#!/usr/bin/python2
from collections import namedtuple
from ansible.parsing.dataloader import DataLoader
from ansible.vars import VariableManager
from ansible.inventory import Inventory
from ansible.playbook.play import Play
from ansible.executor.task_queue_manager import TaskQueueManager
from ansible.plugins.callback import CallbackBase
from DJBot.config import Config
from datetime import datetime
import threading
import json
import os


Options = namedtuple('Options', ['connection', 'module_path', 'forks',
                                 'remote_user', 'private_key_file',
                                 'ssh_common_args', 'ssh_extra_args',
                                 'sftp_extra_args', 'scp_extra_args',
                                 'become', 'become_method',
                                 'become_user', 'verbosity', 'check'])


# Creat a callback object so we can capture the output
class ResultsCollector(CallbackBase):

    def __init__(self, *args, **kwargs):
        super(ResultsCollector, self).__init__(*args, **kwargs)
        self.host_ok = {}
        self.host_unreachable = {}
        self.host_failed = {}
        self.condition = threading.Semaphore(0)

    def v2_runner_on_unreachable(self, result):
        self.host_unreachable[result._host.get_name()] = result._result

    def v2_runner_on_ok(self, result,  *args, **kwargs):
        try:
            self.host_ok[result._host.get_name()]
        except:
            self.host_ok[result._host.get_name()] = []
        self.host_ok[result._host.get_name()].append(result._result)

    def v2_runner_on_failed(self, result,  *args, **kwargs):
        self.host_failed[result._host.get_name()] = result._result

    def get_all(self):
        return {'ok': self.host_ok,
                'unreachable': self.host_unreachable,
                'failed': self.host_failed}


class Runner(object):
    """I wrote this to make a response with flask to avoid the timeout
    But I neet to check if it's really usefull,
    maybe the way of Runner is enought.
    """
    def __init__(self, inventory, remote_user='root',
                 private_key_file=None, ssh_extra_args=None,
                 become=None):
        # initialize needed objects
        ansible_path = '/usr/local/lib/python2.7/site-packages/ansible'
        self.callback = ResultsCollector()
        self.vmanager = VariableManager()
        self.loader = DataLoader()
        self.remote_user = remote_user
        self.inventory = Inventory(loader=self.loader,
                                   variable_manager=self.vmanager,
                                   host_list=inventory)
        self.vmanager.set_inventory(self.inventory)
        self.options = Options(connection='smart',
                               module_path=ansible_path,
                               forks=100, remote_user=remote_user,
                               private_key_file=private_key_file,
                               ssh_common_args=None,
                               ssh_extra_args=ssh_extra_args,
                               sftp_extra_args=None,
                               scp_extra_args=None,
                               become=become, become_method=None,
                               become_user=None, verbosity=None,
                               check=False)
        # create inventory and pass to var manager
        self.passwords = dict(vault_pass='secret')

        self.plays = {}
        self.hosts_results = {}

    def add_setup(self, hosts):
        self.play_source = dict(
            name='setup',
            hosts=', '.join(hosts),
            tasks=[dict(action='setup')]
            # args=(dict(filter='ansible_[a,d,h,l,m,p,][a,e,i,o,r,s]*'))
        )

        self.plays['setup'] = Play().load(self.play_source,
                                          variable_manager=self.vmanager,
                                          loader=self.loader)
        self.plays['setup'].gather_facts = False

    def add_plays(self, name='undefined', hosts=[], tasks=[]):
        """ add tasks to play"""
        self.play_source = dict(
            name=name,
            hosts=', '.join(hosts),
            tasks=tasks
        )
        self.plays[name] = Play().load(self.play_source,
                                       variable_manager=self.vmanager,
                                       loader=self.loader)
        self.plays[name].gather_facts = False

    def run(self):
        tqm = None
        try:
            tqm = TaskQueueManager(
                inventory=self.inventory,
                variable_manager=self.vmanager,
                loader=self.loader,
                options=self.options,
                passwords=self.passwords,
                stdout_callback=self.callback,
            )
            for name, play in self.plays.items():
                tqm.run(play)
        finally:
            if tqm is not None:
                tqm.cleanup()


class ThreadRunner(threading.Thread):
    def __init__(self, machines, playbook, user, room, username,
                 private_key="id_rsa",
                 setup=False):
        threading.Thread.__init__(self)

        self.room = room
        self.username = username
        self.machines = machines
        self.user = user
        self.private_key = Config.KEYS + private_key
        self.playbook = Runner(self.machines, self.user,
                               self.private_key)
        if setup:
            self.playbook.add_setup(self.machines)
        self.playbook.add_plays(playbook['name'], self.machines,
                                playbook['modules'])
        self.task = playbook

    def run(self):
        self.playbook.run()
        results = self.playbook.callback.get_all()
        results['datetime'] = datetime.now().isoformat(' ')[:-7]
        results['playbook'] = self.task['name']
        results['room'] = self.room
        results['tasks'] = self.task
        results['username'] = self.username

        name_log = '-'.join(self.task['name'].split(' ')) + \
                   '@' + '-'.join(self.room.split(' '))
        name_log += '@' + self.username
        name_log += '@' + '-'.join(results['datetime'].split(' '))

        name = os.getenv("LOGS") + '/' + name_log + '.json'

        with open(name, 'w') as record:
            json.dump(results, record)


def ansible_status(hosts, user="root", private_key_file=None):
    """run ansible setup on hosts"""
    key = Config.KEYS + private_key_file
    ansible_game = Runner(hosts, remote_user=user,
                          private_key_file=key)
    ansible_game.add_setup(hosts)
    ansible_game.run()
    response = ansible_game.callback.get_all()
    response['tasks'] = {
        'modules': [{
            'action': {
                'module': 'setup',
                'args': {
                    'filter': 'ansible_[a,d,h,l,m,p,][a,e,i,o,r,s]*',
                }
            }
        }],
        'name': 'Get host info',
    }
    return response


def copy_key(hosts, key, user, password):
    key = Config.KEYS + key + ".pub"
    key = "{{ lookup('file', '" + key + "' ) }}"
    ansible_api = Runner(hosts, user)
    ansible_api.passwords = {'conn_pass': password}
    authorized_key = [{'action': u'authorized_key',
                      'args': {
                          u'user': unicode(user),
                          u'state': u'present',
                          u'key': unicode(key)
                      },
    }]
    ansible_api.add_plays('Add ssh key', hosts, authorized_key)
    ansible_api.run()
    response = ansible_api.callback.get_all()
    response['tasks'] = {'name': 'Add ssh key'}
    response['tasks'].update(authorized_key[0])
    return response


if __name__ == '__main__':
    inventory = ['172.18.0.2']
    ansible_api = Runner(inventory, 'krahser')
    ansible_api.add_setup(inventory)
    ansible_api.passwords = {'conn_pass': 'root'}
    ansible_api.add_plays('Add ssh key', inventory, [
        {'action': u'authorized_key',
         'args':
         {
             u'user': u'root',
             u'state': u'present',
             u'key': u"{{ lookup('file', '/home/krahser/.ssh/id_rsa.pub') }}",
         },
        }
    ]
    )
    ansible_api.run()
    print ansible_api.callback.get_all()

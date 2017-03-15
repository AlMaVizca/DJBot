#!/usr/bin/python2
from collections import namedtuple
from ansible.parsing.dataloader import DataLoader
from ansible.vars import VariableManager
from ansible.inventory import Inventory
from ansible.playbook.play import Play
from ansible.executor.task_queue_manager import TaskQueueManager
from ansible.plugins.callback import CallbackBase
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
                               sftp_extra_args=None, scp_extra_args=None,
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
            tasks=[
                dict(
                    action=dict(
                        module='setup',
                        args=(dict(
                            filter='ansible_[h,m,l,d][o,e,s]*')
                        )
                    )
                ),
            ]
        )
        self.plays['setup'] = Play().load(self.play_source,
                                          variable_manager=self.vmanager,
                                          loader=self.loader)

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
    def __init__(self, rooms, tasks, user, execution_name):
        threading.Thread.__init__(self)

        self.execution_name = execution_name
        self.rooms = rooms
        self.user = user
        self.playbook = Runner(self.rooms, self.user)
        self.playbook.add_setup(self.rooms)
        self.tasks = tasks
        self.tasks_count = len(tasks)
        for each in tasks:
            self.playbook.add_plays(each['name'], self.rooms, each['modules'])

    def run(self):
        self.playbook.run()
        results = self.playbook.callback.get_all()
        name = os.getenv('LOGS') + self.execution_name + '.json'
        with open(name, 'w') as record:
            json.dump(results, record)
        with open('/tmp/prueba.tareas', 'w') as tareas:
            json.dump(self.tasks, tareas)


if __name__ == '__main__':
    inventory = ['172.18.0.3']
    ansible_api = Runner(inventory, 'root')
    ansible_api.add_setup(inventory)

    ansible_api.add_plays('shell ls', inventory, [
        {'action':
         {'args':
          {
            u'repo': u'deb http://httpredir.debian.org/debian jessie main',
            u'state': u'present'
          },
          'module': u'apt_repository'}}
    ]
    )
    ansible_api.run()
    ansible_api.callback.get_all()

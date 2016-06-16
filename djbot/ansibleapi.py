#!/usr/bin/python2
from collections import namedtuple
from ansible.parsing.dataloader import DataLoader
from ansible.vars import VariableManager
from ansible.inventory import Inventory
from ansible.playbook.play import Play
from ansible.executor.task_queue_manager import TaskQueueManager
from ansible.plugins.callback import CallbackBase
from threading import Thread
from task import Task
import json
import os


Options = namedtuple('Options', ['connection','module_path', 'forks',
                                 'remote_user','private_key_file',
                                 'ssh_common_args', 'ssh_extra_args',
                                 'sftp_extra_args','scp_extra_args',
                                 'become', 'become_method',
                                 'become_user', 'verbosity', 'check'])

# Creat a callback object so we can capture the output
class ResultsCollector(CallbackBase):

    def __init__(self, *args, **kwargs):
        super(ResultsCollector, self).__init__(*args, **kwargs)
        self.host_ok     = {}
        self.host_unreachable = {}
        self.host_failed = {}
        
    def v2_runner_on_unreachable(self, result):
        self.host_unreachable[result._host.get_name()] = result._result

    def v2_runner_on_ok(self, result,  *args, **kwargs):
        self.host_ok[result._host.get_name()] = result._result['ansible_facts']

    def v2_runner_on_failed(self, result,  *args, **kwargs):
        self.host_failed[result._host.get_name()] = result._result

    def get_all(self):
        return {'ok': self.host_ok,
                'unreachable': self.host_unreachable, \
                'failed': self.host_failed}
        

class Runner(object):
    def __init__(self, inventory, remote_user='root', private_key_file=None, ssh_extra_args = None, become = None):
        # initialize needed objects
        self.callback = ResultsCollector()
        self.variable_manager = VariableManager()
        self.loader = DataLoader()
        self.remote_user = remote_user
        self.inventory = Inventory(loader=self.loader, variable_manager=self.variable_manager, host_list=inventory)
        self.variable_manager.set_inventory(self.inventory)
        self.options = Options(connection='smart',
                               module_path='/usr/local/lib/python2.7/site-packages/ansible',
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


    def clean_callback():
        self.callback = ResultsCollector()

    def add_setup(self, hosts):
        self.play_source =  dict(
            name = 'setup',
            hosts = ', '.join(hosts),
            tasks = [
                dict(action=dict(module='setup', args=(dict(filter='ansible_[h,m,l,d][o,e,s]*')))),
                 ]
        )
        self.plays['setup'] = Play().load(self.play_source, variable_manager=self.variable_manager, loader=self.loader)


    def add_plays(self, name='undefined', hosts=[], tasks=[]):
        """ add tasks to play"""
        execution_tasks = []
        for each in tasks:
            execution_tasks.append(dict(action=each))
        self.play_source =  dict(
            name = name,
            hosts = ', '.join(hosts),
            tasks = execution_tasks
        )
        self.plays[name] = Play().load(self.play_source, variable_manager=self.variable_manager, loader=self.loader)

    def run(self):
        tqm = None
        try:
            tqm = TaskQueueManager(
                inventory=self.inventory,
                variable_manager=self.variable_manager,
                loader=self.loader,
                options=self.options,
                passwords=self.passwords,
                stdout_callback=self.callback,
            )
            for name, play in self.plays.items():
                result = tqm.run(play)
        finally:
            if tqm is not None:
                tqm.cleanup()


class ThreadRunner(Thread):
    def __init__(self, rooms, tasks, user, execution_name):
        Thread.__init__(self)
        self.execution_name = execution_name
        self.rooms = rooms
        self.user = user
        self.playbook = Runner(self.rooms, self.user)
        self.playbook.add_setup(self.rooms)
        self.tasks = tasks
        for each in tasks:
            for module in each['modules']:
                self.playbook.add_plays(each['name'], self.rooms, module)


    def run(self):
        self.playbook.run()
        results = self.playbook.callback.get_all()
        name = os.getenv('LOGS') + self.execution_name + '.json'
        with open(name, 'w') as record:
            json.dump(results, record)
        with open('/tmp/prueba.tareas','w') as tareas:
            json.dump(self.tasks, tareas)

                
if __name__ == '__main__':
    inventory = ['127.0.0.1']
    ansible_api = Runner(inventory, 'krahser')
    ansible_api.add_setup(inventory)
    ansible_api.run()

            
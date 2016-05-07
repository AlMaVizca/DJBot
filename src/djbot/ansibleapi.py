#!/usr/bin/python2
from collections import namedtuple
from ansible.parsing.dataloader import DataLoader
from ansible.vars import VariableManager
from ansible.inventory import Inventory
from ansible.playbook.play import Play
from ansible.executor.task_queue_manager import TaskQueueManager
from ansible.plugins.callback import CallbackBase

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
        self.host_unreachable[result._host.get_name()] = result

    def v2_runner_on_ok(self, result,  *args, **kwargs):
        self.host_ok[result._host.get_name()] = result

    def v2_runner_on_failed(self, result,  *args, **kwargs):
        self.host_failed[result._host.get_name()] = result

class Runner(object):
    def __init__(self, inventory):
        # initialize needed objects
        self.callback = ResultsCollector()
        self.variable_manager = VariableManager()
        self.loader = DataLoader()
        self.inventory = Inventory(loader=self.loader, variable_manager=self.variable_manager, host_list=inventory)
        self.plays = {}
        self.host_ok = {}
        self.host_failed = {}
        self.host_unreachable = {}

        self.options = Options(connection='smart',
                          module_path='/home/krahser/Repositories/djbot/src/env/lib/python2.7/site-packages/ansible',
                          forks=100, remote_user='avizcaino',
                          private_key_file=None,
                          ssh_common_args=None, ssh_extra_args=None,
                          sftp_extra_args=None, scp_extra_args=None,
                          become=None, become_method=None,
                          become_user=None, verbosity=None,
                          check=False)
        
        self.passwords = dict(vault_pass='secret')

        # create inventory and pass to var manager


    def setup(self):
        
        self.variable_manager.set_inventory(self.inventory)


    def add_play(self, name, hosts):
        # create play with tasks
        self.play_source =  dict(
            name = name,
            hosts = ', '.join(hosts),
            tasks = [
                
                dict(action=dict(module='setup'))

                 ]
        )
        self.plays[name] = Play().load(self.play_source, variable_manager=self.variable_manager, loader=self.loader)

    def run(self):
        self.setup()
        # actually run it
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

    def get_setup(self):
        setup = ''
        for host, result in self.callback.host_ok.items():
            setup = result._result['ansible_facts']

        for host, result in self.callback.host_failed.items():
            print result._result

        for host, result in self.callback.host_unreachable.items():
            print result._result

        return setup
            
                
if __name__ == '__main__':
    inventory = ['localhost','QM-firewall','Q-controller', '163.10.78.1']
    ansible_api = Runner(inventory)
    ansible_api.add_play('shell log',['163.10.78.1'], 'yes')
    ansible_api.run()
            
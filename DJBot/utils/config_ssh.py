import yaml
import os
import subprocess
from ipaddress import IPv4Address, IPv4Network
from Crypto.PublicKey import RSA

def generate_key():
    key = RSA.generate(2048)
    key_path = os.getenv("HOME")+"/.ssh/id_rsa"
    with open(key_path, 'w') as content_file:
        os.chmod(key_path, 0600)
        content_file.write(key.exportKey('PEM'))
        content_file.write("\n")

    pubkey = key.publickey()
    with open(key_path + ".pub", 'w') as content_file:
        content_file.write(pubkey.exportKey('OpenSSH'))
        content_file.write("\n")

    subprocess.call(['cp', '/root/.ssh/id_rsa.pub', '/root/.ssh/pub_key/'])
    subprocess.call(['cp', '/usr/src/app/djbot/utils/config', '/root/.ssh/'])


class SshConfig():
    def __init__(self):
        self.conf_file = os.getenv('HOME')+'/.ssh/assh.yml'
        self.hosts = {}
        self.defaults = {}

    def set_defaults(self, user = 'root', key='~/.ssh/id_rsa',
                     fw_agent= 'yes'):

        self.defaults = {
            'IdentityFile': key,
            'ForwardAgent': fw_agent,
            'Port': '22',
            'PubkeyAuthentication': 'yes',
            'User': user,
            'compression': 'yes',
            'UserKnownHostsFile': '/dev/null',
            'StrictHostKeyChecking': 'no',
        }

    def write_settings(self):
        with open(self.conf_file, 'w') as fp:
            yaml.dump({'hosts': self.hosts},
                      fp, default_flow_style=False)
            yaml.dump({'defaults': self.defaults},
                      fp, default_flow_style=False)
        with open(os.getenv('HOME')+'/.ssh/config','w') as fp:
            fp.write(subprocess.check_output(['assh', '-f', 'build']))

    def read_settings(self):
        with open(self.conf_file, 'r') as fp:
            self.settings = yaml.load(fp)
            self.hosts = self.settings['hosts']
            self.defaults = self.settings['defaults']

    def add_proxy(self, proxy, ip, user=None, port=22, fw_agent='yes'):
        self.hosts[proxy] = {
            'ForwardAgent': fw_agent,
            'Hostname': ip,
            'Port': port,
            'User': user,
        }



    def add_room(self, network, proxy, user = None):
        network = IPv4Network(unicode(network))
        regex = IPv4Address(unicode(self.hosts[proxy]['Hostname']))
        ip_str = str(network.network_address + 1).split('.')
        base = '.'.join(ip_str[0:3])
        wild = '.*'
        regex = base + wild

        self.hosts[regex] = { 'User': user, 'Gateways': [proxy]}


if __name__ == '__main__':
    my_config = SshConfig()
    my_config.set_defaults()
    my_config.add_proxy('proxy1','163.10.78.1','avizcaino','22')
    my_config.add_room('163.10.78.0/25', 'proxy1','avizcaino')
    my_config.write_settings()

from ansibleapi import *
from database import Base, db_session
from context import Host
from flask import jsonify
from helpers import set_properties
from scripts import proxy, config_ssh
from sqlalchemy import Column, Integer, SmallInteger, String
from sqlalchemy import Table, Column, ForeignKey
from sqlalchemy.orm import relationship



class Task(Base):
    __tablename__ = 'task'
    key = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    modules = relationship("Module")

class Module(Base):
    __tablename__ = 'module'
    key = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    module = Column(String(50), nullable=False)
    args = Column(String(50), nullable=False)
    task_key = Column(Integer, ForeignKey('task.key'))



class Room(Base):
    __tablename__ = 'room'
    key = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    machines = Column(SmallInteger, nullable=False)
    network = Column(String, nullable=False)
    proxy = Column(String)
    
    
    def __init__(self, name=None, machines=None, network=None,
                 proxy=None):
        self.name = name
        self.machines = machines
        self.network = network
        self.netmask = 8
        self.proxy = proxy
        self.db = Room.query.filter(Room.name == self.name).first()
        self.username = 'avizcaino'
        self.key = None
        self.hosts = ['163.10.78.4', '163.10.78.34', '163.10.78.79']
        self.get()
        
    def __repr__(self):
        return '<Room %r %r %r %r %r>' % (self.key,
                                          self.name, self.machines,
                                          self.network, self.proxy)

    def _set_network(self):
        return self.network + '/' + str(self.netmask)
        
    def _get_network(self, cidr):
        try:
            address = cidr.split('/')
        except:
            address = ['127.0.0.1','8']
        return address[0], address[1]
        
    def get_setup(self):
        return dict(name=self.name,
                 machines=self.machines,
                 network=self.network,
                 netmask=self.netmask,
                 proxy=self.proxy,
                 status='on',
                 key=self.key)

    def discover_hosts(self):
        self.hosts = proxy.check_network(unicode(self._set_network()))
        return self.hosts

    def get_all(self):
        """ Return settings and hosts"""
        hosts = self.get_hosts()
        hosts.update(self.get_setup())
        return hosts

    def get(self, complete = True):
        """Complete (or not) from database"""
        if self.db:
            if complete:
                set_properties(self, self.db)
            return True
        return False
        
    def save(self):
        """save in database"""
        self.db.name = self.name
        self.db.network = self._set_network()
        self.db.machines = self.machines
        self.db.proxy = self.proxy
        try:
            db_session.commit()
            return True
        except:
            db_session.add(self.db)
            db_session.commit()
            return False

    def delete(self):
        """delete on database"""
        try:
            db_session.delete(self)
            db_session.commit()
            return True
        except:
            return False

    def get_hosts(self):
        """run ansible setup on hosts"""
        ssh_extra_args = None
        if self.proxy:
            ssh_settings = config_ssh.SshConfig()
            ssh_settings.set_defaults()
            room_name = str(''.join(self.name.split())).lower()
            ssh_settings.add_proxy(room_name, self.proxy, self.username)
            ssh_settings.add_room(self._set_network(), room_name, self.username)
            ssh_settings.write_settings()

            
        ansible_game = Runner(self.hosts, self.username)
        ansible_game.add_setup(self.hosts)
        ansible_game.run()
        facts = ansible_game.callback.get_all()['ok']
        hosts = []
        for host_data in facts.keys():
            host = None
            try:
                host = {
                    "hostname": facts[host_data]["ansible_hostname"],
                    "memory": facts[host_data]["ansible_memory_mb"]["real"]["free"],
                    "lsb": facts[host_data]["ansible_lsb"]["description"],
                    "id": host_data.split('.')[3]
                }
            except:
                host = {
                    "hostname": "Something wrong happen",
                    "memory": "ansible_memory_mb",
                    "lsb": "ansible_lsb",
                    "id": 999
                }
            hosts.append(host)
        return 	{"hosts": hosts}
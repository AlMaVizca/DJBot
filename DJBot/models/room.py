from database import db
from utils import proxy
from ansibleapi import Runner


class Room(db.Model):
    __tablename__ = "room"
    key = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    machines = db.Column(db.Integer, nullable=False)
    network = db.Column(db.String, nullable=False)
    hosts = db.relationship("Computer", cascade="all, delete-orphan")

    def __repr__(self):
        return "<Room %r %r %r %r>" % (self.key,
                                       self.name, self.machines,
                                       self.network)

    def _set_network(self, network=None, netmask=None):
        if network and netmask:
            return network + "/" + str(netmask)

    def _get_network(self):
        try:
            address = self.network.split("/")
        except:
            address = ["127.0.0.1", "8"]
        return address[0], address[1]

    def get_setup(self):
        network, netmask = self._get_network()
        return dict(name=self.name,
                    machines=self.machines,
                    network=network,
                    netmask=netmask,
                    key=self.key)

    def discover_hosts(self):
        hosts = proxy.check_network(unicode(self.network))
        return hosts

    def get_all(self):
        """ Return settings and hosts"""
        hosts = self.get_hosts()
        hosts.update(self.get_setup())
        return hosts

    def save(self, name, network, netmask, machines):
        """save in database"""
        self.name = name
        self.machines = machines
        self.network = self._set_network(network, netmask)
        db.session.add(self)
        db.session.commit()
        return True

    def delete(self):
        """delete on database"""
        db.session.delete(self)
        db.session.commit()

    def get_hosts(self):
        """run ansible setup on hosts"""
        ansible_game = Runner(self.hosts, self.username)
        ansible_game.add_setup(self.hosts)
        ansible_game.run()
        facts = ansible_game.callback.get_all()["ok"]
        hosts = []
        for host_data in facts.keys():
            host = None
            try:
                host = {
                    "hostname": facts[host_data]["ansible_hostname"],
                    "memory": facts[host_data]
                    ["ansible_memory_mb"]["real"]["free"],
                    "lsb": facts[host_data]["ansible_lsb"]["description"],
                    "key": host_data.split(".")[3]
                }
            except:
                host = {
                    "hostname": "Something wrong happen",
                    "memory": "ansible_memory_mb",
                    "lsb": "ansible_lsb",
                    "key": 999
                }
            hosts.append(host)
        return {"hosts": hosts}


class Computer(db.Model):
    __tablename__ = "computer"
    key = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    mac = db.Column(db.String(50), nullable=False)
    location = db.Column(db.Integer, nullable=False)
    task_key = db.Column(db.Integer, db.ForeignKey("room.key"))

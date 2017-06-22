from DJBot.database import db
from DJBot.utils import proxy
from DJBot.utils.ansible_api import ansible_status
import ipaddress


class Room(db.Model):
    __tablename__ = "room"
    key = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    machines = db.Column(db.Integer, nullable=False)
    network = db.Column(db.String, unique=True, nullable=False)
    gateway = db.Column(db.String, nullable=False)
    user = db.Column(db.String, nullable=False, default="root")
    private_key = db.Column(db.String, nullable=False,
                            default="id_rsa")

    def __repr__(self):
        return "<Room %r %r %r %r %r>" % (self.key,
                                          self.name, self.machines,
                                          self.network, self.gateway)

    def _set_network(self, network=None, netmask=None):
        if network and netmask:
            network_address = unicode(network + '/' + str(netmask))
            network_address = ipaddress.ip_network(network_address,
                                                   strict=False)
            return str(network_address)

    def _get_network(self):
        try:
            address = self.network.split("/")
        except:
            address = ["127.0.0.1", "8"]
        return address[0], address[1]

    def get_setup(self):
        network, netmask = self._get_network()
        room = dict(name=self.name,
                    machines=self.machines,
                    network=network,
                    netmask=netmask,
                    gateway=self.gateway,
                    key=self.key,
                    private_key=self.private_key,
                    user=self.user)
        return room

    def discover_hosts(self):
        hosts = proxy.check_network(unicode(self.network))
        return hosts

    def get_all(self):
        """ Return settings and hosts"""
        hosts = self.get_hosts()
        hosts.update(self.get_setup())
        return hosts

    def save(self, name, network, netmask, machines, gateway, user,
             private_key):
        """save in database"""
        self.name = name
        self.machines = machines
        self.network = self._set_network(network, netmask)
        self.gateway = gateway
        self.user = user
        self.private_key = private_key
        db.session.add(self)
        db.session.commit()
        return True

    def delete(self):
        """delete on database"""
        db.session.delete(self)
        db.session.commit()

    def get_hosts(self):
        return ansible_status(self.discover_hosts(), self.user)


class Host(db.Model):
    __tablename__ = "host"
    key = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    ip = db.Column(db.String(50), unique=True, nullable=False)
    note = db.Column(db.String(200), nullable=True)
    user = db.Column(db.String, nullable=False, default="root")
    private_key = db.Column(db.String, nullable=False,
                            default="id_rsa")

    def __repr__(self):
        return "<Host %r %r %r %r %r %r>" % (self.key,
                                             self.name, self.ip,
                                             self.note, self.user,
                                             self.private_key)

    def get_setup(self):
        host = dict(name=self.name,
                    ip=self.ip,
                    key=self.key,
                    note=self.note,
                    user=self.user,
                    private_key=self.private_key)
        return host

    def save(self, name, ip, user, private_key, note=None):
        """save in database"""
        self.name = name
        self.ip = ip
        self.note = note
        self.user = user
        self.private_key = private_key
        db.session.add(self)
        db.session.commit()
        return True


def get_hosts():
    hosts = Host().query.all()
    hosts_info = {'hosts': []}
    for each in hosts:
        hosts_info['hosts'].append(each.get_setup())
    return hosts_info


def get_rooms():
    rooms = Room().query.all()
    rooms_info = {'rooms': []}
    for each in rooms:
        rooms_info['rooms'].append(each.get_setup())
    return rooms_info


def get_room(id):
    if id == 0:
        return Room()
    return Room.query.get(id)


def get_machines(room_key):
    room = Room.query.get(room_key)
    hosts = room.discover_hosts()
    hosts.remove(room.gateway)
    return hosts, room.name


def get_host(id):
    if id == 0:
        return Host()
    return Host.query.get(id)

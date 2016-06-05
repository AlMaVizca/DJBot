def room_properties(room, from_database):
    room.key = from_database.key
    room.name = from_database.name
    room.network, room.netmask  = room._get_network(from_database.network)
    room.machines = from_database.machines
    room.proxy = from_database.proxy
    return room

def task_properties(room, from_database):
    room.key = from_database.key
    room.name = from_database.name
    room.modules = [ dict(key=each.key, name=each.name) for each in from_database.modules]
    return room
    



        
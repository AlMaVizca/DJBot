def set_properties(room, from_database):
    room.key = from_database.key
    room.name = from_database.name
    room.network, room.netmask  = room._get_network(from_database.network)
    room.machines = from_database.machines
    room.proxy = from_database.proxy
    return room


        
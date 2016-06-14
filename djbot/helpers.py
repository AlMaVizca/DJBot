def room_properties(room, from_database):
    room.key = from_database.key
    room.name = from_database.name
    room.network, room.netmask  = room._get_network(from_database.network)
    room.machines = from_database.machines
    return room

def modules_to_dict(database_modules):
    modules = []
    for each in database_modules:
        arg = []
        for argument in each.args:
            arg.append(dict(key=argument.key, name=argument.name, value=argument.value))
        modules.append(dict(key=each.key, name=each.name, options=arg))
    return modules
    
def task_properties(room, from_database):
    room.key = from_database.key
    room.name = from_database.name
    room.modules = modules_to_dict(from_database.modules)
    return room
    



        
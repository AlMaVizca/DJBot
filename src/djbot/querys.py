from models import Room
from helpers import set_properties


def get_rooms():
    rooms = Room().query.all()
    rooms_info = {'rooms': []}
    for each in rooms:
        a_room = Room(each.name)
        rooms_info['rooms'].append(a_room.get_setup())
    return rooms_info
        
    



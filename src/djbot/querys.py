from models import RoomTable, Room
from models import TaskTable
from task import Task

def get_rooms():
    rooms = RoomTable().query.all()
    rooms_info = {'rooms': []}
    for each in rooms:
        each_room = Room(key=each.key)
        rooms_info['rooms'].append(each_room.get_setup())
    return rooms_info
        
def get_tasks():
    tasks = TaskTable().query.all()
    tasks_info = {'tasks': []}
    for each in tasks:
        each_task = Task(key=each.key)
        tasks_info['tasks'].append(each_task.get_setup())
    return tasks_info

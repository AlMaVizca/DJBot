from models import RoomTable, Room
from models import TaskTable
from task import Task
import yaml

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

def get_machines(rooms):
    hosts = []
    names = []
    for each in rooms:
        a_room = Room(each)
        names.append(a_room.name)
        hosts.extend(a_room.discover_hosts())
    return hosts, names

def execution_taks(tasks):
    execution_tasks = []
    names = []
    for each in tasks:
        a_task = Task(each).get_setup()
        names.append(a_task['name'])
        task = {'name': a_task['name'], 'modules':[]}
        for module in a_task['modules']:
            parameters = [{arg['name']:arg['value']} for arg in module['options']]
            task['modules'].append((dict(action=dict(module=module['name'], args=parameters))))
        execution_tasks.append(task)
    return execution_tasks, names


def get_result(filename):
    result = {'data': 'Not Found!'}
    try:
        with open(filename, 'r') as fp:
            result = yaml.load(fp)
    except:
        pass
    return result

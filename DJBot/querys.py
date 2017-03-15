from models.room import Room
from models.user import User
from models.playbook import Playbook, Task
import json
import os
import time


def execution_tasks(tasks):
    execution_tasks = []
    names = []
    for each in tasks:
        a_task = Task.query.get(each).get_setup()
        names.append(a_task['name'])
        task = {'name': a_task['name'], 'modules': []}
        parameters = {}
        for module in a_task['modules']:
            for arg in module['options']:
                parameters[arg['name']] = arg['value']
            task['modules'].append((dict(
                action=dict(
                    module=module['name'],
                    args=parameters)
            )))
        execution_tasks.append(task)
    return execution_tasks, names


def get_machines(rooms):
    hosts = []
    names = []
    for each in rooms:
        a_room = Room.query.get(each)
        names.append(a_room.name)
        hosts.extend(a_room.discover_hosts())
    return hosts, names


def get_result(filename):
    result = {'data': 'Not Found!'}
    with open(filename, 'r') as fp:
        result = json.load(fp)
    result['datetime'] = time.strftime("%m/%d/%Y %I:%M:%S %p",
                                       time.localtime(
                                           os.path.getmtime(filename)))
    return result


def get_rooms():
    rooms = Room().query.all()
    rooms_info = {'rooms': []}
    for each in rooms:
        each_room = Room.query.get(each.key)
        rooms_info['rooms'].append(each_room.get_setup())
    return rooms_info


def get_playbooks():
    playbooks = Playbook().query.all()
    playbooks_info = {'playbooks': []}
    for each in playbooks:
        playbooks_info['playbooks'].append(each.get_setup())
    return playbooks_info


def get_users():
    users = User().query.all()
    users_info = {'users': []}
    for each in users:
        user = User.query.filter(User.username == each.username).first()
        users_info['users'].append(user.get_setup())
    return users_info

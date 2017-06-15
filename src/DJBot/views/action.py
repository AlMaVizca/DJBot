from DJBot.utils.ansible_api import ThreadRunner
from flask import Blueprint, jsonify, request
from flask_security import current_user, roles_required
from DJBot.forms.action import Result, Run
from DJBot.models.playbook import execution_tasks, get_result
from DJBot.models.room import get_machines, get_room
import os

action_bp = Blueprint('action', __name__)


@action_bp.route('/run', methods=['POST'])
@roles_required('user')
def run():
    form = Run(request.form)
    if form.validate():
        room = get_room(form.room.data)
        machines, room_name = get_machines(form.room.data)
        playbook = execution_tasks(form.playbook.data)

        name_log = '-'.join(playbook['name'].split(' ')) + '@' + '-'.join(room_name.split(' '))
        name_log += '@' + current_user.username
        ansible_playbook = ThreadRunner(machines, playbook, 'root',
                                        name_log,
                                        room.private_key,
                                        )
        ansible_playbook.start()
        if True:
            return jsonify({'message': 'Task is running!'})
    return jsonify({'message': 'receive'})


@action_bp.route('/results', methods=['GET'])
@roles_required('user')
def get_results():
    dirs = os.listdir(os.getenv('LOGS'))
    results = []
    for each in dirs:
        results.append({'name': each})
    return jsonify({'results': results})


@action_bp.route('/result', methods=['POST'])
@roles_required('user')
def get_a_result():
    form = Result(request.form)
    if form.validate():
        filename = os.getenv('LOGS') + form.result.data
        result = get_result(filename)
    return jsonify(result)

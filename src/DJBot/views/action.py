from DJBot.utils.ansible_api import ThreadRunner
from flask import Blueprint, jsonify, request
from flask_security import current_user, roles_required
from DJBot.forms.action import Run
from DJBot.forms.generic import Select
from DJBot.models.playbook import execution_tasks
from DJBot.models.inventory import get_machines, get_room
import os
import json

action_bp = Blueprint('action', __name__)


def get_log_by_date():
    # TODO
    return os.listdir(os.getenv('LOGS'))


@action_bp.route('/run', methods=['POST'])
@roles_required('user')
def run():
    form = Run(request.form)
    if form.validate():
        room = get_room(form.room.data)
        machines, room_name = get_machines(form.room.data)
        playbook = execution_tasks(form.playbook.data)

        ansible_playbook = ThreadRunner(machines, playbook, room.user,
                                        room_name,
                                        current_user.username,
                                        room.private_key,
                                        )
        ansible_playbook.start()
        if True:
            return jsonify({'message': 'Task is running!'})
    return jsonify({'message': 'receive'})


@action_bp.route('/results', methods=['GET'])
@roles_required('user')
def get_results():
    files = get_log_by_date()
    results = []
    for each in files:
        data = each.split('@')
        results.append({
            'playbook': ' '.join(data[0].split('-')),
            'room': ' '.join(data[1].split('-')),
            'username': data[2],
            # datetime [:-5] is for remove the extension
            'datetime': ' '.join(data[3].split('-'))[:-5],
        })
    return jsonify({'results': results})


@action_bp.route('/result', methods=['POST'])
@roles_required('user')
def get_a_result():
    form = Select(request.form)
    result = {'msg': 'Execution not found!'}
    if form.validate():
        files = get_log_by_date()
        filename = os.getenv('LOGS') + '/' + files[form.key.data]
        with open(filename, 'r') as fp:
            result = json.load(fp)
    return jsonify(result)

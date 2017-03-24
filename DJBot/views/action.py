from ansibleapi import ThreadRunner
from flask import Blueprint, jsonify, request
from flask_security import current_user, roles_required
from forms import ResultForm
from querys import get_machines, execution_tasks, get_result
import os

action_bp = Blueprint('action', __name__)


@action_bp.route('/run', methods=['POST'])
@roles_required('user')
def run():
    rooms = [int(each) for each in request.form.getlist('rooms[]')]
    tasks = [int(each) for each in request.form.getlist('tasks[]')]

    rooms, room_names = get_machines(rooms)
    tasks, task_names = execution_tasks(tasks)

    name_log = '-'.join(task_names) + '@' + '-'.join(room_names)
    name_log += '@' + current_user.username
    ansible_playbook = ThreadRunner(rooms, tasks, 'root', name_log)
    ansible_playbook.start()
    if True:
        return jsonify({'message': 'Task is running!'})
    return jsonify({'message': 'receive'})


@action_bp.route('/results', methods=['GET'])
@roles_required('user')
def results():
    dirs = os.listdir(os.getenv('LOGS'))
    results = []
    for each in dirs:
        results.append({'name': each})
    return jsonify({'results': results})


@action_bp.route('/results', methods=['POST'])
@roles_required('user')
def a_result():
    form = ResultForm(request.form)
    if form.validate():
        filename = os.getenv('LOGS') + form.result.data
        result = get_result(filename)
    return jsonify(result)

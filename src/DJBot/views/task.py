from flask import Blueprint, jsonify, request
from flask_security import roles_required
from DJBot.forms.playbook import TaskAdd, ParameterAdd
from DJBot.forms.generic import Select
from DJBot.models.playbook import get_playbook

task_bp = Blueprint("task", __name__)


@roles_required('user')
@task_bp.route('/<id>/module/add', methods=['POST'])
def module_add(id):
    form = TaskAdd(request.form)
    if form.validate():
        task = get_playbook(id)
        saved = task.module_add(form.module.data)
        if saved:
            return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})


@task_bp.route('/<id>/module/delete', methods=['POST'])
@roles_required('user')
def module_delete(id):
    form = Select(request.form)
    if form.validate():
        task = get_playbook(id)
        deleted = task.module_delete(form.key.data)
        if deleted:
            return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})


@task_bp.route('/<id>/parameter/add', methods=['POST'])
@roles_required('user')
def parameter_add(id):
    form = ParameterAdd(request.form)
    if form.validate():
        task = get_playbook(id)
        saved = task.parameter_add(
            form.modulekey.data, (form.parameter.data, form.value.data)
        )
        if saved:
            return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})


@task_bp.route('/<id>/parameter/delete', methods=['POST'])
@roles_required('user')
def parameter_delete(id):
    form = Select(request.form)
    if form.validate():
        task = get_playbook(id)
        deleted = task.parameter_delete(form.key.data)
        if deleted:
            return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})

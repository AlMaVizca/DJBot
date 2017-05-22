from flask import Blueprint, jsonify, request
from flask_security import login_required, roles_required
from DJBot.forms.playbook import TaskAdd, ParameterAdd
from DJBot.forms.generic import Select, SelectName
from DJBot.messages import msg_saved, msg_failed
from DJBot.models.playbook import get_playbook, delete_parameter, delete_task
from DJBot.modules import ansible_docs


task_bp = Blueprint("task", __name__)


@task_bp.route('/add', methods=['POST'])
@login_required
@roles_required('user')
def task_add():
    form = TaskAdd(request.form)
    if form.validate():
        playbook = get_playbook(form.playbook.data)
        saved = playbook.task_add(form.task.data)
        if saved:
            return msg_saved()
    return msg_failed()


@task_bp.route('/delete', methods=['POST'])
@login_required
@roles_required('user')
def task_delete():
    form = Select(request.form)
    if form.validate():
        deleted = delete_task(form.key.data)
        if deleted:
            return msg_saved()
    return msg_failed()


@task_bp.route('/parameter/add', methods=['POST'])
@login_required
@roles_required('user')
def parameter_add():
    form = ParameterAdd(request.form)
    if form.validate():
        playbook = get_playbook(form.playbook.data)
        saved = playbook.parameter_add(
            form.task.data, (form.parameter.data, form.value.data)
        )
        if saved:
            return msg_saved()
    return msg_failed()


@task_bp.route('/parameter/delete', methods=['POST'])
@login_required
@roles_required('user')
def parameter_delete():
    form = Select(request.form)
    if form.validate():
        deleted = delete_parameter(form.key.data)
        if deleted:
            return msg_saved()
    return msg_failed()


@task_bp.route('/categories', methods=['GET'])
@login_required
@roles_required('user')
def get_categories():
    return jsonify(ansible_docs.get_categories())


@task_bp.route('/category', methods=['POST'])
@login_required
@roles_required('user')
def get_category():
    form = SelectName(request.form)
    if form.validate():
        return jsonify(ansible_docs.get_category(form.name.data))
    return jsonify({})


@task_bp.route('/modules', methods=['GET'])
@login_required
@roles_required('user')
def get_modules():
    return jsonify({'modules': ansible_docs.get_modules()})


@task_bp.route('/module', methods=['POST'])
@login_required
@roles_required('user')
def get_module():
    form = SelectName(request.form)
    if form.validate():
        return jsonify(ansible_docs.get_module(str(form.name.data)))
    return jsonify({})

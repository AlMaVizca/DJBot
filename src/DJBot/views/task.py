from flask import Blueprint, request
from flask_security import login_required, roles_required
from DJBot.forms.playbook import TaskAdd, ParameterAdd
from DJBot.forms.generic import Select
from DJBot.messages import msg_saved, msg_failed
from DJBot.models.playbook import get_playbook, delete_parameter, delete_task

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

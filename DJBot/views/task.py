from flask import Blueprint, jsonify, request
from flask_user import roles_required

task_bp = Blueprint("task", __name__)

@roles_required('user')
@task_bp.route('/<id>/module/add', methods=['POST'])
def module_add(id):
    form = ModuleFormAdd(request.form)
    if form.validate():
        task = Task.query.get(id)
        saved = task.module_add(form.module.data, app)
        if saved:
            return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})


@task_bp.route('/<id>/module/delete', methods=['POST'])
@roles_required('user')
def module_delete(id):
    form = ModuleFormDelete(request.form)
    if form.validate():
        task = Task.query.get(id)
        deleted = task.module_delete(form.key.data)
        if deleted:
            return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})


@task_bp.route('/<id>/parameter/add', methods=['POST'])
@roles_required('user')
def parameter_add(id):
    form = ParameterFormAdd(request.form)
    if form.validate():
        task = Task.query.get(id)
        saved = task.parameter_add(form.modulekey.data, (form.parameter.data, form.value.data))
        if saved:
            return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})


@task_bp.route('/<id>/parameter/delete', methods=['POST'])
@roles_required('user')
def parameter_delete(id):
    form = ParameterFormDelete(request.form)
    if form.validate():
        task = Task.query.get(id)
        deleted = task.parameter_delete(form.key.data)
        if deleted:
            return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})

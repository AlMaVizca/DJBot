from DJBot.database import db
from flask import Blueprint, jsonify, request
from flask_security import login_required, roles_required, current_user
from flask_security.utils import verify_password
from DJBot.forms.user import Add, Change
from DJBot.forms.generic import Select
from DJBot.models.user import create_user, get_user, get_user_id, \
    get_users


user_bp = Blueprint('user', __name__)


@user_bp.route('/get', methods=['GET'])
@login_required
@roles_required('user')
def get():
    user = get_user(current_user.username)
    return jsonify(user.get_setup())


@user_bp.route('/all', methods=['GET'])
@login_required
@roles_required('admin')
def get_all():
    users = {}
    user = get_user(current_user.username)
    if user.is_admin():
        users.update(get_users())
    return jsonify(users)


@user_bp.route('/add', methods=['POST'])
@login_required
@roles_required('admin')
def add():
    form = Add(request.form)
    if form.validate():
        create_user(form.username.data, form.email.data,
                    form.password.data)
        return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})


@user_bp.route('/modify', methods=['POST'])
@login_required
@roles_required('user')
def modify():
    form = Change(request.form)
    if form.validate_on_submit():
        user = get_user_id(form.key.data)
        if verify_password(form.password.data, user.password):
            user.username = form.username.data
            user.email = form.email.data
            db.session.commit()
            return jsonify({"messageMode": 0, "messageText": "Changes saved "})
        return jsonify({"messageMode": 1, "messageText": "Wrong password"})
    return jsonify({"messageMode": 1, "messageText": "Failed to save changes"})


@user_bp.route('/admin', methods=['POST'])
@login_required
@roles_required('admin')
def change_admin():
    form = Select(request.form)
    if form.validate():
        user = get_user_id(form.key.data)
        user.change_admin()
        db.session.commit()
        return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})


@user_bp.route('/delete', methods=['POST'])
@login_required
@roles_required('admin')
def delete():
    form = Select(request.form)
    if form.validate():
        user = get_user_id(form.key.data)
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'deleted'})
    return jsonify({'message': 'failed'})

from DJBot.database import db
from flask import Blueprint, jsonify, request
from flask_security import roles_required, current_user
from flask_security.utils import verify_password
from DJBot.forms import UserAddForm, UserChangeForm, UserDeleteForm, \
    PassChangeForm
from DJBot.models.user import create_user, get_user, get_users

user_bp = Blueprint('user', __name__)


@user_bp.route('/', methods=['GET'])
@roles_required('user')
def user():
    user = get_user(current_user.username)
    return jsonify(user.get_setup())


@user_bp.route('/users', methods=['GET'])
@roles_required('admin')
def users():
    users = {}
    user = get_user(current_user.username)
    if user.is_admin():
        users.update(get_users())
    else:
        users.update({'users': []})
    return jsonify(users)


@user_bp.route('/add', methods=['POST'])
@roles_required('admin')
def user_add():
    form = UserAddForm(request.form)
    if form.validate():
        create_user(form.username.data, form.email.data,
                    form.password.data)
        return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})


@user_bp.route('/change', methods=['POST'])
@roles_required('user')
def user_change():
    form = UserChangeForm(request.form)
    if form.validate_on_submit():
        user = User.query.get(form.key.data)
        if verify_password(form.old.data, user.password):
            user.username = form.username.data
            user.email = form.email.data
            if form.password.data != '':
                user.password = (form.password.data)
            db.session.commit()
            return jsonify({"messageMode": 0, "messageText": "Changes saved "})
        return jsonify({"messageMode": 1, "messageText": "Wrong password"})
    return jsonify({"messageMode": 1, "messageText": "Failed to save changes"})


@user_bp.route('/change_admin', methods=['POST'])
@roles_required('admin')
def user_change_admin():
    form = UserDeleteForm(request.form)
    if form.validate():
        user = User.query.get(form.key.data)
        user.change_admin()
        db.session.commit()
        return jsonify({'message': 'deleted'})
    return jsonify({'message': 'failed'})


@user_bp.route('/change_password', methods=['POST'])
@roles_required('admin')
def user_change_password():
    form = PassChangeForm(request.form)
    if form.validate_on_submit():

        user = get_user(current_user.username)

        if verify_password(form.old.data, user):
            user = User.query.get(form.key.data)
            user.password = encrypt_password(form.password.data)
            db.session.commit()
            return jsonify({'message': 'saved'})
        return jsonify({'message': 'wrong password!'})
    return jsonify({'message': 'failed'})


@user_bp.route('/delete', methods=['POST'])
@roles_required('admin')
def user_delete():
    form = UserDeleteForm(request.form)
    if form.validate():
        user = User.query.get(form.key.data)
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'deleted'})
    return jsonify({'message': 'failed'})

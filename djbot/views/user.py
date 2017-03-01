from database import db_session
from flask import Blueprint, jsonify, request
from flask_login import current_user
from flask_user import roles_required
from forms import UserAddForm, UserChangeForm, UserDeleteForm, PassChangeForm
from models.user import User, Role

user_bp = Blueprint('user', __name__)

@user_bp.route('/', methods=['GET'])
@roles_required('user')
def user():
    user = User.query.filter(User.username==current_user.username).first()
    return jsonify(user.get_setup())

@user_bp.route('/users', methods=['GET'])
@roles_required('admin')
def users():
    users = {}
    user = User.query.filter(User.username==current_user.username).first()
    if user.is_admin():
        users.update(get_users())
    else:
        users.update({'users':[]})
    user_bp.logger.info(users)
    return jsonify(users)

@user_bp.route('/add', methods=['POST'])
@roles_required('admin')
def user_add():
    form = UserAddForm(request.form)
    if form.validate():
        user = User()
        user.username = form.username.data
        current_user.username = user.username
        user.email = form.email.data
        user.password = user_manager.hash_password(form.password.data)
        role_user = Role.query.filter(Role.name == 'user').first()
        user.roles.append(role_user)
        db_session.add(user)
        db_session.commit()
        return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})


@user_bp.route('/change', methods=['POST'])
@roles_required('user')
def user_change():
    form = UserChangeForm(request.form)
    if form.validate_on_submit():
        user = User.query.get(form.key.data)
        if user_manager.verify_password(form.old.data, user):
            user.username = form.username.data
            user.email = form.email.data
            if form.password.data != '':
                user.password = user_manager.hash_password(form.password.data)
            db_session.commit()
            return jsonify({"messageMode": 0, "messageText": "Changes saved "})
        return jsonify({"messageMode": 1, "messageText": "Wrong password"})
    return jsonify({"messageMode": 1, "messageText": "Failed to save changes"})


@user_bp.route('//change_admin', methods=['POST'])
@roles_required('admin')
def user_change_admin():
    form = UserDeleteForm(request.form)
    if form.validate():
        user = User.query.get(form.key.data)
        user.change_admin()
        db_session.commit()
        return jsonify({'message': 'deleted'})
    return jsonify({'message': 'failed'})


@user_bp.route('/change_password', methods=['POST'])
@roles_required('admin')
def user_change_password():
    form = PassChangeForm(request.form)
    if form.validate_on_submit():
        user = User.query.filter(User.username == current_user.username).first()
        if user_manager.verify_password(form.old.data, user):
            user = User.query.get(form.key.data)
            user.password = user_manager.hash_password(form.password.data)
            db_session.commit()
            return jsonify({'message': 'saved'})
        return jsonify({'message': 'wrong password!'})
    return jsonify({'message': 'failed'})


@user_bp.route('/delete', methods=['POST'])
@roles_required('admin')
def user_delete():
    form = UserDeleteForm(request.form)
    if form.validate():
        user = User.query.get(form.key.data)
        db_session.delete(user)
        db_session.commit()
        return jsonify({'message': 'deleted'})
    return jsonify({'message': 'failed'})

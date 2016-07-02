from database import db_session
from flask import Flask, render_template, request
from flask import url_for, redirect
from flask import jsonify, flash
from flask_login import current_user
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CsrfProtect
from flask_user import UserManager, LoginManager, login_required, SQLAlchemyAdapter, roles_required
from forms import *
from models import first_data
from models.user import User, Role
from querys import *
from ansibleapi import ThreadRunner
from scripts import config_ssh
import flask_login
import os



app = Flask(__name__)

app.config.from_object('settings.Config')
app.config.from_envvar('FLASKR_SETTINGS', silent=True)
app.debug = app.config['DEBUG']

csrf = CsrfProtect()
csrf.init_app(app)

db_adapter = SQLAlchemyAdapter(db_session, User)
user_manager = UserManager(db_adapter, app)


try:
    User.query.all()
except:
    first_data(user_manager)

if not os.path.isfile('/root/.ssh/id_rsa'):
    config_ssh.generate_key()

login_manager = LoginManager()
login_manager.init_app(app)

    

@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()


@login_manager.user_loader
def user_loader(username):
    return  User(username)


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    form = LoginForm(request.form)
    if form.validate():
        user = User.query.filter(User.username == form.username.data).first()
        if user and user_manager.verify_password(form.pw.data, user):
            flask_login.login_user(user)
            return redirect(url_for('index', _external=True))
    return redirect(url_for('login', _external=True))
            
            
@app.route('/logout')
def logout():
    flask_login.logout_user()
    return redirect(url_for('login', _external=True))


@login_manager.unauthorized_handler
def unauthorized_handler():
    flash('You must log in.')
    return redirect(url_for('login', _external=True))


@app.route('/', methods=['GET'])
@flask_login.login_required
@roles_required('user')
def index():
    public_key = ''
    with open('/root/.ssh/id_rsa.pub') as pub:
        public_key = pub.read()
    return render_template('dashboard.html', public_key=public_key)


@app.route('/api/room/', methods=['GET'])
@roles_required('user')
def api_rooms():
    return jsonify(get_rooms())
    


@app.route('/api/room/add', methods=['POST'])
@roles_required('user')    
def room_add():
    form = RoomFormAdd(request.form)
    if form.validate():
        room = Room()
        saved = room.save(form.name.data, form.network.data, form.netmask.data, form.machines.data)
        if saved:
            return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})


@app.route('/api/room/delete', methods=['POST'])
@roles_required('user')    
def room_delete():
    form = RoomFormDelete(request.form)
    if form.validate():
        room = Room.query.get(form.key.data)
        room.delete()
        return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})


@app.route('/api/room/discover', methods=['POST'])
@roles_required('user')    
def room_ssh():
    room = RoomFormDelete(request.form)
    if room.validate():
        room.discover_hosts()
        hosts = room.get_hosts()
        return jsonify(hosts)
    else:
        return redirect(url_for('index'))
        

@app.route('/api/task/', methods=['GET'])
@roles_required('user')    
def api_tasks():
    return jsonify(get_tasks())


@app.route('/api/task/add', methods=['POST'])
@roles_required('user')
def task_add():
    form = TaskFormAdd(request.form)
    if form.validate():
        task = Task(name=form.taskName.data)
        db_session.add(task)
        db_session.commit()
        return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})

    
@app.route('/api/task/delete', methods=['POST'])
@roles_required('user')
def task_delete():
    form = TaskFormDelete(request.form)
    if form.validate():
        task = Task.query.get(form.key.data)
        db_session.delete(task)
        db_session.commit()
        return jsonify({'message': 'deleted'})
    return jsonify({'message': 'failed'})

    
@roles_required('user')    
@app.route('/api/task/<id>/module/add', methods=['POST'])
def module_add(id):
    form = ModuleFormAdd(request.form)
    if form.validate():
        task = Task.query.get(id)
        saved = task.module_add(form.module.data, app)
        if saved:
            return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})

    

@app.route('/api/task/<id>/module/delete', methods=['POST'])
@roles_required('user')
def module_delete(id):
    form = ModuleFormDelete(request.form)
    if form.validate():
        task = Task.query.get(id)
        deleted = task.module_delete(form.key.data)
        if deleted:
            return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})

    
@app.route('/api/task/<id>/parameter/add', methods=['POST'])
@roles_required('user')
def parameter_add(id):
    form = ParameterFormAdd(request.form)
    if form.validate():
        task = Task.query.get(id)
        saved = task.parameter_add(form.modulekey.data, (form.parameter.data, form.value.data))
        if saved:
            return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})


@app.route('/api/task/<id>/parameter/delete', methods=['POST'])
@roles_required('user')
def parameter_delete(id):
    form = ParameterFormDelete(request.form)
    if form.validate():
        task = Task.query.get(id)
        deleted = task.parameter_delete(form.key.data)
        if deleted:
            return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})

    

@app.route('/api/run', methods=['POST'])
@roles_required('user')
def run():
    rooms = [ int(each) for each in request.form.getlist('rooms[]')]
    tasks = [ int (each) for each in request.form.getlist('tasks[]')]

    rooms, room_names = get_machines(rooms)
    tasks, task_names = execution_taks(tasks)

    name_log = '-'.join(task_names) + '@' +  '-'.join(room_names) 
    name_log += '@' + current_user.username
    ansible_playbook = ThreadRunner(rooms, tasks, 'root', name_log,app)
    ansible_playbook.start()
    if True:
        return jsonify({'message': 'Task is running!'})
    return jsonify({'message': 'receive'})

    
    
@app.route('/api/results', methods=['GET'])
@roles_required('user')
def results():
    dirs = os.listdir(os.getenv('LOGS'))
    results = []
    for each in dirs:
        results.append({'name': each})
    return jsonify({'results': results })

    
    
@app.route('/api/results', methods=['POST'])
@roles_required('user')
def a_result():
    form = ResultForm(request.form)
    if form.validate():
        filename = os.getenv('LOGS') + form.result.data
        result = get_result(filename)
    return jsonify(result)




@app.route('/api/user', methods=['GET'])
@roles_required('admin')
def users():
    users = {}
    user = User.query.filter(User.username==current_user.username).first()
    if user.is_admin():
        users.update(get_users())
    else:
        users.update({'users':[]})
    users['user'] = user.get_setup()
    return jsonify(users)

    
    
@app.route('/api/user/add', methods=['POST'])
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


@app.route('/api/user/change', methods=['POST'])
@roles_required('user')
def user_change():
    form = UserChangeForm(request.form)
    if form.validate():
        user = User.query.get(form.key.data)
        if user_manager.verify_password(form.old.data, user):
            user.username = form.username.data
            user.email = form.email.data
            user.password = user_manager.hash_password(form.password.data)
            db_session.commit()
            return jsonify({'message': 'saved'})
        return jsonify({'message': 'wrong password!'})
    return jsonify({'message': 'failed'})
    

@app.route('/api/user/change_password', methods=['POST'])
@roles_required('admin')
def user_change_password():
    form = PassChangeForm(request.form)
    if form.validate():
        user = User.query.filter(User.username == current_user.username).first()
        if user_manager.verify_password(form.old.data, user):
            user = User.query.get(form.key.data)
            user.password = user_manager.hash_password(form.password.data)
            db_session.commit()
            return jsonify({'message': 'saved'})
        return jsonify({'message': 'wrong password!'})
    return jsonify({'message': 'failed'})

    
@app.route('/api/user/delete', methods=['POST'])
@roles_required('admin')
def user_delete():
    form = UserDeleteForm(request.form)
    if form.validate():
        user = User.query.get(form.key.data)
        db_session.delete(user)
        db_session.commit()
        return jsonify({'message': 'deleted'})
    return jsonify({'message': 'failed'})


        

if __name__ == '__main__':
    app.run(host='0.0.0.0')



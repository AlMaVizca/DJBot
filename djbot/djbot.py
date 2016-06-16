from database import db_session, init_db
from contextlib import closing
from flask import Flask, g, Response, render_template, request
from flask import url_for, redirect
from flask import jsonify, flash
from flask_debugtoolbar import DebugToolbarExtension
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CsrfProtect
from forms import *
from models import Room
from task import Task
from querys import *
from ansibleapi import ThreadRunner
from scripts import config_ssh, generate_RSA
import os

csrf = CsrfProtect()

app = Flask(__name__)
csrf.init_app(app)
app.config.from_object('settings.Config')
app.config.from_envvar('FLASKR_SETTINGS', silent=True)
app.debug = app.config['DEBUG']
toolbar = DebugToolbarExtension(app)

ssh_config = config_ssh.SshConfig()
ssh_config.set_defaults()
ssh_config.write_settings()

if not os.path.isfile('/root/.ssh/id_rsa'):
    generate_RSA()
    


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()

@app.route('/', methods=['GET'])
def index():
    return render_template('dashboard.html' )
    
@app.route('/api/room/', methods=['GET'])
def api_rooms():
    return jsonify(get_rooms())
    

@app.route('/api/room/add', methods=['POST'])
def room_add():
    form = RoomFormAdd(request.form)
    if form.validate():
        room = Room()
        saved = room.save(form.name.data, form.network.data, form.netmask.data, form.machines.data)
        if saved:
            return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})

@app.route('/api/room/delete', methods=['POST'])
def room_delete():
    form = RoomFormDelete(request.form)
    if form.validate():
        room = Room(key=form.key.data)
        room.delete()
        return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})

@app.route('/api/room/discover', methods=['POST'])
def room_ssh():
    room = RoomFormDelete(request.form)
    app.logger.info(request.form)
    if room.validate():
        room.discover_hosts()
        hosts = room.get_hosts()
        return jsonify(hosts)
    else:
        return redirect(url_for('index'))
        
    
@app.route('/api/task/', methods=['GET'])
def api_tasks():
    return jsonify(get_tasks())

@app.route('/api/task/add', methods=['POST'])
def task_add():
    form = TaskFormAdd(request.form)
    if form.validate():
        task = Task()
        saved = task.save(form.taskName.data)
        if saved:
            return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})

@app.route('/api/task/delete', methods=['POST'])
def task_delete():
    form = TaskFormDelete(request.form)
    if form.validate():
        task = Task(form.key.data)
        delete = task.delete()
        if delete:
            return jsonify({'message': 'deleted'})
    return jsonify({'message': 'failed'})

@app.route('/api/task/<id>/module/add', methods=['POST'])
def module_add(id):
    form = ModuleFormAdd(request.form)
    if form.validate():
        task = Task(id)
        saved = task.module_add(form.module.data)
        if saved:
            return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})


@app.route('/api/task/<id>/module/delete', methods=['POST'])
def module_delete(id):
    form = ModuleFormDelete(request.form)
    if form.validate():
        task = Task(id)
        deleted = task.module_delete(form.key.data)
        if deleted:
            return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})
    
@app.route('/api/task/<id>/parameter/add', methods=['POST'])
def parameter_add(id):
    form = ParameterFormAdd(request.form)
    if form.validate():
        task = Task(id)
        app.logger.info(task)
        saved = task.parameter_add(form.modulekey.data, (form.parameter.data, form.value.data), app)
        if saved:
            return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})


@app.route('/api/task/<id>/parameter/delete', methods=['POST'])
def parameter_delete(id):
    form = ParameterFormDelete(request.form)
    if form.validate():
        task = Task(id)
        deleted = task.parameter_delete(form.key.data)
        if deleted:
            return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})


@app.route('/api/run', methods=['POST'])
def run():
    rooms = [ int(each) for each in request.form.getlist('rooms[]')]
    tasks = [ int (each) for each in request.form.getlist('tasks[]')]

    rooms, room_names = get_machines(rooms)
    tasks, task_names = execution_taks(tasks) 

    name_log = '-'.join(task_names) + '@' +  '-'.join(room_names)

    ansible_playbook = ThreadRunner(rooms, tasks, 'root', name_log)
    ansible_playbook.start()
    if True:
        return jsonify({'message': 'Task is running!'})
    return jsonify({'message': 'receive'})

    
@app.route('/api/results', methods=['GET'])
def results():
    dirs = os.listdir(os.getenv('LOGS'))
    results = []
    for each in dirs:
        results.append({'name': each})
    return jsonify({'results': results })

    
@app.route('/api/results', methods=['POST'])
def a_result():
    form = ResultForm(request.form)
    if form.validate():
        name = os.getenv('LOGS') + form.result.data
        app.logger.info(name)
        result = get_result(name)
        app.logger.info(result)
    return jsonify({'result': result})
    
        

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0')



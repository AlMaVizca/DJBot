from database import db_session
from contextlib import closing
from flask import Flask, g, Response, render_template, request
from flask import url_for, redirect
from flask import jsonify, flash
from flask_wtf.csrf import CsrfProtect
from forms import *
from models import Room
from task import Task
from querys import get_rooms, get_tasks


csrf = CsrfProtect()

app = Flask(__name__)
csrf.init_app(app)
app.config.from_object('settings.Config')
app.config.from_envvar('FLASKR_SETTINGS', silent=True)
app.debug = app.config['DEBUG']


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()

@app.route('/api/room/', methods=['GET'])
def api_rooms():
    return jsonify(get_rooms())

@app.route('/api/room/<name>/discover', methods=['GET'])
def room_ssh(name):
    room = Room(name)
    if room.get(name):
        #room.discover_hosts()
        hosts = room.get_hosts()
        return jsonify(hosts)
    else:
        return redirect(url_for('index'))
        
@app.route('/api/room/add', methods=['POST'])
def room_add():
    form = AddRoomForm(request.form)
    app.logger.info(form.validate())
    app.loggar.info(request.form)
    if form.validate():
        room = Room(key=form.keyRoom.data)
        saved = room.save(form.name.data, form.network.data, form.netmask.data, form.proxy.data, form.machines.data)
        if saved:
            return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})

@app.route('/api/room/delete', methods=['POST'])
def room_delete():
    form = DeleteRoomForm(request.form)    
    if form.validate():
        room = Room(key=form.keyRoom.data)
        room.delete()
        return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})


@app.route('/api/task/', methods=['GET'])
def api_tasks():
    return jsonify(get_tasks())

@app.route('/api/task/add', methods=['POST'])
def task_add():
    form = AddTaskForm(request.form)
    if form.validate():
        task = Task()
        app.logger.info(form.taskName.data)
        saved = task.save(form.taskName.data)
        app.logger.info(saved)
        if saved:
            return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})

@app.route('/api/task/delete', methods=['POST'])
def task_delete():
    form = DeleteTaskForm(request.form)
    app.logger.info(request.form)
    if form.validate():
        app.logger.info(form.key.data);
        task = Task(form.key.data)
        delete = task.delete()
        if delete:
            return jsonify({'message': 'deleted'})
    return jsonify({'message': 'failed'})

@app.route('/api/task/<id>/add', methods=['POST'])
def module_add(id):
    form = ModuleFormAdd(request.form)
    app.logger.info(request.form)
    if form.validate():
        task = Task(id)
        saved = task.add_module(form.module.data)
        app.logger.info(saved)
        if saved:
            return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})


@app.route('/api/task/<id>/delete', methods=['POST'])
def module_delete(id):
    form = ModuleFormDelete(request.form)
    app.logger.info(request.form)
    if form.validate():
        task = Task(id)
        saved = task.delete_module(form.key.data)
        app.logger.info(saved)
        if saved:
            return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})
    

    
    
@app.route('/', methods=['GET'])
def index():
    return render_template('dashboard.html' )

@app.route('/room/<name>', methods=['GET', 'POST'])
def room(name):
    room = Room(name)
    if room.get(name):
        room.hosts = ['163.10.78.1','163.10.78.79']
        return render_template('room.html', room=room.get_all())
    else:
        return redirect(url_for('index'))


if __name__ == '__main__':
    app.run(host='0.0.0.0')



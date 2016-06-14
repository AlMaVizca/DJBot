from database import db_session
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
from querys import get_rooms, get_tasks


csrf = CsrfProtect()

app = Flask(__name__)
csrf.init_app(app)
app.config.from_object('settings.Config')
app.config.from_envvar('FLASKR_SETTINGS', silent=True)
app.debug = app.config['DEBUG']
toolbar = DebugToolbarExtension(app)
# db = SQLAlchemy()
# db.init_app(app)

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
    app.logger.info(request.form)
    if form.validate():
        room = Room()
        saved = room.save(form.name.data, form.network.data, form.netmask.data, form.machines.data)
        app.logger.info(saved)
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
    room = RoomFormAdd(request.form)
    if room.get(name):
        #room.discover_hosts()
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
        app.logger.info(form.taskName.data)
        saved = task.save(form.taskName.data)
        app.logger.info(saved)
        if saved:
            return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})

@app.route('/api/task/delete', methods=['POST'])
def task_delete():
    form = (request.form)
    app.logger.info(request.form)
    if form.validate():
        app.logger.info(form.key.data);
        task = Task(form.key.data)
        delete = task.delete()
        if delete:
            return jsonify({'message': 'deleted'})
    return jsonify({'message': 'failed'})

@app.route('/api/task/<id>/module/add', methods=['POST'])
def module_add(id):
    form = ModuleFormAdd(request.form)
    app.logger.info(request.form)
    app.logger.info(form.validate())
    if form.validate():
        task = Task(id)
        saved = task.module_add(form.module.data)
        app.logger.info(saved)
        if saved:
            return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})


@app.route('/api/task/<id>/module/delete', methods=['POST'])
def module_delete(id):
    form = ModuleFormDelete(request.form)
    app.logger.info(request.form)
    if form.validate():
        task = Task(id)
        deleted = task.module_delete(form.key.data)
        app.logger.info(saved)
        if deleted:
            return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})
    
@app.route('/api/task/<id>/argument/add', methods=['POST'])
def argument_add(id):
    form = ArgumentFormAdd(request.form)
    app.logger.info(request.form)
    app.logger.info(form.validate())
    if form.validate():
        task = Task(id)
        saved = task.argument_add(form.modulekey.data, (form.argument.data, form.value.data), app)
        app.logger.info(saved)
        if saved:
            return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})


@app.route('/api/task/<id>/argument/delete', methods=['POST'])
def argument_delete(id):
    form = ArgumentFormDelete(request.form)
    app.logger.info(request.form)
    if form.validate():
        task = Task(id)
        deleted = task.argument_delete(form.key.data)
        if deleted:
            return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})


@app.route('/api/run', methods=['POST'])
def room(name):
    pass

if __name__ == '__main__':
    app.run(host='0.0.0.0')



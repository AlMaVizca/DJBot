from database import db_session
from contextlib import closing
from flask import Flask, g, Response, render_template, request
from flask import url_for, redirect
from flask import jsonify, flash
from forms import SettingsForm
from helpers import set_properties
from models import Room
from querys import get_rooms

import logging


app = Flask(__name__)
app.config.from_object('settings.Config')
app.config.from_envvar('FLASKR_SETTINGS', silent=True)
app.debug = app.config['DEBUG']


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()

@app.route('/api/room/', methods=['GET'])
def api_room():
    return jsonify(get_rooms())

@app.route('/api/room/<name>', methods=['GET'])
def room_settings(name):
    form = SettingsForm(request.form)
    room = Room(name)
    if room.get(name):
        return jsonify(room.get_all())
    else:
        return redirect(url_for('index'))

@app.route('/api/room/<name>/discover', methods=['GET'])
def room_ssh(name):
    room = Room(name)
    if room.get(name):
        #room.discover_hosts()
        hosts = room.get_hosts()

        return jsonify(hosts)
    else:
        return redirect(url_for('index'))
        
@app.route('/api/room/<name>/add', methods=['POST'])
def room_add(name):
    form = SettingsForm(request.form)
    room = Room(name)
    if form.validate():
        room.key = form.identifier.data
        room.name = form.name.data
        room.network = form.network.data
        room.netmask = form.netmask.data        
        room.proxy = form.proxy.data
        room.machines = form.machines.data
        if room.save():
                return redirect(url_for('room_settings', name=room.name))

@app.route('/', methods=['GET', 'POST'])
def index():
    room = Room('Biol')
    room.get('Biol')
    return render_template('dashboard.html', room=room.get_all())

@app.route('/room/<name>', methods=['GET', 'POST'])
def room(name):
    room = Room(name)
    if room.get(name):
        room.hosts = ['163.10.78.1','163.10.78.79']
        return render_template('room.html', room=room.get_all())
    else:
        return redirect(url_for('index'))


@app.route('/task/', methods=['GET'])
def task():
    tasks = {'tasks': [{ 'name': 'arch', 'modules': 'pacman' }, {'name': 'otra', 'modules': 'docker'}]}
    return jsonify(tasks)
    
        
if __name__ == '__main__':
    app.run(host='0.0.0.0')



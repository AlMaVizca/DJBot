from flask import Flask, Response, render_template, request
from context import get_rooms, get_host
from ansibleapi import *

DEBUG = True
app = Flask(__name__)
app.secret_key = 'DevDThelopmente'
app.config.from_object(__name__)



@app.route('/', methods=['GET', 'POST'])
def index():
    computer_rooms = get_rooms()
    return render_template('dashboard.html', computer_rooms=computer_rooms)

@app.route('/settings/<room_name>', methods=['GET', 'POST'])
def settings(room_name):
    return render_template('room.html', room_name=room_name)

    
@app.route('/room/<room_name>', methods=['GET', 'POST'])
def room(room_name):
    host = get_host()
    inventory = ['localhost','163.10.78.1']
    ansible_game = Runner(inventory)
    ansible_game.add_play('shell log',['163.10.78.1'])
    ansible_game.run()
    host = ansible_game.get_setup()
    return render_template('room.html', room_name=room_name, host=host)

@app.route('/task/<room_name>', methods=['GET', 'POST'])
def task(room_name):
    return render_template('task.html', room_name=room_name)

@app.route('/task/add/<room_name>', methods=['GET', 'POST'])
def add_task(room_name):
    return render_template('task.html', room_name=room_name)

@app.route('/task/edit/<room_name>', methods=['GET', 'POST'])
def edit_task(room_name):
    return render_template('task.html', room_name=room_name)
    
@app.route('/task/delete/<room_name>', methods=['GET', 'POST'])
def delete_task(room_name):
    return render_template('task.html', room_name=room_name)
    
    
if __name__ == '__main__':
    app.run(host='0.0.0.0')



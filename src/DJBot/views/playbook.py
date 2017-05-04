from DJBot.database import db
from DJBot.models.playbook import Playbook, get_playbooks
from DJBot.forms.playbook import Add, Change
from DJBot.forms.generic import Select
from flask import Blueprint, jsonify, request
from flask_security import login_required, roles_required

playbook_bp = Blueprint('playbook', __name__)


@playbook_bp.route('/all', methods=['GET'])
@login_required
@roles_required('user')
def playbooks():
    return jsonify(get_playbooks())


@playbook_bp.route('/get', methods=['POST'])
@login_required
@roles_required('user')
def get():
    form = Select(request.form)
    if form.validate():
        try:
            playbook = Playbook.query.get(form.key.data)
            return jsonify(playbook.get_setup())
        except:
            pass
    return jsonify({'messageMode': 1,
                    'messageText': 'That playbook does not exist'})


@playbook_bp.route('/new', methods=['POST'])
@login_required
@roles_required('user')
def add():
    form = Add(request.form)
    if form.validate():
        play = Playbook(name=form.name.data,
                        description=form.description.data)
        db.session.add(play)
        db.session.commit()
        return jsonify({'messageMode': 0,
                        'messageText': 'Playbook saved'})
    return jsonify({'messageMode': 1,
                    'messageText': 'There was an error saving the playbook'})


@playbook_bp.route('/delete', methods=['POST'])
@login_required
@roles_required('user')
def delete():
    form = Select(request.form)
    if form.validate():
        playbook = Playbook.query.get(form.key.data)
        db.session.delete(playbook)
        db.session.commit()
        return jsonify({'messageMode': 0,
                        'messageText': 'Playbook deleted'})
    return jsonify({'messageMode': 1,
                    'messageText': 'There was an error deleting the playbook'})


@playbook_bp.route('/save', methods=['POST'])
@login_required
@roles_required('user')
def save():
    form = Change(request.form)
    if form.validate_on_submit():
        playbook = Playbook.query.get(form.key.data)
        playbook.name = form.name.data
        playbook.description = form.description.data
        db.session.commit()
        return jsonify({'messageMode': 0,
                        'messageText': 'Playbook saved'})
    return jsonify({'messageMode': 1,
                    'messageText': 'There was an error saving the playbook'})

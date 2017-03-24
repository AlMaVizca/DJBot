from database import db
from flask import Blueprint, jsonify, request
from flask_security import roles_required
from querys import get_playbooks
from models.playbook import Playbook
from forms import PlaybookFormAdd, PlaybookFormSelect

playbook_bp = Blueprint('playbook', __name__)


@playbook_bp.route('/playbooks', methods=['GET'])
@roles_required('user')
def api_playbooks():
    return jsonify(get_playbooks())


@playbook_bp.route('/new', methods=['POST'])
@roles_required('user')
def playbook_add():
    form = PlaybookFormAdd(request.form)
    if form.validate():
        play = Playbook(name=form.name.data,
                        description=form.description.data)
        db.session.add(play)
        db.session.commit()
        return jsonify({'messageMode': '0',
                        'messageText': 'Playbook saved'})
    return jsonify({'messageMode': '1',
                    'messageText': 'There was an error saving the playbook'})


@playbook_bp.route('/delete', methods=['POST'])
@roles_required('user')
def playbook_delete():
    form = PlaybookFormSelect(request.form)
    if form.validate():
        playbook = Playbook.query.get(form.key.data)
        db.session.delete(playbook)
        db.session.commit()
        return jsonify({'messageMode': 0,
                        'messageText': 'Playbook deleted'})
    return jsonify({'messageMode': 1,
                    'messageText': 'There was an error deleting the playbook'})


@playbook_bp.route('/get', methods=['POST'])
@roles_required('user')
def playbook_get():
    form = PlaybookFormSelect(request.form)
    if form.validate():
        playbook = Playbook.query.get(form.key.data)
        return jsonify(playbook.get_setup())
    return jsonify({'messageMode': 1,
                    'messageText': 'That playbook does not exist'})


@playbook_bp.route('/save', methods=['POST'])
@roles_required('user')
def playbook_save():
    form = PlaybookFormSelect(request.form)
    if form.validate_on_submit():
        playbook = Playbook.query.get(form.key.data)
        playbook.name = form.name.data
        playbook.description = form.description.data
        db.session.commit()
        return jsonify({'messageMode': '0',
                        'messageText': 'Playbook saved'})
    return jsonify({'messageMode': '1',
                    'messageText': 'There was an error saving the playbook'})

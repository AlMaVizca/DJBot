from database import db_session
from flask import Blueprint, jsonify, request
from flask_user import roles_required


playbook_bp = Blueprint('playbook', __name__ )


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
        db_session.add(play)
        db_session.commit()
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
        db_session.delete(playbook)
        db_session.commit()
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
        playbook_bplogger.info(request.form)
        playbook_bplogger.info(form.name.data)
        playbook_bplogger.info(form.description.data)
        playbook = Playbook.query.get(form.key.data)
        playbook.name = form.name.data
        playbook.description = form.description.data
        db_session.commit()
        return jsonify({'messageMode': '0',
                        'messageText': 'Playbook saved'})
    return jsonify({'messageMode': '1',
                    'messageText': 'There was an error saving the playbook'})

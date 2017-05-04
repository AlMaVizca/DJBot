from DJBot.forms.room import Add
from DJBot.forms.generic import Select
from DJBot.models.room import Room, get_rooms
from flask import Blueprint, jsonify, request
from flask_security import login_required, roles_required

room_bp = Blueprint('room', __name__)


@room_bp.route('/all', methods=['GET'])
@login_required
@roles_required('user')
def api_rooms():
    return jsonify(get_rooms())


@room_bp.route('/new', methods=['POST'])
@login_required
@roles_required('user')
def room_add():
    form = Add(request.form)
    if form.validate():
        room = Room()
        saved = room.save(form.name.data, form.network.data,
                          form.netmask.data, form.machines.data)
        if saved:
            return jsonify({'messageMode': 0,
                            'message': 'saved'})
    return jsonify({'messageMode': 1,
                    'message': 'failed'})


@room_bp.route('/delete', methods=['POST'])
@login_required
@roles_required('user')
def room_delete():
    form = Select(request.form)
    if form.validate():
        try:
            room = Room.query.get(form.key.data)
            room.delete()
            return jsonify({'messageMode': 0,
                            'message': 'saved'})
        except:
            pass
    return jsonify({'messageMode': 1,
                    'message': 'failed'})

# TODO: Auto discover machines
# @room_bp.route('/discover', methods=['POST'])
# @login_required
# @roles_required('user')
# def room_ssh():
#     room = Select(request.form)
#     if room.validate():
#         room.discover_hosts()
#         hosts = room.get_hosts()
#         return jsonify(hosts)

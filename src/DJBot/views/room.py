from flask import Blueprint, jsonify, request
from DJBot.forms import RoomFormAdd, RoomFormDelete
from DJBot.models.room import Room, get_rooms

room_bp = Blueprint('room', __name__)


@room_bp.route('/', methods=['GET'])
def api_rooms():
    return jsonify(get_rooms())


@room_bp.route('/add', methods=['POST'])
def room_add():
    form = RoomFormAdd(request.form)
    if form.validate():
        room = Room()
        saved = room.save(form.name.data, form.network.data,
                          form.netmask.data, form.machines.data)
        if saved:
            return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})


@room_bp.route('/delete', methods=['POST'])
def room_delete():
    form = RoomFormDelete(request.form)
    if form.validate():
        room = Room.query.get(form.key.data)
        room.delete()
        return jsonify({'message': 'saved'})
    return jsonify({'message': 'failed'})


@room_bp.route('/discover', methods=['POST'])
def room_ssh():
    room = RoomFormDelete(request.form)
    if room.validate():
        room.discover_hosts()
        hosts = room.get_hosts()
        return jsonify(hosts)

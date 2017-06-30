from DJBot.forms.inventory import Add, HostAdd, KeyCopy
from DJBot.forms.generic import Select
from DJBot.models.inventory import get_host, get_hosts,\
    get_machines, get_room, get_rooms
from DJBot.utils.ansible_api import copy_key, ansible_status
from flask import Blueprint, jsonify, request
from flask_security import login_required, roles_required

inventory_bp = Blueprint('inventory', __name__)


@inventory_bp.route('/all', methods=['GET'])
@login_required
@roles_required('user')
def inventory():
    records = get_rooms()
    records.update(get_hosts())
    return jsonify(records)


@inventory_bp.route('/get', methods=['POST'])
@login_required
@roles_required('user')
def room_get():
    form = Select(request.form)
    if form.validate():
        return jsonify(get_room(form.key.data).get_setup())
    return jsonify({'messageMode': 1,
                    'messageText': 'That room does not exist'})


@inventory_bp.route('/get_machines', methods=['POST'])
@login_required
@roles_required('user')
def room_get_machines():
    form = Select(request.form)
    if form.validate():
        try:
            room = get_room(form.key.data)
            hosts, name = get_machines(form.key.data)
            result = ansible_status(hosts, room.user, room.private_key)
            return jsonify({"hosts": result})
        except:
            pass
    return jsonify({'messageMode': 1,
                    'messageText': "DJBot can't  find any host",
                    'hosts': {}})


@inventory_bp.route('/new', methods=['POST'])
@login_required
@roles_required('user')
def room_add():
    form = Add(request.form)
    if form.validate():
        room = get_room(form.key.data)
        saved = room.save(form.name.data, form.network.data,
                          form.netmask.data, form.machines.data,
                          form.gateway.data, form.user.data,
                          form.private_key.data)
        if saved:
            return jsonify({'messageMode': 0,
                            'message': 'saved',
                            'key': room.key})
    return jsonify({'messageMode': 1,
                    'message': 'failed'})


@inventory_bp.route('/delete', methods=['POST'])
@login_required
@roles_required('user')
def room_delete():
    form = Select(request.form)
    if form.validate():
        try:
            room = get_room(form.key.data)
            room.delete()
            return jsonify({'messageMode': 0,
                            'message': 'saved'})
        except:
            pass
    return jsonify({'messageMode': 1,
                    'message': 'failed'})


@inventory_bp.route('/host/get', methods=['POST'])
@login_required
@roles_required('user')
def host_get():
    form = Select(request.form)
    if form.validate():
        try:
            response = get_host(form.key.data).get_setup()
            return jsonify(response)
        except:
            pass
    return jsonify({'messageMode': 1,
                    'message': 'failed'})


@inventory_bp.route('/host/info', methods=['POST'])
@login_required
@roles_required('user')
def host_info():
    form = Select(request.form)
    if form.validate():
        try:
            host = get_host(form.key.data).get_setup()
            response = {}
            response['hosts'] = ansible_status([host['ip']],
                                               host['user'],
                                               host['private_key'])
            response['name'] = host['name']
            response['key'] = host['key']
            return jsonify(response)
        except:
            pass
    return jsonify({'messageMode': 1,
                    'message': 'failed'})


@inventory_bp.route('/host/new', methods=['POST'])
@login_required
@roles_required('user')
def host_add():
    form = HostAdd(request.form)
    if form.validate():
        host = get_host(form.key.data)
        saved = host.save(form.name.data, form.ip.data,
                          form.user.data, form.private_key.data,
                          form.note.data)
        if saved:
            response = host.get_setup()
            response.update({'status': 'good'})
            return jsonify(response)
    return jsonify({'messageMode': 1,
                    'message': 'failed'})


@inventory_bp.route('/host/delete', methods=['POST'])
@login_required
@roles_required('user')
def host_delete():
    form = Select(request.form)
    if form.validate():
        try:
            host = get_host(form.key.data)
            host.delete()
            return jsonify({'messageMode': 0,
                            'message': 'saved'})
        except:
            pass
    return jsonify({'messageMode': 1,
                    'message': 'failed'})


@inventory_bp.route('/copy', methods=['POST'])
@login_required
@roles_required('user')
def key_copy():
    form = KeyCopy(request.form)
    if form.validate():
        if form.room.data != 'false':
            room = get_room(form.key.data)
            hosts, name = get_machines(form.key.data)

            result = copy_key(hosts, room.private_key, room.user,
                              form.password.data)
        else:
            host = get_host(form.key.data)
            result = copy_key([host.ip], host.private_key, host.user,
                              form.password.data)
        return jsonify({'hosts': result})
    return jsonify({'messageMode': 1,
                    'message': 'failed'})

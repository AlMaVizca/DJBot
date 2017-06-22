from flask import Blueprint, jsonify, request
from flask_security import login_required, roles_required
from DJBot.forms.generic import SelectName
from DJBot.utils.ssh import generate_key, remove_key
from DJBot.models.playbook import Playbook
from DJBot.models.inventory import Room, Host
import os
import re

settings_bp = Blueprint('settings', __name__)


def get_keys():
    keys = os.listdir(os.getenv("HOME")+"/.ssh/keys")
    keys = [each for each in keys if not re.match(".*\.pub", each)]
    return keys


def get_results():
    return os.listdir(os.getenv("LOGS"))


@settings_bp.route('/main', methods=['GET'])
@login_required
@roles_required('user')
def main():
    inventory = Room.query.count() + Host.query.count()
    return jsonify({"playbooks": Playbook.query.count(),
                    "inventory": inventory,
                    "results": len(get_results())})


@settings_bp.route('/keys', methods=['GET'])
@login_required
@roles_required('user')
def keys_get():
    return jsonify({"keys": get_keys()})


@settings_bp.route('/key_new', methods=['POST'])
@login_required
@roles_required('user')
def key_new():
    form = SelectName(request.form)
    if form.validate():
        generate_key(form.name.data)
    return jsonify({"keys": get_keys()})


@settings_bp.route('/key_delete', methods=['POST'])
@login_required
@roles_required('user')
def key_delete():
    form = SelectName(request.form)
    if form.validate():
        remove_key(form.name.data)
    return jsonify({"keys": get_keys()})

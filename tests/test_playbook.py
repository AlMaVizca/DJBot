# -*- coding: utf-8 -*-
"""
    test_playbook
    ~~~~~~~~~~~~~~

    Playbook managment tests
"""

from utils import authenticate, logout


def test_get_playbooks(client):
    without_login = client.get('/api/playbook/all')
    authenticate(client)
    playbooks = client.get('/api/playbook/all').json
    logout(client)
    assert without_login.status_code == 302
    assert isinstance(playbooks['playbooks'], list)


def test_add_playbook(client):
    without_login = client.post('/api/playbook/new')
    wrong_method = client.get('/api/playbook/new')
    authenticate(client)
    save = client.post('/api/playbook/new', data={
        'name': 'Initial setup',
        'description': 'Hardening of the operative system'
    }).json
    wrong = client.post('/api/playbook/new', data={
        'description': 'Hardening of the operative system'
    }).json
    logout(client)
    assert without_login.status_code == 302
    assert wrong_method.status_code == 405
    assert save['messageMode'] == 0
    assert save['messageText'] == 'Playbook saved'
    assert wrong['messageMode'] == 1


def test_get_playbook(client):
    wrong_method = client.get('/api/playbook/get')
    without_login = client.post('/api/playbook/get')
    authenticate(client)
    check_pb = client.post('/api/playbook/get', data={
        'key': 1,
    }).json
    logout(client)
    assert without_login.status_code == 302
    assert wrong_method.status_code == 405
    assert check_pb['name'] == 'Initial setup'
    assert check_pb['description'] == 'Hardening of the operative system'
    assert isinstance(check_pb['tasks'], list)


def test_save_playbook(client):
    without_login = client.post('/api/playbook/save')
    wrong_method = client.get('/api/playbook/save')
    authenticate(client)
    change_pb = client.post('/api/playbook/get', data={
        'key': 1,
    }).json
    change_pb['name'] = 'Modified initial setup'
    change_pb['description'] = 'Modified description'
    save_pb = client.post('/api/playbook/save', data=change_pb).json
    check_pb = client.post('/api/playbook/get', data={
        'key': 1,
    }).json
    wrong_id = client.post('/api/playbook/save', data={
        'key': 0,
        'name': 'Not Good',
        'description': 'This is a test of a non valid id'
    }).json
    logout(client)
    assert without_login.status_code == 302
    assert wrong_method.status_code == 405
    assert save_pb['messageMode'] == 0
    assert wrong_id['messageMode'] == 1
    assert check_pb['name'] == 'Modified initial setup'
    assert check_pb['description'] == 'Modified description'
    assert isinstance(check_pb['tasks'], list)


def test_delete_playbook(client):
    without_login = client.post('/api/playbook/delete')
    wrong_method = client.get('/api/playbook/delete')
    authenticate(client)
    delete_pb = client.post('/api/playbook/delete', data={
        'key': 1,
    }).json
    check_pb = client.post('/api/playbook/get', data={
        'key': 1,
    }).json
    not_exist_pb = client.post('/api/playbook/delete', data={
        'key': 0,
    }).json

    logout(client)
    assert without_login.status_code == 302
    assert wrong_method.status_code == 405
    assert delete_pb['messageMode'] == 0
    assert check_pb['messageMode'] == 1
    assert not_exist_pb['messageMode'] == 1

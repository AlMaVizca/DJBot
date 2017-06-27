# -*- coding: utf-8 -*-
"""
    test_room
    ~~~~~~~~~~~~~~

    Room managment tests
"""


from utils import authenticate, logout


def test_get_inventory(client):
    without_login = client.get('/api/inventory/all')
    authenticate(client)
    room = client.get('/api/inventory/all').json
    logout(client)
    assert without_login.status_code == 302
    assert isinstance(room['rooms'], list)


def test_add_room(client):
    without_login = client.post('/api/inventory/new')
    authenticate(client)
    save = client.post('/api/inventory/new', data={
        'key': 0,
        'name': 'sala-1',
        'network': '192.168.0.1',
        'gateway': '192.168.0.1',
        'netmask': 24,
        'machines': 10,
        'user': 'root',
        'private_key': 'id_rsa',
    }).json
    fail = client.post('/api/inventory/new', data={
        'name': 'sala-1',
        'network': '192.168.0.1',
        'machines': 10
    }).json
    logout(client)
    assert without_login.status_code == 302
    assert save['messageMode'] == 0
    assert fail['messageMode'] == 1


def test_delete_rooms(client):
    without_login = client.post('/api/inventory/delete')
    authenticate(client)
    delete = client.post('/api/inventory/delete', data={
        'key': 1
    }).json
    fail = client.post('/api/inventory/delete', data={
        'key': 1
    }).json

    logout(client)
    assert without_login.status_code == 302
    assert delete['messageMode'] == 0
    assert fail['messageMode'] == 1

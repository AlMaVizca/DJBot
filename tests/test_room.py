# -*- coding: utf-8 -*-
"""
    test_room
    ~~~~~~~~~~~~~~

    Room managment tests
"""


from utils import authenticate, logout


def test_get_rooms(client):
    without_login = client.get('/api/room/all')
    authenticate(client)
    room = client.get('/api/room/all').json
    logout(client)
    assert without_login.status_code == 302
    assert isinstance(room['rooms'], list)


def test_add_room(client):
    without_login = client.post('/api/room/new')
    authenticate(client)
    save = client.post('/api/room/new', data={
        'name': 'sala-1',
        'network': '192.168.0.1',
        'netmask': 24,
        'machines': 10
    }).json
    fail = client.post('/api/room/new', data={
        'name': 'sala-1',
        'network': '192.168.0.1',
        'machines': 10
    }).json
    logout(client)
    assert without_login.status_code == 302
    assert save['messageMode'] == 0
    assert fail['messageMode'] == 1


def test_delete_rooms(client):
    without_login = client.post('/api/room/delete')
    authenticate(client)
    delete = client.post('/api/room/delete', data={
        'key': 1
    }).json
    fail = client.post('/api/room/delete', data={
        'key': 1
    }).json

    logout(client)
    assert without_login.status_code == 302
    assert delete['messageMode'] == 0
    assert fail['messageMode'] == 1

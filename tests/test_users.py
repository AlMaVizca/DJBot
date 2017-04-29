# -*- coding: utf-8 -*-
"""
    test_users
    ~~~~~~~~~~~~~~

    Users managment tests
"""

from utils import authenticate, logout


def test_get_users(client):
    user_without_login = client.get('/api/user/get_users')
    authenticate(client)
    user_login = client.get('/api/user/get_users')
    logout(client)
    users = user_login.json
    assert user_without_login.status_code == 302
    assert 2 == len(users['users'])


def test_get_user(client):
    user = {
        "admin": True,
        "email": "admin@dj.bot",
        "key": 1,
        "username": "admin"
    }
    user_without_login = client.get('/api/user/get')
    authenticate(client)
    user_login = client.get('/api/user/get')
    logout(client)
    assert user_without_login.status_code == 302
    assert user == user_login.json


def test_add_user(client):
    client.post('/api/user/add')


def test_change_user(client):
    client.post('/api/user/modify')


def test_change_password(client):
    client.post('/api/user/password')


def test_change_admin(client):
    client.post('/api/user/admin')


def test_delete_user(client):
    client.post('/api/user/delete')

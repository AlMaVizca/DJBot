# -*- coding: utf-8 -*-
"""
    test_users
    ~~~~~~~~~~~~~~

    Users managment tests
"""

from utils import authenticate, logout


def test_get_all(client):
    without_login = client.get('/api/user/all')
    authenticate(client)
    user_login = client.get('/api/user/all')
    logout(client)
    users = user_login.json
    assert without_login.status_code == 302
    assert 2 == len(users['users'])


def test_get_user(client):
    user = {
        "admin": True,
        "email": "admin@dj.bot",
        "key": 1,
        "username": "admin"
    }
    without_login = client.get('/api/user/get')
    authenticate(client)
    user_login = client.get('/api/user/get')
    logout(client)
    assert without_login.status_code == 302
    assert user == user_login.json


def test_add_user(client):
    data = {
        "username": "testUser",
        "email": "test@user.djbot",
        "password": "testPassword"
    }
    without_login = client.post('/api/user/add', data=data)
    authenticate(client)
    wrong_method = client.get('/api/user/add?username=a&email=a@b.c')
    save = client.post('/api/user/add', data=data)
    mistake = client.post('/api/user/add', data={"username": "testUserA",
                                                 "password": "password"})
    logout(client)
    assert without_login.status_code == 302
    assert wrong_method.status_code == 405
    assert {'message': 'saved'} == save.json
    assert {'message': 'failed'} == mistake.json


def test_change_user(client):
    username = 'new_name'
    wrong_method = client.get('/api/user/modify?username=a&email=a@b.c')
    without_login = client.post('/api/user/modify')
    authenticate(client)
    user_login = client.get('/api/user/get').json
    user_login['username'] = username
    user_login['password'] = 'password'
    client.post('/api/user/modify', data=user_login)
    user_login['password'] = 'fakePassword'
    wrong_password = client.post('/api/user/modify', data=user_login).json
    user_login.pop('password')
    form_not_valid = client.post('/api/user/modify', data=user_login).json
    user_login = client.get('/api/user/get').json
    logout(client)
    assert without_login.status_code == 302
    assert wrong_method.status_code == 405
    assert user_login['username'] == username
    assert wrong_password['messageText'] == 'Wrong password'
    assert form_not_valid['messageText'] == 'Failed to save changes'


def test_change_password(client):
    # TODO: Fix the change password repetition code
    without_login = client.post('/change',
                                data={"password": "password",
                                      "new_password": "new_password",
                                      "new_password_confirm": "new_password"})

    authenticate(client)
    new_password = client.post(
        '/change',
        data={
            "password": "password",
            "new_password": "new_password",
            "new_password_confirm": "new_password",
        }
    )
    password = client.post(
        '/change',
        data={
            "password": "new_password",
            "new_password": "password",
            "new_password_confirm": "password",
        }
    )
    logout(client)
    assert without_login.status_code == 302
    print new_password.data
    assert '/#/settings/user' in new_password.location
    assert password.status_code == 302
    assert '/#/settings/user' in password.location


def test_change_admin(client):
    wrong_method = client.get('/api/user/admin?key=2')
    without_login = client.post('/api/user/admin')
    authenticate(client)
    users = client.get('/api/user/all').json
    user_id = None
    for each in users['users']:
        if not each['admin']:
            user_id = each['key']
            break
    to_admin = client.post('/api/user/admin', data={'key': user_id})
    to_user = client.post('/api/user/admin', data={'key': user_id})
    mistake = client.post('/api/user/admin', data={'key': 0})
    invalid = client.post('/api/user/admin', data={'akey': 0})
    logout(client)
    assert without_login.status_code == 302
    assert wrong_method.status_code == 405
    assert invalid.status_code == 200
    assert {'message': 'saved'} == to_admin.json
    assert {'message': 'saved'} == to_user.json
    assert {'message': 'user not found'} == mistake.json
    assert {'message': 'failed'} == invalid.json


def test_delete_user(client):
    wrong_method = client.get('/api/user/delete?key=2')
    without_login = client.post('/api/user/delete')
    authenticate(client)
    users = client.get('/api/user/all').json
    user_id = None
    for each in users['users']:
        if not each['admin']:
            user_id = each['key']
            break

    delete = client.post('/api/user/delete', data={'key': user_id})
    invalid = client.post('/api/user/delete', data={'keyx': user_id})
    mistake = client.post('/api/user/delete', data={'key': 0})
    logout(client)
    assert without_login.status_code == 302
    assert wrong_method.status_code == 405
    assert delete.status_code == 200
    assert mistake.status_code == 200
    assert invalid.status_code == 200
    assert {'message': 'deleted'} == delete.json
    assert {'message': 'user not found'} == mistake.json
    assert {'message': 'failed'} == invalid.json

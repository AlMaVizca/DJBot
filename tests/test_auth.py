# -*- coding: utf-8 -*-
"""
    test_auth
    ~~~~~~~~~~~~~~

    Authentication tests
"""


def test_index(client):
    assert client.get('/').status_code == 302


def test_login(client):
    data = dict(email='admin@dj.bot', password='password')
    response = client.post(
        '/login?next=/',
        data=data,
        follow_redirects=True)
    assert b'Loading ...' in response.data


def test_login_unauthorized(client):
    """ Test if after fail the authentication show again the form"""
    data = dict(email='admin@otro.app', password='nopassword')
    response = client.post(
        '/login?next=/',
        data=data,
        follow_redirects=True)
    assert b'login_user_form' in response.data

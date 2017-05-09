# -*- coding: utf-8 -*-
"""
    test_task
    ~~~~~~~~~~~~~~

    Task managment tests
"""


from utils import authenticate, logout, add_playbook


def test_run(client):
    without_login = client.post('/api/action/run')
    authenticate(client)
    add_playbook(client)
    logout(client)
    assert without_login.status_code == 302
    # assert save['messageMode'] == 0
    # assert form_incomplete['messageMode'] == 1


def test_results(client):
    without_login = client.get('/api/action/results')
    authenticate(client)
    # execution_results = client.get('/api/action/results').json
    logout(client)
    assert without_login.status_code == 302
    # assert isinstance(execution_results['results'], list)


def test_get_result(client):
    without_login = client.post('/api/action/result')
    authenticate(client)
    logout(client)
    assert without_login.status_code == 302
    # assert save['messageMode'] == 0
    # assert form_incomplete['messageMode'] == 1

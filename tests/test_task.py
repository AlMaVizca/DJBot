# -*- coding: utf-8 -*-
"""
    test_task
    ~~~~~~~~~~~~~~

    Task managment tests
"""

from utils import authenticate, logout, add_playbook, delete_playbook


def test_add_task(client):
    without_login = client.post('/api/task/add')
    authenticate(client)
    add_playbook(client)
    # Review playooks key
    save = client.post('/api/task/add', data={
        'key': 2,
        'task': 'Update package list',
        'module': 'apt',
        'configuration-0-option': 'update_cache',
        'configuration-0-value': 'yes',
        'configuration-1-option': 'upgrade',
        'configuration-1-value': 'yes',
    }).json
    form_incomplete = client.post('/api/task/add', data={
        'task': 'Update package list',
    }).json
    logout(client)
    assert without_login.status_code == 302
    assert save['messageMode'] == 0
    assert form_incomplete['messageMode'] == 1


def test_delete_task(client):
    without_login = client.post('/api/task/delete')
    authenticate(client)

    delete = client.post('/api/task/delete', data={
        'key': 1
    }).json
    wrong_id = client.post('/api/task/delete', data={
        'key': 0
    }).json
    delete_playbook(client)
    logout(client)
    assert without_login.status_code == 302
    assert delete['messageMode'] == 0
    assert wrong_id['messageMode'] == 1


def test_categories(client):
    without_login = client.get('/api/task/categories')
    authenticate(client)

    categories = client.get('/api/task/categories').json

    logout(client)
    assert without_login.status_code == 302
    assert isinstance(categories, dict)
    assert isinstance(categories['categories'], list)


def test_category(client):
    without_login = client.post('/api/task/category')
    authenticate(client)

    category = client.post('/api/task/category',
                           data={'name': 'cloud'}).json
    not_valid_form = client.post('/api/task/category').json
    logout(client)
    assert without_login.status_code == 302
    assert isinstance(category['modules'], list)
    assert category['category_name'] == 'cloud'
    assert isinstance(not_valid_form, dict)

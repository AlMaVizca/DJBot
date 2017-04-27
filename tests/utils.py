# -*- coding: utf-8 -*-
"""
    utils
    ~~~~~

    Test utils
"""

import json


def authenticate(
        client,
        email="admin@dj.bot",
        password="password",
        endpoint=None,
        **kwargs):
    data = dict(email=email, password=password, remember='y')
    return client.post(endpoint or '/login', data=data, **kwargs)


def logout(client, endpoint=None, **kwargs):
    return client.get(endpoint or '/logout', **kwargs)


def json_of_response(response):
    """Decode json from response"""
    return json.loads(response.data.decode('utf8'))

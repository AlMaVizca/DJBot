from flask import url_for


def test_app(client):
    assert client.get(url_for('index')).status_code == 302


# def test_login(client):
#     assert client.get(url_for('login')).status_code == 200

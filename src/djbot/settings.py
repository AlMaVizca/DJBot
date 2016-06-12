import base64
import random

class Config(object):
    TESTING = True
    DEBUG = True
    #    SECRET_KEY = ''.join([base64.b64encode('asd' + str(random.random())) for each in range(0,4)])
    SECRET_KEY = 'asdasd'
    DATABASE = 'djbot.db'
    USERNAME = 'admin'
    PASSWORD = 'admin'
    SQLALCHEMY_ECHO=True

import os
import tempfile


class Config():
    TESTING = False
    DEBUG = False

    SECRET_KEY = 'changeThisKey'
    CSRF_ENABLED = True
    # Override the database path
    DATABASE = ''

    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + DATABASE

    # Flask-security settings
    SECURITY_PASSWORD_HASH = "bcrypt"
    SECURITY_TRACKABLE = True
    SECURITY_USER_IDENTITY_ATTRIBUTES = ['email', 'username']
    SECURITY_PASSWORD_SALT = "changeThisInInstanceConfiguration"

    # Flask-User settings
    USER_APP_NAME = "DJBot"
    USER_ENABLE_REGISTRATION = False
    DEBUG_TB_INTERCEPT_REDIRECTS = False


class Production(Config):
    DATABASE = os.path.basename('djbot.db')
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + DATABASE


class Testing(Config):
    f, path = tempfile.mkstemp(
        prefix='flask-security-test-db', suffix='.db', dir='/tmp')

    TESTING = True
    DEBUG = True
    USER_APP_NAME = "DJBot-Testing"

    DATABASE = path
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + DATABASE

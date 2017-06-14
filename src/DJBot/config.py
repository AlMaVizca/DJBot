import os
import tempfile


class Config():
    TESTING = False
    DEBUG = False

    SECRET_KEY = "changeThisKey"
    CSRF_ENABLED = True
    # Override the database path
    DATABASE = ""

    SQLALCHEMY_DATABASE_URI = "sqlite:///" + DATABASE

    # Flask-security settings
    SECURITY_CHANGEABLE = True
    SECURITY_PASSWORD_HASH = "bcrypt"
    SECURITY_PASSWORD_SALT = "changeThisInInstanceConfiguration"
    SECURITY_POST_CHANGE_VIEW = "/#/settings/user"
    SECURITY_REGISTERABLE = False
    SECURITY_TRACKABLE = True
    SECURITY_USER_IDENTITY_ATTRIBUTES = ["email", "username"]
    SECURITY_UNAUTHORIZED_VIEW = "/login"
    SECURITY_SEND_PASSWORD_CHANGE_EMAIL = False

    # Flask-User settings
    USER_APP_NAME = "DJBot"
    DEBUG_TB_INTERCEPT_REDIRECTS = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    LOGS = "/tmp/"
    KEYS = "/home/djbot/.ssh/keys/"


class Production(Config):
    DATABASE = os.path.basename("djbot.db")
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + DATABASE


class Testing(Config):
    f, path = tempfile.mkstemp(
        prefix="flask-security-test-db", suffix=".db", dir="/tmp")

    TESTING = True
    DEBUG = True
    USER_APP_NAME = "DJBot-Testing"

    DATABASE = path
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + DATABASE
    WTF_CSRF_ENABLED = False

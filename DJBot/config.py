import os

TESTING = False
DEBUG = False

DATABASE = 'djbot.db'
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.basename(DATABASE)

CSRF_ENABLED = True

# Flask-security settings
SECURITY_PASSWORD_HASH = "bcrypt"
SECURITY_TRACKABLE = True
SECURITY_USER_IDENTITY_ATTRIBUTES = ['email', 'username']
SECURITY_PASSWORD_SALT = "changeThisInInstanceConfiguration"

# Flask-User settings
USER_APP_NAME = "DJBot"
USER_ENABLE_REGISTRATION = False
DEBUG_TB_INTERCEPT_REDIRECTS = False

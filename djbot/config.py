import os

TESTING = False
DEBUG = False

DATABASE = 'djbot.db'
SQLALCHEMY_DATABASE_URI = 'sqlite:///'+ os.path.basename(DATABASE)

CSRF_ENABLED = True

# Flask-User settings
USER_APP_NAME= "DJBot"
USER_ENABLE_REGISTRATION = False
DEBUG_TB_INTERCEPT_REDIRECTS=False

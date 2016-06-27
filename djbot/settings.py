import base64
import random
import os



class Config(object):
    TESTING = True
    DEBUG = True
    SECRET_KEY = 'asdasd'
    DATABASE = 'djbot.db'
    USERNAME = 'admin'
    PASSWORD = 'admin'
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///'+ os.path.basename(DATABASE)

    CSRF_ENABLED = True
    
    # Flask-Mail settings
    MAIL_USERNAME =           os.getenv('MAIL_USERNAME',        'email@example.com')
    MAIL_PASSWORD =           os.getenv('MAIL_PASSWORD',        'password')
    MAIL_DEFAULT_SENDER =     os.getenv('MAIL_DEFAULT_SENDER',  '"MyApp" <noreply@example.com>')
    MAIL_SERVER =             os.getenv('MAIL_SERVER',          'smtp.gmail.com')
    MAIL_PORT =           int(os.getenv('MAIL_PORT',            '465'))
    MAIL_USE_SSL =        int(os.getenv('MAIL_USE_SSL',         True))
    
    # Flask-User settings
    USER_APP_NAME        = "DJBot"
    USER_ENABLE_REGISTRATION = False
    DEBUG_TB_INTERCEPT_REDIRECTS=False

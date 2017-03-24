from database import db
from models import first_data
from models.user import User, Role
from utils import config_ssh
from views import register_api
import os

from flask import Flask, render_template, request
from flask_wtf.csrf import CSRFProtect

from flask_security import Security, SQLAlchemyUserDatastore, \
    login_required, roles_required


def create_app(config='config.Production', instance=True):

    app = Flask(__name__, instance_relative_config=instance)

    app.config.from_object(config)
    app.config.from_pyfile('config.py', silent=True)
    app.config.from_envvar('FLASKR_SETTINGS', silent=True)
    app.debug = app.config['DEBUG']
    csrf = CSRFProtect()
    csrf.init_app(app)
    register_api(app)

    db.init_app(app)
    user_datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, user_datastore)

    try:
        User.query.all()
    except:
        first_data(app, user_datastore)

    if not os.path.isfile(os.getenv("HOME") + '/.ssh/id_rsa'):
        config_ssh.generate_key()

    @app.route('/', methods=['GET'])
    @login_required
    @roles_required('user')
    def index():
        return render_template('dashboard.html')

    @app.before_request
    def log_request():
        app.logger.debug(request)

    return app
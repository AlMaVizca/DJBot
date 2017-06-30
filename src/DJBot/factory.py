# DJBot - Ansible frontend for design playbooks and run them
# Copyright (C) 2017  Vizcaino, Aldo Maria <aldo.vizcaino87@gmail.com>

# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.


from DJBot.database import db
from DJBot.models import first_data
from DJBot.models.user import get_datastore, get_users
from DJBot.utils import ssh
from DJBot.views import register_api
import os

from flask import Flask, render_template, request
from flask_wtf.csrf import CSRFProtect

from flask_security import Security, login_required, roles_required


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
    user_datastore = get_datastore(db)
    app.security = Security(app, user_datastore)

    @app.before_first_request
    def init_database():
        """Check if the database doesn't exist and create it"""
        try:
            app.logger.info('Getting users...')
            get_users()
            app.logger.info('Success.')
        except:
            app.logger.error('Fail. We are gonna create the database')
            first_data(app, user_datastore)

        if not os.path.isfile(os.getenv("HOME") + '/.ssh/keys/id_rsa'):
            ssh.generate_key()

    @app.route('/', methods=['GET'])
    @login_required
    @roles_required('user')
    def index():
        return render_template('dashboard.html')

    @app.before_request
    def log_request():
        app.logger.debug(request)

    return app

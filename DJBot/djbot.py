from database import db_session
from flask import Flask, render_template, request
from flask import url_for, redirect
from flask_wtf.csrf import CSRFProtect

from flask_security import Security, SQLAlchemySessionUserDatastore, \
    login_required, roles_required

from forms import LoginForm
from models import first_data
from models.user import User, Role

from scripts import config_ssh

import os

from views import register_api


app = Flask(__name__, instance_relative_config=True)

app.config.from_object('config')
app.config.from_pyfile('config.py')
app.config.from_envvar('FLASKR_SETTINGS', silent=True)
app.debug = app.config['DEBUG']
csrf = CSRFProtect()
csrf.init_app(app)

user_datastore = SQLAlchemySessionUserDatastore(db_session, User, Role)
security = Security(app, user_datastore)


try:
    User.query.all()
except:
    first_data(app, user_datastore)

if not os.path.isfile(os.getenv("HOME") +'/.ssh/id_rsa'):
    config_ssh.generate_key()

register_api(app)

@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()


@app.route('/logout')
def logout():
    flask_login.logout_user()
    return redirect(url_for('login', _external=True))


@app.route('/', methods=['GET'])
@login_required
@roles_required('user')
def index():
    return render_template('dashboard.html')


@app.before_request
def log_request():
    app.logger.debug(request)


if __name__ == '__main__':
    app.run(host='0.0.0.0')



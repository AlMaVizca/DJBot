from database import db_session
from flask import Flask, render_template, request
from flask import url_for, redirect
from flask import jsonify
from flask_login import current_user

from flask_wtf.csrf import CSRFProtect
from flask_user import UserManager, LoginManager, login_required, SQLAlchemyAdapter, roles_required
from forms import *
from models import first_data
from models.user import User, Role
from querys import *
from ansibleapi import ThreadRunner
from scripts import config_ssh
import flask_login
import os

from views import register_api


app = Flask(__name__, instance_relative_config=True)

app.config.from_object('config')
app.config.from_pyfile('config.py')
app.config.from_envvar('FLASKR_SETTINGS', silent=True)
app.debug = app.config['DEBUG']
csrf = CSRFProtect()
csrf.init_app(app)

db_adapter = SQLAlchemyAdapter(db_session, User)
user_manager = UserManager(db_adapter, app)


try:
    User.query.all()
except:
    first_data(user_manager)

if not os.path.isfile('/root/.ssh/id_rsa'):
    config_ssh.generate_key()

login_manager = LoginManager()
login_manager.init_app(app)
register_api(app)

@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()


@login_manager.user_loader
def user_loader(username):
    return  User(username)


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    form = LoginForm(request.form)
    if form.validate_on_submit():
        user = User.query.filter(User.username == form.username.data).first()
        if user and user_manager.verify_password(form.pw.data, user):
            flask_login.login_user(user)
            return redirect(url_for('index', _external=True))
    return redirect(url_for('login', _external=True))


@app.route('/logout')
def logout():
    flask_login.logout_user()
    return redirect(url_for('login', _external=True))


@login_manager.unauthorized_handler
def unauthorized_handler():
    return redirect(url_for('login', _external=True))


@app.route('/', methods=['GET'])
@flask_login.login_required
@roles_required('user')
def index():
    return render_template('dashboard.html', public_key=public_key)


@app.before_request
def log_request():
    app.logger.debug(request)

if __name__ == '__main__':
    app.run(host='0.0.0.0')



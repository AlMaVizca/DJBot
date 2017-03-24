__all__ = ["user", "room", "playbook"]

import user
import room
from playbook import Task, Parameter, Playbook
from database import db
from flask_security.utils import encrypt_password
from user import User, Role


def first_data(app, user_datastore):
    with app.app_context():
        db.create_all()
        role_admin = user_datastore.create_role(
            name='admin',
            description="administration user"
        )
        role_user = user_datastore.create_role(
            name='user',
            description="general user"
        )
        admin = user_datastore.create_user(
            email='admin@dj.bot',
            username='admin',
            active=True,
            password=encrypt_password('password')
        )
        user = user_datastore.create_user(
            email='user@dj.bot',
            username='user',
            active=True,
            password=encrypt_password('password')
        )
        user_datastore.add_role_to_user(admin, role_user)
        user_datastore.add_role_to_user(user, role_user)
        user_datastore.add_role_to_user(admin, role_admin)

        db.session.commit()

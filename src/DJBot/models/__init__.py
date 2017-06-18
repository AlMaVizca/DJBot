__all__ = ["user", "inventory", "playbook"]


from DJBot.database import db
from flask_security.utils import encrypt_password as hash_password


def first_data(app, user_datastore):
    with app.app_context():
        db.create_all()
        user_datastore.create_role(
            name='admin',
            description="administration user"
        )
        user_datastore.create_role(
            name='user',
            description="general user"
        )
        admin = user_datastore.create_user(
            email='admin@dj.bot',
            username='admin',
            active=True,
            password=hash_password('password')
        )
        user = user_datastore.create_user(
            email='user@dj.bot',
            username='user',
            active=True,
            password=hash_password('password')
        )
        user_datastore.add_role_to_user(admin, 'user')
        user_datastore.add_role_to_user(user, 'user')
        user_datastore.add_role_to_user(admin, 'admin')

        db.session.commit()

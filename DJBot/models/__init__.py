__all__ = ["user", "room", "task"]

import user
import room
import task
from database import db_session, init_db

from user import User, Role




def first_data(user_datastore):
    init_db()
    role_admin = user_datastore.create_role(name='admin',
                                            description="administration user")
    role_user = user_datastore.create_role(name='user',
                                           description="general user")
    user_admin = user_datastore.create_user(email='admin@dj.bot', password='admin', roles=['admin', 'user'])
    user_user = user_datastore.create_user(email='user@dj.bot', password='user', roles=['user'])

    db_session.commit()



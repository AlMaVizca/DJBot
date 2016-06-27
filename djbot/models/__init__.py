__all__ = ["user", "room", "task"]

import user
import room
import task
from database import db_session, init_db

from user import User, Role




def first_data(user_manager):
    init_db()
    
    user1 = User(username='admin', email='admin@dj.bot', active=True,
                 password=user_manager.hash_password('admin'))
    user2 = User(username='user', email='admin@dj.bot', active=True,
                 password=user_manager.hash_password('user'))
    role_user = Role(name='user')
    user1.roles.append(Role(name='admin'))
    user1.roles.append(role_user)
    user2.roles.append(role_user)
    db_session.add(user1)
    db_session.add(user2)    
    db_session.commit()



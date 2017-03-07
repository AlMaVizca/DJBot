from database import Base, db_session
from flask import jsonify
from flask_security import UserMixin, RoleMixin
from sqlalchemy import Boolean, DateTime, Column, Integer, SmallInteger, String
from sqlalchemy import Table, Column, ForeignKey
from sqlalchemy.orm import relationship, backref



# Define Role model
class Role(Base, RoleMixin):
    __tablename__ = 'role'
    id = Column(Integer(), primary_key=True)
    name = Column(String(50), unique=True)
    description = Column(String(50))

    def __repr__(self):
        return self.name


# Define UserRoles model
class RolesUsers(Base):
    __tablename__ = 'roles_users'
    id = Column(Integer(), primary_key=True)
    user_id = Column(Integer(), ForeignKey('user.id', ondelete='CASCADE'))
    role_id = Column(Integer(), ForeignKey('role.id', ondelete='CASCADE'))


class User(Base, UserMixin):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True)
    username = Column(String(255))
    password = Column(String(255))
    last_login_at = Column(DateTime())
    current_login_at = Column(DateTime())
    last_login_ip = Column(String(100))
    current_login_ip = Column(String(100))
    login_count = Column(Integer)
    active = Column(Boolean())
    confirmed_at = Column(DateTime())
    roles = relationship('Role', secondary='roles_users',
                         backref=backref('users', lazy='dynamic'))


    def __repr__(self):
        return '%r %r' % (self.username, self.email)


    def get_setup(self):
        return dict(key=self.id, username=self.username, \
                    email=self.email, admin=self.is_admin())

    def change_admin(self):
        admin = Role.query.filter(Role.name == 'admin').first()
        if admin in self.roles.all():
            self.roles.remove(admin)
        else:
            self.roles.append(admin)

    def is_admin(self):
        roles = self.roles.all()
        roles = [each.name for each in roles]
        if 'admin' in roles:
            return True
        return False

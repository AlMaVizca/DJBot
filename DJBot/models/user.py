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
class UserRoles(Base):
    __tablename__ = 'user_roles'
    id = Column(Integer(), primary_key=True)
    user_id = Column(Integer(), ForeignKey('user.id', ondelete='CASCADE'))
    role_id = Column(Integer(), ForeignKey('role.id', ondelete='CASCADE'))


class User(Base, UserMixin):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    username = Column(String(50), nullable=True, unique=True)
    password = Column(String(255), nullable=False, server_default='')
    reset_password_token = Column(String(100), nullable=False, server_default='')

    # User email information
    email = Column(String(255), nullable=True, unique=False)
    confirmed_at = Column(DateTime())

    # User information
    active = Column('is_active', Boolean(), nullable=False, server_default='0')
    first_name = Column(String(100), nullable=False, server_default='')
    last_name = Column(String(100), nullable=False, server_default='')
    roles = relationship('Role', secondary='user_roles',
                         backref=backref('users', lazy='dynamic'))

    def __repr__(self):
        return '%r %r' % (self.username, self.email)


    def __init__(self, username=None, password=None, email=None, active=None, id=None):
        self.id = id
        self.username = username
        self.password = password
        self.email = email
        self.active = active


    def authenticate(self, password):
        if (password ==  self.password):
            self.is_authenticated = True
            return True
        return False

    def get_id(self):
        return unicode(self.username)

    def get_setup(self):
        return dict(key=self.id, username=self.username, \
                    email=self.email, admin=self.is_admin())

    def has_roles(self, *role_names):
        return True

    def save(self, username, email, password):
        """save in database"""
        self.username = username
        self.email = email
        self.password = password
        db_session.commit()
        return True

    def delete(self):
        """delete on database"""
        db_session.delete(self)
        db_session.commit()

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

    def is_active(self):
        return self.is_active

    def is_authenticated(self):
        """Return True if the user is authenticated."""
        return self.is_authenticated

    def is_anonymous(self):
        """False, as anonymous users aren't supported."""
        return False

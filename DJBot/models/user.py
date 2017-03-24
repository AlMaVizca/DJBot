from database import db
from flask_security import UserMixin, RoleMixin


# Define Role model
class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(50), unique=True)
    description = db.Column(db.String(50))

    def __repr__(self):
        return self.name


# Define UserRoles model
class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer(),
                        db.ForeignKey('user.id', ondelete='CASCADE'))
    role_id = db.Column(db.Integer(),
                        db.ForeignKey('role.id', ondelete='CASCADE'))


class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True)
    username = db.Column(db.String(255))
    password = db.Column(db.String(255))
    last_login_at = db.Column(db.DateTime())
    current_login_at = db.Column(db.DateTime())
    last_login_ip = db.Column(db.String(100))
    current_login_ip = db.Column(db.String
                                 (100))
    login_count = db.Column(db.Integer)
    active = db.Column(db.Boolean())
    confirmed_at = db.Column(db.DateTime())
    roles = db.relationship('Role', secondary='roles_users',
                            backref=db.backref('users', lazy='dynamic'))

    def __repr__(self):
        return '%r %r' % (self.username, self.email)

    def get_setup(self):
        return dict(key=self.id, username=self.username,
                    email=self.email, admin=self.is_admin())

    def change_admin(self):
        admin = Role.query.filter(Role.name == 'admin').first()
        if admin in self.roles:
            self.roles.remove(admin)
        else:
            self.roles.append(admin)

    def is_admin(self):
        roles = [each.name for each in self.roles]
        if 'admin' in roles:
            return True
        return False

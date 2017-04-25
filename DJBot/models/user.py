from DJBot.database import db
from flask_security import UserMixin, RoleMixin, SQLAlchemyUserDatastore
from flask_security.utils import encrypt_password as hash_password

# Define Role model
class Role(db.Model, RoleMixin):
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
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True)
    username = db.Column(db.String(255))
    password = db.Column(db.String(255))
    last_login_at = db.Column(db.DateTime())
    current_login_at = db.Column(db.DateTime())
    last_login_ip = db.Column(db.String(100))
    current_login_ip = db.Column(db.String(100))
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


def create_user(username, email, password):
    user = User()
    user.username = username
    user.email = email
    user.password = hash_password(password)
    user.roles.append(get_role())
    db.session.add(user)
    db.session.commit()



def get_datastore(db):
    return SQLAlchemyUserDatastore(db, User, Role)


def get_users():
    users = User().query.all()
    users_info = {'users': []}
    for each in users:
        user = User.query.filter(User.username == each.username).first()
        users_info['users'].append(user.get_setup())
    return users_info


def get_user(username):
    return User.query.filter(User.username == username).first()


def get_role(role_name='user'):
    return Role.query.filter(Role.name == role_name).first()

from flask_wtf import FlaskForm
from wtforms import IntegerField, PasswordField,\
    StringField, validators


class Add(FlaskForm):
    key = IntegerField('key')
    name = StringField('name', [validators.DataRequired()])
    network = StringField('network', [validators.DataRequired(),
                                      validators.IPAddress()])
    netmask = IntegerField('netmask',
                           [validators.NumberRange(min=8, max=30)])
    machines = IntegerField('machines')
    gateway = StringField('gateway', [validators.DataRequired(),
                                      validators.IPAddress()])
    user = StringField('user', [validators.DataRequired()])
    private_key = StringField('private_key', [validators.DataRequired()])


class KeyCopy(FlaskForm):
    key = IntegerField('key', [validators.DataRequired()])
    password = PasswordField('password', [validators.DataRequired()])
    room = StringField('room', [validators.DataRequired()])
    # TODO: see how to do this as a Boolan


class HostAdd(FlaskForm):
    key = IntegerField('key')
    name = StringField('name', [validators.DataRequired()])
    ip = StringField('ip', [validators.DataRequired(),
                            validators.IPAddress()])
    note = StringField('note')
    user = StringField('user', [validators.DataRequired()])
    private_key = StringField('private_key', [validators.DataRequired()])

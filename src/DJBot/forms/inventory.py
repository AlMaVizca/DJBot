from flask_wtf import FlaskForm
from wtforms import IntegerField, PasswordField, StringField,\
    validators


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


class KeyCopy(FlaskForm):
    key = IntegerField('key', [validators.DataRequired()])
    password = PasswordField('password', [validators.DataRequired()])


class HostAdd(FlaskForm):
    key = IntegerField('key')
    name = StringField('name', [validators.DataRequired()])
    ip = StringField('ip', [validators.DataRequired(),
                            validators.IPAddress()])
    note = StringField('note', [validators.DataRequired()])

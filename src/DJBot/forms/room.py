from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, validators


class Add(FlaskForm):
    name = StringField('name', [validators.DataRequired()])
    network = StringField('network', [validators.DataRequired(),
                                      validators.IPAddress()])
    netmask = IntegerField('netmask',
                           [validators.NumberRange(min=8, max=30)])
    machines = IntegerField('machines')


class Select(FlaskForm):
    key = IntegerField('key', [validators.NumberRange(min=0, max=255)])

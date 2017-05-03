from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, validators


class Add(FlaskForm):
    username = StringField('username', [validators.DataRequired()])
    email = StringField('email', [validators.DataRequired()])
    password = StringField('password', [validators.DataRequired()])


class Change(FlaskForm):
    key = IntegerField('key', [validators.DataRequired()])
    username = StringField('username', [validators.DataRequired()])
    email = StringField('email', [validators.DataRequired()])
    password = StringField('password', [validators.DataRequired()])


class Select(FlaskForm):
    key = IntegerField('key', [validators.DataRequired()])

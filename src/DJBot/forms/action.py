from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, validators


class Result(FlaskForm):
    result = StringField('result', [validators.DataRequired()])


class Run(FlaskForm):
    room = IntegerField('room', [validators.DataRequired()])
    playbook = IntegerField('playbook', [validators.DataRequired()])

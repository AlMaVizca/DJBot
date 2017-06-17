from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, validators


class Run(FlaskForm):
    room = IntegerField('room', [validators.DataRequired()])
    playbook = IntegerField('playbook', [validators.DataRequired()])

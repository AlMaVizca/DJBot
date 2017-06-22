from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, validators


class Run(FlaskForm):
    key = IntegerField('key', [validators.DataRequired()])
    playbook = IntegerField('playbook', [validators.DataRequired()])
    isRoom = StringField('isRoom', [validators.DataRequired()])

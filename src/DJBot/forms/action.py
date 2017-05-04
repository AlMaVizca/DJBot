from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, validators, FieldList

identifier = IntegerField(default=0)


class ResultForm(FlaskForm):
    result = StringField('result', [validators.DataRequired()])


class RunFormAdd(FlaskForm):
    rooms = FieldList('rooms[]', identifier)
    playbook = FieldList('playbook[]', identifier)


class RunForm(FlaskForm):
    roomKeys = []
    playbookKeys = []

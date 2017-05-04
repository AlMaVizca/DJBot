from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, validators


class Add(FlaskForm):
    name = StringField('playbookName', [validators.DataRequired()])
    description = StringField('playbookDescription')


class Change(FlaskForm):
    key = IntegerField('key', [validators.DataRequired()])
    name = StringField('name')
    description = StringField('description')


class ParameterAdd(FlaskForm):
    parameter = StringField('parameter', [validators.DataRequired()])
    value = StringField('value', [validators.DataRequired()])
    task = StringField('task', [validators.DataRequired()])


class TaskAdd(FlaskForm):
    playbook = IntegerField('playbook', [validators.DataRequired()])
    module = StringField('module', [validators.DataRequired()])

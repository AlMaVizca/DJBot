from flask_wtf import FlaskForm
from wtforms import FieldList, FormField, IntegerField, StringField, validators
from .generic import Configuration


class Add(FlaskForm):
    name = StringField('playbookName', [validators.DataRequired()])
    description = StringField('playbookDescription')


class Change(FlaskForm):
    key = IntegerField('key', [validators.DataRequired()])
    name = StringField('name')
    description = StringField('description')


class ParameterAdd(FlaskForm):
    playbook = IntegerField('playbook', [validators.DataRequired()])
    parameter = StringField('parameter', [validators.DataRequired()])
    value = StringField('value', [validators.DataRequired()])
    task = IntegerField('task', [validators.DataRequired()])


class TaskAdd(FlaskForm):
    playbook = IntegerField('playbook', [validators.DataRequired()])
    task = StringField('task', [validators.DataRequired()])
    module = StringField('module', [validators.DataRequired()])
    configuration = FieldList(FormField(Configuration))

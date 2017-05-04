from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, validators, FieldList

identifier = IntegerField(default=0)


class ParameterFormAdd(FlaskForm):
    parameter = StringField('parameter', [validators.DataRequired()])
    value = StringField('value', [validators.DataRequired()])
    modulekey = StringField('modulekey', [validators.DataRequired()])


class ParameterFormDelete(FlaskForm):
    key = IntegerField('key', [validators.DataRequired()])


class ResultForm(FlaskForm):
    result = StringField('result', [validators.DataRequired()])


class RunFormAdd(FlaskForm):
    rooms = FieldList('rooms[]', identifier)
    playbook = FieldList('playbook[]', identifier)


class RunForm(FlaskForm):
    roomKeys = []
    playbookKeys = []


class ModuleFormAdd(FlaskForm):
    module = StringField('module', [validators.DataRequired()])


class ModuleFormDelete(FlaskForm):
    key = IntegerField('key', [validators.DataRequired()])

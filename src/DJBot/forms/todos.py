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


class RoomFormAdd(FlaskForm):
    name = StringField('name', [validators.DataRequired()])
    network = StringField('network', [validators.DataRequired(),
                                      validators.IPAddress()])
    netmask = IntegerField('netmask',
                           [validators.NumberRange(min=8, max=30)])
    machines = IntegerField('machines')


class RoomFormDelete(FlaskForm):
    key = IntegerField('key', [validators.NumberRange(min=0, max=255)])


class RunFormAdd(FlaskForm):
    rooms = FieldList('rooms[]', identifier)
    playbook = FieldList('playbook[]', identifier)


class RunForm(FlaskForm):
    roomKeys = []
    playbookKeys = []


class PlaybookFormAdd(FlaskForm):
    name = StringField('playbookName', [validators.DataRequired()])
    description = StringField('playbookDescription')


class PlaybookFormSelect(FlaskForm):
    key = IntegerField('key', [validators.DataRequired()])
    name = StringField('name')
    description = StringField('description')


class ModuleFormAdd(FlaskForm):
    module = StringField('module', [validators.DataRequired()])


class ModuleFormDelete(FlaskForm):
    key = IntegerField('key', [validators.DataRequired()])

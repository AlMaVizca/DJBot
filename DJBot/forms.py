from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, validators, FieldList

identifier = IntegerField(default=0)

class LoginForm(FlaskForm):
    username = StringField('username', [validators.DataRequired()])
    pw = StringField('pw', [validators.DataRequired()])


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
    network = StringField('network', [validators.DataRequired(), validators.IPAddress()])
    netmask = IntegerField('netmask', [validators.NumberRange(min=8,max=30)])
    machines = IntegerField('machines')

    
class RoomFormDelete(FlaskForm):
    key = IntegerField('key', [validators.NumberRange(min=0,max=255)])


class RunFormAdd(FlaskForm):
    rooms = FieldList('rooms[]',identifier)
    tasks = FieldList('tasks[]',identifier)    

    
class RunForm(FlaskForm):
    roomKeys = []
    taskKeys = []


class TaskFormAdd(FlaskForm):
    taskName = StringField('taskName', [validators.DataRequired()])

    
class TaskFormDelete(FlaskForm):
    key = IntegerField('key', [validators.DataRequired()])


class ModuleFormAdd(FlaskForm):
    module = StringField('module', [validators.DataRequired()])

    
class ModuleFormDelete(FlaskForm):
    key = IntegerField('key', [validators.DataRequired()])



class UserAddForm(FlaskForm):
    username = StringField('username', [validators.DataRequired()])
    email = StringField('email', [validators.DataRequired()])
    password = StringField('password', [validators.DataRequired()])


class UserChangeForm(FlaskForm):
    key = IntegerField('key', [validators.DataRequired()])
    username = StringField('username', [validators.DataRequired()])
    email = StringField('email', [validators.DataRequired()])
    password = StringField('password')
    old = StringField('old', [validators.DataRequired()])

class UserDeleteForm(FlaskForm):
    key = IntegerField('key', [validators.DataRequired()])

class PassChangeForm(FlaskForm):
    key = IntegerField('key', [validators.DataRequired()])
    password = StringField('password', [validators.DataRequired()])
    old = StringField('old', [validators.DataRequired()])


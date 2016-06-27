from wtforms import Form, StringField, IntegerField, validators, FieldList

identifier = IntegerField(default=0)

class LoginForm(Form):
    username = StringField('username', [validators.DataRequired()])
    pw = StringField('pw', [validators.DataRequired()])


class ParameterFormAdd(Form):
    parameter = StringField('parameter', [validators.DataRequired()])
    value = StringField('value', [validators.DataRequired()])
    modulekey = StringField('modulekey', [validators.DataRequired()])

    
class ParameterFormDelete(Form):
    key = IntegerField('key', [validators.DataRequired()])


class ResultForm(Form):
    result = StringField('result', [validators.DataRequired()])
    
    
class RoomFormAdd(Form):
    name = StringField('name', [validators.DataRequired()])
    network = StringField('network', [validators.DataRequired(), validators.IPAddress()])
    netmask = IntegerField('netmask', [validators.NumberRange(min=8,max=30)])
    machines = IntegerField('machines')

    
class RoomFormDelete(Form):
    key = IntegerField('key', [validators.NumberRange(min=0,max=255)])


class RunFormAdd(Form):
    rooms = FieldList('rooms[]',identifier)
    tasks = FieldList('tasks[]',identifier)    

    
class RunForm(Form):
    roomKeys = []
    taskKeys = []


class TaskFormAdd(Form):
    taskName = StringField('taskName', [validators.DataRequired()])

    
class TaskFormDelete(Form):
    key = IntegerField('key', [validators.DataRequired()])


class ModuleFormAdd(Form):
    module = StringField('module', [validators.DataRequired()])

    
class ModuleFormDelete(Form):
    key = IntegerField('key', [validators.DataRequired()])


    
class UserAddForm(Form):
    username = StringField('username', [validators.DataRequired()])
    email = StringField('email', [validators.DataRequired()])
    password = StringField('password', [validators.DataRequired()])


class UserChangeForm(Form):
    key = IntegerField('key', [validators.DataRequired()])
    username = StringField('username', [validators.DataRequired()])
    email = StringField('email', [validators.DataRequired()])
    password = StringField('password', [validators.DataRequired()])
    old = StringField('old', [validators.DataRequired()])
    
class UserDeleteForm(Form):
    key = IntegerField('key', [validators.DataRequired()])

class PassChangeForm(Form):
    key = IntegerField('key', [validators.DataRequired()])
    password = StringField('password', [validators.DataRequired()])
    old = StringField('old', [validators.DataRequired()])
    
from wtforms import Form, StringField, IntegerField, validators


class ArgumentFormAdd(Form):
    argument = StringField('argument', [validators.DataRequired()])
    value = StringField('value', [validators.DataRequired()])
    modulekey = StringField('modulekey', [validators.DataRequired()])

    
class ArgumentFormDelete(Form):
    key = IntegerField('key', [validators.DataRequired()])


class RoomFormAdd(Form):
    name = StringField('name', [validators.DataRequired()])
    network = StringField('network', [validators.DataRequired(), validators.IPAddress()])
    netmask = IntegerField('netmask', [validators.NumberRange(min=8,max=30)])
    machines = IntegerField('machines', [validators.NumberRange(min=1,max=50)])

    
class RoomFormDelete(Form):
    key = IntegerField('key', [validators.NumberRange(min=0,max=255)])


class TaskFormAdd(Form):
    taskName = StringField('taskName', [validators.DataRequired()])

    
class TaskFormDelete(Form):
    key = IntegerField('key', [validators.DataRequired()])


class ModuleFormAdd(Form):
    module = StringField('module', [validators.DataRequired()])

    
class ModuleFormDelete(Form):
    key = IntegerField('key', [validators.DataRequired()])


class RunForm(Form):
    roomKeys = []
    taskKeys = []

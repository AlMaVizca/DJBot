from wtforms import Form, StringField, IntegerField, validators

class AddRoomForm(Form):
    name = StringField('name', [validators.DataRequired()])
    network = StringField('network', [validators.DataRequired(), validators.IPAddress()])
    netmask = IntegerField('netmask', [validators.NumberRange(min=8,max=30)])
    proxy = StringField('proxy', [validators.IPAddress()])
    machines = IntegerField('machines', [validators.NumberRange(min=1,max=50)])
    keyRoom = IntegerField('keyRoom', [validators.DataRequired()])

    
class DeleteRoomForm(Form):
    keyRoom = IntegerField('keyRoom', [validators.NumberRange(min=0,max=255)])


class AddTaskForm(Form):
    taskName = StringField('taskName', [validators.DataRequired()])

    
class DeleteTaskForm(Form):
    key = IntegerField('key', [validators.DataRequired()])


class ModuleFormAdd(Form):
    module = StringField('module', [validators.DataRequired()])

    
class ModuleFormDelete(Form):
    key = IntegerField('key', [validators.DataRequired()])
    
from wtforms import Form, StringField, IntegerField, validators

class SettingsForm(Form):
    name = StringField('name', [validators.DataRequired()])
    network = StringField('network', [validators.DataRequired()])
    netmask = IntegerField('netmask', [validators.NumberRange(min=8,max=30)])
    proxy = StringField('proxy', [validators.IPAddress()])
    machines = IntegerField('machines', [validators.NumberRange(min=1,max=50)])
    key = IntegerField('id')

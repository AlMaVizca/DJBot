from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, validators


class Add(FlaskForm):
    name = StringField('playbookName', [validators.DataRequired()])
    description = StringField('playbookDescription')


class Select(FlaskForm):
    key = IntegerField('key', [validators.DataRequired()])
    name = StringField('name')
    description = StringField('description')

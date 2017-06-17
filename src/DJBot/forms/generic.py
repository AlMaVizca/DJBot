from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField, validators


class Select(FlaskForm):
    key = IntegerField('key', [validators.InputRequired()])


class SelectName(FlaskForm):
    name = StringField('name', [validators.DataRequired()])
    category = StringField('category')


class Configuration(FlaskForm):
    option = StringField('option', [validators.DataRequired()])
    value = StringField('value', [validators.DataRequired()])

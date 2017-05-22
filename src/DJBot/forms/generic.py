from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField, validators


class Select(FlaskForm):
    key = IntegerField('key', [validators.DataRequired()])


class SelectName(FlaskForm):
    name = StringField('name', [validators.DataRequired()])
    category = StringField('category')

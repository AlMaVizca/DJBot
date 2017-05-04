from flask_wtf import FlaskForm
from wtforms import IntegerField, validators


class Select(FlaskForm):
    key = IntegerField('key', [validators.DataRequired()])

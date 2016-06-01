import factory
from factory.alchemy import SQLALchemyModelFactory
from . import models
from .test import common

class RoomFactory(SQLAlchemyModelFactory):
    class Meta:
        model = models.Room
        sqlalchemy_session = common.session 

    key = factory.Sequence(lambda n: n)

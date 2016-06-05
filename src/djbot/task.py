from database import Base, db_session
from helpers import task_properties
from models import *

class Task():
    def __init__(self, key=None):
        """Get the object from database, and complete with parameters"""
        self.key = key
        self.name = None
        self.modules = None
        self.db = TaskTable.query.filter(TaskTable.key == self.key).first()
        self.get()

    def get(self, complete = True):
        """Complete (or not) from database"""
        if self.db:
            if complete:
                task_properties(self, self.db)
            return True
        return False


    def save(self, name):
        """save in database"""
        if self.get(complete=False):
            self.db.name = name
            db_session.add(self.db)
        else:
            task = TaskTable(name=name)
            db_session.add(task)
        db_session.commit()

    def delete(self):
        """delete on database"""
        db_session.delete(self.db)
        db_session.commit()

    def get_setup(self):
        return dict(name=self.name, key=self.key,
                    modules=self.modules)

    def modules(self):
        modules = []
        for each in self.db.modules:
            modules.append(dict(key=each.key, name=each.name))
        self.modules = modules

    def add_module(self, name):
        new_module = ModuleTable(name=name)
        self.db.modules.append(new_module)
        db_session.add(self.db)
        db_session.commit()
        return True

    def delete_module(self, key):
        if key >=0:
            delete_module = ModuleTable(key=key)
            db_session.delete(self.db)
            db_session.commit()
        

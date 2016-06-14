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

    def parameter_add(self, modulekey, options, app):
        new_args = ArgsTable(name=options[0], value=options[1])
        for each in self.db.modules:
            app.logger.info(modulekey)
            app.logger.info(each.key)
            if int(modulekey) == each.key:
                each.args.append(new_args)
        db_session.add(self.db)
        db_session.commit()
        return True

    def parameter_delete(self, key):
        arg = ArgsTable.query.filter(ArgsTable.key == key).first()
        db_session.delete(arg)
        db_session.commit()
        return True

    def module_add(self, name):
        new_module = ModuleTable(name=name, args=[])
        self.db.modules.append(new_module)
        db_session.add(self.db)
        db_session.commit()
        return True

    def module_delete(self, key):
        module = ModuleTable.query.filter(ModuleTable.key == key).first()
        db_session.delete(module)
        db_session.commit()
        return True
        

from database import Base, db_session
from sqlalchemy import Boolean, DateTime, Column, Integer, SmallInteger, String
from sqlalchemy import Table, Column, ForeignKey
from sqlalchemy.orm import relationship


class Module(Base):
    __tablename__ = 'module'
    key = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    args = relationship("Args", cascade="all, delete-orphan")
    task = Column(Integer, ForeignKey('task.key'))

    def __repr__(self):
        return '<Module %r %r %r %r>' % (self.key, self.name, self.args, self.task)
    


class Args(Base):
    __tablename__ = 'parameter'
    key = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    value = Column(String(50), nullable=False)
    filename = Column(String(50))
    module = Column(Integer, ForeignKey('module.key'))

    def __repr__(self):
        return '<Args %r %r %r>' % (self.key, self.name, self.value)



class Task(Base):
    __tablename__ = 'task'
    key = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    modules = relationship("Module", cascade="all, delete-orphan")


    def get_setup(self):
        return dict(name=self.name, key=self.key,
                    modules=self._get_modules())

    def _get_modules(self):
        modules = []
        for each in self.modules:
            arg = []
            for argument in each.args:
                arg.append(dict(key=argument.key, name=argument.name, value=argument.value))
            modules.append(dict(key=each.key, name=each.name, options=arg))
        return modules

        
    def parameter_add(self, modulekey, options):
        new_args = Args(name=options[0], value=options[1])
        for each in self.modules:
            if int(modulekey) == each.key:
                each.args.append(new_args)
        db_session.commit()
        return True

    def parameter_delete(self, key):
        arg = Args.query.filter(Args.key == key).first()
        db_session.delete(arg)
        db_session.commit()
        return True

    def module_add(self, name, app):
        new_module = Module(name=name, args=[])
        app.logger.info(self)
        self.modules.append(new_module)
        db_session.add(self)
        db_session.commit()
        return True

    def module_delete(self, key):
        module = Module.query.filter(Module.key == key).first()
        db_session.delete(module)
        db_session.commit()
        return True
        

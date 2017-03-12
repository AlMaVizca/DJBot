from database import Base, db_session
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


class Task(Base):
    __tablename__ = "task"
    key = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    parameters = relationship("Parameter", cascade="all, delete-orphan")
    playbook = Column(Integer, ForeignKey("playbook.key"))

    def __repr__(self):
        return "<Task %r %r %r %r>" % (self.key,
                                       self.name,
                                       self.args,
                                       self.playbook)


class Parameter(Base):
    __tablename__ = "paramenter"
    key = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    value = Column(String(50), nullable=False)
    filename = Column(String(50))
    task = Column(Integer, ForeignKey("task.key"))

    def __repr__(self):
        return "<Parameter %r %r %r>" % (self.key,
                                         self.name,
                                         self.value)


class Playbook(Base):
    __tablename__ = "playbook"
    key = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    description = Column(String(150), nullable=False)
    tasks = relationship("Task", cascade="all, delete-orphan")


    def get_setup(self):
        return dict(name=self.name, description=self.description,
                    key=self.key, tasks=self._get_tasks())

    def _get_tasks(self):
        tasks = []
        for each in self.tasks:
            arg = []
            for argument in each.args:
                arg.append(dict(key=argument.key, name=argument.name,
                                value=argument.value))
            tasks.append(dict(key=each.key, name=each.name, options=arg))
        return tasks

    def parameter_add(self, taskkey, options):
        new_args = Parameter(name=options[0], value=options[1])
        for each in self.tasks:
            if int(taskkey) == each.key:
                each.args.append(new_args)
        db_session.commit()
        return True

    def parameter_delete(self, key):
        arg = Parameter.query.filter(Parameter.key == key).first()
        db_session.delete(arg)
        db_session.commit()
        return True

    def module_add(self, name, app):
        new_task = Task(name=name, args=[])
        app.logger.info(self)
        self.tasks.append(new_task)
        db_session.add(self)
        db_session.commit()
        return True

    def module_delete(self, key):
        task = Task.query.filter(Task.key == key).first()
        db_session.delete(task)
        db_session.commit()
        return True

from database import db


class Task(db.Model):
    __tablename__ = "task"
    key = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    parameters = db.relationship("Parameter", cascade="all, delete-orphan")
    playbook = db.Column(db.Integer, db.ForeignKey("playbook.key"))

    def __repr__(self):
        return "<Task %r %r %r %r>" % (self.key,
                                       self.name,
                                       self.args,
                                       self.playbook)


class Parameter(db.Model):
    __tablename__ = "paramenter"
    key = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    value = db.Column(db.String(50), nullable=False)
    filename = db.Column(db.String(50))
    task = db.Column(db.Integer, db.ForeignKey("task.key"))

    def __repr__(self):
        return "<Parameter %r %r %r>" % (self.key,
                                         self.name,
                                         self.value)


class Playbook(db.Model):
    __tablename__ = "playbook"
    key = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(150), nullable=False)
    tasks = db.relationship("Task", cascade="all, delete-orphan")

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
        db.session.commit()
        return True

    def parameter_delete(self, key):
        arg = Parameter.query.filter(Parameter.key == key).first()
        db.session.delete(arg)
        db.session.commit()
        return True

    def module_add(self, name, app):
        new_task = Task(name=name, args=[])
        app.logger.info(self)
        self.tasks.append(new_task)
        db.session.add(self)
        db.session.commit()
        return True

    def module_delete(self, key):
        task = Task.query.filter(Task.key == key).first()
        db.session.delete(task)
        db.session.commit()
        return True

from DJBot.database import db
import json
import os
import time


class Task(db.Model):
    __tablename__ = "task"
    key = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    module = db.Column(db.String(50), nullable=False)
    parameters = db.relationship("Parameter", cascade="all, delete-orphan")
    playbook = db.Column(db.Integer, db.ForeignKey("playbook.key"))

    def __repr__(self):
        return "<Task %r %r %r %r >" % (self.key,
                                        self.name,
                                        self.module,
                                        self.parameters)

    def get_setup(self):
        setup = dict(key=self.key, name=self.name, module=self.module)
        setup['options'] = {}
        for each in self.parameters:
            setup['options'][each.name] = each.value
        return setup

    def add_parameter(self, options):
        try:
            for each in options:
                new_args = Parameter(name=each['option'],
                                     value=each['value'])

                self.parameters.append(new_args)
            return True
        except:
            return False

    def change_parameter(self, options):
        """Options is  an array of dictionaries, with option, value keys
        Iterate over it and try to update the value if it fails,
        so we add this new parameter
        """
        new = []
        for each in options:
            parameter = Parameter.query.filter(Parameter.task == self.key).\
                        filter(Parameter.name == each['option']).first()
            try:
                parameter.value = each['value']
            except:
                new.append(each)

        self.add_parameter(new)
        self.save()
        return True

    def save(self):
        db.session.add(self)
        db.session.commit()


class Parameter(db.Model):
    __tablename__ = "parameter"
    key = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    value = db.Column(db.String(50), nullable=False)
    filename = db.Column(db.String(50))
    task = db.Column(db.Integer, db.ForeignKey("task.key"))

    def __repr__(self):
        return "<Parameter %r %r %r>" % (self.key,
                                         self.name,
                                         self.value)

    def get_setup(self):
        return dict(option=self.name, value=self.value)


class Playbook(db.Model):
    __tablename__ = "playbook"
    key = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(150), nullable=False)
    tasks = db.relationship("Task", cascade="all, delete-orphan")

    def get_setup(self, full=False):
        if full:
            return dict(name=self.name, description=self.description,
                        key=self.key, tasks=self._get_tasks())
        return dict(name=self.name, description=self.description,
                    key=self.key)

    def _get_tasks(self):
        tasks = []
        for each in self.tasks:
            arg = []
            for argument in each.parameters:
                arg.append(dict(key=argument.key, name=argument.name,
                                value=argument.value))
            tasks.append(dict(key=each.key, name=each.name, options=arg))
        return tasks

    def task_add(self, name, module, options=None):
        new_task = Task(name=name, module=module)
        new_task.add_parameter(options)
        self.tasks.append(new_task)
        db.session.add(self)
        db.session.commit()
        return True


def execution_tasks(tasks):
    execution_tasks = []
    names = []
    for each in tasks:
        a_task = Task.query.get(each).get_setup()
        names.append(a_task['name'])
        task = {'name': a_task['name'], 'modules': []}
        parameters = {}
        for module in a_task['modules']:
            for arg in module['options']:
                parameters[arg['name']] = arg['value']
            task['modules'].append((dict(
                action=dict(
                    module=module['name'],
                    args=parameters)
            )))
        execution_tasks.append(task)
    return execution_tasks, names


def get_result(filename):
    result = {'data': 'Not Found!'}
    with open(filename, 'r') as fp:
        result = json.load(fp)
    result['datetime'] = time.strftime("%m/%d/%Y %I:%M:%S %p",
                                       time.localtime(
                                           os.path.getmtime(filename)))
    return result


def get_playbook(id):
    return Playbook.query.get(id)


def get_playbooks():
    playbooks = Playbook().query.all()
    playbooks_info = {'playbooks': []}
    for each in playbooks:
        playbooks_info['playbooks'].append(each.get_setup())
    return playbooks_info


def delete_parameter(key):
    try:
        arg = Parameter.query.filter(Parameter.key == key).first()
        db.session.delete(arg)
        db.session.commit()
        return True
    except:
        return False


def delete_task(key):
    try:
        task = Task.query.filter(Task.key == key).first()
        db.session.delete(task)
        db.session.commit()
        return True
    except:
        return False


def get_task(key):
    return Task.query.get(key)

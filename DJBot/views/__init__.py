from .action import action_bp
from .playbook import playbook_bp
from .room import room_bp
from .task import task_bp
from .user import user_bp

blueprints = {
    '/api/action' : action_bp,
    '/api/playbook' : playbook_bp,
    '/api/room' : room_bp,
    '/api/task' : task_bp,
    '/api/user' : user_bp,
}

def register_api(app):
    for url, manager in blueprints.items():
        app.register_blueprint(manager, url_prefix=url)

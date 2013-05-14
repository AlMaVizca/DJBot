import os, sys
sys.path.append('<botnet>')
os.environ['DJANGO_SETTINGS_MODULE'] = 'botnet.settings'
import django.core.handlers.wsgi
_application = django.core.handlers.wsgi.WSGIHandler()
def application(environ, start_response):
    environ['PATH_INFO'] = environ['SCRIPT_NAME'] + environ['PATH_INFO']
    if environ['wsgi.url_scheme'] == 'https':
        environ['HTTPS'] = 'on'
    return _application(environ, start_response)

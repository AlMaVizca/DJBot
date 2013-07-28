Djbot
======

Sistema de control remoto de equipos basado en SSH.

#Requisitos
* [Django 1.4.5](https://www.djangoproject.com/ "django")
* [Fabric](http://docs.fabfile.org/en/1.6/)
* [django-admin-bootstrapped](http://riccardo.forina.me/bootstrap-your-django-admin-in-3-minutes/)
* [Redis](http://redis.io/)
* [django-rq](https://github.com/ui/django-rq/)
* [django-redis](https://django-redis.readthedocs.org/en/latest/)


Instalar <a id="instalar"/>
--------

El desarrollo del sistema se llevo a cabo con [virtualenv](https://pypi.python.org/pypi/virtualenv) y se instalaron las dependencias con pip.


    virtualenv envdjbot
    source <path envdjbot>/bin/activate
    pip install django==1.4.5 fabric django-admin-bootstrapped django-rq django-redis
    python manage.py syncdb
  
Para ejecutar el proyecto tenemos que instalar Redis y ejecutar redis-server con las configuracion que se encuentra en la carpeta de djbot.


    python manage.py rqworker default ejecutados
    python manage.py runserver

djbot
======

Controlador de maquinas remotas.

#Requisitos
* 'Django 1.4.5 <https://www.djangoproject.com/>'_
* 'Fabric <http://docs.fabfile.org/en/1.6/>'_
* 'django-admin-bootstrapped <http://riccardo.forina.me/bootstrap-your-django-admin-in-3-minutes/>'_
* 'Redis <http://redis.io/>'_
* 'django-rq <https://github.com/ui/django-rq/>'_
* 'django-redis <https://django-redis.readthedocs.org/en/latest/>'_


Instalar <a id="instalar"/>
--------

El desarrollo del sistema se llevo a cabo con 'virtualenv <https://pypi.python.org/pypi/virtualenv>'_ y se instalaron las dependencias con pip.

.. code-block:: bash
   $ virtualenv envdjbot
   $ source <path envdjbot>/bin/activate
   $ pip install django==1.4.5 fabric django-admin-bootstrapped django-rq django-redis
   $ python manage.py syncdb
  
Para ejecutar el proyecto tenemos que instalar Redis y ejecutar redis-server con las configuracion que se encuentra en la carpeta de djbot.

.. code-block:: bash
   % python manage.py rqworker default
   % python manage.py runserver
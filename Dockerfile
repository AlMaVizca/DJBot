FROM debian
RUN apt-get update
RUN apt-get install -yqq redis-server python-pip
RUN pip install django==1.4.8 fabric django-admin-bootstrapped django-rq django-redis python-dev

FROM python:2
EXPOSE 80
VOLUME /usr/src/app

#Install ansible
RUN pip install git+git://github.com/ansible/ansible.git@stable-2.1

#Logs
RUN mkdir -p /var/log/djbot
ENV LOGS '/var/log/djbot/'

#SSH
RUN mkdir -p /root/.ssh
RUN touch /root/.ssh/.none

VOLUME /root/.ssh/pub_key

WORKDIR /usr/src/app
COPY pytest.ini setup.py setup.cfg /usr/src/app/
COPY src /usr/src/app/src
COPY tests /usr/src/app/tests
RUN pip install -e .
# python setup.py install
RUN pip install --upgrade git+git://github.com/inveniosoftware/flask-security-fork.git
COPY gunicorn.py /usr/src/app/
CMD ["gunicorn", "--forwarded-allow-ips=*", "--config=gunicorn.py", "wsgi:app"]

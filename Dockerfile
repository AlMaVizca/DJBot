FROM python:2-onbuild
EXPOSE 80
VOLUME /usr/src/app

#Install ansible
RUN pip install git+git://github.com/ansible/ansible.git@stable-2.1

#Build scripts
WORKDIR /usr/src/app/djbot/static/scripts
RUN bash build_scripts.sh

#Logs
RUN mkdir -p /var/log/djbot
ENV LOGS '/var/log/djbot/'

#SSH
RUN mkdir -p /root/.ssh
RUN touch /root/.ssh/.none

VOLUME /root/.ssh/pub_key

WORKDIR /usr/src/app
CMD ["gunicorn", "--config=gunicorn.py", "djbot:app"]

FROM python:2-onbuild
EXPOSE 80
VOLUME /usr/src/app
RUN pip install git+git://github.com/ansible/ansible.git@stable-2.1
CMD ["gunicorn", "--config=gunicorn.py", "app:app"]

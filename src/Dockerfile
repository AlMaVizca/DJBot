FROM python:3.4-onbuild
EXPOSE 80
VOLUME /usr/src/app
CMD ["gunicorn", "--config=gunicorn.py", "app:app"]

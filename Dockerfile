FROM python:2-onbuild
EXPOSE 80
VOLUME /usr/src/app
RUN pip install git+git://github.com/ansible/ansible.git@stable-2.1

WORKDIR /usr/src/app/djbot/static/scripts
RUN cat src/*.jsx > build/main.js;                                                                                      

# WORKDIR /opt/go
# RUN wget https://storage.googleapis.com/golang/go1.6.linux-amd64.tar.gz
# RUN tar -xvf go1.6.linux-amd64.tar.gz
# RUN rm go1.6.linux-amd64.tar.gz
# RUN mv go /usr/local
	
# ENV GOPATH /go
# ENV PATH $GOPATH/bin:/usr/local/go/bin:$PATH
# RUN go get -u github.com/moul/advanced-ssh-config/cmd/assh

RUN mkdir -p /var/logs/djbot
ENV LOGS '/var/logs/djbot'

WORKDIR /usr/src/app
CMD ["gunicorn", "--config=gunicorn.py", "djbot:app"]

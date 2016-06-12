FROM python:2-onbuild
EXPOSE 80
VOLUME /usr/src/app
RUN pip install git+git://github.com/ansible/ansible.git@stable-2.1

RUN curl -sL https://deb.nodesource.com/setup_4.x | bash -
RUN apt-get install -yqq nodejs

WORKDIR /usr/src/app/djbot

RUN npm install


RUN gulp
WORKDIR /usr/src/app/djbot/static
RUN bower install --allow-root


RUN apt-get remove --purge -yqq nodejs\
     && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/go
RUN wget https://storage.googleapis.com/golang/go1.6.linux-amd64.tar.gz
RUN tar -xvf go1.6.linux-amd64.tar.gz
RUN rm go1.6.linux-amd64.tar.gz
RUN mv go /usr/local
	
ENV GOPATH /go
ENV PATH $GOPATH/bin:/usr/local/go/bin:$PATH
RUN go get -u github.com/moul/advanced-ssh-config/cmd/assh



WORKDIR /usr/src/app
CMD ["gunicorn", "--config=gunicorn.py", "djbot:app"]

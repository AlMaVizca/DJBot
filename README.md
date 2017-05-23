DJBot
======

**You are reading the development version **

The goal of DJBot is to orquestrate computer room and servers, for that we are using ansible API to write a nice frontend that reduce the gap for those who want to initiate in the DevOps Culture.


This is an ambitious proposal, so if you have any comment please write a [message](https://github.com/krahser/DJBot/issues/new)

Try it
------

If you want to make it easy just use [Docker](https://docs.docker.com/engine/installation/)

Get the image:

    docker pull krahser/djbot:dev

Run in localhost:

    docker run -d -p8080:80 --name DJBot krahser/djbot:dev


After this you can see the application using your web browser: [localhost:8080](http://localhost:8080)

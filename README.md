DJBot
======

[![Build Status](https://travis-ci.org/krahser/DJBot.svg?branch=master)](https://travis-ci.org/krahser/DJBot)

The goal is make ansible a very easy tool for anybody. You are able to write playbooks without need visit the docs of ansible,
and run them on your inventory.

Disclaimer
----------

The use of this tool could damage the systems that are on the inventory.
That it's on your responsability and not of any developer of DJBot.

If you have some question or something looks wrong for you, please [let us know](https://github.com/krahser/DJBot/issues/new)

Install
--------

If you want to make it easy just use [Docker](https://docs.docker.com/engine/installation/)

Get the image:

    docker pull krahser/djbot

Run in localhost:

    docker run -d -p127.0.0.1:8080:80 --name DJBot krahser/djbot


Take in mind that this is only for local usage, If you want to make the interface public you should add some security settings.

How to use it
-------------

After this you can see the application using your web browser: [localhost:8080](http://localhost:8080)
The default user is *admin* with password *password*

1. In Playbooks tab you are going to manage all the playbooks. So lets start to create an easy one.
For example make an update of a Debian system.

2. The inventory is the place where you are going to setup the rooms and servers, and run some playbooks.

3. In the Results you are going to see all the executions.
You need to choose one and you are going to see the tasks executed with his own standard output.


Contributions
-------------

Everything is welcome :)

Right now, I'm trying to get feedback and improve the UX. But I also need to improve the docs and make some gifs.


Questions or Suggestions
------------------------

Please write a [message](https://github.com/krahser/DJBot/issues/new)

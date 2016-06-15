#!/bin/bash

apt-get update
apt-get install apt-transport-https ca-certificates -yqq
apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D

echo 'deb https://apt.dockerproject.org/repo debian-jessie main' > /etc/apt/sources.list.d/docker.list
echo '### apt-get update ---> this may take a while...'
apt-get update -qq
echo '### apt-get install docker-engine ---> this may take a while...'
apt-get install docker-engine -yqq
echo '### systemctl enable docker && systemctl start docker'
systemctl enable docker
systemctl start docker

#!/bin/bash


mkdir /tmp/DJBot
pushd /tmp/DJBot


wget https://raw.githubusercontent.com/krahser/DJBot/master/docker-compose.yml

curl -L https://github.com/docker/compose/releases/download/1.7.1/docker-compose-`uname -s`-`uname -m` > docker-compose
chmod +x docker-compose
sudo mv docker-compose /usr/local/bin

docker-compose up -d

docker-compose scale computer=10


echo "The network is:"
docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' djbot_computer_2
popd

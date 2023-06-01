#!/bin/bash
set -e

sudo rm -r $1
sudo docker builder prune -f
sudo docker rm -f $(docker ps -aq)
sudo docker rmi -f $(docker images -aq)

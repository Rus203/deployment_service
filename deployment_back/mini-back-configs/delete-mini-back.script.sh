#!/bin/bash
set -e

sudo rm -r $1
docker stop $(docker ps -aq) || true
sudo docker rm -f $(docker ps -aq) || true
sudo docker rmi -f $(docker images -aq) || true
sudo docker builder prune -f

#!/bin/bash

# check out Docker
if ! command -v docker &> /dev/null; then
    # Set up Docker
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
fi

# check out Docker Compose
if ! command -v docker-compose &> /dev/null; then
    # Set up Docker Compose
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi
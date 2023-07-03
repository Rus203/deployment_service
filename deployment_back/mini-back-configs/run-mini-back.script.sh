#!/bin/bash
set -e

cd ~/$1/mini-back
docker compose up --build -d

# $1 - project name 
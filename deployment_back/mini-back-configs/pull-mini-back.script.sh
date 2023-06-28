#!/bin/bash
set -e

eval $(ssh-agent -s)
ssh-add ~/project/id_rsa
ssh -o StrictHostKeyChecking=no -T git@github.com 2>&1 | grep -v "^Warning: Permanently added.*" || true
git clone -b $1 ~/$2/mini_back
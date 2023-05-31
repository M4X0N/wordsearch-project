#! /bin/bash
# TODO
# CRUTCHY, SHOULD BE REIMPLEMENTED

TAG=$1
if [ -z "$1" ]; then
    echo "No tag argument"
    exit
fi

docker build api -t wordsearchproject/backend:$TAG
docker push wordsearchproject/backend:$TAG

docker build api -t wordsearchproject/frontend:$TAG
docker push wordsearchproject/frontend:$TAG

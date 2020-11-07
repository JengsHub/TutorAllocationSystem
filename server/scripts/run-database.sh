#!/bin/bash

CONTAINER_NAME="monash-tas-database"
POSTGRES_USER=$(grep DB_USERNAME ../.env | cut -d '=' -f 2-)
POSTGRES_PASSWORD=$(grep DB_PASSWORD ../.env | cut -d '=' -f 2-)
POSTGRES_DB=$(grep DB_NAME ../.env | cut -d '=' -f 2-)

echo $POSTGRES_USER
echo $POSTGRES_PASSWORD
echo $POSTGRES_DB

if [[ ! "$(docker ps -aqf name=$CONTAINER_NAME)" ]]; then
  docker run \
    -e "POSTGRES_USER=$POSTGRES_USER" \
    -e "POSTGRES_PASSWORD=$POSTGRES_PASSWORD" \
    -e "POSTGRES_DB=$POSTGRES_DB" \
    -p 5432:5432 \
    --name "$CONTAINER_NAME" \
    postgres:alpine
else
  docker start -ia "$CONTAINER_NAME"
fi

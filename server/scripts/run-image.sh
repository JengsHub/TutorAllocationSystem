#!/bin/bash
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

POSTGRES_USER=$(grep DB_USERNAME ../.env | cut -d '=' -f 2-)
POSTGRES_PASSWORD=$(grep DB_PASSWORD ../.env | cut -d '=' -f 2-)
POSTGRES_DB=$(grep DB_NAME ../.env | cut -d '=' -f 2-)

echo $POSTGRES_USER
echo $POSTGRES_PASSWORD
echo $POSTGRES_DB

docker run --network=host \
  -e "DB_NAME=${POSTGRES_DB}" \
  -e "DB_PORT=5432" \
  -e "DB_USERNAME=${POSTGRES_USER}" \
  -e "DB_PASSWORD=${POSTGRES_DB}" \
  -e "DB_HOST=127.0.0.1" \
  monash-tas-server
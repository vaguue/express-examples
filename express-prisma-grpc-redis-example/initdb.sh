#!/bin/bash

#NOTE: this script is intended for setting up development environment, not production

pullIfDoesntExist() {
  image=$1
  docker inspect --type=image $image &> /dev/null
  if [ $? -gt 0 ]; then
    echo [*] pulling $image
    docker pull $image
  fi
}

pullIfDoesntExist mysql:latest
pullIfDoesntExist redislabs/redisearch:latest

docker run --name mysql -e MYSQL_ROOT_PASSWORD="mysql" -p 3306:3306 -p 33060:33060 --rm -d mysql:latest
docker run --name redis -p 6379:6379 --rm -d redislabs/redisearch:latest

#after mysql is ready (takes time)
# npx prisma db push
# npm run predev

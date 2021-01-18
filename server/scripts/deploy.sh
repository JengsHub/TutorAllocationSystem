
aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin 765783841184.dkr.ecr.ap-southeast-2.amazonaws.com
docker build -t monash-tas-server .
docker tag monash-tas-server:latest 765783841184.dkr.ecr.ap-southeast-2.amazonaws.com/monash-tas-server-repo:latest
docker push 765783841184.dkr.ecr.ap-southeast-2.amazonaws.com/monash-tas-server-repo:latest
aws ecs update-service --cluster monash-tas-server --service server --force-new-deployment > /dev/null
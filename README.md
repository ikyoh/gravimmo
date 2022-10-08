# INSTALL

## 1 - Create .env at root

###> Docker env variables ###
APP_NAME=
DOMAIN_NAME=
API_URL=

###> symfony/framework-bundle ###
APP_ENV=dev
APP_SECRET=


###> doctrine/doctrine-bundle ###
DB_USER=
DB_PASS=
DB_ROOT_PASS=
DB_NAME=


###> lexik/jwt-authentication-bundle ###
JWT_PASSPHRASE=

###> nelmio/cors-bundle ###
#CORS_ALLOW_ORIGIN='^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$'
CORS_ALLOW_ORIGIN='^http?://.*?$'



## 2 - make container-up

## 3 - docker exec -it cohealth-api bash composer install

## 4 - docker exec -it cohealth-api php bin/console lexik:jwt:generate-keypair

## 5 - docker exec -it cohealth-api bash composer dump-env prod







docker exec -it cohealth-api bash

docker exec -it cohealth-app npm run build --force


docker-compose exec -w /etc/caddy caddy caddy reload


docker-compose -f docker-compose.dev.yml up -d

docker-compose down --remove-orphans

composer dump-env prod
php bin/console lexik:jwt:generate-keypair
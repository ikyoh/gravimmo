#---VARIABLES---------------------------------#

#---ENV---#
-include .env

#---DOCKER---#
DOCKER = docker
DOCKER_RUN = $(DOCKER) run
DOCKER_COMPOSE = docker-compose
DOCKER_COMPOSE_UP = $(DOCKER_COMPOSE) up -d
DOCKER_COMPOSE_STOP = $(DOCKER_COMPOSE) stop
DOCKER_EXEC = $(DOCKER) exec -it
#------------#

#---SYMFONY--#
SYMFONY = symfony
SYMFONY_SERVER_START = $(SYMFONY) serve -d
SYMFONY_SERVER_STOP = $(SYMFONY) server:stop
SYMFONY_CONSOLE = $(SYMFONY) console
SYMFONY_LINT = $(SYMFONY_CONSOLE) lint:
#------------#

#---COMPOSER-#
COMPOSER = composer
COMPOSER_INSTALL = $(COMPOSER) install
COMPOSER_UPDATE = $(COMPOSER) update
#------------#

#---NPM-----#
NPM = npm
NPM_INSTALL = $(NPM) install --force
NPM_UPDATE = $(NPM) update
NPM_BUILD = $(NPM) run build
NPM_DEV = $(NPM) run dev
NPM_WATCH = $(NPM) run watch
#------------#


## === HELP ==================================================
help: ## Show this help.
	@echo "Symfony-And-Docker-Makefile"
	@echo "---------------------------"
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@grep -E '(^[a-zA-Z0-9_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'
	@grep : Makefile | awk -F: '/^[^.]/ {print $1;}'
#---------------------------------------------#


## === DOCKER ================================================

stop: ## Docker stop
	@echo "\n==> Stop docker container"
	$(DOCKER_COMPOSE) stop
.PHONY: stop

up: ## Docker up
	@echo "\n==> Up docker container"
	$(DOCKER_COMPOSE) up -d --build
.PHONY: up

down: ## Docker down
	@echo "\n==> Remove docker container"
	$(DOCKER_COMPOSE) down
.PHONY: down

remove:
	@echo "\n==> Remove all images"
	$(DOCKER) rmi $$(docker images -a -q)
.PHONY: remove

prune :
	@echo "\n==> Clean up"
	$(DOCKER) system prune --all --force
.PHONY: prune
	
docker-dev: ## Docker docker-compose.dev.yml
	@echo "\n==> Docker compose development environment ..."
	$(DOCKER_COMPOSE) up -d --build
.PHONY: docker-dev

docker-prod:
	@echo "\n==> Docker compose production environment ..."
	$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.production.yml up -d --build
	$(DOCKER) exec -it ${APP_NAME}-app npm run build --force
	$(DOCKER) exec -it ${APP_NAME}-api composer dump-env prod
	$(DOCKER_COMPOSE_STOP) app
.PHONY: docker-prod


## === SYMFONY ================================================
symfony-dev : ## Symfony dev environment
	@echo "\n==> Start Symfony dev environment ..."
	rm -f api/.env.local.php
	$(DOCKER_EXEC) ${APP_NAME}-api symfony server:start --no-tls -d
.PHONY: symfony-dev

symfony-bash : ## Symfony bash
	@echo "\n==> Start Symfony bash ..."
	$(DOCKER) exec -it ${APP_NAME}-api bash
.PHONY: symfony-bash


## === CADDY ================================================
caddy-reload: ## Reload Caddy Server
	@echo "\n==> Reloadind Caddy Server ..."
	$(DOCKER) exec -w /etc/caddy ${APP_NAME}-caddy caddy reload
.PHONY: caddy-reload



## === FIRST INSTALL ================================================
install: 
	@echo "\n==> Run production environment ..."
.PHONY: install


## === DEVELOPMENT ================================================
dev: docker-dev symfony-dev
	@echo "\n==> Running development environment ..."
.PHONY: dev


## === PRODUCTION ================================================
prod: docker-prod caddy-reload
	@echo "\n==> Running production environment ..."
.PHONY: prod

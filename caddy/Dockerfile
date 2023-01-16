# Build Caddy with Mercure and Vulcain modules
FROM caddy:2-builder-alpine AS caddy_builder

RUN xcaddy build \
	--with github.com/dunglas/mercure \
	--with github.com/dunglas/mercure/caddy \
	--with github.com/dunglas/vulcain \
	--with github.com/dunglas/vulcain/caddy


# Caddy image Prod
FROM caddy:2-alpine AS caddy

WORKDIR /srv/app
COPY --from=caddy_builder /usr/bin/caddy /usr/bin/caddy
COPY ./Caddyfile /etc/caddy/Caddyfile


# Caddy image Dev
FROM caddy:2-alpine AS caddydev

WORKDIR /srv/app
COPY --from=caddy_builder /usr/bin/caddy /usr/bin/caddy
COPY ./Caddyfile.dev /etc/caddy/Caddyfile

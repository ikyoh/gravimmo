FROM php:8.1-fpm-buster

# Copy composer.lock and composer.json
COPY composer.json /.

# Set working directory
WORKDIR /srv/api

ARG APP_ENV
ENV APP_ENV=$APP_ENV

ARG APP_SECRET
ENV APP_SECRET=$APP_SECRET

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

ARG JWT_PASSPHRASE
ENV JWT_PASSPHRASE=$JWT_PASSPHRASE

ARG CORS_ALLOW_ORIGIN
ENV CORS_ALLOW_ORIGIN=$CORS_ALLOW_ORIGIN


RUN apt-get update \
    &&  apt-get install -y --no-install-recommends \
        locales apt-utils git libicu-dev g++ libpng-dev libxml2-dev libzip-dev libonig-dev libxslt-dev unzip libpq-dev wget \
        apt-transport-https lsb-release ca-certificates

RUN pecl install apcu && docker-php-ext-enable apcu

RUN docker-php-ext-configure \
	intl \
	&&  docker-php-ext-install \
	pdo pdo_mysql mysqli pdo_pgsql opcache intl zip calendar dom mbstring gd xsl \
	&& docker-php-ext-enable mysqli
	

ENV COMPOSER_ALLOW_SUPERUSER=1

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer selfupdate

RUN curl -1sLf 'https://dl.cloudsmith.io/public/symfony/stable/setup.deb.sh' | bash
RUN apt install symfony-cli


# Copy existing application directory contents
COPY . /srv/api


# Expose port 9000 and start php server
EXPOSE 9000
CMD ["php-fpm"]


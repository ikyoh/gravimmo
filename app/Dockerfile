FROM node:18-alpine

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL


RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY ./package.json /app/
COPY ./package-lock.json /app/
RUN npm i --force

COPY . /app

CMD ["npm", "run", "start"]
EXPOSE 3000




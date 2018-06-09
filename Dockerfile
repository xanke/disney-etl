FROM node:latest

COPY . /app/
WORKDIR /app

RUN yarn install

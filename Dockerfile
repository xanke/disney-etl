FROM node:latest

COPY . /app/
WORKDIR /app

RUN npm install --registry=https://registry.npm.taobao.org

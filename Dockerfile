FROM node:20-alpine

MAINTAINER SomeDev

RUN apk add --no-cache bash

RUN mkdir -p /app/server
RUN mkdir -p /app/socket
RUN mkdir -p /app/statistics

WORKDIR /app

FROM ghcr.io/puppeteer/puppeteer:latest

RUN mkdir app
WORKDIR app

COPY task/package.json .
RUN npm i
COPY task/ .

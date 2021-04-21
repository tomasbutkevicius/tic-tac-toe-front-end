# TicTacToe

## Introduction

TicTacToe game front-end. Without back-end action log is not displayed.

Backend of project: https://github.com/tomasbutkevicius/tic-tac-toe-back-end

## Installation

- Clone project from git repository

- Run project (with docker) by entering in terminal
```bash
docker-compose up --build -d
```

## Usage

Go to the url: http://localhost:4200 to start the game.

## Useful links 
- For docker setup 
  - (Mac)     https://docs.docker.com/docker-for-mac/install/
  - (Windows) https://docs.docker.com/docker-for-windows/install/


## Angular generated info
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.9.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


# This defines our starting point
FROM node:10-alpine as build-step

RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build --prod

COPY . . 

FROM nginx:1.17.1-alpine
COPY --from=build-step /app/dist/tic-tac-toe /usr/share/nginx/html

EXPOSE 4200

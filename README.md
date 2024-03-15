<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

This is chat-app backend built with NestJS. It uses websockets with RabbitMQ for scalability to communicate with the client.

## Project setup

I use PNPM as my package manager, can be installed with the following this link [PNPM](https://pnpm.io/id/installation). You can also use NPM or Yarn to run the project. The project also needs Docker installed to run the RabbitMQ server. You can install Docker from this link [Docker](https://www.docker.com/products/docker-desktop).

**Run the project**

```bash
# install dependencies
$ pnpm install

# Check terraform plan
$ pnpm run terraform:plan

# run the RabbitMQ server with terraform
$ pnpm run terraform:apply

# destroy the RabbitMQ server with terraform
$ pnpm run terraform:destroy

# run the development server
$ pnpm run start:dev

# run the test
$ pnpm run test
```

Websocket server will be running on `ws://localhost:4001` and the RabbitMQ server will be running on `amqp://localhost:5672`.

This project use socket.io to handle and emit the websocket events.

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:4001', { autoConnect: false });

socket.on('connect', () => {
  console.log('Socket connected');
});

socket.on('disconnect', () => {
  console.log('Socket disconnected');
});

socket.on('chat', (newMessage) => {
  console.log('New message added', newMessage);
  // Add the new message to the chat list
});

socket.emit('chat', { author: 'Testing', body: 'Hello world!' });
```

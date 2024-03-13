import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { connect, Connection, Channel } from 'amqplib';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ChatDto } from './dto/chat.dto';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  // let server: Server;
  let connection: Connection;
  let channel: Channel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatGateway],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    connection = await connect('amqp://localhost');
    channel = await connection.createChannel();
    gateway.setLogger(new Logger('ChatGateway'));
    gateway.setChannel(channel);
  });

  afterEach(async () => {
    if (channel) {
      await channel.close();
    }

    if (connection) {
      await connection.close();
    }
  });

  describe('init', () => {
    it('should initialize the RabbitMQ connection and channel', async () => {
      await gateway.init();
      expect(gateway.getChannel()).toBeDefined();
      expect(gateway.getChannel()).toBeDefined();
    });
  });

  describe('handleMessage', () => {
    it('should send a message to the RabbitMQ queue', async () => {
      const payload: ChatDto = { author: 'test', body: 'test' };
      const spy = jest.spyOn(channel, 'sendToQueue');
      const result = gateway.handleMessage(payload);
      expect(spy).toHaveBeenCalledWith(
        'chat',
        Buffer.from(JSON.stringify(payload)),
      );
      expect(result).toEqual(payload);
      spy.mockRestore();
    });
  });

  describe('handleConnection', () => {
    it('should log a message when a client connects', () => {
      const loggerSpy = jest.spyOn(gateway.getLogger(), 'log');
      const client = { id: '123' } as Socket;
      gateway.handleConnection(client);
      expect(loggerSpy).toHaveBeenCalledWith(`Client connected: ${client.id}`);
      loggerSpy.mockRestore();
    });
  });

  describe('handleDisconnect', () => {
    it('should log a message when a client disconnects', () => {
      const loggerSpy = jest.spyOn(gateway.getLogger(), 'log');
      const client = { id: '123' } as Socket;
      gateway.handleDisconnect(client);
      expect(loggerSpy).toHaveBeenCalledWith(
        `Client disconnected: ${client.id}`,
      );
      loggerSpy.mockRestore();
    });
  });
});

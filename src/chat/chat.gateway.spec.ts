import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { MessageDto } from './dto/message.dto';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let server: Server;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatGateway],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    server = new Server();
    logger = new Logger('ChatGateway');
    gateway.server = server;
    gateway.setLogger(logger);
  });

  it('should log and emit message', () => {
    const payload: MessageDto = { author: 'Test', body: 'Test message' };
    const logSpy = jest.spyOn(logger, 'log');
    const emitSpy = jest.spyOn(server, 'emit');

    const result = gateway.handleMessage(payload);

    expect(logSpy).toHaveBeenCalledWith(
      `Message: ${payload.author} - ${payload.body}`,
    );
    expect(emitSpy).toHaveBeenCalledWith('message', payload);
    expect(result).toEqual(payload);
  });
});

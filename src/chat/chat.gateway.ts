import { connect, Connection, Channel } from 'amqplib';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatDto } from './dto/chat.dto';

@WebSocketGateway(4001, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');
  private connection: Connection;
  private channel: Channel;

  constructor() {
    this.init();
  }

  async init() {
    this.connection = await connect('amqp://localhost');
    this.channel = await this.connection.createChannel();
    this.channel.assertQueue('chat');
    this.channel.consume('chat', (msg) => {
      if (msg) {
        const chat = JSON.parse(msg.content.toString());
        this.server.emit('chat', chat);
      }
    });
  }

  setLogger(logger: Logger) {
    this.logger = logger;
  }

  setChannel(channel: Channel) {
    this.channel = channel;
  }

  getConnection() {
    return this.connection;
  }

  getChannel() {
    return this.channel;
  }

  getLogger() {
    return this.logger;
  }

  @SubscribeMessage('chat')
  handleMessage(@MessageBody() payload: ChatDto): ChatDto {
    this.channel.sendToQueue('chat', Buffer.from(JSON.stringify(payload)));
    return payload;
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async disconnect() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }
}

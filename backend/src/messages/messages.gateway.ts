import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto';

@WebSocketGateway({
  cors: {
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3010',
      'http://localhost:3000',
      'http://localhost:3010',
      /^http:\/\/localhost:\d+$/,
    ],
    credentials: true,
  },
})
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private messagesService: MessagesService) {}

  @SubscribeMessage('join-room')
  handleJoinRoom(@MessageBody() data: { conversationId: string }, @ConnectedSocket() client: Socket) {
    client.join(data.conversationId);
  }

  @SubscribeMessage('send-message')
  async handleMessage(@MessageBody() dto: CreateMessageDto & { senderId: string }) {
    const message = await this.messagesService.create(dto.senderId, dto);
    // Emit both event names for frontend compatibility
    this.server.to(dto.conversationId).emit('new-message', message);
    this.server.to(dto.conversationId).emit('message', message);
    return message;
  }

  @SubscribeMessage('typing')
  handleTyping(@MessageBody() data: { conversationId: string; userId: string; isTyping: boolean }) {
    this.server.to(data.conversationId).emit('user-typing', {
      userId: data.userId,
      isTyping: data.isTyping,
    });
  }
}

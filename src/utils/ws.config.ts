/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import log from '../logging/logger';
import RedisClient from './redis';
import config from '../../config/default';
import { WS_EVENT } from '../../config/constants';
import mongoose from 'mongoose';
import UserService from '../services/user.service';
import Doctor from '../database/models/doctor.model';
const userService = new UserService();

export default class WS {
  public io: Server;
  private redis: RedisClient = new RedisClient(config.redis.url);
  private user: string;
  constructor(io: Server) {
    this.io = io;
    this.setupSocket();
  }

  private setupSocket() {
    this.io.on(
      WS_EVENT.CONNECTION,
      async (socket: Socket<DefaultEventsMap>) => {
        const { user } = socket.handshake.query;
        const user_previous_socket = await this.redis.getUserSocket(
          user as string,
        );
        this.user = user as string;
        if (user_previous_socket) {
          await this.redis.delete(user as string);
        }
        await this.redis.set(user as string, socket.id);
        log.info(`${socket.id} connected`);
        // this.handleUserConnection(socket);
        this.setupEventHandlers(socket);
        socket.emit(WS_EVENT.CONNECTED, { message: 'Connected to socket' });
        socket.on(WS_EVENT.DISCONNECT, async () => {
          log.info(`${socket.id} disconnected`);
          socket.emit(`${socket.id} disconnected`);
          const { user } = socket.handshake.query;
          await this.redis.delete(user as string);
          socket.disconnect();
        });
      },
    );
  }

  setupEventHandlers(socket: Socket) {
    socket.on(
      'send_message',
      async (data: { message: string; recipientId: string }) => {
        log.info(
          `Message from ${socket.id} to ${data.recipientId}: ${data.message}`,
        );
        log.info(this.user);
        this.io
          .to(await this.redis.getUserSocket(data.recipientId))
          .emit('receive_message', {
            from: socket.id,
            message: data.message,
          });
      },
    );

    // Handle joining a room
    socket.on(WS_EVENT.JOIN_ROOM, (roomName: string) => {
      socket.join(roomName);
      log.info(`User ${socket.id} joined room ${roomName}`);
    });

    // Handle message events
    socket.on(
      WS_EVENT.SEND_LIVE_LOCATION,
      (data: { roomName: string; location: { [key: string]: string } }) => {
        log.info(data);
        log.info(
          `Message from ${socket.id} to room ${data.roomName}: The Doctors current longitude is ${data.location.longitude} and latitude is ${data.location.latitude}`,
        );
        socket.broadcast
          .to(data.roomName)
          .emit(WS_EVENT.RECEIVE_LIVE_LOCATION, {
            from: socket.id,
            location: data.location,
          });
      },
    );
  }

  async emitEventToClient(user: string, eventName: string, data: any) {
    const socketId = await this.redis.getUserSocket(user);
    if (socketId) {
      this.io.sockets.sockets.get(socketId)?.emit(eventName, data);
    }
  }
}

export async function socketUserMiddleware(
  socket: Socket,
  next: (err?: Error) => void,
) {
  try {
    let { user } = socket.handshake.query;
    user = user as string;
    if (!user) throw new Error('Oops!, user must be provided');
    if (!mongoose.Types.ObjectId.isValid(user))
      throw new Error('invalid Id format ');
    let user_details = await userService.getUserById(user);
    if (!user_details) {
      user_details = await userService.getOne(Doctor, { _id: user });
      if (!user_details) throw new Error('Oops!, user not found');
    }
    socket.handshake.query.user = user_details.id;
    next();
  } catch (error) {
    log.error(error);
    if (error instanceof Error) {
      next(error);
    }
  }
}

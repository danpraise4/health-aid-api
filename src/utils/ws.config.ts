/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import log from '../logging/logger';
import RedisClient from './redis';
import config from '../../config/apiGatewayConfig';
import { WS_EVENT } from '../../config/constants';
import mongoose from 'mongoose';
import UserService from '../services/user.service';
import HealthWorker from '../database/models/health_worker.model';
import Patient from '../database/models/patient.model';
import { userController } from '../http/controllers/controllers.module';
const userService = new UserService();

export default class WS {
  public io: Server;
  private redis: RedisClient = new RedisClient(config.redis.url);
  private Patient: string;
  constructor(io: Server) {
    this.io = io;
    this.setupSocket();
  }

  private setupSocket() {
    this.io.on(
      WS_EVENT.CONNECTION,
      async (socket: Socket<DefaultEventsMap>) => {
        const { Patient } = socket.handshake.query;
        const Patient_previous_socket = await this.redis.getPatientSocket(
          Patient as string,
        );
        this.Patient = Patient as string;
        if (Patient_previous_socket) {
          await this.redis.delete(Patient as string);
        }
        await this.redis.set(Patient as string, socket.id);
        log.info(`${socket.id} connected`);
        // this.handlePatientConnection(socket);
        this.setupEventHandlers(socket);
        socket.emit(WS_EVENT.CONNECTED, { message: 'Connected to socket' });
        socket.on(WS_EVENT.DISCONNECT, async () => {
          log.info(`${socket.id} disconnected`);
          socket.emit(`${socket.id} disconnected`);
          const { Patient } = socket.handshake.query;
          await this.redis.delete(Patient as string);
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
        log.info(this.Patient);
        this.io
          .to(await this.redis.getPatientSocket(data.recipientId))
          .emit('receive_message', {
            from: socket.id,
            message: data.message,
          });
      },
    );

    socket.on(
      WS_EVENT.UPDATE_HEALTH_WORKER_LOCATION,
      async (data: { [key: string]: string }) => {
        data.user = data.user_id;
        await userController.updateHealthWorkerLocation(data);
      },
    );

    socket.on(
      WS_EVENT.GET_NEARBY_HEALTH_WORKS,
      async (data: { [key: string]: number }) => {
        const health_workers = await userController.getNearbyHealthWorkers(
          data,
        );
        await this.emitEventToClient(
          data.user_id as unknown as string,
          WS_EVENT.GET_NEARBY_HEALTH_WORKS,
          health_workers,
        );
      },
    );

    // Handle joining a room
    socket.on(WS_EVENT.JOIN_ROOM, (roomName: string) => {
      socket.join(roomName);
      log.info(`Patient ${socket.id} joined room ${roomName}`);
    });

    socket.on(
      WS_EVENT.REQUEST_DOCTOR_EVENT,
      async (hw_id: string, data: Object) => {
        const socketId = await this.redis.getPatientSocket(hw_id);
        if (socketId) {
          this.io.sockets.sockets
            .get(socketId)
            ?.emit(WS_EVENT.REQUEST_DOCTOR_EVENT, data);
        }
      },
    );

    // Handle message events
    socket.on(
      WS_EVENT.SEND_LIVE_LOCATION,
      (data: { roomName: string; location: { [key: string]: string } }) => {
        log.info(data);
        log.info(
          `Message from ${socket.id} to room ${data.roomName}: The HealthWorkers current longitude is ${data.location.longitude} and latitude is ${data.location.latitude}`,
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

  async emitEventToClient(Patient: string, eventName: string, data: any) {
    const socketId = await this.redis.getPatientSocket(Patient);
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
    let user_details: Patient | HealthWorker;
    user_details = await userService.getPatientById(user);
    if (!user_details) {
      user_details = await userService.getOne(HealthWorker, {
        _id: user,
      });
      if (!user_details) throw new Error('Oops!, Patient not found');
    }
    socket.handshake.query.Patient = user_details.id;
    next();
  } catch (error) {
    log.error(error);
    if (error instanceof Error) {
      next(error);
    }
  }
}

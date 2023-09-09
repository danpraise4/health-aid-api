/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import log from '../logging/logger';
import RedisClient from './redis';
import config from '../../config/default';
import { WS_EVENT } from '../../config/constants';
import mongoose from 'mongoose';
import PatientService from '../services/patient.service';
import Doctor from '../database/models/healthworker.model';
const patientService = new PatientService();

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

    // Handle joining a room
    socket.on(WS_EVENT.JOIN_ROOM, (roomName: string) => {
      socket.join(roomName);
      log.info(`Patient ${socket.id} joined room ${roomName}`);
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
    let { Patient } = socket.handshake.query;
    Patient = Patient as string;
    if (!Patient) throw new Error('Oops!, Patient must be provided');
    if (!mongoose.Types.ObjectId.isValid(Patient))
      throw new Error('invalid Id format ');
    let Patient_details = await patientService.getPatientById(Patient);
    if (!Patient_details) {
      Patient_details = await patientService.getOne(Doctor, { _id: Patient });
      if (!Patient_details) throw new Error('Oops!, Patient not found');
    }
    socket.handshake.query.Patient = Patient_details.id;
    next();
  } catch (error) {
    log.error(error);
    if (error instanceof Error) {
      next(error);
    }
  }
}

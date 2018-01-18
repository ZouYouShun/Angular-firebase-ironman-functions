import { Router } from 'express';

import { roomWithMessageHandler } from './message/roomWithMessage.handler';
import { checkMessageReadedHandler } from './message/checkMessageReaded.handler';

export enum ROOM_TYPE {
  OneToOne = 1
}

export const messageApi = Router()
  .post('/roomWithMessage', roomWithMessageHandler)
  .post('/checkMessageReaded', checkMessageReadedHandler);

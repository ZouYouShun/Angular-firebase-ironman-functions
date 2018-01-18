import { Router } from 'express';

import { roomWithMessageHandler } from './message/roomWithMessage.handler';
import { checkMessageReadedHandler } from './message/checkMessageReaded.handler';
import { loginCheck } from '../libs/login-check';

export const messageApi = Router()
  .use('/', loginCheck)
  .post('/roomWithMessage', roomWithMessageHandler)
  .post('/checkMessageReaded', checkMessageReadedHandler);

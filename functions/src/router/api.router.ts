import * as express from 'express';

import { messageApi } from '../apis/message.api';

export const apiRouter = express.Router()
    .use('/message', messageApi)
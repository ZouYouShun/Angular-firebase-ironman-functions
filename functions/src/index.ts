import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { Server } from './model/server.model';
import { roomsMessagefirestore } from './triggers/firestore/roomsMessage.firestore';

admin.initializeApp(functions.config().firebase);

// import { storeTimeObject } from './libs/timestamp';


// import { writeMessageFunction } from './function/write.message';
// import { writeRoomsMessagesFunction } from './function/write-rooms-message';

export const api = functions.https.onRequest(new Server().bootstrap());

export const Trigger_roomsMessage_store = roomsMessagefirestore;
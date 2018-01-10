import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { Server } from './model/server.model';
import { userCreated } from './triggers/authentication/user.created.trigger';
import { userDeleted } from './triggers/authentication/user.deleted.trigger';
import { roomsMessagefirestore } from './triggers/firestore/roomsMessage.firestore';
import { fcmSend } from './triggers/realtimeDatabase/fcm.send.trigger';
import { generateThumbnail } from './triggers/storage/generateThumbnail.storage';

admin.initializeApp(functions.config().firebase);

// http
export const api = functions.https.onRequest(new Server().bootstrap());

// store
export const Trigger_roomsMessage_store = roomsMessagefirestore;

// storage
export const Trigger_generateThumbnail = generateThumbnail;

// realtime database
export const Trigger_fcmSend = fcmSend;

// authentication
export const Trigger_userCreated = userCreated;
export const Trigger_userDeleted = userDeleted;

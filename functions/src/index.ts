import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { Server } from './model/server.model';
import { userCreated } from './triggers/authentication/user.created.trigger';
import { userDeleted } from './triggers/authentication/user.deleted.trigger';
import { roomsMessagefirestore } from './triggers/firestore/roomsMessage.firestore.trigger';
import { fcmSend } from './triggers/realtimeDatabase/fcm.send.trigger';
import { generateThumbnail } from './triggers/storage/generateThumbnail.storage';
import { rendertronHttpTrigger } from './triggers/http/rendertron.http.trigger';
import { userStatusFirestore } from './triggers/realtimeDatabase/user-status.realtime.trigger';

admin.initializeApp(functions.config().firebase);

// http
export const api = functions.https.onRequest(new Server().bootstrap());

// store
export const Trigger_roomsMessage_store = roomsMessagefirestore;

// storage
export const Trigger_generateThumbnail = generateThumbnail;

// realtime database
export const Trigger_userStatusFirestore = userStatusFirestore;

// authentication
export const Trigger_userCreated = userCreated;
export const Trigger_userDeleted = userDeleted;

// rendertron
// export const Rendertron = rendertronHttpTrigger;


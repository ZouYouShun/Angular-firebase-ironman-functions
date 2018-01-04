import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { storeTimeObject } from '../../libs/timestamp';

export const roomsMessagefirestore = functions.firestore
  .document('/rooms/{roomId}/messages/{messageId}').onWrite((event) => {
    const firestore = admin.firestore();

    const roomId = event.params.roomId;
    const messageId = event.params.messageId;

    const message = event.data.data();

    const messageRef: FirebaseFirestore.DocumentReference = event.data.ref;

    return messageRef.parent.parent.update(storeTimeObject({ last: message }, false));
  });

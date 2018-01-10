import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const fcmSend = functions.database.ref('/messages/{userId}/{messageId}').onCreate(event => {
    console.log('realtime database is work!')
    return false;
});
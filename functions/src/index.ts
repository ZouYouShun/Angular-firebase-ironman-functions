import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { Server } from './model/server.model';

admin.initializeApp(functions.config().firebase);

// import { storeTimeObject } from './libs/timestamp';


// import { writeMessageFunction } from './function/write.message';
// import { writeRoomsMessagesFunction } from './function/write-rooms-message';

// export const api = functions.https.onRequest((req, response) => {

//   console.log(req.body);

//   return response.json({ test: '!!' });

//   // const roomId = req.body.roomId;
//   // const messageData = req.body.message;

//   // const roomsUsers = admin.firestore().doc(`rooms/${roomId}`).collection('users');
//   // const usersRef = admin.firestore().collection('users');

//   // return Promise.all([
//   //   roomsUsers
//   //     .doc(messageData.sender)
//   //     .set(storeTimeObject({})),
//   //   roomsUsers
//   //     .doc(messageData.addressee)
//   //     .set(storeTimeObject({})),
//   //   usersRef
//   //     .doc(messageData.sender)
//   //     .collection('rooms')
//   //     .doc(messageData.addressee)
//   //     .set(storeTimeObject({ roomId: roomId })),
//   //   usersRef
//   //     .doc(messageData.addressee)
//   //     .collection('rooms')
//   //     .doc(messageData.sender)
//   //     .set(storeTimeObject({ roomId: roomId }))
//   // ]).then((result) => {
//   //   console.log(result);
//   //   return response.status(200).send({ test: 'Testing functions!!' });
//   // }).catch(err => {
//   //   return response.status(500).send({ test: 'error!!' });
//   // });
// });

export const api = functions.https.onRequest(new Server().bootstrap());

// export const writeMessage = writeRoomsMessagesFunction;
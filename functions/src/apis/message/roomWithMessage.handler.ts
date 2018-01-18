import * as admin from 'firebase-admin';

import { storeTimeObject } from '../../libs/timestamp';

export enum ROOM_TYPE {
  OneToOne = 1
}
export const roomWithMessageHandler = async (req, res, next) => {
  try {
    const firestore = admin.firestore();
    const messageData = req.body.message;
    // user ref
    const usersRef = firestore.collection('users');
    // add room
    const room = await firestore.collection('rooms')
      .add(storeTimeObject({
        type: ROOM_TYPE.OneToOne
      }));

    const roomsUsers = room.collection('users');
    const messagesRef = room.collection('messages');

    return Promise.all([
      // add message
      messagesRef
        .add(storeTimeObject(messageData)),
      // set rooms user => sender
      roomsUsers
        .doc(messageData.sender)
        .set(storeTimeObject({})),
      // set rooms user => addressee
      roomsUsers
        .doc(messageData.addressee)
        .set(storeTimeObject({})),
      // set sender room
      usersRef
        .doc(messageData.sender)
        .collection('rooms')
        .doc(messageData.addressee)
        .set(storeTimeObject({
          roomId: room.id,
          type: ROOM_TYPE.OneToOne
        })),
      // set addressee room
      usersRef
        .doc(messageData.addressee)
        .collection('rooms')
        .doc(messageData.sender)
        .set(storeTimeObject({
          roomId: room.id,
          type: ROOM_TYPE.OneToOne
        }))
    ]).then((result) => {
      return res.success({
        message: 'add message success',
        obj: result
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: 'fail',
      obj: error
    });
  }
}

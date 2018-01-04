import { Router } from 'express';
import { storeTimeObject } from '../libs/timestamp';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const messageApi = Router()
  .post('/roomWithMessage', async (req, res, next) => {
    try {
      const firestore = admin.firestore();
      // user ref
      const usersRef = firestore.collection('users');
      // add room
      const room = await firestore.collection('rooms').add(storeTimeObject({}));
      const messageData = req.body.message;

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
          .set(storeTimeObject({ roomId: room.id })),
        // set addressee room
        usersRef
          .doc(messageData.addressee)
          .collection('rooms')
          .doc(messageData.sender)
          .set(storeTimeObject({ roomId: room.id }))
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
  })

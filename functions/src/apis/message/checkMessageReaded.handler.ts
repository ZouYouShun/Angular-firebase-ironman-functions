import * as admin from 'firebase-admin';

import { storeTimeObject } from '../../libs/timestamp';
import { BaseModel } from '../../model/base.model';

export const checkMessageReadedHandler = async (req, res, next) => {
  try {
    const firestore = admin.firestore();
    const user: admin.auth.DecodedIdToken = req.user;
    // console.log(user);
    const roomId = req.body.roomId;

    const roomRef = firestore.doc(`/rooms/${roomId}`);
    const roomMessagesRef = roomRef.collection(`messages`);
    const myReadStatus = await roomRef.collection(`users`).doc(user.uid).get();

    let query = roomMessagesRef.orderBy('updatedAt');

    if (myReadStatus) {
      const lastDate = myReadStatus.data();
      query = query.startAt(lastDate.updatedAt)
    }

    const batch = firestore.batch();
    let firstNotReadedMessageId;

    return query.get()
      .then((result) => {
        const data = result.docs;
        if (data && data.length > 0) {
          firstNotReadedMessageId = data[0].id;
          data.forEach(message => {
            // 過濾掉自己的訊息
            if (message.data().sender !== user.uid) {
              const messageReadedDoc = message.ref.collection(`readed`).doc(user.uid);
              batch.set(messageReadedDoc, storeTimeObject({}));
            }
          });
          return batch.commit();
        }
        return null;
      }).then((result) => {
        return res.success({
          message: 'mark readed success',
          obj: firstNotReadedMessageId
        });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'fail',
      obj: error
    });
  }
}

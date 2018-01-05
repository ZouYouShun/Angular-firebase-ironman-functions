import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { storeTimeObject } from '../../libs/timestamp';

// 當訊息有資料寫入時觸發
export const roomsMessagefirestore = functions.firestore
  .document('/rooms/{roomId}/messages/{messageId}').onCreate((event) => {
    const firestore = admin.firestore();

    const roomId = event.params.roomId;
    const messageId = event.params.messageId;

    const message = event.data.data();

    return Promise.all([
      // 更新這個人對應到另一個人的最後一句資料
      firestore.doc(`users/${message.sender}`)
        .collection('rooms')
        .doc(message.addressee)
        .update({ last: message }),// because data contain createdAt and updatedAt, no longer to write again
      // 兩個人的都要更新
      firestore.doc(`users/${message.addressee}`)
        .collection('rooms')
        .doc(message.sender)
        .update({ last: message }),
    ])
    // const messageRef: FirebaseFirestore.DocumentReference = event.data.ref;
    // return messageRef.parent.parent.update(storeTimeObject({ last: message }, false));
  });

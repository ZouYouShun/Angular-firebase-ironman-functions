import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { storeTimeObject } from '../../libs/timestamp';
import { MessageModel, MESSAGE_TYPE } from '../../model/message.model';

// 當訊息有資料寫入時觸發
export const roomsMessagefirestore = functions.firestore
  .document('/rooms/{roomId}/messages/{messageId}').onCreate((event) => {
    const firestore = admin.firestore();

    const message: MessageModel = event.data.data();
    
    const roomId = event.params.roomId;
    let fileHandler;
    if (message.type === MESSAGE_TYPE.FILE) {
      fileHandler = firestore.doc(`rooms/${roomId}`).collection('files')
        .doc(encodeURIComponent(message.content)).set({
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
          creator: message.sender
        })
    }

    return Promise.all([
      // 更新這個人對應到另一個人的最後一句資料
      firestore.doc(`users/${message.sender}`)
        .collection('rooms')
        .doc(message.addressee)
        .update(storeTimeObject({ last: message }, false)),
      // 兩個人的都要更新
      firestore.doc(`users/${message.addressee}`)
        .collection('rooms')
        .doc(message.sender)
        .update(storeTimeObject({ last: message }, false)),
      fileHandler
    ])
    // const messageRef: FirebaseFirestore.DocumentReference = event.data.ref;
    // return messageRef.parent.parent.update(storeTimeObject({ last: message }, false));
  });

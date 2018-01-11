import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { storeTimeObject } from '../../libs/timestamp';
import { MessageModel, MESSAGE_TYPE } from '../../model/message.model';
import { UserModel } from '../../model/user.model';

// 當訊息有資料寫入時觸發
export const roomsMessagefirestore = functions.firestore
  .document('/rooms/{roomId}/messages/{messageId}').onCreate((event) => {
    const firestore = admin.firestore();

    const message: MessageModel = event.data.data();
    const senderRef = firestore.doc(`users/${message.sender}`);
    const addresseeRef = firestore.doc(`users/${message.addressee}`);

    // set files
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

    // look fcmTokens and send messages

    return Promise.all([
      // 更新這個人對應到另一個人的最後一句資料
      senderRef
        .collection('rooms')
        .doc(message.addressee)
        .update(storeTimeObject({ last: message }, false)),
      // 兩個人的都要更新
      addresseeRef
        .collection('rooms')
        .doc(message.sender)
        .update(storeTimeObject({ last: message }, false)),
      fileHandler
    ]).then(() => {
      return Promise.all([
        addresseeRef.get(),
        senderRef.get()
      ]);
    }).then(async ([address, sender]) => {

      const addresseeTokens = await address.ref.collection('fcmTokens').get();

      if (addresseeTokens.empty) {
        // 這個人尚未有任何載具
        return false;
      }

      const addresseeData = address.data();
      const senderData = sender.data();

      const body = message.type === MESSAGE_TYPE.MESSAGE ? message.content : '送出了一個檔案';

      const payload = {
        notification: {
          icon: senderData.photoURL,
          clickAction: `https://onfirechat.ga/message/r/${roomId}/${message.sender}`,
          title: addresseeData.displayName,
          body: message.content,
        }
      };

      const messaging = admin.messaging();

      return addresseeTokens.docs.map(token => {
        return messaging.sendToDevice(token.data().token, payload);
      });
    })
  });

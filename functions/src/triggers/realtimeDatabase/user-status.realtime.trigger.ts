import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export const userStatusFirestore = functions.database
  .ref('/status/{uid}').onUpdate(event => {
    const firestore = admin.firestore();
    const eventStatus = event.data.val();

    const userStatusFirestoreRef = firestore.doc(`status/${event.params.uid}`);

    // 資料可能快速的被做修改，如果我們發現時間事件時間小於資料庫的更新時間，不做處理
    return event.data.ref.once("value").then((statusSnapshot) => {
      return statusSnapshot.val();
    }).then((status) => {
      if (status.updatedAt > eventStatus.updatedAt) return null;

      // 把資料轉乘時間格式
      eventStatus.updatedAt = new Date(eventStatus.updatedAt);
      return userStatusFirestoreRef.set(eventStatus);
    });
  });
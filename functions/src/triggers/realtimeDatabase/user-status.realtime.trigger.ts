import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export const userStatusFirestore = functions.database
  .ref('/status/{uid}').onUpdate(event => {
    const firestore = admin.firestore();
    const eventStatus = event.data.val();

    const userRef = firestore.doc(`users/${event.params.uid}`);

    // 資料可能快速的被做修改，如果我們發現時間事件時間小於資料庫的更新時間，不做處理
    return event.data.ref.once("value").then((statusSnapshot) => {
      return statusSnapshot.val();
    }).then((status) => {
      if (status.updatedAt > eventStatus.updatedAt) return null;

      // 把資料轉乘時間格式
      return userRef.update({
        loginStatus: status.state,
        lastSignInTime: new Date(eventStatus.updatedAt)
      });
    });
  });
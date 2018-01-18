import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { MESSAGE_TYPE, MessageModel } from '../../model/message.model';
import { BaseModel } from '../../model/base.model';
import { DeltaDocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

// 當訊息的已讀人員有資料寫入時觸發
export const roomsMessageUsersfirestore = functions.firestore
  .document('/rooms/{roomId}/messages/{messageId}/readed/{readUserId}')
  .onWrite((event: functions.Event<DeltaDocumentSnapshot>) => {
    const firestore = admin.firestore();

    const readedData: BaseModel = event.data.data();
    const roomId = event.params.roomId;
    const messageId = event.params.messageId;

    const messageRef = firestore.doc(`/rooms/${roomId}/messages/${messageId}`);

    return messageRef.collection('readed').orderBy('updatedAt').get()
      .then((result) => {
        const lastData: BaseModel = result.docChanges[result.docChanges.length - 1].doc.data();
        // 如果當下的最後一筆大於這一筆資料的話，不處理，給後面的處理
        if (lastData.updatedAt > readedData.updatedAt) {
          return null;
        }
        // 如果是最後一筆那就給他當下的長度
        return messageRef.update({
          readedNum: result.docChanges.length || 0
        });
      })
      .catch(err => {
        console.log(err);
        return err;
      });
  });

import * as Storage from '@google-cloud/storage';
import * as cpp from 'child-process-promise';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as path from 'path';

import { storeTimeObject } from '../../libs/timestamp';
import { CONFIG } from '../../config';

// 這是Storage的使用方法，
const gcs = Storage({ keyFilename: CONFIG.keyFilename });
// 使用child-process-promise的spawn方法
const spawn = cpp.spawn;

export const generateThumbnail = functions.storage.object()
  .onChange(event => {
    console.log('!!!!!!!!!!!!!圖片轉換被啟動了');
    // 我們會把資料寫回資料庫，所以我們要使用admin.firestore建立files的Ref
    const filesRef = admin.firestore().collection('files');
    const object = event.data;
    const metadata = object.metadata;
    const filePath = object.name;
    const encodePath = encodeURIComponent(filePath); // encodePath 用於存資料庫使用，資料庫不能存有/的路徑
    const fileName = path.basename(filePath);
    if (object.resourceState === 'not_exists') {
      console.log('這是刪除事件');
      // 如果是刪除事件，把資料也刪掉
      return filesRef.doc(encodePath).delete()
        .catch(err => {
          console.log('資料不存在了!');
        });
    }
    if (!object.contentType.startsWith('image/')) {
      console.log('這不是圖片')
      return false;
    }
    if (metadata.complete) {
      console.log('這個檔案已經處理完成')
      return false;
    }
    const fileBucket = object.bucket
    const bucket = gcs.bucket(fileBucket);
    const tempFilePath = path.join('/tmp', fileName);
    const thumbFilePath = filePath.replace(/(\/)?([^\/]*)$/, '$1thumb_$2');
    // 下載原檔
    return bucket.file(filePath).download({
      destination: tempFilePath
    })
      .then(() => {
        // 下載完成後，我們執行spawn來呼叫Google Cloud提供的縮圖功能
        console.log('圖片下載完成，在', tempFilePath);
        return spawn('convert', [tempFilePath, '-thumbnail', '200x200',
          tempFilePath])
      }).then(() => {
        // 縮圖產生完成後，把縮圖透過bucket上傳到storage
        console.log('縮圖產生完成');

        return bucket.upload(tempFilePath, {
          destination: thumbFilePath,
          metadata: { // 這裡要注意，我們的metadata
            metadata: { // customMetada放這裡
              complete: true // 我們新增一個complete的屬性
            }
          }
        });
      }).then(() => {
        const config = {
          action: 'read',
          expires: '08-03-2491' // I don't want to expire
        }
        // get files download url
        return Promise.all([
          bucket.file(thumbFilePath).getSignedUrl(config),
          bucket.file(filePath).getSignedUrl(config)
        ])
      }).then(([thumbResult, originalResult]) => {
        const url = originalResult[0]; // 注意這裡回傳的是陣列
        const thumbnail = thumbResult[0]; // 注意這裡回傳的是陣列
        return filesRef.doc(encodePath)
          .set(storeTimeObject({
            path: filePath,
            contentType: object.contentType,
            creator: metadata.creator || 'system',
            updater: metadata.updater || 'system',
            url,
            thumbnail,
          }))
      }).catch((err) => {
        console.error(err);
        return err;
      });
  });
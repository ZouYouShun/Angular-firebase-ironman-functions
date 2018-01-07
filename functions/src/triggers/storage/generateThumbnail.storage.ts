import * as Storage from '@google-cloud/storage';
import * as cpp from 'child-process-promise';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as path from 'path';

import { CONFIG } from '../../config';
import { storeTimeObject } from '../../libs/timestamp';

const gcs = Storage({ keyFilename: CONFIG.keyFilename });
const spawn = cpp.spawn;

export const generateThumbnail = functions.storage.object()
  .onChange(event => {
    // console.log('!!!!!!!!!!!!!圖片轉換被啟動了');
    const filesRef = admin.firestore().collection('files');

    const object = event.data;
    const metadata = object.metadata;
    const filePath = object.name;
    const encodePath = encodeURIComponent(filePath);
    // console.log('filePath: ' + filePath);
    // console.log('encodePath: ' + encodePath);
    const fileName = path.basename(filePath);

    if (object.resourceState === 'not_exists') {
      // console.log('這是刪除事件')
      return filesRef.doc(encodePath).delete()
        .catch(err => {
          console.log('資料不存在了!');
        });
    }

    if (metadata.complete) {
      // console.log('這個檔案已經處理完成')
      return false;
    }

    if (!object.contentType.startsWith('image/')) {
      // console.log('這不是圖片')
      return false;
    }

    const fileBucket = object.bucket
    const bucket = gcs.bucket(fileBucket);
    const tempFilePath = path.join('/tmp', fileName);
    const thumbFilePath = filePath.replace(/(\/)?([^\/]*)$/, '$1thumb_$2');

    return bucket.file(filePath).download({
      destination: tempFilePath
    }).then(() => {
      // console.log('圖片下載完成，在', tempFilePath);
      return spawn('convert', [tempFilePath, '-thumbnail', '200x200',
        tempFilePath])
    }).then(() => {
      // console.log('縮圖產生完成');

      return bucket.upload(tempFilePath, {
        destination: thumbFilePath,
        metadata: {
          metadata: {
            complete: true
          }
        }
      });
    }).then(() => {
      const config = {
        action: 'read',
        // expires: '08-03-2491' // I don't want to expire
      }
      // get files url
      return Promise.all([
        bucket.file(thumbFilePath).getSignedUrl(config),
        bucket.file(filePath).getSignedUrl(config)
      ])
    }).then(([thumbResult, originalResult]) => {
      // console.log('取得網址完成');
      const url = originalResult[0];
      const thumbnail = thumbResult[0];
      // use file path as id
      return filesRef.doc(encodePath)
        .set(storeTimeObject({
          path: filePath,
          contentType: object.contentType,
          creator: metadata.creator || 'system',
          updater: metadata.updater || 'system',
          url,
          thumbnail,
        }));
    }).catch((err) => {
      console.error(err);
    });
  });
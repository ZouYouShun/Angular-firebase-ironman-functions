import * as functions from 'firebase-functions';

// 這是Storage的使用方法，

export const sampleStorage = functions.storage.object()
  .onChange(event => {
    console.log('!!!!!!!!!!!!!圖片轉換被啟動了');

    return false;
  });
import * as gcs from '@google-cloud/storage';
import * as cpp from 'child-process-promise';
import * as functions from 'firebase-functions';


const spawn = cpp.spawn;

export const generateThumbnail = functions.storage.object()
    .onChange(event => {
        const object = event.data;
        const filePath = object.name;
        const fileName = filePath.split('/').pop()

        const file = {
            filePath: filePath,
            fileName: fileName,
            fileBucket: object.bucket,
            bucket: gcs().bucket(object.bucket),
            tempFilePath: `/tmp/${fileName}`
        };
        if(file.fileName.startsWith('thumb_')){
            console.log('已經有縮圖了');
            return false;
        }

        if (object.contentType.startsWith('image/')) {
            console.log('這不是圖片')
            return false;
        }

        if (object.resourceState === 'not_exists') {
            console.log('This is a deletion event.')
            return false;
        }

        return file.bucket.file(file.filePath).download({
            destination: file.tempFilePath
        })
            .then(() => {
                console.log('圖片下載完成，在', file.tempFilePath);
                return spawn('convert', [file.tempFilePath, '-thumbnail', '200x200', file.tempFilePath])
            })
            .then(() => {
                console.log('縮圖產生完成');
                const thumbFilePath = file.filePath.replace(/(\/)?([^\/]*)$/, '$1thumb_$2')

                return file.bucket.upload(thumbFilePath, {
                    destination: thumbFilePath
                });

            });

    });
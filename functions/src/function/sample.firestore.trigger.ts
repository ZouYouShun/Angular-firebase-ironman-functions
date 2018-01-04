import * as functions from 'firebase-functions';

export const sampleFirestoreTrigger = functions.firestore
  .document('users/{userId}').onWrite((event) => {
    console.log(event.eventType);
    console.log('exists: ' + event.data.exists);
    console.log(event.data.ref);
    console.log('id: ' + event.data.id);
    console.log('createTime: ' + event.data.createTime);
    console.log('updateTime: ' + event.data.updateTime);
    console.log('readTime: ' + event.data.readTime);
    if (event.data.previous) {
      console.log(`previous: ${JSON.stringify(event.data.previous.data())}`);
    } else {
      console.log('no previous!');
    }
    console.log('data: ' + JSON.stringify(event.data.data()));
    console.log(event.data.get('data'));

    return 'complete!';
  });

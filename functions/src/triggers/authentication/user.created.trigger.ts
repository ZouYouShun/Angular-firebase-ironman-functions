import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';

export const userCreated = functions.auth.user()
  .onCreate((event) => {
    console.log('新增使用者');
    const user = event.data;

    const type = user.providerData ? user.providerData[0].providerId : 'email';

    const usersRef = admin.firestore().collection('users');

    return usersRef.doc(user.uid).set({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      lastSignInTime: user.metadata.lastSignInTime || null,
      creationTime: user.metadata.creationTime || null,
      type: type
    }).then(u => {

      const options: nodemailer.SendMailOptions = {
        from: '"OnFireChat" <onfirechat@gmail.com>',
        to: user.email,
        subject: '歡迎來到 OnFireChat ！ 這是一封確認信',
        text: '歡迎來到OnFireChat這是一封確認信!'
      };

      const gmailEmail = functions.config().gmail.email;
      const gmailPassword = functions.config().gmail.password;
      return nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: gmailEmail,
          pass: gmailPassword
        }
      }).sendMail(options);
    }).catch(err => {
      console.log('send fail', err);
      return false;
    });
  });

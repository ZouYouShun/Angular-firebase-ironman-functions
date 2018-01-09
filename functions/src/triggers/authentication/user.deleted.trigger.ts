import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const userDeleted = functions.auth.user()
    .onDelete((event) => {
        console.log('刪除使用者');
        const uid = event.data.uid;
        const usersRef = admin.firestore().collection('users');

        return usersRef.doc(uid).update({
            isDeleted: true
        }).catch(err => {
            console.error('user not exist!', uid)
            return false;
        });
    });

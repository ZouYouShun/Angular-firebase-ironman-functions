import * as admin from 'firebase-admin';

export function storeTimeObject(obj: any, isNew = true) {
    const newObj = {
        ...obj,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    if (isNew) {
        newObj.createdAt = admin.firestore.FieldValue.serverTimestamp();
    }
    return newObj;
}

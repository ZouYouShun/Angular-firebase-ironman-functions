import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import { CONFIG } from '../config';

export const loginCheck = (req: Request, res: Response, next: NextFunction) => {
    console.log('開始檢查使用者狀態');
    const authorization = req.headers.authorization as string;
    // console.log(req.headers);
    // console.error(req.headers.authorization);

    if (!authorization || !authorization.startsWith(CONFIG.tokenAlias)) {
        console.error('找不到Token喔');
        res.status(403).send('Unauthorized');
        return;
    }

    let idToken;
    if (authorization && authorization.startsWith(CONFIG.tokenAlias)) {
        console.log('找到 Token了');
        idToken = authorization.split(CONFIG.tokenAlias)[1];
    }

    admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
        console.log('使用者：', decodedIdToken);
        (<any>req).user = decodedIdToken;
        next();
    }).catch(error => {
        console.error('找不到這個ID的使用者:', error);
        res.status(403).send('Unauthorized');
    });
};
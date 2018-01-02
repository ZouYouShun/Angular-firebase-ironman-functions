import * as functions from 'firebase-functions';
import { Server } from './model/server.model';

// export const helloWorld = functions.https.onRequest((request, response) => {
//   console.log("Hello from Firebase!");
//   // return cors(request, response, () => {
//   return response.status(200).send({ test: 'Testing functions!!' });
//   // })
// });
export const helloWorld = functions.https.onRequest(new Server().bootstrap());
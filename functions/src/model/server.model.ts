import * as express from 'express';
// main server
import * as bluebird from 'bluebird';
import * as bodyParser from 'body-parser';
import * as expressValidator from 'express-validator';
import { apiRouter } from '../router/api.router';
import { resSuccess } from '../libs/res.success';

export class Server {
  private app: express.Application = express();

  bootstrap() {
    return this.app;
  }

  constructor() {
    this.setConfig();
    this.setRouters();
  }

  private setConfig() {

    // mount json form parser
    this.app.use(bodyParser.json());

    // mount query string parser
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));

    // use bluebird promises
    global.Promise = bluebird;

    this.app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Credentials', 'true');

      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        res.end();
      } else {
        next();
      }
    });
    // add validator
    this.app.use(expressValidator());
  }

  private setRouters() {
    this.app
      .use(resSuccess)
      .use('/', apiRouter);
  }

}
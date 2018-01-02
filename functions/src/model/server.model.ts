import * as express from 'express';
import { apiRouter } from '../router/api.router';

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
        this.app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            next();
        });
    }

    private setRouters() {
        this.app
            .use('/', apiRouter);
    }

}
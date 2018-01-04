
declare namespace Express {
    export interface Response {
        success(object: ResponseObj);
    }
}

interface ResponseObj  {
    status?: number;
    message: string;
    obj?: any;
}

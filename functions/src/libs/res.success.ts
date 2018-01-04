export const resSuccess = (req, res, next) => {
    res.success = (object: ResponseObj) => {
        console.log(object);
        return res.status(object.status || 200).json({
            message: object.message,
            obj: object.obj
        });
    };
    next();
};

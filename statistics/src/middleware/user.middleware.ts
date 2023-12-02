import {CustomRequest} from "../interfaces/func";
import {NextFunction, Response} from "express";
import {UserSchema} from "../dataBase";

class UserMiddleware {

    constructor() {
        this.checkUserUnique = this.checkUserUnique.bind(this);
    }

    async checkUserUnique(req: CustomRequest, res: Response, next: NextFunction) {
        const {email} = req.body;
        try {
            const user = await UserSchema.findOne({email: email});

            if (user) {
                return res.status(401).json({message: 'User with this EMAIL is exist'});
            }

            next();
        } catch (e) {
            next(e);
        }
    }
}

export default new UserMiddleware();
import {NextFunction, Response} from "express";
import {CustomRequest} from "../interfaces/func";

class UserController {

    constructor() {
        this.createUser = this.createUser.bind(this);
    }

    async createUser(req: CustomRequest, res: Response, next: NextFunction) {
        const {} = req.body;
        try {

        } catch (e) {
            next(e)
        }
    }
}

export default new UserController();
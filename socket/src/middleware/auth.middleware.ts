import {NextFunction, Response} from "express";
import axios from "axios";

import {CustomRequest} from "../interfaces/func";
import {IUser} from "../interfaces/common";
import configs from "../configs";

const SERVER_API = configs.API_URL;

class AuthMiddleware {

    constructor() {
        this.checkAuth = this.checkAuth.bind(this);
    }

    async checkAuth(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const access_token = req.get("Authorization");
            let isAuth: boolean = false;
            let user = {} as IUser;

            if (!access_token) {
                return res.status(404).json({message: "No token"})
            }
            const {data} = await axios.get(`${SERVER_API}/api/v1/auth/check_auth_user`, {
                headers: {
                    Authorization: access_token
                }
            })
            if (data) {
                isAuth = data?.status === 'auth';
                user = data?.user;
            }
            if (isAuth && user?._id) {
                req.user = user;
                next()
            } else {
                return res.status(403).json({message: "Access denied"})
            }
        } catch (e) {
            next(e)
        }
    }
}

export default new AuthMiddleware();

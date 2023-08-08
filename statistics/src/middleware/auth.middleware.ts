import {NextFunction, Response} from "express";
import axios, {AxiosRequestConfig} from "axios";

import {CustomRequest} from "../interfaces/func";
import {IUser} from "../interfaces/common";

class AuthMiddleware {
    async checkAuthAdmin(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const access_token = req.get("Authorization");

            let isAuth: boolean = false;
            let user = {} as IUser;

            await axios.get(`http://localhost:8080/api/v1/auth/check_auth`, {
                headers: {
                    Authorization: access_token
                }
            }).then((value) => {
                isAuth = value.data.status === 'auth';
                user = value.data.user;
            }).catch((e) => {
                console.log(e)
            });

            if (isAuth && user?.status === 'admin') {
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
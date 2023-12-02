import {NextFunction, Response} from "express";
import {Schema} from "mongoose";

import {CustomRequest} from "../interfaces/func";
import {NotificationService} from "../service";
import {INotification} from "../interfaces/common";

class NotificationController {

    constructor() {


        this.getUserNotifications = this.getUserNotifications.bind(this);
        this.createNotification = this.createNotification.bind(this);
    }

    async createNotification(req: CustomRequest, res: Response, next: NextFunction) {
        const {userId, description, forUser, typeNotification, message, status} = req.body;
        try {
            const notification = await NotificationService.createNotification({
                type: typeNotification,
                userId: userId as Schema.Types.ObjectId,
                isRead: false,
                message: message,
                description: description,
                forUser: forUser,
                status: status as INotification['status']
            });
            res.status(200).json(notification);
        } catch (e) {
            next(e)
        }
    }
    async getUserNotifications(req: CustomRequest, res: Response, next: NextFunction) {

        try {
            const notifications = await NotificationService.getUserNotifications()
        } catch (e) {
            next(e)
        }
    }
}

export default new NotificationController();
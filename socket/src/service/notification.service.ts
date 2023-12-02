import {Notification} from "../dataBase";
import {INotification} from "../interfaces/common";

class NotificationService {
    createNotification(params = {}) {
        return Notification.create(params);
    }

    async getUserNotifications() {

    }
}

export default new NotificationService();
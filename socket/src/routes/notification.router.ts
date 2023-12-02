import {Router} from "express";
import {notificationController} from "../controller";

const router = Router();

router.post(
    `/create`,
    notificationController.createNotification
)

export default router;
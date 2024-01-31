import {Router} from "express";
import {messageController} from "../controller";
import {authMiddleware} from "../middleware";

const router = Router();

router.post(
    `/file`,
    authMiddleware.checkAuth,
    messageController.createMessageWithFile
)
export default router;
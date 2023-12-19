import {Router} from "express";
import {messageController} from "../controller";

const router = Router();

router.post(
    `/file`,
    messageController.createMessageWithFile
)
export default router;
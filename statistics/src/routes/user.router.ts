import {Router} from "express";

import {authMiddleware, userMiddleware} from "../middleware";
import { userController} from "../conrollers";


const router = Router();

router.post(
    `/createUser`,
    authMiddleware.checkAuthAdmin,
    userMiddleware.checkUserUnique,
    userController.createUser
)


export default router;
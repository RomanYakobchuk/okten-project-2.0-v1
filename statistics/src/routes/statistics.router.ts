import {Router} from "express";

import {authMiddleware} from "../middleware";
import {statisticsController} from "../conrollers";

const router = Router();

router.get(
    `/institutionsStatistics/:number`,
    authMiddleware.checkAuthAdmin,
    statisticsController.institutionsStatistics
)
router.get(
    `/userStatistics/:number`,
    authMiddleware.checkAuthAdmin,
    statisticsController.usersStatistics
)
router.get(
    `/newsStatistics/:number`,
    authMiddleware.checkAuthAdmin,
    statisticsController.newsStatistics
)

export default router;
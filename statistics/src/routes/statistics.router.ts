import {Router} from "express";
import {authMiddleware} from "../middleware";
import {statisticsController} from "../conrollers";

const router = Router();

router.get(
    `/institutionsStatistics`,
    authMiddleware.checkAuthAdmin,
    statisticsController.institutionsStatistics
)

export default router;
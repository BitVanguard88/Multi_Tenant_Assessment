import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
    getAnalyticsEventsController,
    getAnalyticsSummaryController
} from "../controllers/analyticsController";

const router = Router();

router.use(authMiddleware);
router.get("/summary", getAnalyticsSummaryController);
router.get("/events", getAnalyticsEventsController);

export default router;
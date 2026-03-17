import { Request, Response, NextFunction } from "express";
import { AnalyticsService } from "../services/analyticsService";
import { AnalyticsRepository } from "../repositories/analyticsRepository";

const analyticsService = new AnalyticsService(new AnalyticsRepository());

export function getAnalyticsSummaryController(req: Request, res: Response, next: NextFunction) {
    try {
        const result = analyticsService.getSummary(req.tenantId!);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export function getAnalyticsEventsController(req: Request, res: Response, next: NextFunction) {
    try {
        const result = analyticsService.getEvents(req.tenantId!);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}
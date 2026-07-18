import { Router } from "express";
import { createResource, getResources, getRecommendations, deleteResource } from "../controllers/resource.controller";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

router.post("/", requireAuth, requireRole("admin", "mentor"), createResource);
router.delete("/:id", requireAuth, requireRole("admin", "mentor"), deleteResource);
router.get("/", getResources);
router.post("/recommendations", requireAuth, getRecommendations);


export default router;

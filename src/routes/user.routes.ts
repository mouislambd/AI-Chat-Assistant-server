import { Router } from "express";
import { getAllUsers, updateUserRole, deleteUser } from "../controllers/user.controller";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

router.use(requireAuth, requireRole("admin"));

router.get("/", getAllUsers);
router.patch("/:id/role", updateUserRole);
router.delete("/:id", deleteUser);

export default router;

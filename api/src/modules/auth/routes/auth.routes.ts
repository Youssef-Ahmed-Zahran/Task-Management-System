import { Router } from "express";
import * as authController from "../controller/auth.controller.js";
import { authenticate } from "../../../middlewares/authenticate.js";
import { validate } from "../../../middlewares/validate.js";
import { registerSchema, loginSchema } from "../schema/auth.schema.js";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.get("/me", authenticate, authController.getMe);

export default router;

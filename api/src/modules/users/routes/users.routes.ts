import { Router } from "express";
import * as usersController from "../controller/users.controller.js";
import { authenticate } from "../../../middlewares/authenticate.js";

const router = Router();

router.use(authenticate);
router.get("/", usersController.getAllUsers);
router.get("/:id", usersController.getUserById);

export default router;

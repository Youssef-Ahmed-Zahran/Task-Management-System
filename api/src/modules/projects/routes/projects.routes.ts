import { Router } from "express";
import * as projectsController from "../controller/projects.controller.js";
import { authenticate } from "../../../middlewares/authenticate.js";
import { authorize } from "../../../middlewares/authorize.js";
import { validate } from "../../../middlewares/validate.js";
import {
  createProjectSchema,
  updateProjectSchema,
  addMemberSchema,
} from "../schema/projects.schema.js";

// Import task routes for nesting
import taskRouter from "../../tasks/routes/tasks.routes.js";

const router = Router();

router.use(authenticate);

router.get("/", projectsController.getProjects);
router.post("/", authorize("ADMIN"), validate(createProjectSchema), projectsController.createProject);
router.get("/:id", projectsController.getProject);
router.put("/:id", authorize("ADMIN"), validate(updateProjectSchema), projectsController.updateProject);
router.delete("/:id", authorize("ADMIN"), projectsController.deleteProject);
router.post("/:id/members", authorize("ADMIN"), validate(addMemberSchema), projectsController.addMember);
router.delete("/:id/members/:userId", authorize("ADMIN"), projectsController.removeMember);

// Nested task routes
router.use("/:projectId/tasks", taskRouter);

export default router;

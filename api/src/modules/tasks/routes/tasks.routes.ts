import { Router } from "express";
import * as tasksController from "../controller/tasks.controller.js";
import { validate } from "../../../middlewares/validate.js";
import {
  createTaskSchema,
  updateTaskSchema,
  listTasksQuerySchema,
} from "../schema/tasks.schema.js";

const router = Router({ mergeParams: true });

router.get("/", validate(listTasksQuerySchema), tasksController.listTasks);
router.post("/", validate(createTaskSchema), tasksController.createTask);
router.get("/:taskId", tasksController.getTask);
router.put("/:taskId", validate(updateTaskSchema), tasksController.updateTask);
router.delete("/:taskId", tasksController.deleteTask);

export default router;

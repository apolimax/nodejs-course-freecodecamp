const express = require("express");
const {
  getTasksController,
  createTaskController,
  updateTaskController,
  getTaskController,
  deleteTaskController,
} = require("../controllers/tasks");
const router = express.Router();

router.route("/").get(getTasksController).post(createTaskController);

router
  .route("/:id")
  .get(getTaskController)
  .patch(updateTaskController)
  .delete(deleteTaskController);

module.exports = router;

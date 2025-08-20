const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

router.get("/", taskController.getTasks);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/completed", taskController.deleteCompletedTasks);
router.delete("/:id", taskController.deleteTask);
router.delete("/", taskController.deleteAllTasks);

module.exports = router;

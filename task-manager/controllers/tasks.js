const Task = require("../models/Task");
const asyncWrapper = require("../middleware/async");
const { createCustomError } = require("../errors/custom-error");

const getTasksController = asyncWrapper(async (req, res) => {
  const tasks = await Task.find({}).exec();
  res.status(200).json({ tasks, amount: tasks.length });
});

const createTaskController = asyncWrapper(async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json(task);
});

const getTaskController = asyncWrapper(async (req, res, next) => {
  const { id: _id } = req.params;

  const task = await Task.findOne({ _id });
  if (!task) {
    return next(createCustomError(`No task with id: ${_id}`, 404));
  }
  res.status(200).json(task);
});

const updateTaskController = asyncWrapper(async (req, res) => {
  const { id: _id } = req.params;
  const { body } = req;

  const task = await Task.findOneAndUpdate({ _id }, body, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    return next(createCustomError(`No task with id: ${_id}`, 404));
  }

  res.status(200).json({ id: _id, task });
});

const deleteTaskController = asyncWrapper(async (req, res) => {
  const { id: _id } = req.params;

  const task = await Task.findOneAndDelete({ _id });
  if (!task) {
    return next(createCustomError(`No task with id: ${_id}`, 404));
  }
  res.status(200).json(task);
});

module.exports = {
  getTasksController,
  createTaskController,
  getTaskController,
  updateTaskController,
  deleteTaskController,
};

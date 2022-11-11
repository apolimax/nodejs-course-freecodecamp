const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt"); // find all the jobs related to the user authenticaded
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id },
  } = req;

  const job = await Job.findOne({ _id: id, createdBy: userId });

  if (!job) {
    throw new NotFoundError("Job not found");
  }

  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json(job);
};

const updateJob = async (req, res) => {
  const {
    user: { userId },
    params: { id },
  } = req;

  if (!id) {
    throw new BadRequestError("Please provide the job id");
  }

  /* const job = await Job.findByIdAndUpdate({ _id }, req.body, { now: true }); */
  const job = await Job.findOneAndUpdate(
    { _id: id, createdBy: userId },
    req.body,
    { new: true }
  );

  if (!job) {
    throw new NotFoundError("Job not found");
  }

  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id },
  } = req;

  if (!id) {
    throw new BadRequestError("Please provide the job id");
  }

  const job = await Job.findOneAndRemove({ _id: id, createdBy: userId });

  if (!job) {
    throw new NotFoundError("Job not found");
  }

  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};

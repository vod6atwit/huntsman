import Job from '../models/jobs.js';
import { StatusCodes } from 'http-status-codes';
import { CustomAPIError } from '../errors/index.js';
import checkPermissions from '../utils/checkPermissions.js';

const createJob = async (req, res) => {
  const { position, company } = req.body;
  if (!position || !company) {
    throw new CustomAPIError(
      'Please provide all values',
      StatusCodes.BAD_REQUEST
    );
  }

  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);

  res.status(StatusCodes.CREATED).json({ job });
};

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId });

  res
    .status(StatusCodes.OK)
    .json({ jobs, totalJobs: jobs.length, numOfPages: 1 });
};

const editJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { company, position } = req.body;

  if (!position || !company) {
    throw new CustomAPIError(
      'Please provide all values',
      StatusCodes.BAD_REQUEST
    );
  }

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new CustomAPIError(`No job with id: ${jobId}`, StatusCodes.NOT_FOUND);
  }

  // check permissions
  checkPermissions(req.user, job.createdBy);

  // use this way if you dont have any middleware in models
  const updateJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ updateJob });
};

const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new CustomAPIError(`No job with id: ${jobId}`, StatusCodes.NOT_FOUND);
  }

  // check permissions
  checkPermissions(req.user, job.createdBy);

  await job.remove();

  res.status(StatusCodes.OK).json({ msg: 'Success! Job removed' });
};

const showStats = async (req, res) => {
  res.send('show stats');
};

export { createJob, deleteJob, getAllJobs, editJob, showStats };

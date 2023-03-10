import Job from '../models/jobs.js';
import { StatusCodes } from 'http-status-codes';
import { CustomAPIError } from '../errors/index.js';
import checkPermissions from '../utils/checkPermissions.js';
import mongoose from 'mongoose';
import moment from 'moment';

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
  // for searching
  const { status, jobType, sort, search, searchBy } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  // add in query object based on condition

  // /jobs?status='status'
  if (status && status !== 'all') {
    queryObject.status = status;
  }

  // /jobs?jobType='jobType'
  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType;
  }

  // /jobs?search='search'&searchBy='searchBy'
  if (search) {
    if (searchBy === 'position') {
      queryObject.position = { $regex: search, $options: 'i' };
    }
    if (searchBy === 'company') {
      queryObject.company = { $regex: search, $options: 'i' };
    }
    if (searchBy === 'location') {
      queryObject.jobLocation = { $regex: search, $options: 'i' };
    }
  }

  // get the result based on the query object
  let result = Job.find(queryObject);

  // sort conditions
  if (sort === 'latest') {
    // descending order
    result = result.sort('-createdAt');
  }

  if (sort === 'oldest') {
    // ascending order
    result = result.sort('createdAt');
  }

  if (sort === 'position name a-z') {
    result = result.sort('position');
  }

  if (sort === 'position name z-a') {
    result = result.sort('-position');
  }

  // pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);

  // return an array of jobs from results
  const jobs = await result;

  // count total jobs after query execution
  const totalJobs = await Job.countDocuments(queryObject);

  // calculate number of pages
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
};

const editJob = async (req, res) => {
  // jobId is al alias of id
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
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplicationStats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    // get latest 6 months
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);

  monthlyApplicationStats = monthlyApplicationStats
    .map(item => {
      const {
        _id: { year, month },
        count,
      } = item;

      const date = moment()
        // moment count from 0-11 (jan - dec)
        .month(month - 1)
        .year(year)
        .format('MMMM Y');

      return { date, count };
    })
    // for displaying from oldest to newest month
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplicationStats });
};

export { createJob, deleteJob, getAllJobs, editJob, showStats };

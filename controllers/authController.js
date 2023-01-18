import User from '../models/user.js';
import { CustomAPIError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // missing required fields
  if (!name || !email || !password) {
    throw new CustomAPIError(
      'Please provide all values',
      StatusCodes.BAD_REQUEST
    );
  }

  // duplicate email
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new CustomAPIError('Email already exists', StatusCodes.BAD_REQUEST);
  }

  // generate new user in mongoDB
  // '.create' method won't work for 'select' queries in schema
  const user = await User.create({ name, email, password });

  // to be able to communicate between frontend and server
  // requests from frontend need to have token to be able to complete the requests
  const token = user.createJWT();

  // send user infos (not include password) and token back to frontend
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      name: user.name,
      location: user.location,
      lastName: user.lastName,
    },
    token,
    location: user.location,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // missing required fields
  if (!email || !password) {
    throw new CustomAPIError(
      'Please provide all values',
      StatusCodes.BAD_REQUEST
    );
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new CustomAPIError('Invalid credentials', StatusCodes.UNAUTHORIZED);
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomAPIError('Invalid credentials', StatusCodes.UNAUTHORIZED);
  }

  // to be able to communicate between frontend and server
  // requests from frontend need to have token to be able to complete the requests
  const token = await user.createJWT();

  // send user infos (not include password) and token back to frontend
  res.status(StatusCodes.OK).json({
    user: {
      email: user.email,
      name: user.name,
      location: user.location,
      lastName: user.lastName,
    },
    token,
    location: user.location,
  });
};

const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body;
  if (!email || !name || !location || !lastName) {
    throw new CustomAPIError(
      'Please provide all values',
      StatusCodes.BAD_REQUEST
    );
  }

  // '.findone' works for 'select: false' in user Schema
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;

  await user.save();

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({
    user,
    token,
    location: user.location,
  });
};

export { register, login, updateUser };

import User from '../models/user.js';
import { CustomAPIError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';
import attachCookie from '../utils/attachCookie.js';

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

  // create and send cookie with response
  attachCookie({ res, token });

  // send user infos (not include password) and token back to frontend
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      name: user.name,
      location: user.location,
      lastName: user.lastName,
    },
    /* Not sending token back with response because we are using token in cookie */
    // token,
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
  // created new token every time user is logged in ( prevent expired token )
  const token = await user.createJWT();

  // create and send cookie with response
  attachCookie({ res, token });

  // send user infos (not include password) and token back to frontend
  res.status(StatusCodes.OK).json({
    user: {
      email: user.email,
      name: user.name,
      location: user.location,
      lastName: user.lastName,
    },
    /* Not sending token back with response because we are using token in cookie */
    // token,
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
  // req.user from auth.js
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;

  await user.save();

  const token = user.createJWT();

  // create and send cookie with response
  attachCookie({ res, token });

  res.status(StatusCodes.OK).json({
    user,
    /* Not sending token back with response because we are using token in cookie */
    // token,
    location: user.location,
  });
};

const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });

  res.status(StatusCodes.OK).json({
    user,
    location: user.location,
  });
};

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: 'user logged out' });
};

export { register, login, updateUser, getCurrentUser, logout };

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
      lastname: user.lastName,
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
      lastname: user.lastName,
    },
    token,
    location: user.location,
  });
};

const updateUser = async (req, res) => {
  res.send('update User');
};

export { register, login, updateUser };

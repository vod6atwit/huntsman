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
  const user = await User.create({ name, email, password });

  // send user back to frontend
  res.status(StatusCodes.CREATED).json({ user });
};

const login = async (req, res) => {
  res.send('login user');
};
const updateUser = async (req, res) => {
  res.send('update User');
};

export { register, login, updateUser };

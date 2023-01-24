import { CustomAPIError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';

const testUser = (req, res, next) => {
  if (req.user.testUser) {
    throw new CustomAPIError('Test user. Read only', StatusCodes.BAD_REQUEST);
  }
  next();
};

export default testUser;

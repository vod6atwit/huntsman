import { CustomAPIError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
  // using this approach when send cookie in response from frontend
  const token = req.cookies.token;

  if (!token) {
    throw new CustomAPIError('Authorization Invalid', StatusCodes.UNAUTHORIZED);
  }

  /* using this verify token approach when store token in localStorage and globalState when development */

  // const authHeader = req.headers.authorization;
  // if (!authHeader || !authHeader.startsWith('Bearer')) {
  //   throw new CustomAPIError('Authorization Invalid', StatusCodes.UNAUTHORIZED);
  // }
  // const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // create test user for demo app
    const testUser = payload.userId === '63d01a8d7abbd99761c85898';

    // attach the user request object
    req.user = { userId: payload.userId, testUser };
    next();
  } catch (error) {
    throw new CustomAPIError('Authorization Invalid', StatusCodes.UNAUTHORIZED);
  }
};

export default auth;

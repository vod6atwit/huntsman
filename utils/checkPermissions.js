import { CustomAPIError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';

const checkPermissions = (requestUser, resourceUserId) => {
  // console.log(requestUser);
  // console.log(resourceUserId);
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new CustomAPIError(
    'Not authorized to access this route',
    StatusCodes.UNAUTHORIZED
  );
};

export default checkPermissions;

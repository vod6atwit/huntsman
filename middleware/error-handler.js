// include err and next parameter if want to catch throw errors in the routes
const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    msg: 'there was an error',
  });
};

export default errorHandlerMiddleware;

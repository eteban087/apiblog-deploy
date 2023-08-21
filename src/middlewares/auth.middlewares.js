const AppError = require('../helpers/appErros');
const catchAsync = require('../helpers/catchAsync');
const jwt = require('jsonwebtoken');
const User = require('../models/users.models');
const { promisify } = require('util');

const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in!, please log in the to get access'),
      401
    );
  }
  // decodificar el token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEDD
  );

  //   buscar el usuario y validar si existe
  const user = await User.findOne({
    where: {
      id: decoded.id,
      status: 'active',
    },
  });

  if (!user) {
    return next(
      new AppError('the owner of this token is not longer available', 401)
    );
  }

  // validar el tiempo en que se cambio la contraseña para saber si el token generado fue generado despues de cambiar la contraseña
  if (user.passwordChangeAt) {
    console.log(user.passwordChangeAt.getTime());
    const changeTimeStamp = parseInt(
      user.passwordChangeAt.getTime() / 1000,
      10
    );
    if (decoded.iat < changeTimeStamp) {
      return next(
        new AppError('User recently changed password! please login again', 401)
      );
    }
    console.log('token', decoded.iat);
    console.log('pass', changeTimeStamp);
  }

  // Adjuntar el  usuario en sesion
  req.sessionUser = user;

  next();
});

const protectAccountOwner = (req, res, next) => {
  const { user, sessionUser } = req;
  if (user.id !== sessionUser.id) {
    return next(new AppError('yo do not own this account ', 401));
  }
  next();
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.sessionUser.role)) {
      return next(
        new AppError('you do not have permission to permorm this action', 403)
      );
    }
    next();
  };
};

module.exports = {
  protect,
  protectAccountOwner,
  restrictTo,
};

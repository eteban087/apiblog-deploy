const AppErros = require('../helpers/appErros');
const catchAsync = require('../helpers/catchAsync');
const { Post } = require('../models/post.model');
const User = require('../models/users.models');

const validUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: {
      id,
      status: 'active',
    },
  });

  if (!user) {
    return next(new AppErros(`user with id ${id} not found`, 404));
  }

  req.user = user;
  next();
});

module.exports = {
  validUser,
};

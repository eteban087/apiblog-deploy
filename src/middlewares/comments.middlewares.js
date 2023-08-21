const AppError = require('../helpers/appErros');
const catchAsync = require('../helpers/catchAsync');
const Comment = require('../models/comment.model');

const validComment = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const comment = await Comment.findOne({
    where: {
      id,
      status: true,
    },
  });

  if (!comment) {
    return next(new AppError(`comment with id ${id} not found`, 404));
  }
  next();
  req.comment = comment;
});

module.exports = {
  validComment,
};

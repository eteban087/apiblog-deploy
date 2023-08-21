const AppError = require('../helpers/appErros');
const catchAsync = require('../helpers/catchAsync');
const Comment = require('../models/comment.model');
const { Post, postStatus } = require('../models/post.model');
const PostImg = require('../models/postImg');
const User = require('../models/users.models');

const validPost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findOne({
    where: {
      id,
      status: postStatus.active,
    },
    include: [
      {
        model: User,
        attributes: ['id', 'name', 'profileImgUrl', 'description'],
      },
    ],
  });

  if (!post) {
    return next(new AppError(`post with id ${id} not found`, 404));
  }
  req.user = post.user;
  req.post = post;
  next();
});

const validPostPerFindOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findOne({
    where: {
      id,
      status: postStatus.active,
    },
    include: [
      {
        model: User,
        attributes: ['id', 'name', 'profileImgUrl', 'description'],
      },
      {
        model: PostImg,
      },
      {
        model: Comment,
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'profileImgUrl', 'description'],
          },
        ],
      },
    ],
  });

  if (!post) {
    return next(new AppError(`post with id ${id} not found`, 404));
  }
  req.user = post.user;
  // req.postimg = post.postimg;
  req.post = post;
  next();
});

module.exports = {
  validPost,
  validPostPerFindOne,
};

const catchAsync = require('../helpers/catchAsync');
const Comment = require('../models/comment.model.js');
const User = require('../models/users.models');

const findAllComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.findAll({
    where: {
      status: true,
    },
  });
  return res.status(200).json({
    status: 'succes',
    results: comments.length,
    comments,
  });
});

const findOneComment = catchAsync(async (req, res, next) => {
  const { comment } = await req;
  console.log(comment);

  return res.status(200).json({
    status: 'succes',
    comment,
  });
});

const createComment = catchAsync(async (req, res, next) => {
  const { text } = req.body;
  const { id: postId } = req.params;
  const { id: userId } = req.sessionUser;
  const comment = await Comment.create({
    text,
    postId,
    userId,
  });
  return res.status(201).json({
    status: 'succes',
    message: 'comment created susccessfully!',
    comment,
  });
});

const updateComment = catchAsync(async (req, res, next) => {
  const { comment } = await req;

  const { text } = req.body;
  await comment.update({
    text,
  });
  return res.status(200).json({
    status: 'succes',
    message: 'comment has been updated susccessfully!',
  });
});

const deleteComment = catchAsync(async (req, res, next) => {
  const { comment } = await req;
  comment.update({ status: false });
  return res.status(200).json({
    status: 'succes',
    message: 'comment has been deleted susccessfully!',
  });
});

module.exports = {
  deleteComment,
  findOneComment,
  updateComment,
  findAllComments,
  createComment,
};

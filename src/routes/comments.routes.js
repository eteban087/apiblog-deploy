const {
  createComment,
  deleteComment,
  updateComment,
  findOneComment,
  findAllComments,
} = require('../controller/comment.controller');
const express = require('express');

const { validComment } = require('../middlewares/comments.middlewares');
const { protect } = require('../middlewares/auth.middlewares');
const {
  createCommentValidation,
  updateCommentValidation,
} = require('../middlewares/validations.middlewares');

const router = express.Router();

router.use(protect);

router.route('/').get(findAllComments);

router.post('/:id', createCommentValidation, createComment);

router
  .use('/:id', validComment)
  .route('/:id')
  .get(findOneComment)
  .patch(updateCommentValidation, updateComment)
  .delete(deleteComment);

module.exports = router;

const express = require('express');

const {
  createPost,
  findAllPosts,
  getOnePost,
  updatePost,
  deletePost,
  findMyPosts,
  findUserPosts,
} = require('../controller/posts.controller');

const { upload } = require('../helpers/multer');

const { validUser } = require('../middlewares/user.middleware');

const {
  protect,
  protectAccountOwner,
} = require('../middlewares/auth.middlewares');

const {
  createPostValidation,
} = require('../middlewares/validations.middlewares');

const {
  validPost,
  validPostPerFindOne,
} = require('../middlewares/post.middleware');

const router = express.Router();

router
  .route('/')
  .post(upload.array('postImgs', 3), protect, createPostValidation, createPost) //al utilizar el upload de multer me va a pemitir tener acceso al req.files
  .get(protect, findAllPosts);

router.use(protect);
router.get('/me', findMyPosts);
router.get('/profile/:id', validUser, findUserPosts);

router

  .route('/:id')
  .get(validPostPerFindOne, getOnePost)
  .patch(validPost, createPostValidation, protectAccountOwner, updatePost)
  .delete(validPost, protectAccountOwner, deletePost);

module.exports = router;

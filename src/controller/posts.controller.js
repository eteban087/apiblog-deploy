const { db } = require('../database/config');
const catchAsync = require('../helpers/catchAsync');
const Comment = require('../models/comment.model');
const { Post, postStatus } = require('../models/post.model');
const PostImg = require('../models/postImg');
const User = require('../models/users.models');

const { storage } = require('../helpers/firabase');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

const findAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.findAll({
    where: {
      status: postStatus.active,
    },
    attributes: {
      exclude: ['status', 'userId'],
    },

    include: [
      {
        model: User,
        attributes: ['id', 'name', 'profileImgUrl', 'description'],
      },
      // {
      //   model: Comment,

      //   include: [
      //     {
      //       model: User,
      //       attributes: ['id', 'name', 'profileImgUrl', 'description'],
      //     },
      //   ],
      //   attributes: {
      //     exclude: ['status', 'postId', 'userId'],
      //   },
      // },
      {
        model: PostImg,
      },
    ],

    order: [['createdAt', 'DESC']],
  });

  const postPromises = posts.map(async (post) => {
    const imgRefUser = ref(storage, post.user.profileImgUrl);
    const urlUser = await getDownloadURL(imgRefUser);

    post.user.profileImgUrl = urlUser;

    const PostImgsPromises = post.postImgs.map(async (postImg) => {
      const imgRef = ref(storage, postImg.postImgUrl);
      const url = await getDownloadURL(imgRef);

      postImg.postImgUrl = url;
      return postImg;
    });

    const postImgsResolved = await Promise.all(PostImgsPromises);

    post.postImg = postImgsResolved;

    return post;
  });

  await Promise.all(postPromises);

  return res.status(200).json({
    status: 'success',
    results: posts.length,
    posts,
  });
});

const findMyPosts = catchAsync(async (req, res, next) => {
  const { id } = req.sessionUser;
  const posts = await Post.findAll({
    where: {
      userId: id,
      status: postStatus.active,
    },

    attributes: {
      exclude: ['status', 'userId'],
    },

    include: [
      // {
      //   model: User,
      // },
      // {
      //   model: Comment,
      //   attributes: {
      //     exclude: ['status', 'postId', 'userId'],
      //   },
      //   include: [
      //     {
      //       model: User,
      //       attributes: ['id', 'name', 'profileImgUrl', 'description'],
      //     },
      //   ],
      // },
      {
        model: PostImg,
      },
    ],
  });

  if (posts.length > 0) {
    const postPromises = posts.map(async (post) => {
      const postImgsPromises = post.postImgs.map(async (postImg) => {
        const imgRef = ref(storage, postImg.postImgUrl);
        const url = await getDownloadURL(imgRef);
        postImg.postImgUrl = url;
        return postImg;
      });

      const postImgsResolved = await Promise.all(postImgsPromises);
      post.postImgs = postImgsResolved;

      return post;
    });

    await Promise.all(postPromises);
  }

  return res.status(200).json({
    status: 'success',
    results: posts.length,
    posts,
  });
});

const findUserPosts = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findAll({
    where: {
      userId: id,
      status: postStatus.active,
    },
  });

  return res.status(200).json({
    status: 'success',
    post,
  });
});

const getOnePost = catchAsync(async (req, res, next) => {
  const { post } = req;
  let imgsPromises = [];
  let imgsCommentsPromise = [];
  const imgRef = ref(storage, post.user.profileImgUrl);
  const url = await getDownloadURL(imgRef);
  post.user.profileImgUrl = url;

  if (post.postImgs.length > 0) {
    imgsPromises = post.postImgs.map(async (postImg) => {
      const imgRef = ref(storage, postImg.postImgUrl);
      const url = await getDownloadURL(imgRef);
      postImg.postImgUrl = url;
      return postImg;
    });
  }

  if (post.comments.length > 0) {
    imgsCommentsPromise = post.comments.map(async (comment) => {
      const imgRef = ref(storage, comment.user.profileImgUrl);
      const url = await getDownloadURL(imgRef);
      comment.user.profileImgUrl = url;
      return comment;
    });
  }

  const arrayPromises = [imgsCommentsPromise, imgsPromises];
  await Promise.all(...arrayPromises);

  return res.status(200).json({
    status: 'success',
    post,
  });
});

const createPost = catchAsync(async (req, res, next) => {
  const { title, content } = req.body;
  const { id } = req.sessionUser;

  const post = await Post.create({
    title,
    content,
    userId: id,
  });

  const postImgs = req.files;

  const imgsPromises = postImgs.map(async (file) => {
    const imgRef = ref(storage, `posts/,${Date.now()}`);
    const imgUploaded = await uploadBytes(imgRef, file.buffer);
    return await PostImg.create({
      postId: post.id,
      postImgUrl: imgUploaded.metadata.fullPath,
    });
  });

  await Promise.all(imgsPromises);

  return res.status(201).json({
    status: 'success',
    message: 'the post has been created!',
    post,
  });
});

const updatePost = catchAsync(async (req, res, next) => {
  const { title, content } = req.body;
  const { post } = req;

  await post.update({
    title,
    content,
  });
  return res.status(200).json({
    status: 'success',
    message: 'the post has been updated',
  });
});

const deletePost = catchAsync(async (req, res, next) => {
  const { post } = req;
  await post.update({
    status: postStatus.disabled,
  });
  return res.status(200).json({
    status: 'success',
    message: 'the post has been deleted',
  });
});

module.exports = {
  findAllPosts,
  deletePost,
  createPost,
  updatePost,
  getOnePost,
  findMyPosts,
  findUserPosts,
};

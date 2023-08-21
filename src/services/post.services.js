const { ref, getDownloadURL } = require('firebase/storage');
const PostImg = require('../models/postImg');
const { Post, postStatus } = require('../models/post.model');
const User = require('../models/users.models');
const AppError = require('../helpers/appErros');
const { storage } = require('../helpers/firabase');

class PostService {
  async findPost() {
    try {
      const post = await Post.findOne({
        where: {
          id,
          status: postStatus.active,
        },
        attributes: {
          exclude: ['userId', 'status'],
        },
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'profileImgUrl', 'description'],
          },
          {
            model: PostImg,
          },
        ],
      });

      if (!post) {
        throw new AppError(`post with id: ${id} not found`, 404);
      }

      return post;
    } catch (error) {
      throw new Error(error);
    }
  }

  async downloadImgPost(post) {
    try {
      const imgRefUserProfile = ref(storage, post.user.profileImgUrl);
      const UrlProfileUser = await getDownloadURL(imgRefUserProfile);
      post.user.profileImgUrl = UrlProfileUser;

      const postImgsPromises = post.postImgs.map(async (postImg) => {
        const imgRef = ref(storage, postImg.postImgUrl);
        const url = await getDownloadURL(imgRef);
        postImg.postImgUrl = url;

        return postImg;
      });

      await Promise.all(postImgsPromises);

      return post;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = PostService;

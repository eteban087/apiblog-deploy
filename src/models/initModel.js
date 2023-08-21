const Comment = require('./comment.model');
const { Post } = require('../models/post.model');
const User = require('./users.models');
const PostImg = require('./postImg');

const initModel = () => {
  User.hasMany(Post, { foreignKey: 'userId' });
  Post.belongsTo(User, { foreignKey: 'userId' });

  Post.hasMany(Comment, { foreignKey: 'postId' });
  Comment.belongsTo(Post, { foreignKey: 'postId' });

  User.hasMany(Comment, { foreignKey: 'userId' }),
    Comment.belongsTo(User, { foreignKey: 'userId' });

  Post.hasMany(PostImg);
  PostImg.belongsTo(Post);
};

module.exports = {
  initModel,
};

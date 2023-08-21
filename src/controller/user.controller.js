const catchAsync = require('../helpers/catchAsync');
const { storage } = require('../helpers/firabase');
const User = require('../models/users.models');
const { getDownloadURL, ref } = require('firebase/storage');

const findUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    where: {
      status: 'active',
    },
  });

  const usersPromise = users.map(async (user) => {
    const imgRef = ref(storage, user.profileImgUrl);
    const url = await getDownloadURL(imgRef);
    user.profileImgUrl = url;
    return user;
  });

  const userResolved = await Promise.all(usersPromise);

  return res.status(200).json({
    status: 'success',
    users: userResolved,
  });
});

const findOneUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const imgRef = ref(storage, user.profileImgUrl);
  const url = await getDownloadURL(imgRef);

  return res.status(200).json({
    status: 'success',
    user: {
      name: user.name,
      email: user.email,
      description: user.description,
      profileImgUrl: url,
      role: user.role,
    },
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name, description } = req.body;

  user.update({
    name,
    description,
  });

  return res.status(200).json({
    status: 'success',
    messge: 'User update successfully',
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  user.update({ status: 'inactive' });

  return res.status(200).json({
    status: 'success',
    message: 'user deleted successfully!',
  });
});

module.exports = {
  findUsers,
  findOneUser,
  updateUser,
  deleteUser,
};

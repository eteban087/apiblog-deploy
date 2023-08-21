const express = require('express');

const router = express();

const { validUser } = require('../middlewares/user.middleware');

const { protect, restrictTo } = require('../middlewares/auth.middlewares');

const {
  updateUserValidation,
} = require('../middlewares/validations.middlewares');
const {
  findUsers,
  deleteUser,
  findOneUser,
  updateUser,
} = require('../controller/user.controller');

router.use(protect);
router.route('/').get(findUsers);
// router.use(restrictTo('admin', 'user'));

router
  .use('/:id', validUser)
  .route('/:id')
  .get(findOneUser)
  .patch(updateUserValidation, updateUser)
  .delete(deleteUser);

module.exports = router;

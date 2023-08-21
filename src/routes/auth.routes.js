const express = require('express');
const { upload } = require('../helpers/multer');
const router = express();
const {
  createUserValidation,
  loginUserValidation,
  updatePasswordValidation,
} = require('../middlewares/validations.middlewares');

const {
  protect,
  protectAccountOwner,
} = require('../middlewares/auth.middlewares');

const {
  signUp,
  signIn,
  updatePassword,
} = require('../controller/auth.controller');

const { validUser } = require('../middlewares/user.middleware');

router.post(
  '/signup',
  upload.single('profileImgUrl'), //al utilizar el upload de multer me va a pemitir tener acceso al req.files
  createUserValidation,
  signUp
);
router.post('/signin', loginUserValidation, signIn);

router.use(protect);

router.patch(
  '/password/:id',
  updatePasswordValidation,
  validUser,
  protectAccountOwner,
  updatePassword
);

module.exports = router;

const AppError = require('../helpers/appErros');
const catchAsync = require('../helpers/catchAsync');
const generateJWT = require('../helpers/jsonwebtoken');
const User = require('../models/users.models');
const bcrypt = require('bcryptjs');

const { storage } = require('../helpers/firabase');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

const signUp = catchAsync(async (req, res, next) => {
  const { name, email, password, description } = req.body;

  if (!req.file) {
    return next(new AppError('please upload a file', 404));
  }

  const imgRef = ref(storage, `users/${Date.now()}-${req.file.originalname}`);
  const imgUpload = await uploadBytes(imgRef, req.file.buffer);

  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: name.toLowerCase().trim(),
    email: email.toLowerCase().trim(),
    password: encryptedPassword,
    description,
    profileImgUrl: imgUpload.metadata.fullPath,
  });

  const tokenPromise = generateJWT(user.id);

  const imgRefToDownload = ref(storage, user.profileImgUrl);
  const urlPromise = getDownloadURL(imgRefToDownload);

  const [token, url] = await Promise.all([tokenPromise, urlPromise]);

  return res.status(200).json({
    status: 'success',
    message: 'The user has been created',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      description: user.description,
      profile_img_url: url,
    },
  });
});

const signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    where: {
      email: email.toLowerCase().trim(),
      status: 'active',
    },
  });

  if (!user) {
    return next(new AppError(`user with email:${email} not found`, 404));
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const tokenPromise = generateJWT(user.id);

  const imgRef = ref(storage, user.profileImgUrl);
  const urlPromise = getDownloadURL(imgRef);

  const [token, url] = await Promise.all([tokenPromise, urlPromise]);

  return res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      description: user.description,
      profile_img_url: url,
    },
  });
});

const updatePassword = catchAsync(async (req, res, next) => {
  //1. traerme el usuario que viene de la req, del midleware
  const { user } = req;

  //2. traerme los datos de la req.body
  const { currentPassword, newPassword } = req.body;

  //3. validar si la contraseña actual y nueva son iguales enviar un error
  if (currentPassword === newPassword) {
    return next(new AppError('The password cannot be equals', 400));
  }

  //4. validar si la contraseña actual es igual a la contraseña en bd
  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return next(new AppError('Incorrect password', 401));
  }

  //5. encriptar la nueva contraseña
  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(newPassword, salt);

  //6. actualizar el usuario que viene de la req
  await user.update({
    password: encryptedPassword,
    passwordChangeAt: new Date(),
  });

  //7. enviar el mensaje al cliente
  return res.status(200).json({
    status: 'success',
    message: 'The user password was updated successfully',
  });
});

module.exports = {
  signUp,
  signIn,
  updatePassword,
};

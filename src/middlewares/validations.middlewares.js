const { body, validationResult } = require('express-validator');

const validFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'Error',
      errors: errors.array(),
    });
  }

  next();
};

const updateUserValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description')
    .notEmpty()
    .withMessage('description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),
  validFields,
];

const createUserValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a correct format'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must have a least 8 characters')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must have contain a least one letter'),
  body('description').notEmpty().withMessage('Description is required'),
  validFields,
];

const loginUserValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a correct format'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must have a least 8 characters')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must have contain a least one letter'),
  validFields,
];

const updatePasswordValidation = [
  body('currentPassword')
    .isLength({ min: 8 })
    .withMessage('Password must have a least 8 characters')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must have contain a least one letter'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must have a least 8 characters')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must have contain a least one letter'),
  validFields,
];

const createPostValidation = [
  body('title').notEmpty().withMessage('title is required'),
  body('content').notEmpty().withMessage('content is required'),
  validFields,
];

const createCommentValidation = [
  body('text').notEmpty().withMessage('text is required'),
  validFields,
];

const updateCommentValidation = [
  body('text').notEmpty().withMessage('text is required'),
  validFields,
];

module.exports = {
  updateUserValidation,
  createUserValidation,
  loginUserValidation,
  updatePasswordValidation,
  createPostValidation,
  createCommentValidation,
  updateCommentValidation,
};

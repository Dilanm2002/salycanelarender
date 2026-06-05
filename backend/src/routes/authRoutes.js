const router = require('express').Router();
const { register, login } = require('../controllers/authController');
const { body } = require('express-validator');

const validarRegister = [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('username').trim().isLength({ min: 3 }).withMessage('Usuario mínimo 3 caracteres'),
  body('password').isLength({ min: 6 }).withMessage('Contraseña mínimo 6 caracteres')
];

const validarLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

router.post('/register', validarRegister, register);
router.post('/login', validarLogin, login);

module.exports = router;

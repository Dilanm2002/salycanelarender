const router = require('express').Router();
const { getAll, getById, create, update, remove } = require('../controllers/productoController');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const { body } = require('express-validator');

const validarProducto = [
  body('nombre').trim().notEmpty().withMessage('Nombre requerido'),
  body('precio').isFloat({ min: 0.01 }).withMessage('Precio inválido'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock inválido')
];

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', verifyToken, requireAdmin, validarProducto, create);
router.put('/:id', verifyToken, requireAdmin, update);
router.delete('/:id', verifyToken, requireAdmin, remove);

module.exports = router;

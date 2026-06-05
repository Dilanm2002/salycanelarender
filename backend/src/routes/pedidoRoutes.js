const router = require('express').Router();
const { crear, misPedidos, todos, actualizarEstado } = require('../controllers/pedidoController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

router.post('/', verifyToken, crear);
router.get('/mis-pedidos', verifyToken, misPedidos);
router.get('/', verifyToken, requireAdmin, todos);
router.patch('/:id/estado', verifyToken, requireAdmin, actualizarEstado);

module.exports = router;

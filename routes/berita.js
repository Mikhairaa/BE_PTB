const express = require('express')
const router = express.Router()
const beritaController = require('../controllers/beritaControllers.js')
const authMiddleware = require('../middleware/authMiddleware')
const upload = require('../middleware/upload');

router.get('/all',authMiddleware.verifyToken,beritaController.getAllBerita)
router.get('/onProgress',authMiddleware.verifyToken,beritaController.getOnProgressBerita)
router.get('/rejected',authMiddleware.verifyToken,beritaController.getRejectedBerita)
router.get('/done',authMiddleware.verifyToken,beritaController.getSelesaiBerita)
router.post('/upload', authMiddleware.verifyToken, upload.single('bukti'), beritaController.createOrUpdateBerita);
router.post('/draft',authMiddleware.verifyToken,beritaController.saveBerita)
router.get('/draft/:id_berita',authMiddleware.verifyToken,beritaController.getSaveBerita)
router.delete('/delete/:id_berita',authMiddleware.verifyToken,beritaController.deleteDraft)
router.get('/detail/:id_berita',authMiddleware.verifyToken,beritaController.getDetailBerita)
router.post('/accepted/:id_berita',authMiddleware.verifyToken,beritaController.beritaDiterima)
router.post('/markAsRead/:id_notifikasi',authMiddleware.verifyToken,beritaController.markAsRead)

module.exports = router;
const express = require('express')
const router = express.Router()
const userController = require('../controllers/users.js')
const authMiddleware = require('../middleware/authMiddleware');

router.post('/',userController.createNewUsers)
router.get('/login', userController.login)
router.post('/login',userController.login)
router.get('/homepage',authMiddleware.verifyToken,userController.getUsersData)
router.get('/profile',authMiddleware.verifyToken,userController.lihatProfil)
router.post('/uploadFotoProfil',authMiddleware.verifyToken,userController.uploadFotoProfil)
router.patch('/updateProfil/:id',authMiddleware.verifyToken,userController.updateProfil)
router.post('/changePassword',authMiddleware.verifyToken,userController.changePassword)
router.post('/logout',userController.logout)

module.exports = router;
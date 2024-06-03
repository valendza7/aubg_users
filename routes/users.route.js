var express = require('express');
var router = express.Router();

const uploadImage  = require("../helper/file.upload")

const auth = require("../middleware/authMiddleware"),
    controller = require("../controllers/users.controller")

router.get('/', auth, controller.read);
router.get('/:user_id', auth, controller.validate("getone"), controller.get);
router.post('/', auth, controller.validate("create"), controller.create);
router.patch('/:user_id', auth, controller.validate("update"), controller.update);
router.delete('/:user_id', auth, controller.validate("delete"), controller.delete);
router.post('/uploadprofile',  uploadImage.single("image"), controller.uploadprofile)

module.exports = router;

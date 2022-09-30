/*
|----------------------------------------------------------------------------------------------------------------
|   Admin Routes File
|----------------------------------------------------------------------------------------------------------------
*/

const express = require('express');
const router = express.Router();
const requireAuthentication = require('../passport').authenticateUser;
const authenticateUserNonRequired = require('../passport').authenticateUserNonRequired;
/*
|----------------------------------------------------------------------------------------------------------------
|   Calling Controllers 
|----------------------------------------------------------------------------------------------------------------
*/

const websiteController = require('../controllers/website/indexController');




router.get('/', websiteController.index);
router.post('/contactadd', websiteController.addUpdate);
router.get('/datashow', websiteController.datashow);


module.exports = router;
const router = require('express').Router()
const UserApi = require('../controllers/myapi/user')
const web = require('../controllers/website/indexController')


router.post('/user/add',UserApi.addUser)
router.post('/user/add',UserApi.addUser)


module.exports = router
/*
|----------------------------------------------------------------------------------------------------------------
|   Admin Routes File
|----------------------------------------------------------------------------------------------------------------
*/

    const express = require('express');
    const router = express.Router();

/*
|----------------------------------------------------------------------------------------------------------------
|   Calling Controllers 
|----------------------------------------------------------------------------------------------------------------
*/

    const adminAuthController = require(`../controllers/reviewAdmin/adminAuthController`);
    const adminController = require(`../controllers/reviewAdmin/adminController`);
    const restaurantController = require(`../controllers/reviewAdmin/restaurantController`);
    const restaurantTypeController = require(`../controllers/reviewAdmin/restaurantTypeController`);
    const foodTypeController = require(`../controllers/reviewAdmin/foodTypeController`);
    const settingController = require('../controllers/reviewAdmin/settingController');
    
/*
|----------------------------------------------------------------------------------------------------------------
|   Admin Auth Routes
|----------------------------------------------------------------------------------------------------------------
*/
    router.get('/', adminAuthController.loginPage);
    router.get('/login', adminAuthController.loginPage);
    router.post('/loginSubmit', adminAuthController.loginSubmit);
    router.get('/logout', adminAuthController.logout);

/*
|----------------------------------------------------------------------------------------------------------------
|   Admin Related Routes
|----------------------------------------------------------------------------------------------------------------
*/
    router.get('/dashboard', adminController.dashboard);
    // router.get('/dashboardCounts', adminController.dashboardCounts);
    router.put('/updateStatus', adminController.updateStatus);
    router.delete('/delete', adminController.delete);
    router.put('/changeField', adminController.changeField);

/*
|----------------------------------------------------------------------------------------------------------------
|   Restaurant Type Routes
|----------------------------------------------------------------------------------------------------------------
*/
    router.get('/restaurantType', restaurantTypeController.listing);
    router.get('/restaurantType/listing', restaurantTypeController.listing);
    router.get('/restaurantType/add', restaurantTypeController.add);
    router.get('/restaurantType/edit/:id', restaurantTypeController.edit);
    router.get('/restaurantType/view/:id', restaurantTypeController.view);
    router.post('/restaurantType/addUpdate', restaurantTypeController.addUpdate);
    

/*
|----------------------------------------------------------------------------------------------------------------
|   Food Type Routes
|----------------------------------------------------------------------------------------------------------------
*/
    router.get('/foodType', foodTypeController.listing);
    router.get('/foodType/listing', foodTypeController.listing);
    router.get('/foodType/add', foodTypeController.add);
    router.get('/foodType/edit/:id', foodTypeController.edit);
    router.get('/foodType/view/:id', foodTypeController.view);
    router.post('/foodType/addUpdate', foodTypeController.addUpdate);
    

/*
|----------------------------------------------------------------------------------------------------------------
|   Restaurant Routes
|----------------------------------------------------------------------------------------------------------------
*/
    router.get('/restaurant', restaurantController.listing);
    router.get('/restaurant/listing', restaurantController.listing);
    router.get('/restaurant/add', restaurantController.add);
    router.get('/restaurant/edit/:id', restaurantController.edit);
    router.get('/restaurant/view/:id', restaurantController.view);
    router.post('/restaurant/addUpdate', restaurantController.addUpdate);
    
/*
|----------------------------------------------------------------------------------------------------------------
|   Setting Routes
|----------------------------------------------------------------------------------------------------------------
*/
    router.get('/setting', settingController.setting);
    router.put('/setting/updateSettings', settingController.updateSettings);
    
/*
|----------------------------------------------------------------------------------------------------------------
|   Export Routes
|----------------------------------------------------------------------------------------------------------------
*/
    
module.exports = router;

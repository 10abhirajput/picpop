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
const api = require('../controllers/api/apicontroller');
//const authController = require('../controllers/api/authController');
// const userController = require('../controllers/api/userController');


/* |----------------------------------------------------------------------------------------------------------------
|   Auth Routes
|----------------------------------------------------------------------------------------------------------------
  */
/////user Apis
router.post('/file_upload',api.file_upload);
router.post('/forgot_password', api.forgot_password);

router.post('/user_signup', api.user_signup);
router.post('/user_login', api.user_login);
router.get('/profile', requireAuthentication, api.profile);
router.post('/edit_profile', requireAuthentication, api.edit_profile);
router.get('/user_term', api.user_term);
router.get('/user_privacy', api.user_privacy);
router.get('/user_about_us', api.user_about_us);
router.post('/logout', requireAuthentication, api.logout);
router.put('/change_password', requireAuthentication, api.change_password);
router.post('/add_remove_fav', requireAuthentication, api.add_remove_fav);
router.get('/favourites_list', requireAuthentication, api.favourites_list);
router.post('/social_login', api.social_login);
router.get('/get_category_list', api.get_category_list)
router.post('/category_details', api.category_details)
router.post('/home', requireAuthentication, api.home);
router.post('/addCard', requireAuthentication, api.addCard);
router.get('/getCardList', requireAuthentication, api.getCardList);
router.delete('/delete_profile', requireAuthentication, api.delete_profile);


// ------------------------------deeplinking-----------------------------------------------
router.get('/deeplinking/', api.deeplinking);
router.get('/share/:userId', api.share);








router.post('/homeapi', requireAuthentication, api.homeapi);

router.get('/location_details', requireAuthentication, api.location_details);
router.get('/location_list', requireAuthentication, api.location_list);

router.post('/add_review', requireAuthentication, api.add_review);
router.get('/notification_list', requireAuthentication, api.notification_list);
router.post('/notification_on_off', requireAuthentication, api.notification_on_off);
router.get('/notification_on_off_status', requireAuthentication, api.notification_on_off_status);
router.post('/booking', requireAuthentication, api.booking);
router.post('/my_booking', requireAuthentication, api.my_booking);
// router.get('/jobRequests', requireAuthentication, api.jobRequests);
router.post('/jobRequestDetail', requireAuthentication, api.jobRequestDetail);
router.post('/jobReqAcceptOrReject', requireAuthentication, api.jobReqAcceptOrReject);
router.post('/myServicesOrLocations', requireAuthentication, api.myServicesOrLocations);
router.post('/myServiceOrLocationDetail', requireAuthentication, api.myServiceOrLocationDetail);
router.post('/serviceOrLocationDelete', requireAuthentication, api.serviceOrLocationDelete);





// router.get('/home_categories', api.home_categories);
router.get('/forgot_url/:hash', api.forgotUrl);
router.post('/reset_password', api.resetPassword);
// router.get('/all_categories', api.all_categories);
// router.post('/get_by_category', authenticateUserNonRequired, api.get_by_category);
router.post('/all_reviews', api.all_reviews);
// router.post('/all_reviews', requireAuthentication, api.all_reviews);
// router.post('/cafe_details', api.cafe_details);
router.post('/bookings_chat_details',requireAuthentication,api.bookings_chat_details);


////////////Location Owners Apis//////////

router.post('/add_location_profile',requireAuthentication, api.add_location_profile);
router.post('/edit_location_profile', requireAuthentication, api.edit_location_profile);




////////////Business Professional api///////////////

router.post('/add_business_profile',requireAuthentication, api.add_business_profile);
router.post('/edit_business_prof', requireAuthentication, api.edit_business_prof);

router.post('/delete_image', requireAuthentication, api.delete_image);
router.post('/verify_otp', requireAuthentication, api.verify_otp);
router.post('/resend_otp', api.resend_otp);
//////guest user//////////

router.post('/guest_login', api.guest_login);







/*
|----------------------------------------------------------------------------------------------------------------
|   Exporting Module
|----------------------------------------------------------------------------------------------------------------
*/
module.exports = router;
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

    const adminAuthController = require('../controllers/admin/adminAuthController');
    const adminController = require('../controllers/admin/adminController');
    const userController = require('../controllers/admin/userController');
    const categoryController = require('../controllers/admin/categoryController');
    const featurePlanController = require('../controllers/admin/featurePlanController');
    const productController = require('../controllers/admin/productController');
    const pageController = require('../controllers/admin/pageController');
    const orderController = require('../controllers/admin/orderController');
    const reportController = require('../controllers/admin/reportController');
    const contact_usController = require('../controllers/admin/contact_usController');
    const reviewController = require('../controllers/admin/reviewController');
    const settingController = require('../controllers/admin/settingController');
    const bookingController = require('../controllers/admin/bookingController');
    const transactionController = require('../controllers/admin/transactionController');

    const bannerController = require('../controllers/admin/bannerController');
    // const websiteController = require('../controllers/admin/websiteController');


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
|   User Routes
|----------------------------------------------------------------------------------------------------------------
*/
    router.get('/user', userController.listing);
    router.get('/user/listing', userController.listing);
    router.get('/user/add', userController.add);
    router.get('/user/edit/:id', userController.edit);
    router.get('/user/view/:id', userController.view);
    router.get('/user/datatable', userController.datatable);
    router.post('/user/addUpdateUser', userController.addUpdateUser);
    // router.post('/searchUsersListing', userController.searchUsersListing);



    
/*
|----------------------------------------------------------------------------------------------------------------
|   Category Routes
|----------------------------------------------------------------------------------------------------------------
*/
    router.get('/category', categoryController.listing);
    router.get('/category/listing', categoryController.listing);
    router.get('/category/add', categoryController.add);
    router.get('/category/edit/:id', categoryController.edit);
    router.get('/category/view/:id', categoryController.view);
    router.post('/category/addUpdate', categoryController.addUpdate);
    router.post('/category/categoryBasedChildCategories', categoryController.categoryBasedChildCategories);
    

/*
|----------------------------------------------------------------------------------------------------------------
|   Feature Plan Routes
|----------------------------------------------------------------------------------------------------------------
*/
    router.get('/featurePlan', featurePlanController.listing);
    router.get('/featurePlan/listing', featurePlanController.listing);
    router.get('/featurePlan/add', featurePlanController.add);
    router.get('/featurePlan/edit/:id', featurePlanController.edit);
    router.get('/featurePlan/view/:id', featurePlanController.view);
    router.post('/featurePlan/addUpdate', featurePlanController.addUpdate);
    // router.post('/category/categoryBasedChildCategories', featurePlanController.categoryBasedChildCategories);


/*
|----------------------------------------------------------------------------------------------------------------
|   Product Routes
|----------------------------------------------------------------------------------------------------------------
*/
    router.get('/product', productController.listing);
    router.get('/product/listing', productController.listing);
    router.get('/product/add', productController.add);
    router.get('/product/edit/:id', productController.edit);
    router.get('/product/view/:id', productController.view);
    router.post('/product/addUpdateProduct', productController.addUpdateProduct);
    router.post('/product/productCategorySelect', productController.productCategorySelect);
  
/*
|----------------------------------------------------------------------------------------------------------------
|   Order Routes
|----------------------------------------------------------------------------------------------------------------
*/
    router.get('/order', orderController.customerOrders);
    router.get('/order/view/:id', orderController.view);
    router.get('/order/customerOrders', orderController.customerOrders);
    router.get('/order/sellerOrders', orderController.sellerOrders);
    router.get('/order/cancellationRequests', orderController.cancellationRequests);
    router.get('/order/withdrawalRequests', orderController.withdrawalRequests);
    router.get('/order/refundRequests', orderController.refundRequests);
    router.get('/order/customerOrderDataTable', orderController.customerOrderDataTable);
    router.get('/order/sellerOrderDataTable', orderController.sellerOrderDataTable);
    router.get('/order/cancellationRequestsDataTable', orderController.cancellationRequestsDataTable);
    // router.get('/order/withdrawalRequestsDataTable', orderController.withdrawalRequestsDataTable);
    // router.get('/order/refundRequestsDataTable', orderController.refundRequestsDataTable);


    /*
|----------------------------------------------------------------------------------------------------
|  Banner Routes
|----------------------------------------------------------------------------------------------------
*/
router.get('/banner/listing', bannerController.listing);
router.get('/banner/add', bannerController.add);
router.get('/banner/edit/:id', bannerController.edit);
router.get('/banner/view/:id', bannerController.view);
router.post('/banner/addUpdate', bannerController.addUpdate);
    
/*
|----------------------------------------------------------------------------------------------------------------
|   Report Routes
|----------------------------------------------------------------------------------------------------------------
*/
    router.get('/report', reportController.featurePlanIncomeReport);
    router.get('/report/salesReport', reportController.featurePlanIncomeReport);
    router.get('/report/salesReport', reportController.salesReport);
    router.get('/report/userReport', reportController.userReport);
    router.get('/report/sellerReport', reportController.sellerReport);
    router.get('/report/taxReport', reportController.taxReport);
    router.get('/report/commissionReport', reportController.commissionReport);
    router.get('/report/revenueReport', reportController.revenueReport);
    router.get('/report/salesReportDataTable', reportController.salesReportDataTable);
    router.get('/report/userReportDataTable', reportController.userReportDataTable);
    router.get('/report/sellerReportDataTable', reportController.sellerReportDataTable);
    router.get('/report/taxReportDataTable', reportController.taxReportDataTable);
    router.get('/report/commissionReportDataTable', reportController.commissionReportDataTable);
    

      
/*
|----------------------------------------------------------------------------------------------------------------
|   Review Routes
|----------------------------------------------------------------------------------------------------------------
*/
    router.get('/review', reviewController.listing);


    
    router.get('/contact_us', contact_usController.listing);
    // router.get('/website', websiteController.index);
// router.post('/banner/addUpdate', bannerController.addUpdate);

/*
|----------------------------------------------------------------------------------------------------------------
|   Setting Routes
|----------------------------------------------------------------------------------------------------------------
*/
    router.get('/setting', settingController.setting);
    router.put('/setting/updateSettings', settingController.updateSettings);
    router.put('/setting/updateSiteComission', settingController.updateSiteComission);
/*
|----------------------------------------------------------------------------------------------------------------
|   Page Routes
|----------------------------------------------------------------------------------------------------------------
*/
    // router.get('/share', pageController.share);
    router.get('/page/aboutUs', pageController.getPage('aboutUs'));
    router.get('/page/termsAndConditions', pageController.getPage('termsAndConditions'));
    router.get('/page/privacyPolicy', pageController.getPage('privacyPolicy'));
    router.put('/page/updatePage', pageController.updatePage);


/*
|----------------------------------------------------------------------------------------------------------------
|   Booking Routes
|----------------------------------------------------------------------------------------------------------------
*/
    router.get('/booking/listing',bookingController.listing)
    router.get('/bookings/view/:id',bookingController.view)
    router.get('/booking/approved',bookingController.approvel)
    router.get('/booking/pending',bookingController.pending)


    /*
|----------------------------------------------------------------------------------------------------------------
|   trangaction Routes
|----------------------------------------------------------------------------------------------------------------
*/
router.put('/changeField', adminController.changeField);

router.get('/transaction/listing',transactionController.listing)
// router.get('/bookings/view/:id',bookingController.view)
// router.get('/booking/approved',bookingController.approvel)
// router.get('/booking/pending',bookingController.pending)
/*
|----------------------------------------------------------------------------------------------------------------
|   Exporting Module
|----------------------------------------------------------------------------------------------------------------
*/


    module.exports = router;

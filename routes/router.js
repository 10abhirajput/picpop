/*
|----------------------------------------------------------------------------------------------------------------
|   Router File
|----------------------------------------------------------------------------------------------------------------
|   All routers called in this file.
|
*/
    const adminRouter = require('./admin.routes');
    const sellerAdminRouter = require('./sellerAdmin.routes');
    const reviewAdminRouter = require('./reviewAdmin.routes');
    const apiRouter = require('./api.routes');
    const webRouter = require('./website.routes');

/*
|----------------------------------------------------------------------------------------------------------------
|   Middlewares
|----------------------------------------------------------------------------------------------------------------
*/
    const adminAuthentication = require('../middlewares/adminAuthentication');
    const sellerAdminAuthentication = require('../middlewares/sellerAdminAuthentication');
    const reviewAdminAuthentication = require('../middlewares/reviewAdminAuthentication');

/*
|----------------------------------------------------------------------------------------------------------------
|   Route Files called with middlewares
|----------------------------------------------------------------------------------------------------------------
*/
module.exports = (app) => {
    const swaggerUi = require('swagger-ui-express');
    const swaggerApiDocument = require('../swagger.json')

    app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerApiDocument));

    app.use('/admin/', adminAuthentication, adminRouter);
    // app.use('/sellerAdmin/', sellerAdminAuthentication, sellerAdminRouter);
    // app.use('/reviewAdmin/', reviewAdminAuthentication, reviewAdminRouter);
    app.use('/api/', apiRouter);
    app.use('/', webRouter);
    
    app.use('/portal', async (req, res) => {
        res.render('portal/');
    });
}
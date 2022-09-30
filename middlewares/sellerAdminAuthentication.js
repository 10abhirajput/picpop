const sequelize = require('sequelize');
const { Op } = sequelize;
const models = require('../models');
const helper = require('../helpers/helper');

const User = models.user;
const AdminDetail = models.adminDetail;

module.exports = async (req, res, next) => {
    const ignoreRoutes = [
        '/',
        '/login',
        '/loginSubmit'
    ];

    if (ignoreRoutes.includes(req.url)) return next();

    // if (![3].includes(req.session.admin.role)) {
    //     req.session.authenticated = false;
    // }

    if (![3].includes(req.session.authenticated && req.session.admin.role)) {
        req.session.authenticated = false;
    }
    
    
    if (req.session.authenticated == true) {
        const admin = await User.findOne({
            where: {
                id: req.session.admin.id,
                role: {
                    [Op.in]: [3]
                },
            },
            include: [
                {
                    model: AdminDetail,
                    attributes: {
                        include: [
                            [sequelize.literal(`(IF (adminDetail.image='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', adminDetail.image)) )`), 'image']
                        ]
                    }
                },
                {
                    model: models['vendorDetail'],
                    attributes: {
                        include: [
                            [sequelize.literal(`(IF (vendorDetail.image='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', vendorDetail.image)) )`), 'image'],
                            [sequelize.literal(`(IF (vendorDetail.shopLogo='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', vendorDetail.shopLogo)) )`), 'shopLogo']
                        ]
                    }
                }
            ],
            raw: true,
            nest: true
        });
        req.session.admin = admin;
        global.adminData = admin;
        console.log(global.adminData, '===========>adminData');

        return next();
    } else {
        req.flash('flashMessage', { color: 'error', message: 'Please login first.' });
        const originalUrl = req.originalUrl.split('/')[1];
        return res.redirect(`/${originalUrl}`);
    }
}
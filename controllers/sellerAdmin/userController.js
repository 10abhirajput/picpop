const models = require('../../models');
const helper = require('../../helpers/helper');
const Paginator = require("paginator");
const sequelize = require("sequelize");
const { request } = require('express');
const { Op } = sequelize;
// const User = models.user;
// const UserDetail = models.userDetail;
// const DriverDetail = models.driverDetail;

const model = "user";
global.modelTitle = "User";
global.modelDataTable = "userDataTable";

const roleTypes = {
    0: 'Admin',
    1: 'User',
    2: 'Driver',
    3: 'Vendor'
}
const userRoleModels = {
    0: 'adminDetail',
    1: 'userDetail',
    2: 'driverDetail',
    3: 'vendorDetail',
}

module.exports = {
    manageShop: async (req, res) => {
        try {
            global.currentModule = 'Manage Shop';
            global.currentSubModule = 'Shop Detail';
            global.currentSubModuleSidebar = 'manageShop';

            return res.render('sellerAdmin/manageShop');
        } catch (err) {
            return helper.error(res, err);
        }
    },
    taxCategory: async (req, res) => {
        try {
            global.currentModule = 'Tax Category';
            global.currentSubModule = '';
            global.currentSubModuleSidebar = 'taxCategory';

            return res.render('sellerAdmin/taxCategory');
        } catch (err) {
            return helper.error(res, err);
        }
    },
    updateUser: async (req, res) => {
        try {
            const required = {
                id: adminData.id,
            };
            const nonRequired = {
                name: req.body.name,
                email: req.body.email,
                // role: req.body.role,
                password: req.body.password,
                image: req.files && req.files.image,
                phone: req.body.phone,
                shopName: req.body.shopName,
                city: req.body.city,
                state: req.body.state,
                country: req.body.country,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                geoLocation: req.body.geoLocation,
                shopAddress: req.body.shopAddress,
                shopDescription: req.body.shopDescription,
                paymentPolicy: req.body.paymentPolicy,
                deliveryPolicy: req.body.deliveryPolicy,
                sellerInformation: req.body.sellerInformation,
                taxInPercent: req.body.taxInPercent,
                taxValue: req.body.taxValue,
                bankName: req.body.bankName,
                accountHolderName: req.body.accountHolderName,
                accountNumber: req.body.accountNumber,
                ifscSwiftCode: req.body.ifscSwiftCode,
                bankAddress: req.body.bankAddress,
                shopLogo: req.body.shopLogo,
                // countryCode: req.body.countryCode,
                // phone: req.body.phone,
                redirectUrl: req.body.redirectUrl,
            };

            let requestData = await helper.vaildObject(required, nonRequired);

            // requestData.countryCodePhone = `${requestData.countryCode}${requestData.phone}`;

            if (requestData.hasOwnProperty('password') && requestData.password) {
                requestData.password = helper.bcryptHash(requestData.password);
            }

            // const imageFolders = {
            //     0: 'admin',
            //     1: 'user',
            //     2: 'user',
            //     3: 'user',
            // }

            if (req.files && req.files.image) {
                requestData.image = helper.imageUpload(req.files.image, 'user');
            }

            if (req.files && req.files.shopLogo) {
                requestData.shopLogo = helper.imageUpload(req.files.shopLogo, 'user');
            }

            const userId = await helper.save(models[model], requestData);
            const user = await module.exports.findOneUser(userId);
            console.log(user, '=================================================>user');

            user[userRoleModels[user.role]].id ? requestData.id = user[userRoleModels[user.role]].id : delete requestData.id;
            requestData.userId = user.id;

            await helper.save(models[userRoleModels[user.role]], requestData);

            // let message = `${roleTypes[user.role]} ${requestData.hasOwnProperty('id') ? `${req.session.admin.id == user.id ? 'Profile ' : ''}Updated` : 'Added'} Successfully.`;

            const messageModule = {
                '/sellerAdmin/manageShop': 'Shop Detail',
                '/sellerAdmin/taxCategory': 'Tax Category',
                '/sellerAdmin/setting': 'Setting',
            };

            let message = `${messageModule[requestData.redirectUrl]} Updated Successfully.`;

            req.flash('flashMessage', { color: 'success', message });

            if (messageModule[requestData.redirectUrl] == 'Setting') {
                return helper.success(res, message, user);
            }

            res.redirect(requestData.redirectUrl);

            // return helper.success(res, message, user);    
        } catch (err) {
            err.code = 200;
            return helper.error(res, err);
        }
    },
    findOneUser: async (id) => {
        return await models[model].findOne({
            where: {
                id
            },
            include: [
                {

                    model: models['adminDetail'],
                    attributes: {
                        include: [
                            [sequelize.literal(`(IF (adminDetail.image='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', adminDetail.image)) )`), 'image']
                        ]
                    }
                },
                {

                    model: models['userDetail'],
                    attributes: {
                        include: [
                            [sequelize.literal(`(IF (userDetail.image='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', userDetail.image)) )`), 'image']
                        ]
                    }
                },
                {
                    model: models['driverDetail'],
                    attributes: {
                        include: [
                            [sequelize.literal(`(IF (driverDetail.image='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', driverDetail.image)) )`), 'image']
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
                },
            ],
            raw: true,
            nest: true,
        });
    },

    changePasswordSetting: async (req, res) => {
        try {
            const required = {
                id: adminData.id,
                currentPassword: req.body.currentPassword,
                newPassword: req.body.newPassword,
                confirmNewPassword: req.body.confirmNewPassword,
            };
            const nonRequired = {};

            if (required.newPassword != required.confirmNewPassword) throw "New Password and Confirm Password did not match.";

            let requestData = await helper.vaildObject(required, nonRequired);

            let getUser = await models[model].findOne({
                where: {
                    id: adminData.id,
                },
                raw: true,
            });
            console.log(getUser, '======================>getUser');

            checkPassword = await helper.comparePass(requestData.currentPassword, getUser.password);

            if (!checkPassword) {
                throw "Current Password did not match, Please try again.";
            }

            if (requestData.hasOwnProperty('newPassword') && requestData.newPassword) {
                requestData.newPassword = helper.bcryptHash(requestData.newPassword);
            }

            const updatedItem = await helper.save(models[model], requestData, true);

            return helper.success(res, 'Password Updated Successfully.', updatedItem);
        } catch (err) {
            if (typeof err == 'string') {
                err = {
                    message: err
                }
            }
            err.code = 200;

            return helper.error(res, err);
        }
    },

    changeEmailSetting: async (req, res) => {
        try {
            const required = {
                id: adminData.id,
                currentPassword: req.body.currentPassword,
                newEmail: req.body.newEmail,
                confirmNewEmail: req.body.confirmNewEmail,
            };
            const nonRequired = {};

            if (required.newEmail != required.confirmNewEmail) throw "New Email and Confirm Email did not match.";

            let requestData = await helper.vaildObject(required, nonRequired);

            let getUser = await models[model].findOne({
                where: {
                    id: adminData.id,
                },
                raw: true,
            });
            console.log(getUser, '======================>getUser');

            checkPassword = await helper.comparePass(requestData.currentPassword, getUser.password);

            if (!checkPassword) {
                throw "Current Password did not match, Please try again.";
            }

            requestData.email = requestData.newEmail;

            const updatedItem = await helper.save(models[model], requestData, true);

            return helper.success(res, 'Email Updated Successfully.', updatedItem);
        } catch (err) {
            if (typeof err == 'string') {
                err = {
                    message: err
                }
            }
            err.code = 200;

            return helper.error(res, err);
        }
    },
}
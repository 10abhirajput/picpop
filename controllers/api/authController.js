const models = require('../../models');
// const database = require('../../db/db');
const sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const helper = require('../../helpers/helper');
const constants = require('../../config/constants');
const secretKey = constants.jwtSecretKey;

const model = "user";

const roleTypes = {
    0: 'Admin',
    1: 'User',
    2: 'Driver',
    3: 'Vendor',
    4: 'Review Admin',
}
const userRoleModels = {
    0: 'adminDetail',
    1: 'userDetail',
    2: 'driverDetail',
    3: 'vendorDetail',
    4: 'adminDetail',
}

module.exports = {
    signup: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                // countryCode: req.body.countryCode,
                // phone: req.body.phone,
                location: req.body.location,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                image: req.files && req.files.image,
                role: req.body.role || 1,
                checkExists: 1,
                imageFolders: {
                    image: 'user'
                }
            };
            const nonRequired = {
                deviceType: req.body.deviceType,
                deviceToken: req.body.deviceToken
            };

            let requestData = await helper.vaildObject(required, nonRequired);

            if (requestData.role == 0) throw "Invalid role.";

            if (requestData.image) {
                requestData['image'] = helper.imageUpload(requestData.image, 'user');
            }

            if (requestData.hasOwnProperty('password') && requestData.password) {
                requestData.password = helper.bcryptHash(requestData.password);
            }

            // let user = await helper.save(models['user'], requestData, true, req);            
            const userId = await helper.save(models['user'], requestData);
            const user = await module.exports.findOneUser(userId);

            console.log(user, '=========>user');

            user.hasOwnProperty(userRoleModels[user.role]) && user[userRoleModels[user.role]] && user[userRoleModels[user.role]].hasOwnProperty('id') && user[userRoleModels[user.role]].id ? requestData.id = user[userRoleModels[user.role]].id : delete requestData.id;
            requestData.userId = user.id;

            await helper.save(models[userRoleModels[user.role]], requestData);

            const updatedUser = await module.exports.findOneUser(userId);

            let userData = {
                id: updatedUser.id,
                email: updatedUser.email,
            }

            // const nowTimestamp = helper.nowTimestamp();

            let token = jwt.sign({
                data: userData,
                iat: updatedUser.created,
            }, secretKey);
            updatedUser.token = token;

            await helper.save(models['userToken'], {
                userId: updatedUser.id,
                token,
                iat: updatedUser.created,
                deviceToken: requestData.deviceToken,
                deviceType: requestData.deviceType,
            });

            if (updatedUser.role == 1) {
                delete updatedUser.adminDetail;
                delete updatedUser.driverDetail;
                delete updatedUser.vendorDetail;
            } else if (updatedUser.role == 2) {
                delete updatedUser.adminDetail;
                delete updatedUser.userDetail;
                delete updatedUser.vendorDetail;
            } else if (updatedUser.role == 3) {
                delete updatedUser.adminDetail;
                delete updatedUser.userDetail;
                delete updatedUser.driverDetail;
            }

            return helper.success(res, `${roleTypes[user.role]} signed up Successfully.`, updatedUser);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    login: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                email: req.body.email,
                password: req.body.password,
            };
            const nonRequired = {
                deviceType: req.body.deviceType,
                deviceToken: req.body.deviceToken
            };

            let requestData = await helper.vaildObject(required, nonRequired);

            let user = await models['user'].findOne({
                where: {
                    email: requestData.email,
                },
                raw: true
            });

            if (!user) {
                throw "Email or Password did not match, Please try again.";
            }
            checkPassword = await helper.comparePass(requestData.password, user.password);
            if (!checkPassword) {
                throw "Email or Password did not match, Please try again.";
            }
            // delete user['password'];


            const getUser = await module.exports.findOneUser(user.id);
            if (getUser.role == 1) {
                delete getUser.adminDetail;
                delete getUser.driverDetail;
                delete getUser.vendorDetail;
            } else if (getUser.role == 2) {
                delete getUser.adminDetail;
                delete getUser.userDetail;
                delete getUser.vendorDetail;
            } else if (getUser.role == 3) {
                delete getUser.adminDetail;
                delete getUser.userDetail;
                delete getUser.driverDetail;
            }

            const updateUserObj = {
                id: getUser.id,
                deviceToken: requestData.deviceToken,
                deviceType: requestData.deviceType,
            }
            await helper.save(models['user'], updateUserObj);

            let userData = {
                id: getUser.id,
                email: getUser.email,
            }

            let token = jwt.sign({
                data: userData
            }, secretKey);

            getUser.token = token;
            getUser.deviceType = requestData.hasOwnProperty('deviceType') && requestData.deviceType ? parseInt(requestData.deviceType) : getUser.deviceType;
            getUser.deviceToken = requestData.hasOwnProperty('deviceToken') && requestData.deviceToken ? requestData.deviceToken : getUser.deviceToken;
            // getUser.deviceType = requestData.deviceType || 0;
            // getUser.deviceToken = requestData.deviceToken || '';

            return helper.success(res, 'User logged in successfully.', getUser);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    socialLogin: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                name: req.body.name,
                email: req.body.email,
                socialId: req.body.socialId,
                socialType: req.body.socialType, // 1 => facebook, 2 => google
                role: req.body.role || 1,
                imageFolders: {
                    image: 'users'
                }
            };
            const nonRequired = {
                socialImage: req.body.socialImage,
                location: req.body.location,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                image: req.files && req.files.image,
                deviceType: req.body.deviceType,
                deviceToken: req.body.deviceToken
            };

            let requestData = await helper.vaildObject(required, nonRequired);

            if (requestData.role == 0) throw "Invalid role.";

            if (requestData.image) {
                requestData['image'] = helper.imageUpload(requestData.image, 'user');
            }

            let socialId = 'facebookId';

            if (requestData.socialType == 2) {
                socialId = 'googleId';
            }

            const checkUser = await models['user'].findOne({
                where: {
                    [socialId]: requestData.socialId,
                    email: requestData.email
                },
                raw: true
            });

            requestData[socialId] = requestData.socialId;
            if (checkUser) {
                requestData.id = checkUser.id;
            }

            // if (requestData.profileImage) {
            //     requestData['profileImage'] = helper.fileUpload(requestData.profileImage, 'users');
            // }


            const userId = await helper.save(models['user'], requestData);
            // console.log(requestData, '==========>requestData');
            // return;
            const user = await module.exports.findOneUser(userId);

            console.log(user, '=========>user');

            user.hasOwnProperty(userRoleModels[user.role]) && user[userRoleModels[user.role]] && user[userRoleModels[user.role]].hasOwnProperty('id') && user[userRoleModels[user.role]].id ? requestData.id = user[userRoleModels[user.role]].id : delete requestData.id;
            requestData.userId = user.id;



            await helper.save(models[userRoleModels[user.role]], requestData);

            const updatedUser = await module.exports.findOneUser(userId);

            let userData = {
                id: updatedUser.id,
                email: updatedUser.email,
            }

            // const nowTimestamp = helper.nowTimestamp();

            let token = jwt.sign({
                data: userData,
                iat: updatedUser.created,
            }, secretKey);
            updatedUser.token = token;

            await helper.save(models['userToken'], {
                userId: updatedUser.id,
                token,
                iat: updatedUser.created,
                deviceToken: requestData.deviceToken,
                deviceType: requestData.deviceType,
            });

            if (updatedUser.role == 1) {
                delete updatedUser.adminDetail;
                delete updatedUser.driverDetail;
                delete updatedUser.vendorDetail;
            } else if (updatedUser.role == 2) {
                delete updatedUser.adminDetail;
                delete updatedUser.userDetail;
                delete updatedUser.vendorDetail;
            } else if (updatedUser.role == 3) {
                delete updatedUser.adminDetail;
                delete updatedUser.userDetail;
                delete updatedUser.driverDetail;
            }

            updatedUser.deviceType = requestData.hasOwnProperty('deviceType') && requestData.deviceType ? parseInt(requestData.deviceType) : getUser.deviceType;
            updatedUser.deviceToken = requestData.hasOwnProperty('deviceToken') && requestData.deviceToken ? requestData.deviceToken : getUser.deviceToken;

            return helper.success(res, 'User logged in successfully.', updatedUser);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    // socialLogin: async (req, res) => {
    //     try {
    //         const required = {
    //             securitykey: req.headers.securitykey,
    //             name: req.body.name,
    //             email: req.body.email,
    //             socialId: req.body.socialId,
    //             socialType: req.body.socialType, // 1 => facebook, 2 => google
    //             imageFolders: {
    //                 profileImage: 'users'
    //             }
    //         };
    //         const nonRequired = {
    //             image: req.files && req.files.image,
    //             deviceType: req.body.deviceType,
    //             deviceToken: req.body.deviceToken
    //         };

    //         let requestData = await helper.vaildObject(required, nonRequired);
    //         let socialId = 'facebookId';

    //         if (requestData.socialType == 2) {
    //             socialId = 'googleId';
    //         }

    //         const checkUser = await models['user'].findOne({
    //             where: {
    //                 [socialId]: requestData.socialId,
    //                 email: requestData.email
    //             },
    //             raw: true
    //         });
    //         requestData[socialId] = requestData.socialId;
    //         if (checkUser) {
    //             requestData.id = checkUser.id;
    //         }

    //         if (requestData.profileImage) {
    //             requestData['profileImage'] = helper.fileUpload(requestData.profileImage, 'users');
    //         }

    //         const getUser = await helper.save(models['user'], requestData, true, req);

    //         let userData = {
    //             id: getUser.id,
    //             email: getUser.email,
    //         }

    //         let token = jwt.sign({
    //             data: userData
    //         }, secretKey);

    //         getUser.token = token;

    //         return helper.success(res, 'User logged in successfully.', getUser);
    //     } catch (err) {
    //         return helper.error(res, err);
    //     }
    // },
    verifyOtp: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                otp: req.body.otp
            };
            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            if (requestData.otp != '1111') throw "Invalid OTP.";

            const updateUserObj = {
                id: req.user.id,
                otpVerified: 1
            }
            let user = await helper.save(models['user'], updateUserObj, true);

            return helper.success(res, 'OTP verified successfully.', user);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    logout: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
            };
            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            const updateUserObj = {
                id: req.user.id,
                deviceType: 0,
                deviceToken: ''
            }
            let user = await helper.save(models['user'], updateUserObj, true);

            return helper.success(res, 'User logged out successfully.', {});
        } catch (err) {
            return helper.error(res, err);
        }
    },
    findOneUser: async (id) => {
        let user = await models[model].findOne({
            where: {
                id
            },
            attributes: {
                exclude: 'password'
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
                            [sequelize.literal(`(IF (vendorDetail.image='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', vendorDetail.image)) )`), 'image']
                        ]
                    }
                },
            ],
            // raw: true,
            // nest: true,
        });

        if (user) user = user.toJSON();
        return user;
    },
}
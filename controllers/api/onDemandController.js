const models = require('../../models');
// const database = require('../../db/db');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const helper = require('../../helpers/helper');
const { request } = require('express');
// const constants = require('../../config/constants');

const model = 'user';
const modelName = 'On Demand';

module.exports = {
    onDemandUserCategoryListing: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
            };
            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            const onDemandCategories = await models['onDemandUserCategories'].findAll({
                attributes: {
                    include: [
                        [sequelize.literal(`(IF (onDemandUserCategories.image='', '', CONCAT('${baseUrl}/uploads/onDemandUserCategories/', onDemandUserCategories.image)) )`), 'image'],
                    ]
                }
            });

            return helper.success(res, `${modelName} Categories listing fetched successfully.`, onDemandCategories);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    onDemandUserListing: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                onDemandUserCategoryId: req.body.onDemandUserCategoryId,
            };
            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            const trending = await module.exports.getAllTrendingOnDemandUser(requestData.onDemandUserCategoryId);
            const topRated = await module.exports.getAllTopRatedOnDemandUser(requestData.onDemandUserCategoryId);

            const onDemmandUsers = {
                trending,
                topRated
            }

            return helper.success(res, `${modelName} Users listing fetched successfully.`, onDemmandUsers);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    onDemandUserDetail: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                id: req.body.id,
            };
            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            const responseData = await module.exports.getOneOnDemandUser(requestData.id);

            return helper.success(res, `${modelName} user detail fetched successfully.`, responseData);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    getAllTrendingOnDemandUser: async (onDemandUserCategoryId) => {
        return await models[model].findAll({
            where: {
                status: 1,
                role: 7,
            },
            attributes: {
                exclude: 'password'
            },
            include: [
                {
                    model: models['onDemandUserDetail'],
                    where: {
                        onDemandUserCategoryId
                    },
                    attributes: {
                        include: [
                            [sequelize.literal(`(IF (onDemandUserDetail.image='', '', CONCAT('${baseUrl}/uploads/user/', onDemandUserDetail.image)) )`), 'image'],
                            [sequelize.literal(`(SELECT COUNT(*) FROM onDemandReviews AS r WHERE r.onDemandUserDetailId=onDemandUserDetail.id)`), 'totalRatings'],
                            [sequelize.literal(`(SELECT FORMAT(IFNULL(AVG(r.rating), 0), 1)*1 FROM onDemandReviews AS r WHERE r.onDemandUserDetailId=onDemandUserDetail.id)`), 'avgRating'],
                        ]
                    }
                },
            ],
            order: [['id', 'DESC']]
        }).map(data => {
            data = data.toJSON()
            data = {
                ...data.onDemandUserDetail,
                email: data.email,
                // id: data.id,
                // totalRatings: 290,
                // avgRating: parseFloat(data.carRentalDealerDetail.avgRating),
            }
            delete data.userId;
            return data;
        });
    },
    getAllTopRatedOnDemandUser: async (onDemandUserCategoryId) => {
        return await models[model].findAll({
            where: {
                status: 1,
                role: 7,
            },
            attributes: {
                exclude: 'password'
            },
            include: [
                {
                    model: models['onDemandUserDetail'],
                    where: {
                        onDemandUserCategoryId
                    },
                    attributes: {
                        include: [
                            [sequelize.literal(`(IF (onDemandUserDetail.image='', '', CONCAT('${baseUrl}/uploads/user/', onDemandUserDetail.image)) )`), 'image'],
                            [sequelize.literal(`(SELECT COUNT(*) FROM onDemandReviews AS r WHERE r.onDemandUserDetailId=onDemandUserDetail.id)`), 'totalRatings'],
                            [sequelize.literal(`(SELECT FORMAT(IFNULL(AVG(r.rating), 0), 1)*1 FROM onDemandReviews AS r WHERE r.onDemandUserDetailId=onDemandUserDetail.id)`), 'avgRating'],
                        ]
                    }
                },
            ],
            order: [[sequelize.literal('`onDemandUserDetail.avgRating`'), 'DESC']]
        }).map(data => {
            data = data.toJSON()
            data = {
                ...data.onDemandUserDetail,
                email: data.email,
                // id: data.id,
                // totalRatings: 290,
                // avgRating: parseFloat(data.carRentalDealerDetail.avgRating),
            }
            delete data.userId;
            return data;
        });
    },
    getOneOnDemandUser: async (id) => {
        let data = await models['onDemandUserDetail'].findOne({
            where: {
                id
            },
            include: [
                {
                    model: models['onDemandUserCategories'],
                    attributes: [
                        'id',
                        'title',
                        [sequelize.literal(`(IF (onDemandUserCategory.image='', '', CONCAT('${baseUrl}/uploads/onDemandUserCategories/', onDemandUserCategory.image)) )`), 'image']
                    ]
                },
            ],
            attributes: {
                include: [
                    [sequelize.literal(`(IF (onDemandUserDetail.image='', '', CONCAT('${baseUrl}/uploads/user/', onDemandUserDetail.image)) )`), 'image'],
                    [sequelize.literal(`(SELECT COUNT(*) FROM onDemandReviews AS r WHERE r.onDemandUserDetailId=onDemandUserDetail.id)`), 'totalRatings'],
                    [sequelize.literal(`(SELECT FORMAT(IFNULL(AVG(r.rating), 0), 1)*1 FROM onDemandReviews AS r WHERE r.onDemandUserDetailId=onDemandUserDetail.id)`), 'avgRating'],
                ]
            }
            // order: [['id', 'DESC']],
        });

        if (!data) throw "Invalid id.";

        data = data.toJSON();

        data = {
            ...data,
            // totalRatings: 290,
            // avgRating: 4.5,
        };

        return data;
    },
}
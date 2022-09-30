const models = require('../../models');
// const database = require('../../db/db');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const helper = require('../../helpers/helper');
const { request } = require('express');
// const constants = require('../../config/constants');

const model = 'user';
const modelName = 'Car Rental Review';

module.exports = {
    carRentalAddReview: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                carRentalDealerDetailId: req.body.carRentalDealerDetailId,
                rating: req.body.rating,
            };

            const nonRequired = {
                comment: req.body.comment,
            };

            let requestData = await helper.vaildObject(required, nonRequired);

            if (![1, 2, 3, 4, 5].includes(parseInt(requestData.rating))) throw "Invalid rating.";

            const carRentalDealerDetail = await models['carRentalDealerDetail'].findOne({
                where: {
                    id: requestData.carRentalDealerDetailId,
                }
            });
            if (!carRentalDealerDetail) throw "Invalid carRentalDealerDetailId.";

            const carRentalReview = await models['carRentalReviews'].findOne({
                where: {
                    userId: req.user.id,
                    carRentalDealerDetailId: requestData.carRentalDealerDetailId,
                },
                raw: true
            });
            // if (restaurantReview) throw "You have already rated the restaurant.";
            if (carRentalReview) requestData.id = carRentalReview.id;

            requestData.userId = req.user.id;

            const modelId = await helper.save(models['carRentalReviews'], requestData);

            const modelData = await models['carRentalReviews'].findOne({
                where: {
                    id: modelId,
                },
            });

            return helper.success(res, `${modelName} added successfully.`, modelData);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    carRentalDealerReviewListing: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                carRentalDealerDetailId: req.body.carRentalDealerDetailId,
            };

            const nonRequired = {
            };

            let requestData = await helper.vaildObject(required, nonRequired);

            const carRentalDealerDetail = await models['carRentalDealerDetail'].findOne({
                where: {
                    id: requestData.carRentalDealerDetailId,
                }
            });
            if (!carRentalDealerDetail) throw "Invalid carRentalDealerDetailId.";

            const carRentalReviews = await models['carRentalReviews'].findAll({
                where: {
                    // userId: req.user.id,
                    carRentalDealerDetailId: requestData.carRentalDealerDetailId,
                },
                include: [
                    {
                        model: models['user'],
                        as: 'user',
                        required: true,
                        where: {
                            role: 1
                        },
                        attributes: [
                            'id',
                            'email',
                            [sequelize.literal('`user->userDetail`.name'), 'name'],
                            [sequelize.literal(`(IF (\`user->userDetail\`.\`image\`='', '', CONCAT('${baseUrl}/uploads/user/', \`user->userDetail\`.\`image\`)) )`), 'image'],
                        ],
                        include: [
                            {
                                model: models['userDetail'],
                                required: true,
                                attributes: []
                            }
                        ]
                    },
                    // {
                    //     model: models['user'],
                    //     as: 'restaurant',
                    //     required: true,
                    //     where: {
                    //         role: 5
                    //     },
                    //     attributes: [
                    //         'id',
                    //         'email',
                    //         [sequelize.literal('`restaurant->restaurantDetail`.name'), 'name'],
                    //         [sequelize.literal('`restaurant->restaurantDetail`.description'), 'description'],
                    //         [sequelize.literal('`restaurant->restaurantDetail`.address'), 'address'],
                    //         [sequelize.literal('`restaurant->restaurantDetail`.latitude'), 'latitude'],
                    //         [sequelize.literal('`restaurant->restaurantDetail`.longitude'), 'longitude'],
                    //         [sequelize.literal(`(IF (\`restaurant->restaurantDetail\`.\`coverImage\`='', '', CONCAT('${baseUrl}/uploads/user/', \`restaurant->restaurantDetail\`.\`coverImage\`)) )`), 'image'],
                    //     ],
                    //     include: [
                    //         {
                    //             model: models['restaurantDetail'],
                    //             required: true,
                    //             attributes: []
                    //         }
                    //     ]
                    // }
                ],
                // attributes: {
                //     include: [
                //         [sequelize.literal('`restaurant->restaurantDetail`.name'), 'restaurantName']
                //     ]
                // },
                order: [['id', 'DESC']]
                // raw: true,
                // nest: true
            });

            return helper.success(res, `${modelName}s fetched successfully.`, carRentalReviews);
        } catch (err) {
            return helper.error(res, err);
        }
    },
}
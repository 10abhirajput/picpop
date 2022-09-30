const models = require('../../models');
// const database = require('../../db/db');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const helper = require('../../helpers/helper');
const { request } = require('express');
// const constants = require('../../config/constants');

const model = 'user';
const modelName = 'On Demand Review';

module.exports = {
    onDemandAddReview: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                onDemandUserDetailId: req.body.onDemandUserDetailId,
                rating: req.body.rating,
            };

            const nonRequired = {
                comment: req.body.comment,
            };

            let requestData = await helper.vaildObject(required, nonRequired);

            if (![1, 2, 3, 4, 5].includes(parseInt(requestData.rating))) throw "Invalid rating.";

            const onDemandUserDetail = await models['onDemandUserDetail'].findOne({
                where: {
                    id: requestData.onDemandUserDetailId,
                }
            });
            if (!onDemandUserDetail) throw "Invalid onDemandUserDetailId.";

            const onDemandReview = await models['onDemandReviews'].findOne({
                where: {
                    userId: req.user.id,
                    onDemandUserDetailId: requestData.onDemandUserDetailId,
                },
                raw: true
            });
            // if (restaurantReview) throw "You have already rated the restaurant.";
            if (onDemandReview) requestData.id = onDemandReview.id;

            requestData.userId = req.user.id;

            const modelId = await helper.save(models['onDemandReviews'], requestData);

            const modelData = await models['onDemandReviews'].findOne({
                where: {
                    id: modelId,
                },
            });

            return helper.success(res, `${modelName} added successfully.`, modelData);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    onDemandUserReviewListing: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                onDemandUserDetailId: req.body.onDemandUserDetailId,
            };

            const nonRequired = {
            };

            let requestData = await helper.vaildObject(required, nonRequired);

            const onDemandUserDetail = await models['onDemandUserDetail'].findOne({
                where: {
                    id: requestData.onDemandUserDetailId,
                }
            });
            if (!onDemandUserDetail) throw "Invalid onDemandUserDetailId.";

            const onDemandReviews = await models['onDemandReviews'].findAll({
                where: {
                    // userId: req.user.id,
                    onDemandUserDetailId: requestData.onDemandUserDetailId,
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
                ],
                order: [['id', 'DESC']],
            });

            return helper.success(res, `${modelName}s fetched successfully.`, onDemandReviews);
        } catch (err) {
            return helper.error(res, err);
        }
    },
}
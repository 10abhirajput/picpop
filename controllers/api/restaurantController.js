const models = require('../../models');
// const database = require('../../db/db');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const helper = require('../../helpers/helper');
const { request } = require('express');
// const constants = require('../../config/constants');

const model = 'restaurantDetail';
const modelName = 'Restaurant';

module.exports = {
    foodTypesListing: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
            };

            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            let modelItems = await models['foodType'].findAll({
                order: [['id', 'DESC']],
                raw: true
            });

            return helper.success(res, `Food types listing fetched successfully.`, modelItems);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    restaurantTypesListing: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
            };

            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            let modelItems = await models['restaurantType'].findAll({
                order: [['id', 'DESC']],
                raw: true
            });

            return helper.success(res, `Restaurant types listing fetched successfully.`, modelItems);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    restaurantListing: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
            };

            const nonRequired = {
                restaurantTypeId: req.body.restaurantTypeId,
                foodTypeId: req.body.foodTypeId,
            };

            let requestData = await helper.vaildObject(required, nonRequired);

            if (requestData.hasOwnProperty('restaurantTypeId') && requestData.restaurantTypeId) {
                const restaurantType = await models['restaurantType'].findOne({
                    where: {
                        id: requestData.restaurantTypeId
                    }
                });
                if (!restaurantType) throw "Invalid restaurantTypeId.";
            }

            if (requestData.hasOwnProperty('foodTypeId') && requestData.foodTypeId) {
                const foodType = await models['foodType'].findOne({
                    where: {
                        id: requestData.foodTypeId
                    }
                });
                if (!foodType) throw "Invalid foodTypeId.";
            }

            const modelListing = await module.exports.getAll(req, {
                ...(
                    requestData.hasOwnProperty('restaurantTypeId') && requestData.restaurantTypeId
                        ? { restaurantTypeId: requestData.restaurantTypeId }
                        : {}
                ),
                ...(
                    requestData.hasOwnProperty('foodTypeId') && requestData.foodTypeId
                        ? { foodTypeId: requestData.foodTypeId }
                        : {}
                ),
            });

            return helper.success(res, `${modelName} listing fetched successfully.`, modelListing);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    restaurantDetail: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                id: req.body.id,
            };

            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            const modelDetail = await module.exports.getOne(req, {
                userId: requestData.id,
            });

            const restaurantReviews = await models['restaurantReview'].findAll({
                where: {
                    // userId: req.user.id,
                    // restaurantId: requestData.restaurantId,
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
                order: [['id', 'DESC']]
            }).map(review => review.toJSON());

            modelDetail.reviews = restaurantReviews;

            return helper.success(res, `${modelName} detail fetched successfully.`, modelDetail);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    getMyRestaurantReview: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                // restaurantId: req.body.restaurantId,
            };

            const nonRequired = {
            };

            let requestData = await helper.vaildObject(required, nonRequired);

            const restaurantReviews = await models['restaurantReview'].findAll({
                where: {
                    userId: req.user.id,
                    // restaurantId: requestData.restaurantId,
                },
                include: [

                    {
                        model: models['user'],
                        as: 'restaurant',
                        required: true,
                        where: {
                            role: 5
                        },
                        attributes: [
                            'id',
                            'email',
                            [sequelize.literal('`restaurant->restaurantDetail`.name'), 'name'],
                            [sequelize.literal('`restaurant->restaurantDetail`.description'), 'description'],
                            [sequelize.literal('`restaurant->restaurantDetail`.address'), 'address'],
                            [sequelize.literal('`restaurant->restaurantDetail`.latitude'), 'latitude'],
                            [sequelize.literal('`restaurant->restaurantDetail`.longitude'), 'longitude'],
                            [sequelize.literal(`(IF (\`restaurant->restaurantDetail\`.\`coverImage\`='', '', CONCAT('${baseUrl}/uploads/user/', \`restaurant->restaurantDetail\`.\`coverImage\`)) )`), 'image'],
                        ],
                        include: [
                            {
                                model: models['restaurantDetail'],
                                required: true,
                                attributes: []
                            }
                        ]
                    },
                    // {
                    //     model: models['user'],
                    //     as: 'restaurant',
                    //     required: true,
                    //     attributes: [],
                    //     // attributes: [
                    //     //     [sequelize.literal('restaurant->restaurantDetail.name'), 'restaurant.name'],
                    //     //     // exclude: [
                    //     //     // ]
                    //     // ],
                    //     // attributes: [
                    //     //     sequelize.literal('restaurant->restaurantDetail.*')
                    //     // ],
                    //     include: [
                    //         {
                    //             model: models['restaurantDetail'],
                    //             required: true,
                    //             // attributes: []
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

            return helper.success(res, `My Restaurant Reviews fetched successfully.`, restaurantReviews);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    getAllRestaurantReview: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                restaurantId: req.body.restaurantId,
            };

            const nonRequired = {
            };

            let requestData = await helper.vaildObject(required, nonRequired);

            const restaurant = await models['restaurantDetail'].findOne({
                where: {
                    userId: requestData.restaurantId,
                }
            });
            if (!restaurant) throw "Invalid restaurantId.";

            const restaurantReviews = await models['restaurantReview'].findAll({
                where: {
                    // userId: req.user.id,
                    // restaurantId: requestData.restaurantId,
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

            return helper.success(res, `Restaurant Reviews fetched successfully.`, restaurantReviews);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    addRestaurantReview: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                restaurantId: req.body.restaurantId,
                rating: req.body.rating,
            };

            const nonRequired = {
                comment: req.body.comment,
            };

            let requestData = await helper.vaildObject(required, nonRequired);

            if (![1, 2, 3, 4, 5].includes(parseInt(requestData.rating))) throw "Invalid rating.";

            const restaurant = await models['restaurantDetail'].findOne({
                where: {
                    userId: requestData.restaurantId,
                }
            });
            if (!restaurant) throw "Invalid restaurantId.";

            const restaurantReview = await models['restaurantReview'].findOne({
                where: {
                    userId: req.user.id,
                    restaurantId: requestData.restaurantId,
                },
                raw: true
            });
            // if (restaurantReview) throw "You have already rated the restaurant.";
            if (restaurantReview) requestData.id = restaurantReview.id;

            requestData.userId = req.user.id;

            const modelId = await helper.save(models['restaurantReview'], requestData);

            const modelData = await models['restaurantReview'].findOne({
                where: {
                    id: modelId,
                },
            });

            return helper.success(res, `Restaurant Review added successfully.`, modelData);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    editRestaurantReview: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                id: req.body.id,
                // image: req.files && req.files.image,
            };

            const nonRequired = {
                name: req.body.name,
            };

            let requestData = await helper.vaildObject(required, nonRequired);

            const checkModelItem = await models[model].findOne({
                where: {
                    id: requestData.id,
                    userId: req.user.id
                }
            });
            if (!checkModelItem) throw "Invalid id.";

            // if (requestData.image) {
            //     requestData["image"] = helper.imageUpload(
            //         requestData.image,
            //         "programs"
            //     );
            // }

            requestData.userId = req.user.id;

            const modelId = await helper.save(models[model], requestData);

            const modelData = await models[model].findOne({
                where: {
                    id: modelId,
                },
                // attributes: {
                //     include: [
                //         [
                //             sequelize.literal(
                //                 'IFNULL(IF(`foodMenuItems`.`image`="", "", CONCAT("' +
                //                 req.protocol +
                //                 "://" +
                //                 req.get("host") +
                //                 '/uploads/foodMenuItems/", `foodMenuItems`.`image`)), "")'
                //             ),
                //             "image",
                //         ],
                //     ],
                // },
            });

            return helper.success(res, `${modelName} updated successfully.`, modelData);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    deleteProgram: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                id: req.body.id,
                // image: req.files && req.files.image,
            };

            const nonRequired = {

            };

            let requestData = await helper.vaildObject(required, nonRequired);

            const checkModelItem = await models[model].findOne({
                where: {
                    id: requestData.id,
                    userId: req.user.id
                }
            });
            if (!checkModelItem) throw "Invalid id.";

            await helper.delete(models[model], requestData.id);

            return helper.success(res, `${modelName} deleted successfully.`, {});
        } catch (err) {
            return helper.error(res, err);
        }
    },
    getOne: async (req, where = {}) => {
        let data = await models[model].findOne({
            where: {
                ...where
            },
            include: [
                {
                    model: models['user'],
                    required: true,
                    where: {
                        status: 1,
                    },
                    attributes: [],
                },
                {
                    model: models['restaurantType'],
                    required: true,
                    where: {
                        status: 1,
                    },
                    attributes: [
                        'id',
                        'name',
                    ]
                },
                {
                    model: models['restaurantImages'],
                    required: false,
                    attributes: [
                        'id',
                        [sequelize.literal(`(IF (\`restaurantImages\`.\`image\`='', '', CONCAT('${baseUrl}/uploads/restaurant/', \`restaurantImages\`.\`image\`)) )`), 'image'],
                    ],
                },
                {
                    model: models['restaurantFoodTypes'],
                    required: false,
                    include: [
                        {
                            model: models['foodType'],
                            required: true,
                            where: {
                                status: 1,
                            },
                            attributes: [],
                        },
                    ],
                    attributes: [
                        [sequelize.literal('`restaurantFoodTypes->foodType`.`id`'), 'id'],
                        [sequelize.literal('`restaurantFoodTypes->foodType`.`name`'), 'name'],
                    ]
                },
            ],
            attributes: {
                include: [
                    ['userId', 'restaurantId'],
                    [sequelize.literal('(SELECT COUNT(*) FROM restaurantReview AS rr WHERE rr.restaurantId=restaurantDetail.userId)'), 'totalRatings'],
                    [sequelize.literal('(SELECT TRUNCATE(AVG(rr.rating), 1) FROM restaurantReview AS rr WHERE rr.restaurantId=restaurantDetail.userId)'), 'avgRating'],
                    [sequelize.literal(`(IF (\`restaurantDetail\`.\`coverImage\`='', '', CONCAT('${baseUrl}/uploads/restaurant/', \`restaurantDetail\`.\`coverImage\`)) )`), 'coverImage'],
                    // [sequelize.literal('IFNULL(IF(`categories`.`image`="", "", CONCAT("'+req.protocol+'://'+req.get('host')+'/uploads/categories/", `categories`.`image`)), "")'), 'image']
                ],
                exclude: [
                    'id',
                    'userId',
                    'coverImage'
                ]
            },
            // subQuery: false,
            // distinct: true,
            //   raw: true,
        });
        if (!data) throw `Invalid id.`;

        data = data.toJSON();

        return data;
    },
    getAll: async (req, where = {}) => {
        let data = await models[model].findAll({
            where: {
                ...where
            },
            include: [
                {
                    model: models['user'],
                    required: true,
                    where: {
                        status: 1,
                    },
                    attributes: [],
                },
                {
                    model: models['restaurantType'],
                    required: true,
                    where: {
                        status: 1,
                    },
                    attributes: [
                        'id',
                        'name',
                    ]
                },
                {
                    model: models['foodType'],
                    required: true,
                    where: {
                        status: 1,
                    },
                    attributes: [
                        'id',
                        'name',
                    ]
                },
            ],
            attributes: {
                include: [
                    ['userId', 'id'],
                    [sequelize.literal('(SELECT COUNT(*) FROM restaurantReview AS rr WHERE rr.restaurantId=restaurantDetail.userId)'), 'totalRatings'],
                    [sequelize.literal('(SELECT TRUNCATE(AVG(rr.rating), 1) FROM restaurantReview AS rr WHERE rr.restaurantId=restaurantDetail.userId)'), 'avgRating'],
                    [sequelize.literal(`(IF (\`restaurantDetail\`.\`coverImage\`='', '', CONCAT('${baseUrl}/uploads/restaurant/', \`restaurantDetail\`.\`coverImage\`)) )`), 'coverImage'],
                    // [sequelize.literal('IFNULL(IF(`categories`.`image`="", "", CONCAT("'+req.protocol+'://'+req.get('host')+'/uploads/categories/", `categories`.`image`)), "")'), 'image']
                ],
                exclude: [
                    'userId'
                ]
            },
            order: [['id', 'DESC']],
            // raw: true
        }).map(singleData => singleData.toJSON());

        return data;
    },
}
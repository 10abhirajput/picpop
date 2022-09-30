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
    onDemandBooking: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                onDemandUserDetailId: req.body.onDemandUserDetailId,
                amount: req.body.amount,
                location: req.body.location,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                date: req.body.date,
                time: req.body.time,
                description: req.body.description,
            };
            const nonRequired = {

            };

            let requestData = await helper.vaildObject(required, nonRequired);

            const onDemandUserDetail = await module.exports.getOnDemandUser(requestData.onDemandUserDetailId);

            requestData.userId = req.user.id;

            requestData.json = {
                onDemandUserDetail,
            }

            // console.log(requestData, '===========>requestData');
            // return;

            const adddedId = await helper.save(models['onDemandBookings'], requestData);

            const booking = await helper.checkId(models['onDemandBookings'], { id: adddedId });

            // console.log(requestData, '=============>requestData');
            // return;

            return helper.success(res, `${modelName} Booking added successfully.`, booking);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    onDemandBookingDetail: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                id: req.body.id,
            };
            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            const booking = await helper.checkId(models['onDemandBookings'], { id: requestData.id });

            return helper.success(res, `${modelName} Booking detail fetched successfully.`, booking);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    getMyonDemandBookings: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
            };
            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);



            return helper.success(res, `${modelName} Booking detail fetched successfully.`, booking);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    getOnDemandUser: async (onDemandUserDetailId) => {
        const data = await models['onDemandUserDetail'].findOne({
            where: {
                id: onDemandUserDetailId,
                // status: 1,
            },
            include: [                
                {
                    model: models['user'],
                    required: true,
                    attributes: [],
                },
                {
                    model: models['onDemandUserCategories'],
                    required: true,
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
                    // [sequelize.literal(`(SELECT COUNT(*) FROM onDemandReviews AS r WHERE r.onDemandUserDetailId=onDemandUserDetail.id)`), 'totalRatings'],
                    // [sequelize.literal(`(SELECT FORMAT(IFNULL(AVG(r.rating), 0), 1)*1 FROM onDemandReviews AS r WHERE r.onDemandUserDetailId=onDemandUserDetail.id)`), 'avgRating'],
                ]
            },
        });

        if (!data) throw "Invalid onDemandUserDetailId.";

        return data;
    }

}
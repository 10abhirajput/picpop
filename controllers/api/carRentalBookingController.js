const models = require('../../models');
// const database = require('../../db/db');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const helper = require('../../helpers/helper');
const { request } = require('express');
// const constants = require('../../config/constants');

const model = 'user';
const modelName = 'Car Rental';

module.exports = {
    carRentalBooking: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                type: req.body.type, // 1=>rent, 2=>buy	
                carRentalBrandCarId: req.body.carRentalBrandCarId,
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

            if (required.type == 1) {
                required['endDate'] = req.body.endDate;
                required['endTime'] = req.body.endTime;
                required['bookingInterval'] = req.body.bookingInterval;
            }

            let requestData = await helper.vaildObject(required, nonRequired);

            const carRentalBrandCar = await module.exports.getBookingCar(requestData.carRentalBrandCarId);

            requestData.userId = req.user.id;

            requestData.json = {
                carRentalBrandCar,
            }

            // console.log(requestData, '===========>requestData');
            // return;

            const adddedId = await helper.save(models['carRentalBookings'], requestData);

            const booking = await helper.checkId(models['carRentalBookings'], { id: adddedId });

            // console.log(requestData, '=============>requestData');
            // return;

            return helper.success(res, `${modelName} Booking added successfully.`, booking);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    carRentalBookingDetail: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                id: req.body.id,
            };
            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            const booking = await helper.checkId(models['carRentalBookings'], { id: requestData.id });

            return helper.success(res, `${modelName} Booking detail fetched successfully.`, booking);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    getMyCarRentalBookings: async (req, res) => {
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
    getBookingCar: async (carRentalBrandCarId) => {
        const data = await models['carRentalBrandCars'].findOne({
            where: {
                id: carRentalBrandCarId,
                // status: 1,
            },
            attributes: {
                include: [
                    [sequelize.literal(`(IF (carRentalBrandCars.image='', '', CONCAT('${baseUrl}/uploads/carRentalBrandCars/', carRentalBrandCars.image)) )`), 'image']
                ],
                exclude: [
                    'image'
                ]
            },
            include: [
                {
                    model: models['carRentalDealerDetail'],
                    required: true,
                    attributes: {
                        include: [
                            [sequelize.literal(`(IF (carRentalDealerDetail.image='', '', CONCAT('${baseUrl}/uploads/user/', carRentalDealerDetail.image)) )`), 'image']
                        ],
                        exclude: [
                            'image'
                        ]
                    }
                },
                {
                    model: models['carRentalCarTypes'],
                    required: true,
                    attributes: {
                        include: [
                            [sequelize.literal(`(IF (carRentalCarType.image='', '', CONCAT('${baseUrl}/uploads/carRentalCarTypes/', carRentalCarType.image)) )`), 'image']
                        ],
                        exclude: [
                            'image'
                        ]
                    }
                },
                {
                    model: models['carRentalBrands'],
                    required: true,
                    attributes: {
                        include: [
                            [sequelize.literal(`(IF (carRentalBrand.image='', '', CONCAT('${baseUrl}/uploads/carRentalBrands/', carRentalBrand.image)) )`), 'image']
                        ],
                        exclude: [
                            'image'
                        ]
                    }
                },
            ]
        });

        if (!data) throw "Invalid carRentalBrandCarId.";

        return data;
    }

}
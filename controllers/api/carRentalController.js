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
	carRentalDealerListing: async (req, res) => {
		try {
			const required = {
				securitykey: req.headers.securitykey,
			};
			const nonRequired = {};

			let requestData = await helper.vaildObject(required, nonRequired);

			const carRentals = await module.exports.getAllCarRentalDealers();

			return helper.success(res, `${modelName} listing fetched successfully.`, carRentals);
		} catch (err) {
			return helper.error(res, err);
		}
	},
	carRentalBrandsListing: async (req, res) => {
		try {
			const required = {
				securitykey: req.headers.securitykey,
				carRentalDealerId: req.body.carRentalDealerId,
			};
			const nonRequired = {};

			let requestData = await helper.vaildObject(required, nonRequired);

			const carRentalBrands = await module.exports.getAllCarRentalBrands(requestData.carRentalDealerId);

			return helper.success(res, `${modelName} Brand listing fetched successfully.`, carRentalBrands);
		} catch (err) {
			return helper.error(res, err);
		}
	},
	carRentalBrandCarsListing: async (req, res) => {
		try {
			const required = {
				securitykey: req.headers.securitykey,
				carRentalBrandId: req.body.carRentalBrandId,
			};
			const nonRequired = {};

			let requestData = await helper.vaildObject(required, nonRequired);

			const carRentalBrandCars = await module.exports.getAllCarRentalBrandCars(requestData.carRentalBrandId);

			return helper.success(res, `${modelName} Brand Cars listing fetched successfully.`, carRentalBrandCars);
		} catch (err) {
			return helper.error(res, err);
		}
	},
	carRentalBrandCarDetail: async (req, res) => {
		try {
			const required = {
				securitykey: req.headers.securitykey,
				id: req.body.id,
			};
			const nonRequired = {};

			let requestData = await helper.vaildObject(required, nonRequired);

			const carRentalBrandCars = await module.exports.getOneCarRentalBrandCar(requestData.id);

			return helper.success(res, `${modelName} Brand Cars listing fetched successfully.`, carRentalBrandCars);
		} catch (err) {
			return helper.error(res, err);
		}
	},
	getAllCarRentalDealers: async () => {
		return await models[model].findAll({
			where: {
				status: 1,
				role: 6
			},
			attributes: {
				exclude: 'password'
			},
			include: [
				{

					model: models['carRentalDealerDetail'],
					attributes: {
						include: [
							[sequelize.literal(`(IF (carRentalDealerDetail.image='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', carRentalDealerDetail.image)) )`), 'image'],
							[sequelize.literal(`(SELECT COUNT(*) FROM carRentalReviews AS r WHERE r.carRentalDealerDetailId=carRentalDealerDetail.id)`), 'totalRatings'],
							[sequelize.literal(`(SELECT FORMAT(IFNULL(AVG(r.rating), 0), 1)*1 FROM carRentalReviews AS r WHERE r.carRentalDealerDetailId=carRentalDealerDetail.id)`), 'avgRating'],
						]
					}
				},
			],
			order: [['id', 'DESC']]
		}).map(data => {
			data = data.toJSON()
			data = {
				...data.carRentalDealerDetail,
				email: data.email,
				// id: data.id,
				// totalRatings: 290,
				// avgRating: parseFloat(data.carRentalDealerDetail.avgRating),
			}
			delete data.userId;
			return data;
		});
	},
	getAllCarRentalBrands: async (id) => {
		let data = await models['carRentalDealerDetail'].findOne({
			where: {
				id
			},
			include: [
				{
					model: models['user'],
					required: true,
					where: {
						status: 1,
					}
				},
				{
					model: models['carRentalBrands'],
					required: false,
					separate: true,
					attributes: {
						include: [
							[sequelize.literal(`(IF (carRentalBrands.image='', '', CONCAT('${baseUrl}/uploads/carRentalBrands/', carRentalBrands.image)) )`), 'image']
						],
					},
					order: [['id', 'DESC']]
				},
			],
			attributes: {
				include: [
					[sequelize.literal(`(IF (carRentalDealerDetail.image='', '', CONCAT('${baseUrl}/uploads/user/', carRentalDealerDetail.image)) )`), 'image'],
					[sequelize.literal(`(SELECT COUNT(*) FROM carRentalReviews AS r WHERE r.carRentalDealerDetailId=carRentalDealerDetail.id)`), 'totalRatings'],
					[sequelize.literal(`(SELECT FORMAT(IFNULL(AVG(r.rating), 0), 1)*1 FROM carRentalReviews AS r WHERE r.carRentalDealerDetailId=carRentalDealerDetail.id)`), 'avgRating'],
				],
				exclude: [
					'image'
				]
			}
		});

		if (!data) throw "invalid carRentalDealerId.";
		data = data.toJSON();

		data = {
			...data,
			// id: data.user.id,
			email: data.user.email,
			// totalRatings: 290,
			// avgRating: 4.5,
		}

		delete data.user;

		return data;
	},
	getAllCarRentalBrandCars: async (carRentalBrandId) => {
		let data = await models['carRentalBrandCars'].findAll({
			where: {
				carRentalBrandId
			},
			include: [
				{
					model: models['carRentalBrands'],
					attributes: [
						'id',
						'name',
						'carRentalDealerDetailId',
						[sequelize.literal(`(IF (carRentalBrand.image='', '', CONCAT('${baseUrl}/uploads/carRentalBrands/', carRentalBrand.image)) )`), 'image']
					]
				},
				{
					model: models['carRentalCarTypes'],
					attributes: [
						'id',
						'name',
						// [sequelize.literal(`(IF (carRentalCarType.image='', '', CONCAT('${baseUrl}/uploads/carRentalCarTypes/', carRentalCarType.image)) )`), 'image']
					]
				},
			],
			attributes: {
				include: [
					[sequelize.literal(`(IF (carRentalBrandCars.image='', '', CONCAT('${baseUrl}/uploads/carRentalBrandCars/', carRentalBrandCars.image)) )`), 'image'],
					[sequelize.literal(`(SELECT c.location FROM carRentalDealerDetail AS c WHERE c.id=carRentalBrand.carRentalDealerDetailId)`), 'location'],
					[sequelize.literal(`(SELECT c.latitude FROM carRentalDealerDetail AS c WHERE c.id=carRentalBrand.carRentalDealerDetailId)`), 'latitude'],
					[sequelize.literal(`(SELECT c.longitude FROM carRentalDealerDetail AS c WHERE c.id=carRentalBrand.carRentalDealerDetailId)`), 'longitude'],
					[sequelize.literal(`(SELECT COUNT(*) FROM carRentalReviews AS r WHERE r.carRentalDealerDetailId=\`carRentalBrand\`.\`carRentalDealerDetailId\`)`), 'totalRatings'],
					[sequelize.literal(`(SELECT FORMAT(IFNULL(AVG(r.rating), 0), 1)*1 FROM carRentalReviews AS r WHERE r.carRentalDealerDetailId=\`carRentalBrand\`.\`carRentalDealerDetailId\`)`), 'avgRating'],
				],
				exclude: [
					'image'
				],
			},
			order: [['id', 'DESC']],
		}).map(data => {
			data = data.toJSON();

			data = {
				...data,
				// totalRatings: 290,
				// avgRating: 4.5,
			};

			return data;
		});

		return data;
	},
	getOneCarRentalBrandCar: async (id) => {
		let data = await models['carRentalBrandCars'].findOne({
			where: {
				id
			},
			include: [
				{
					model: models['carRentalBrands'],
					attributes: [
						'id',
						'name',
						'carRentalDealerDetailId',
						[sequelize.literal(`(IF (carRentalBrand.image='', '', CONCAT('${baseUrl}/uploads/carRentalBrands/', carRentalBrand.image)) )`), 'image']
					]
				},
				{
					model: models['carRentalCarTypes'],
					attributes: [
						'id',
						'name',
						// [sequelize.literal(`(IF (carRentalCarType.image='', '', CONCAT('${baseUrl}/uploads/carRentalCarTypes/', carRentalCarType.image)) )`), 'image']
					]
				},
			],
			attributes: {
				include: [
					[sequelize.literal(`(IF (carRentalBrandCars.image='', '', CONCAT('${baseUrl}/uploads/carRentalBrandCars/', carRentalBrandCars.image)) )`), 'image'],
					[sequelize.literal(`(SELECT c.location FROM carRentalDealerDetail AS c WHERE c.id=carRentalBrand.carRentalDealerDetailId)`), 'location'],
					[sequelize.literal(`(SELECT c.latitude FROM carRentalDealerDetail AS c WHERE c.id=carRentalBrand.carRentalDealerDetailId)`), 'latitude'],
					[sequelize.literal(`(SELECT c.longitude FROM carRentalDealerDetail AS c WHERE c.id=carRentalBrand.carRentalDealerDetailId)`), 'longitude'],
					[sequelize.literal(`(SELECT COUNT(*) FROM carRentalReviews AS r WHERE r.carRentalDealerDetailId=\`carRentalBrand\`.\`carRentalDealerDetailId\`)`), 'totalRatings'],
					[sequelize.literal(`(SELECT FORMAT(IFNULL(AVG(r.rating), 0), 1)*1 FROM carRentalReviews AS r WHERE r.carRentalDealerDetailId=\`carRentalBrand\`.\`carRentalDealerDetailId\`)`), 'avgRating'],
				],
				exclude: [
					'image'
				],
			},
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
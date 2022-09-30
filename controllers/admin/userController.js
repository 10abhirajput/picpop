const models = require('../../models');
const helper = require('../../helpers/helper');
const Paginator = require("paginator");
const sequelize = require("sequelize");
const { request } = require('express');
const { Op } = sequelize;
// const User = models.user;
const locationOwnerDetailImage = models.locationOwnerDetailImage;
const businessImage = models.businessImage;

const model = "user";
global.modelTitle = "User";
global.modelDataTable = "userDataTable";



module.exports = {
	listing: async (req, res) => {
		try {
			global.currentModule = 'User';
			global.currentSubModule = 'Listing';
			global.currentSubModuleSidebar = 'listing';

			return res.render('admin/user/listing');
		} catch (err) {
			return helper.error(res, err);
		}
	},
	add: async (req, res) => {
		try {
			global.currentModule = 'User';
			global.currentSubModule = 'Add';
			global.currentSubModuleSidebar = 'add';

			return res.render('admin/user/add');
		} catch (err) {
			return helper.error(res, err);
		}
	},
	edit: async (req, res) => {
		try {
			global.currentModule = 'User';
			global.currentSubModuleSidebar = 'listing';

			const user = await module.exports.findOneUser(req.params.id);
			global.currentSubModule = `Edit ${roleTypes[user.role]}`;

			return res.render('admin/user/edit', { user });
		} catch (err) {
			return helper.error(res, err);
		}
	},
	view: async (req, res) => {
		try {
			console.log(req, "req====================");
			global.currentModule = 'User';
			global.currentSubModuleSidebar = 'listing';
			console.log('user log**************************',req.params.id);

			const user = await module.exports.findOneUser(req.params.id);
			let data = await models['locationOwnerDetail'].findAll({
				where: { 
				userId : req.params.id
				},
				})
			let businessProf = await models['businessProfessionalDetail'].findAll({
					where: { 
					userId : req.params.id
					},
					include: [
						{
							model: models['category'],
						},
					],
					raw:true,
					nest: true

					})
				console.log("dddddddddddddddddddddddddddddddddddddddddddddddd",businessProf);
				
			// const user = await models.locationOwnerDetail()
			
			;
			console.log("44444444444444444444444444333333333333333---------------------------",user);
			
			global.currentSubModule = `View ${roleTypes[user.role]}`;
			
			// console.log(user,'user log**************************');
			return res.render('admin/user/view', { user: user, data: data, businessProf: businessProf } );
		} catch (err) {
			return helper.error(res, err);
		}
	},
	datatable: async (req, res) => {
		try {
			const queryParameters = req.query;
			const { draw, search, start, length } = queryParameters;
			// console.log(queryParameters, '======================>queryParameters');

			const recordsTotal = await models[model].count({
				where: {
					role: {
						[Op.notIn]: [0],
						// [Op.in]: [1,2,3],
					},
				}
			});
			console.log("111111111111111111111111--------------111111111111111111",recordsTotal);
			
			const listing = await models[model].findAndCountAll({
				where: {
					role: {
						[Op.notIn]: [0],
						[Op.in]: [1, 2, 3],
					},
					// [Op.and]: [
					// 	sequelize.literal(`user.email LIKE '%${search.value}%' || userDetail.name LIKE '%${search.value}%' || businessDetail.name LIKE '%${search.value}%'`)
					// ]
				},
				include: [
					{

						model: models['userDetail'],
						attributes: {
							include: [
								[sequelize.literal(`(IF (userDetail.image='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', userDetail.image)) )`), 'image']
							]
						}
					},
					// {
					// 	model: models['locationOwnerDetail'],
					// 	attributes: {
					// 		include: [
					// 			[sequelize.literal(`(IF (locationOwnerDetail.image='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', locationOwnerDetail.image)) )`), 'image']
					// 		]
					// 	}
					// },
					// {
					// 	model: models['businessProfessionalDetail'],
					// 	attributes: {
					// 		include: [
					// 			[sequelize.literal(`(IF (businessProfessionalDetail.image='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', businessProfessionalDetail.image)) )`), 'image']
					// 		]
					// 	}
					// },
				],
				order: [['id', 'DESC']],
				offset: parseInt(start),
				limit: parseInt(length),
				raw: true,
				nest: true
			});
			// console.log(listing, '===========***************================================>listing');

			let responseData = [];
			const data = listing.rows.map((user, index) => {
				
				
				const roleBasedColumnDetail = {
					1: {
						image: `<img alt="image" src="${user.userDetail.image}" class="rounded-circle" width="50" data-toggle="tooltip" title="${user.userDetail.name}">`,
						user: `Name: ${user.userDetail.name}<br/>
                               Email: ${user.email}`,
						role: '<div class="badge badge-info">User</div>',
						modelTitle: 'User',
						editButtonUrl: '/admin/user/edit',
						viewButonUrl: '/admin/user/view',
					},
					2: {
						image: `<img alt="image" src="${user.userDetail.image}" class="rounded-circle" width="50" data-toggle="tooltip" title="${user.userDetail.name}">`,
						user: `Name: ${user.userDetail.name}<br/>
                               Email: ${user.email}`,
						role: '<div class="badge badge-danger">Location Owner</div>',
						modelTitle: 'Business',
						editButtonUrl: '/admin/user/edit',
						viewButonUrl: '/admin/user/view',
					},
					3: {
						image: `<img alt="image" src="${user.userDetail.image}" class="rounded-circle" width="50" data-toggle="tooltip" title="${user.userDetail.name}">`,
						user: `Name: ${user.userDetail.name}<br/>
                               Email: ${user.email}`,
						role: '<div class="badge badge-dark">Business Professional</div>',
						modelTitle: 'Business Professional',
						editButtonUrl: '/admin/user/edit',
						viewButonUrl: '/admin/user/view',
					}
				}

				const statusButton = {
					0: `<button model_id="${user.id}" model="${model}" status="${user.status}" class="btn btn-outline-danger status_btn" >Inactive</button>`,
					1: `<button model_id="${user.id}" model="${model}" status="${user.status}" class="btn btn-outline-success status_btn" >Active</button>`,
				}

				const verifiedButton = {
					0: `<div class="badge badge-warning">Unverified</div>`,
					1: `<div class="badge badge-success">Verified</div>`,
				}

				const viewButton = `<a href="${roleBasedColumnDetail[user.role]['viewButonUrl']}/${user.id}" class="btn btn-outline-info" >View</a>`;
				// const editButton = `<a href="${roleBasedColumnDetail[user.role]['editButtonUrl']}/${user.id}" class="btn btn-outline-warning" >Edit</a>`;
				const deleteButton = `<button model_id="${user.id}" model="${model}" model_title="${roleBasedColumnDetail[user.role]['modelTitle']}" datatable="${modelDataTable}" class="btn btn-outline-danger delete_btn" >Delete</button>`;

				let action = '';
				action += viewButton;
				action += '&nbsp;';
				// action += editButton;
				action += '&nbsp;';
				// action += deleteButton;

				return Object.values({
					sno: parseInt(start) + parseInt(index) + 1,
					image: roleBasedColumnDetail[user.role].image,
					user: roleBasedColumnDetail[user.role].user,
					role: roleBasedColumnDetail[user.role].role,
					regDate: moment(user.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a'),
					status: statusButton[user.status],
					verified: verifiedButton[user.verified],
					action
				});
			});

			// console.log(data, '=======================>data');
			// console.log(recordsTotal, '=======================>recordsTotal');

			responseData = {
				draw: parseInt(draw),
				recordsTotal,
				recordsFiltered: listing.count,
				data
			}

			return res.send(responseData);
		} catch (err) {
			return helper.error(res, err);
		}
	},

	locationdatatable: async (req, res) => {
		try {
			const queryParameters = req.query;
			const { draw, search, start, length } = queryParameters;
			// console.log(queryParameters, '======================>queryParameters');

			const recordsTotal = await models[model].count({
				where: {
					role: {
						[Op.notIn]: [0],
						// [Op.in]: [1,2,3],
					},
				}
			});
			console.log("111111111111111111111111--------------111111111111111111",recordsTotal);
			
			const listing = await models[model].findAndCountAll({
				where: {
					role: {
						[Op.notIn]: [0],
						[Op.in]: [1, 2, 3],
					},
					// [Op.and]: [
					// 	sequelize.literal(`user.email LIKE '%${search.value}%' || userDetail.name LIKE '%${search.value}%' || businessDetail.name LIKE '%${search.value}%'`)
					// ]
				},
				include: [
					{

						model: models['userDetail'],
						attributes: {
							include: [
								[sequelize.literal(`(IF (userDetail.image='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', userDetail.image)) )`), 'image']
							]
						}
					},
					// {
					// 	model: models['locationOwnerDetail'],
					// 	attributes: {
					// 		include: [
					// 			[sequelize.literal(`(IF (locationOwnerDetail.image='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', locationOwnerDetail.image)) )`), 'image']
					// 		]
					// 	}
					// },
					// {
					// 	model: models['businessProfessionalDetail'],
					// 	attributes: {
					// 		include: [
					// 			[sequelize.literal(`(IF (businessProfessionalDetail.image='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', businessProfessionalDetail.image)) )`), 'image']
					// 		]
					// 	}
					// },
				],
				order: [['id', 'DESC']],
				offset: parseInt(start),
				limit: parseInt(length),
				raw: true,
				nest: true
			});
			// console.log(listing, '===========***************================================>listing');

			let responseData = [];
			const data = listing.rows.map((user, index) => {
				
				
				const roleBasedColumnDetail = {
					1: {
						image: `<img alt="image" src="${user.userDetail.image}" class="rounded-circle" width="50" data-toggle="tooltip" title="${user.userDetail.name}">`,
						user: `Name: ${user.userDetail.name}<br/>
                               Email: ${user.email}`,
						role: '<div class="badge badge-info">User</div>',
						modelTitle: 'User',
						editButtonUrl: '/admin/user/edit',
						viewButonUrl: '/admin/user/view',
					},
					2: {
						image: `<img alt="image" src="${user.userDetail.image}" class="rounded-circle" width="50" data-toggle="tooltip" title="${user.userDetail.name}">`,
						user: `Name: ${user.userDetail.name}<br/>
                               Email: ${user.email}`,
						role: '<div class="badge badge-danger">Location Owner</div>',
						modelTitle: 'Business',
						editButtonUrl: '/admin/user/edit',
						viewButonUrl: '/admin/user/view',
					},
					3: {
						image: `<img alt="image" src="${user.userDetail.image}" class="rounded-circle" width="50" data-toggle="tooltip" title="${user.userDetail.name}">`,
						user: `Name: ${user.userDetail.name}<br/>
                               Email: ${user.email}`,
						role: '<div class="badge badge-dark">Business Professional</div>',
						modelTitle: 'Business Professional',
						editButtonUrl: '/admin/user/edit',
						viewButonUrl: '/admin/user/view',
					}
				}

				const statusButton = {
					0: `<button model_id="${user.id}" model="${model}" status="${user.status}" class="btn btn-outline-danger status_btn" >Inactive</button>`,
					1: `<button model_id="${user.id}" model="${model}" status="${user.status}" class="btn btn-outline-success status_btn" >Active</button>`,
				}

				const verifiedButton = {
					0: `<div class="badge badge-warning">Unverified</div>`,
					1: `<div class="badge badge-success">Verified</div>`,
				}

				const viewButton = `<a href="${roleBasedColumnDetail[user.role]['viewButonUrl']}/${user.id}" class="btn btn-outline-info" >View</a>`;
				// const editButton = `<a href="${roleBasedColumnDetail[user.role]['editButtonUrl']}/${user.id}" class="btn btn-outline-warning" >Edit</a>`;
				const deleteButton = `<button model_id="${user.id}" model="${model}" model_title="${roleBasedColumnDetail[user.role]['modelTitle']}" datatable="${modelDataTable}" class="btn btn-outline-danger delete_btn" >Delete</button>`;

				let action = '';
				action += viewButton;
				action += '&nbsp;';
				// action += editButton;
				action += '&nbsp;';
				// action += deleteButton;

				return Object.values({
					sno: parseInt(start) + parseInt(index) + 1,
					image: roleBasedColumnDetail[user.role].image,
					user: roleBasedColumnDetail[user.role].user,
					role: roleBasedColumnDetail[user.role].role,
					regDate: moment(user.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a'),
					status: statusButton[user.status],
					verified: verifiedButton[user.verified],
					action
				});
			});

			// console.log(data, '=======================>data');
			// console.log(recordsTotal, '=======================>recordsTotal');

			responseData = {
				draw: parseInt(draw),
				recordsTotal,
				recordsFiltered: listing.count,
				data
			}

			return res.send(responseData);
		} catch (err) {
			return helper.error(res, err);
		}
	},
	addUpdateUser: async (req, res) => {
		try {
			// console.log(req.body)
			// return
			const required = {
				name: req.body.name,
				role: req.body.role,
			};
			const nonRequired = {
				id: req.body.id,
				email: req.body.email,
				password: req.body.password,
				image: req.files && req.files.image,
				country_code: req.body.country_code,
				phone: req.body.phone,
				location: req.body.location
			};

			let requestData = await helper.vaildObject(required, nonRequired);	

			// requestData.countryCodePhone = `${requestData.countryCode}${requestData.phone}`;

			if (requestData.hasOwnProperty('password') && requestData.password) {
				requestData.password = helper.bcryptHash(requestData.password);
			}

			const imageFolders = {
			    0: 'admin',
			    1: 'user',
			    2: 'user',
			    3: 'user',

			
			}

			if (req.files && req.files.image) {
				requestData.image = helper.imageUpload(req.files.image, 'user');
			}

			const userId = await helper.save(models[model], requestData);
			const user = await module.exports.findOneUser(userId);
			// console.log(user, '=================================================>user');

			user.hasOwnProperty(userRoleModels[user.role]) && user[userRoleModels[user.role]].hasOwnProperty('id') && user[userRoleModels[user.role]].id ? requestData.id = user[userRoleModels[user.role]].id : delete requestData.id;
			requestData.userId = user.id;

			// console.log(requestData,'requestData before save in detail model')
			log(models[userRoleModels[user.role]], 'models[userRoleModels[user.role]]');
			
			await helper.save(models[userRoleModels[user.role]], requestData);

			let message = `${roleTypes[user.role]} ${requestData.hasOwnProperty('id') ? `${req.session.admin.id == user.id ? 'Profile ' : ''}Updated` : 'Added'} Successfully.`;

			req.flash('flashMessage', { color: 'success', message });

			if (user.role == 0 || user.role == 4) {
				return helper.success(res, message, user);
			}

			res.redirect('/admin/user/listing');

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
						],
					}
				},
				{
					model: models['locationOwnerDetail'],
					include:[
							{
							  model: models['locationOwnerDetailImage'],
							//   required: false ,
							  
							}
						  ]
					// attributes: {
					// 	include: [
					// 		[sequelize.literal(`(IF (locationOwnerDetail.image= '', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', locationOwnerDetail.image)) )`), 'image']
					// 	],
					// 	// include:[
					// 	// 	{
					// 	// 	  model: locationOwnerDetailImage,
					// 	// 	  required: false ,
							  
					// 	// 	}
					// 	//   ]
					// }
				},
				{
					model: models['businessProfessionalDetail'],
					include: [
						{
						model: models['category'],
					},
					{
						  model: models['businessImage'],
						}
				],
					// attributes: {
					// 	include: [
					// 		[sequelize.literal(`(IF (businessProfessionalDetail.image='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', businessProfessionalDetail.image)) )`), 'image']
					// 	],
					// },
					// include:[
					// 	{
					// 	  model: businessImage,
					// 	  required: false ,
						  
					// 	}
					//   ]
				},
				
			],
			raw: true,
			nest: true,
		})
	},
}
const models = require('../../models');
const helper = require('../../helpers/helper');
const Paginator = require("paginator");
const sequelize = require("sequelize");
const { request } = require('express');
const { Op } = sequelize;

const prefixBaseName = 'reviewAdmin';
const model = 'user';
const modelBaseName = 'restaurant';
const modelTitle = 'Restaurant';
const modelImageFolder = 'restaurant';
const modelDataTable = '';

module.exports = {
    listing: async (req, res) => {
        try {
            global.currentModule = modelTitle;
            global.currentSubModule = 'Listing';
            global.currentSubModuleSidebar = 'listing';

            const listing = await module.exports.findAllData();


            console.log(JSON.stringify(listing, null, 2), '======================================>listing');
            // return;

            const data = listing.map((row, index) => {
                const statusButton = {
                    0: `<button model_id="${row.id}" model="${model}" status="${row.status}" class="btn btn-outline-danger status_btn" >Inactive</button>`,
                    1: `<button model_id="${row.id}" model="${model}" status="${row.status}" class="btn btn-outline-success status_btn" >Active</button>`,
                }


                const viewButton = `<a href="/${prefixBaseName}/${modelBaseName}/view/${row.id}" class="btn btn-outline-info" >View</a>`;
                const editButton = `<a href="/${prefixBaseName}/${modelBaseName}/edit/${row.id}" class="btn btn-outline-warning" >Edit</a>`;
                const deleteButton = `<button model_id="${row.id}" model="${model}" model_title="${modelTitle}" datatable="${modelDataTable}" class="btn btn-outline-danger delete_btn" >Delete</button>`;

                let action = '';
                action += viewButton;
                action += '&nbsp;';
                action += editButton;
                action += '&nbsp;';
                action += deleteButton;

                return Object.values({
                    sno: parseInt(index) + 1,
                    image: `<img alt="image" src="${row.restaurantDetail.coverImage}" class="datatable_list_image" data-toggle="tooltip" title="${row.restaurantDetail.coverImage}">`,
                    name: row.restaurantDetail.name,
                    dateCreated: moment(row.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                    status: statusButton[row.status],
                    action
                });
            });

            const headerColumns = Object.values({
                sno: '#',
                image: 'Cover Image',
                name: 'Name',
                dateCreated: 'Date Created',
                status: 'Status',
                action: 'Action',
            });

            return res.render(`${prefixBaseName}/${modelBaseName}/listing`, { headerColumns, data });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    add: async (req, res) => {
        try {
            global.currentModule = modelTitle;
            global.currentSubModule = 'Add';
            global.currentSubModuleSidebar = 'add';

            const restaurantTypes = await models['restaurantType'].findAll({
                where: {
                    status: 1,
                }
            }).map(data => data.toJSON());

            const foodTypes = await models['foodType'].findAll({
                where: {
                    status: 1,
                }
            }).map(data => data.toJSON());

            return res.render(`${prefixBaseName}/${modelBaseName}/addEditView`, { page: 'add', row: undefined, prefixBaseName, modelBaseName, restaurantTypes, foodTypes });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    edit: async (req, res) => {
        try {
            global.currentModule = modelTitle;
            global.currentSubModuleSidebar = '';
            global.currentSubModule = `Edit`;

            const row = await module.exports.findOneData(req.params.id);

            console.log(JSON.stringify(row, null, 2), '======================================>listing');
            // return;

            const restaurantTypes = await models['restaurantType'].findAll({
                where: {
                    status: 1,
                }
            }).map(data => data.toJSON());

            const foodTypes = await models['foodType'].findAll({
                where: {
                    status: 1,
                }
            }).map(data => data.toJSON());

            return res.render(`${prefixBaseName}/${modelBaseName}/addEditView`, { page: 'edit', row, prefixBaseName, modelBaseName, restaurantTypes, foodTypes });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    view: async (req, res) => {
        try {
            global.currentModule = modelTitle;
            global.currentSubModuleSidebar = 'listing';

            global.currentSubModule = `View`;
            const row = await module.exports.findOneData(req.params.id);

            console.log(JSON.stringify(row, null, 2), '====================================>row');

            const restaurantTypes = await models['restaurantType'].findAll({
                where: {
                    status: 1,
                }
            }).map(data => data.toJSON());

            const foodTypes = await models['foodType'].findAll({
                where: {
                    status: 1,
                }
            }).map(data => data.toJSON());
            
            return res.render(`${prefixBaseName}//${modelBaseName}/addEditView`, { page: 'view', row, prefixBaseName, modelBaseName, restaurantTypes, foodTypes });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    addUpdate: async (req, res) => {
        try {
            const required = {
                vendorId: adminData.id,
                name: req.body.name,
                role: 5,
            };
            const nonRequired = {
                id: req.body.id,
                coverImage: req.files && req.files.coverImage,
                ...req.body
            };

            let requestData = await helper.vaildObject(required, nonRequired);

            if (req.files && req.files.coverImage) {
                requestData.coverImage = helper.imageUpload(req.files.coverImage, modelImageFolder);
            }

            const rowId = await helper.save(models[model], requestData);
            const row = await module.exports.findOneData(rowId);
            console.log(row, '=================================================>row');

            row['restaurantDetail'] && row['restaurantDetail'].hasOwnProperty('id') ? requestData.id = row['restaurantDetail'].id : delete requestData.id;
            requestData.userId = row.id;

            await helper.save(models['restaurantDetail'], requestData);

            let message = `${modelTitle} ${requestData.hasOwnProperty('id') ? `Updated` : 'Added'} Successfully.`;

            req.flash('flashMessage', { color: 'success', message });

            res.redirect(`/${prefixBaseName}/${modelBaseName}/listing`);
        } catch (err) {
            err.code = 200;
            return helper.error(res, err);
        }
    },
    ajaxBoilerPlate: async (req, res) => {
        try {
            const requestData = helper.clone(req.body);
            console.log(requestData, '=============>requestData');

            const childCategories = await models[model].findAll({
                where: {
                    parentId: requestData.id,
                    status: 1
                },
                raw: true
            });

            return helper.success(res, `Child Categories fetched successfully`, childCategories);
        } catch (err) {
            err.code = 200;
            return helper.error(res, err);
        }
    },
    findOneData: async (id) => {
        let data = await models[model].findOne({
            where: {
                id,
                role: 5
            },
            include: [
                {
                    model: models['restaurantDetail'],
                    attributes: {
                        include: [
                            [sequelize.literal(`(IF (restaurantDetail.coverImage='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/restaurant/', restaurantDetail.coverImage)) )`), 'coverImage']
                        ]
                    },
                    include: [
                        {
                            model: models['restaurantType'],
                            required: false,
                        },
                        {
                            model: models['foodType'],
                            required: false,
                        },
                    ]
                },
            ],
            // raw: true
        });

        if (data) data = data.toJSON();

        return data;
    },
    findAllData: async (whereConditions) => {
        let data = await models[model].findAll({
            where: {
                role: 5,
                ...whereConditions
            },
            include: [
                {
                    model: models['restaurantDetail'],
                    attributes: {
                        include: [
                            [sequelize.literal(`(IF (restaurantDetail.coverImage='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/restaurant/', restaurantDetail.coverImage)) )`), 'coverImage']
                        ]
                    },
                    include: [
                        {
                            model: models['restaurantType'],
                            required: false,
                        },
                        {
                            model: models['foodType'],
                            required: false,
                        },
                    ]
                },
            ],
            order: [['id', 'DESC']],
            // raw: true
        }).map(data => data.toJSON());

        return data;
    },

}
const models = require('../../models');
const helper = require('../../helpers/helper');
const Paginator = require("paginator");
const sequelize = require("sequelize");
const { request } = require('express');
const { Op } = sequelize;
// const User = models.user;
// const UserDetail = models.userDetail;
// const DriverDetail = models.driverDetail;

const prefixBaseName = 'reviewAdmin';
const model = "foodType";
global.modelTitle = "Food Type";
global.modelDataTable = "";


module.exports = {
    listing: async (req, res) => {
        try {
            global.currentModule = 'Food Type';
            global.currentSubModule = 'Listing';
            global.currentSubModuleSidebar = 'listing';
            const modelTitle = 'Food Type';

            const listing = await module.exports.findAllData();
            // console.log(listing, '===========================================>listing');

            const data = listing.map((row, index) => {
                const statusButton = {
                    0: `<button model_id="${row.id}" model="${model}" status="${row.status}" class="btn btn-outline-danger status_btn" >Inactive</button>`,
                    1: `<button model_id="${row.id}" model="${model}" status="${row.status}" class="btn btn-outline-success status_btn" >Active</button>`,
                }


                const viewButton = `<a href="/${prefixBaseName}/${model}/view/${row.id}" class="btn btn-outline-info" >View</a>`;
                const editButton = `<a href="/${prefixBaseName}/${model}/edit/${row.id}" class="btn btn-outline-warning" >Edit</a>`;
                const deleteButton = `<button model_id="${row.id}" model="${model}" model_title="${modelTitle}" datatable="${modelDataTable}" class="btn btn-outline-danger delete_btn" >Delete</button>`;

                let action = '';
                action += viewButton;
                action += '&nbsp;';
                action += editButton;
                action += '&nbsp;';
                action += deleteButton;

                return Object.values({
                    sno: parseInt(index) + 1,
                    name: row.name,
                    dateCreated: moment(row.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                    status: statusButton[row.status],
                    action
                });
            });

            const headerColumns = Object.values({
                sno: '#',
                name: 'Name',
                dateCreated: 'Date Created',
                status: 'Status',
                action: 'Action',
            });

            return res.render(`${prefixBaseName}/${model}/listing`, { headerColumns, data });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    add: async (req, res) => {
        try {
            global.currentModule = 'Food Type';
            global.currentSubModule = 'Add';
            global.currentSubModuleSidebar = 'add';

            return res.render(`${prefixBaseName}/${model}/addEdit`, { prefixBaseName, model, row: undefined });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    edit: async (req, res) => {
        try {
            global.currentModule = 'Food Type';
            global.currentSubModuleSidebar = '';

            const row = await module.exports.findOneData(req.params.id);
            global.currentSubModule = `Edit`;

            return res.render(`${prefixBaseName}/${model}/addEdit`, { prefixBaseName, model, row });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    view: async (req, res) => {
        try {
            global.currentModule = 'Food Type';
            global.currentSubModuleSidebar = 'listing';

            const row = await module.exports.findOneData(req.params.id);
            global.currentSubModule = `View`;

            return res.render(`${prefixBaseName}/${model}/view`, { row });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    addUpdate: async (req, res) => {
        try {
            const required = {
                name: req.body.name,
            };
            const nonRequired = {
                id: req.body.id,
                image: req.files && req.files.image
            };

            let requestData = await helper.vaildObject(required, nonRequired);

            if (req.files && req.files.image) {
                requestData.image = helper.imageUpload(req.files.image, model);
            }

            const moduleModelId = await helper.save(models[model], requestData);
            const row = await module.exports.findOneData(moduleModelId);
            console.log(row, '=================================================>row');

            let message = `${modelTitle} ${requestData.hasOwnProperty('id') ? `Updated` : 'Added'} Successfully.`;

            req.flash('flashMessage', { color: 'success', message });

            res.redirect(`/${prefixBaseName}/${model}/listing`);
        } catch (err) {
            err.code = 200;
            return helper.error(res, err);
        }
    },
    findOneData: async (id) => {
        let data = await models[model].findOne({
            where: {
                id,
            },
            order: [['id', 'DESC']],
        });

        if (data) data = data.toJSON();
        return data;
    },
    findAllData: async () => {
        return await models[model].findAll({
            order: [['id', 'DESC']],
        }).map(singleData => singleData.toJSON());
    },

}
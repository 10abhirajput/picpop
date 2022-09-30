const models = require('../../models');
const helper = require('../../helpers/helper');
const Paginator = require("paginator");
const sequelize = require("sequelize");
const { request } = require('express');
const { Op } = sequelize;

const prefixBaseName = 'sellerAdmin';
const model = 'subCategory';
const modelBaseName = 'subCategory';
const modelTitle = 'Sub Category';
const modelImageFolder = 'subCategory';
const modelDataTable = '';

module.exports = {
    listing: async (req, res) => {
        try {
            global.currentModule = modelTitle;
            global.currentSubModule = 'Listing';
            global.currentSubModuleSidebar = 'listing';

            const listing = await models[model].findAll({
                include: [
                    {
                        model: models['category'],
                        required: true
                    }
                ],
                order: [['id', 'DESC']]
                // hierarchy: true,
            });


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
                    name: row.name,
                    category: row.category.name,
                    dateCreated: moment(row.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                    status: statusButton[row.status],
                    action
                });
            });

            const headerColumns = Object.values({
                sno: '#',
                name: 'Name',
                category: 'Category',
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

            const categories = await models['category'].findAll({
                where: {
                    status: 1
                }
            });

            return res.render(`${prefixBaseName}/${modelBaseName}/addEdit`, { row: undefined, prefixBaseName, modelBaseName, categories });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    edit: async (req, res) => {
        try {
            global.currentModule = modelTitle;
            global.currentSubModuleSidebar = '';
            global.currentSubModule = `Edit`;
            
            const row = await module.exports.findOne(req.params.id);

            const categories = await models['category'].findAll({
                where: {
                    status: 1
                }
            });

            console.log(JSON.stringify(row, null, 2), '======================================>listing');
            // return;

            return res.render(`${prefixBaseName}/${modelBaseName}/addEdit`, { row, prefixBaseName, modelBaseName, categories });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    view: async (req, res) => {
        try {
            global.currentModule = modelTitle;
            global.currentSubModuleSidebar = 'listing';

            global.currentSubModule = `View`;
            const row = await module.exports.findOne(req.params.id);

            console.log(JSON.stringify(row, null, 2), '====================================>row');

            const categories = await models['category'].findAll({
                where: {
                    status: 1
                }
            });
            

            // function getHierarchy(row) {
            //     if (!row) return;
            //     let html = '';
            //     html += `
            //     <ul>
            //         <li>${row && row.name}</li>`;
            //     if (row.hasOwnProperty('children') && Array.isArray(row.children)) {
            //         row.children.forEach(child => {
            //             html += getHierarchy(child);
            //         });
            //     }
            //     html += `</ul>`;
            //     return html;
            // }

            return res.render(`${prefixBaseName}//${modelBaseName}/view`, { row, prefixBaseName, modelBaseName, categories });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    addUpdate: async (req, res) => {
        try {
            const required = {
                vendorId: adminData.id,
                ...req.body
                // name: req.body.name,
                // name: req.body.name,
            };
            const nonRequired = {
                id: req.body.id,
                image: req.files && req.files.image
            };

            let requestData = await helper.vaildObject(required, nonRequired);

            if (req.files && req.files.image) {
                requestData.image = helper.imageUpload(req.files.image, modelImageFolder);
            }

            const rowId = await helper.save(models[model], requestData);
            const row = await module.exports.findOne(rowId);
            console.log(row, '=================================================>row');

            let message = `${modelTitle} ${requestData.hasOwnProperty('id') ? `Updated` : 'Added'} Successfully.`;

            req.flash('flashMessage', { color: 'success', message });

            res.redirect(`/${prefixBaseName}/${modelBaseName}/listing`);
        } catch (err) {
            err.code = 200;
            return helper.error(res, err);
        }
    },
    findOne: async (id) => {
        return await models[model].findOne({
            where: { id },
            raw: true
        });
    },

}
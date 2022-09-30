const models = require('../../models');
const helper = require('../../helpers/helper');
const Paginator = require("paginator");
const sequelize = require("sequelize");
const { request } = require('express');
const category = require('../../models/category');
const { Op } = sequelize;

const prefixBaseName = 'admin';
const model = 'banner';
const modelBaseName = 'banner';
const modelTitle = 'Banner';
const modelImageFolder = 'banner';
const modelDataTable = '';

module.exports = {
    listing: async (req, res) => {
        try {
            global.currentModule = modelTitle;
            global.currentSubModule = 'Listing';
            global.currentSubModuleSidebar = 'listing';

            const listing = await models[model].findAll({
                order: [['id', 'DESC']],
                raw: true,
            });
            const data = await Promise.all(listing.map(async (row, index) => {
                const statusButton = {
                    0: `<button model_id="${row.id}" model="${model}" status="${row.status}" class="btn btn-outline-danger status_btn" >Inactive</button>`,
                    1: `<button model_id="${row.id}" model="${model}" status="${row.status}" class="btn btn-outline-success status_btn" >Active</button>`,
                }

                // const viewButton = `<a href="/${prefixBaseName}/flavour/view/${row.id}" class="btn btn-outline-info" >View</a>`;
                const editButton = `<a href="/${prefixBaseName}/banner/edit/${row.id}" class="btn btn-outline-warning" >Edit</a>`;
                const deleteButton = `<button model_id="${row.id}" model="${model}" model_title="${modelTitle}" datatable="${modelDataTable}" class="btn btn-outline-danger delete_btn" >Delete</button>`;

                let action = '';
                // action += viewButton;
                // action += '&nbsp;';
                action += editButton;
                action += '&nbsp;';
                action += deleteButton;

                return Object.values({
                    sno: parseInt(index) + 1,
                    // id: row.id, 
                    Image: `<img alt="image" src="/uploads/banner/${ row.image}" class="rounded-circle" width="50" data-toggle="tooltip"  title="${ row.image}">`,
                    
                    dateCreated: moment(row.createdAt).format('dddd, MMMM Do YYYY'),
                    status: statusButton[row.status],
                    action
                });
            }));

            const headerColumns = Object.values({
                sno: '#',
                // id: 'ID',
                image:'Image',
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

            //const parent = await module.exports.getParent();

            return res.render(`${prefixBaseName}/${modelBaseName}/addEdit`, { row: undefined, prefixBaseName, modelBaseName });
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


            return res.render(`${prefixBaseName}/${modelBaseName}/addEdit`, { row, prefixBaseName, modelBaseName });
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

            
            return res.render(`${prefixBaseName}/${modelBaseName}/view`, { row, prefixBaseName, modelBaseName });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    addUpdate: async (req, res) => {
        try {
            const required = {
                image:req.files && req.files.image,
            };
            const nonRequired = {
                id: req.body.id,
                
               // parentId: req.body.parentId,
            };

            let requestData = await helper.vaildObject(required, nonRequired);

            //console.log(req.files, '====================>requestData');

            if (req.files && req.files.image) {
                requestData.image = helper.imageUpload(req.files.image, modelImageFolder);
            }

            const rowId = await helper.save(models[model], requestData);
            const row = await module.exports.findOne(rowId);
            console.log(row, '=================================================>row');

            let message = `${modelTitle} ${requestData.hasOwnProperty('id') ? `Updated` : 'Added'} Successfully.`;

            req.flash('flashMessage', { color: 'success', message });

            res.redirect(`/admin/banner/listing`);
        } catch (err) {
            err.code = 200;
            return helper.error(res, err);
        }
    },
    findOne: async (id) => {
        return await models[model].findOne({
            attributes:{
                include:[helper.makeImageUrlSql('banner','image','banner')]
            },
            where: { id },
            raw: true
        });
    },
  

}
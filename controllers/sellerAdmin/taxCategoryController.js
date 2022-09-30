const models = require('../../models');
const helper = require('../../helpers/helper');
const Paginator = require("paginator");
const sequelize = require("sequelize");
const { request } = require('express');
const { Op } = sequelize;
// const User = models.user;
// const UserDetail = models.userDetail;
// const DriverDetail = models.driverDetail;

const model = "taxCategory";
global.modelTitle = "Tax Category";
global.modelDataTable = "";


module.exports = {
    listing: async (req, res) => {
        try {
            global.currentModule = 'Tax Category';
            global.currentSubModule = 'Listing';
            global.currentSubModuleSidebar = 'listing';
            const modelTitle = 'Tax Category';

            const listing = await models[model].findAll({
                where: {
                    vendorId: adminData.id
                },
                order: [['id', 'DESC']],
                raw: true,
                nest: true
            });
            // console.log(listing, '===========================================>listing');

            const data = listing.map((taxCategory, index) => {


                const statusButton = {
                    0: `<button model_id="${taxCategory.id}" model="${model}" status="${taxCategory.status}" class="btn btn-outline-danger status_btn" >Inactive</button>`,
                    1: `<button model_id="${taxCategory.id}" model="${model}" status="${taxCategory.status}" class="btn btn-outline-success status_btn" >Active</button>`,
                }


                const viewButton = `<a href="/sellerAdmin/taxCategory/view/${taxCategory.id}" class="btn btn-outline-info" >View</a>`;
                const editButton = `<a href="/sellerAdmin/taxCategory/edit/${taxCategory.id}" class="btn btn-outline-warning" >Edit</a>`;
                const deleteButton = `<button model_id="${taxCategory.id}" model="${model}" model_title="${modelTitle}" datatable="${modelDataTable}" class="btn btn-outline-danger delete_btn" >Delete</button>`;

                let action = '';
                action += viewButton;
                action += '&nbsp;';
                action += editButton;
                action += '&nbsp;';
                action += deleteButton;

                return Object.values({
                    sno: parseInt(index) + 1,
                    taxCategory: taxCategory.taxCategory,
                    taxInPercent: taxCategory.taxInPercent == 0 ? 'No' : 'Yes',
                    taxValue: taxCategory.taxValue,
                    dateCreated: moment(taxCategory.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                    status: statusButton[taxCategory.status],
                    action
                });
            });

            const headerColumns = Object.values({
                sno: '#',
                taxCategory: 'Tax Category',
                taxInPercent: 'Tax in Percent',
                taxValue: 'Tax Value',
                dateCreated: 'Date Created',
                status: 'Tax Amount',
                action: 'Action',
            });

            return res.render('sellerAdmin/taxCategory/listing', { headerColumns, data });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    add: async (req, res) => {
        try {
            global.currentModule = 'Tax Category';
            global.currentSubModule = 'Add';
            global.currentSubModuleSidebar = 'add';

            return res.render('sellerAdmin/taxCategory/addEdit', { taxCategory: undefined });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    edit: async (req, res) => {
        try {
            global.currentModule = 'Tax Category';
            global.currentSubModuleSidebar = '';

            const taxCategory = await module.exports.findOneTaxCategory(req.params.id);
            global.currentSubModule = `Edit`;

            return res.render('sellerAdmin/taxCategory/addEdit', { taxCategory });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    view: async (req, res) => {
        try {
            global.currentModule = 'Tax Category';
            global.currentSubModuleSidebar = 'listing';

            const taxCategory = await module.exports.findOneTaxCategory(req.params.id);
            global.currentSubModule = `View`;

            return res.render('sellerAdmin/taxCategory/view', { taxCategory });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    addUpdateTaxCategory: async (req, res) => {
        try {
            const required = {
                vendorId: adminData.id,
                taxCategory: req.body.taxCategory,
                taxInPercent: req.body.taxInPercent,
                taxValue: req.body.taxValue,
            };
            const nonRequired = {
                id: req.body.id,
                image: req.files && req.files.image
            };

            let requestData = await helper.vaildObject(required, nonRequired);

            if (req.files && req.files.image) {
                requestData.image = helper.imageUpload(req.files.image, 'taxCategory');
            }

            const taxCategoryId = await helper.save(models[model], requestData);
            const taxCategory = await module.exports.findOneTaxCategory(taxCategoryId);
            console.log(taxCategory, '=================================================>taxCategory');

            let message = `Tax Category ${requestData.hasOwnProperty('id') ? `Updated` : 'Added'} Successfully.`;

            req.flash('flashMessage', { color: 'success', message });

            res.redirect('/sellerAdmin/taxCategory/listing'); 
        } catch (err) {
            err.code = 200;
            return helper.error(res, err);
        }
    },
    findOneTaxCategory: async (id) => {
        return await models[model].findOne({
            where: {
                id,
                vendorId: adminData.id
            },
            order: [['id', 'DESC']],
            raw: true,
            nest: true
        });
    },

}
const models = require('../../models');
const sequelize = require('sequelize');
const helper = require('../../helpers/helper');
const { request } = require('express');

const BASE_PREFIX = 'reviewAdmin';
const User = models.user;
const AdminDetail = models.adminDetail;

module.exports = {
    dashboard: async (req, res) => {
        try {
            global.currentModule = 'Dashboard';

            let getCounts = await User.findOne({
                attributes: [
                    [sequelize.literal('(SELECT COUNT(*) FROM user WHERE user.role=5)'), 'restaurant'],
                    [sequelize.literal('(SELECT COUNT(*) FROM restaurantType)'), 'restaurantType'],
                    [sequelize.literal('(SELECT COUNT(*) FROM foodType)'), 'foodType'],
                    // [sequelize.literal(`(SELECT COUNT(*) FROM \`order\` AS o WHERE o.vendorId=${adminData.id})`), 'order'],
                ],
                raw: true
            });
            console.log(getCounts, '===============>getCounts');

            return res.render(`${BASE_PREFIX}/home/dashboard`, { getCounts });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    dashboardCounts: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
            };
            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            // let getCounts = await User.findOne({
            //     attributes: [
            //         [sequelize.literal('(SELECT COUNT(*) FROM users WHERE users.role=1)'), 'users'],
            //         [sequelize.literal('(SELECT COUNT(*) FROM communities)'), 'communities'],
            //         [sequelize.literal('(SELECT COUNT(*) FROM journals)'), 'journals'],
            //         [sequelize.literal('(SELECT COUNT(*) FROM posts)'), 'posts'],
            //         [sequelize.literal('(SELECT COUNT(*) FROM reported_posts)'), 'reportedPosts'],
            //         [sequelize.literal('(SELECT COUNT(*) FROM `order`)'), 'order'],
            //         [sequelize.literal('(SELECT count(*) FROM orderCancellationRequest)'), 'orderCancellationRequest'],
            //     ],
            //     raw: true
            // });

            // console.log(getCounts,  '======================>getCounts'); return;

            return helper.success(res, 'Admin Dashboard Count Fetched Successfully.', getCounts);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    updateStatus: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                id: req.body.id,
                status: req.body.status,
                model: req.body.model
            };
            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            const updatedItem = await helper.save(models[requestData.model], requestData, true);

            return helper.success(res, 'Status Updated Successfully.', updatedItem);
        } catch (err) {
            err.code = 200;
            return helper.error(res, err);
        }
    },
    delete: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                id: req.body.id,
                model: req.body.model
            };
            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            const deleteItem = await models[requestData.model].destroy({
                where: {
                    id: requestData.id
                }
            });

            return helper.success(res, 'Item Deleted Successfully.', deleteItem);
        } catch (err) {
            err.code = 200;
            return helper.error(res, err);
        }
    },

    changeField: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                id: req.body.id,
                field: req.body.field,
                fieldValue: req.body.fieldValue,
                model: req.body.model
            };
            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            requestData[requestData.field] = requestData.fieldValue;
            const updatedItem = await helper.save(models[requestData.model], requestData, true);

            return helper.success(res, 'Status Updated Successfully.', updatedItem);
        } catch (err) {
            err.code = 200;
            return helper.error(res, err);
        }
    },
}
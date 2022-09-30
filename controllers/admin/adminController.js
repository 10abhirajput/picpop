const models = require('../../models');
const sequelize = require('sequelize');
const helper = require('../../helpers/helper');
const { request } = require('express');

const User = models.user;
const AdminDetail = models.adminDetail;

module.exports = {
    dashboard: async (req, res) => {
        try {
            global.currentModule = 'Dashboard';

            let getCounts = await User.findOne({
                attributes: [
                    [sequelize.literal('(SELECT COUNT(*) FROM user WHERE user.role=1)'), 'user'],
                    [sequelize.literal('(SELECT COUNT(*) FROM user WHERE user.role=2)'), 'locationOwner'],
                    [sequelize.literal('(SELECT COUNT(*) FROM user WHERE user.role=3)'), 'businessProfessional'],
                    [sequelize.literal('(SELECT COUNT(*) FROM `featurePlan` AS f)'), 'featurePlan'],
                    [sequelize.literal('(SELECT COUNT(*) FROM `category` AS c)'), 'category'],
                    [sequelize.literal('(SELECT COUNT(*) FROM `reviews` AS r)'), 'review'],
                    [sequelize.literal('(SELECT COUNT(*) FROM `contact_us` AS cu)'), 'contact_us'],
                    [sequelize.literal('(SELECT COUNT(*) FROM `bookings` AS b)'), 'bookings'],
                    [sequelize.literal('(SELECT COUNT(*) FROM `card_payment` AS t)'), 'transaction'],
                    [sequelize.literal('(SELECT COUNT(*) FROM `order` AS o)'), 'order'],
                    [sequelize.literal("(SELECT COUNT(*) FROM `orderCancellationRequest` AS `orderCancellationRequest` INNER JOIN `order` AS `order` ON `orderCancellationRequest`.`orderId` = `order`.`id` INNER JOIN `user` AS `order->customer` ON `order`.`customerId` = `order->customer`.`id` LEFT OUTER JOIN `userDetail` AS `order->customer->userDetail` ON `order->customer`.`id` = `order->customer->userDetail`.`userId` INNER JOIN `user` AS `order->vendor` ON `order`.`vendorId` = `order->vendor`.`id` LEFT OUTER JOIN `vendorDetail` AS `order->vendor->vendorDetail` ON `order->vendor`.`id` = `order->vendor->vendorDetail`.`userId` ORDER BY `orderCancellationRequest`.`id` DESC)"), 'orderCancellationRequest'],
                    // [sequelize.literal("(SELECT COUNT(*) FROM `orderRefundRequest` AS `orderRefundRequest` INNER JOIN `order` AS `order` ON `orderRefundRequest`.`orderId` = `order`.`id` INNER JOIN `user` AS `order->customer` ON `order`.`customerId` = `order->customer`.`id` LEFT OUTER JOIN `userDetail` AS `order->customer->userDetail` ON `order->customer`.`id` = `order->customer->userDetail`.`userId` INNER JOIN `user` AS `order->vendor` ON `order`.`vendorId` = `order->vendor`.`id` LEFT OUTER JOIN `vendorDetail` AS `order->vendor->vendorDetail` ON `order->vendor`.`id` = `order->vendor->vendorDetail`.`userId`  ORDER BY `orderRefundRequest`.`id` DESC)"), 'orderRefundRequest'],
                    // [sequelize.literal("(SELECT COUNT(*) FROM `orderWithdrawalRequest` AS `orderWithdrawalRequest` INNER JOIN `order` AS `order` ON `orderWithdrawalRequest`.`orderId` = `order`.`id` INNER JOIN `user` AS `order->customer` ON `order`.`customerId` = `order->customer`.`id` LEFT OUTER JOIN `userDetail` AS `order->customer->userDetail` ON `order->customer`.`id` = `order->customer->userDetail`.`userId` INNER JOIN `user` AS `order->vendor` ON `order`.`vendorId` = `order->vendor`.`id` LEFT OUTER JOIN `vendorDetail` AS `order->vendor->vendorDetail` ON `order->vendor`.`id` = `order->vendor->vendorDetail`.`userId` ORDER BY `orderWithdrawalRequest`.`id` DESC)"), 'orderWithdrawalRequests'],
                    [sequelize.literal("(SELECT COUNT(*) FROM (SELECT DATE(`order`.`createdAt`) AS `grouped_date`, COUNT(*) AS `count` FROM `order` AS `order` INNER JOIN `user` AS `customer` ON `order`.`customerId` = `customer`.`id` LEFT OUTER JOIN `userDetail` AS `customer->userDetail` ON `customer`.`id` = `customer->userDetail`.`userId` INNER JOIN `user` AS `vendor` ON `order`.`vendorId` = `vendor`.`id` LEFT OUTER JOIN `vendorDetail` AS `vendor->vendorDetail` ON `vendor`.`id` = `vendor->vendorDetail`.`userId` GROUP BY `grouped_date` ORDER BY `order`.`id` DESC) as tt)"), 'salesReport'],
                    [sequelize.literal("(SELECT COUNT(*) FROM (SELECT `order`.`id` FROM `order` AS `order` INNER JOIN `user` AS `customer` ON `order`.`customerId` = `customer`.`id` LEFT OUTER JOIN `userDetail` AS `customer->userDetail` ON `customer`.`id` = `customer->userDetail`.`userId` INNER JOIN `user` AS `vendor` ON `order`.`vendorId` = `vendor`.`id` LEFT OUTER JOIN `vendorDetail` AS `vendor->vendorDetail` ON `vendor`.`id` = `vendor->vendorDetail`.`userId` GROUP BY `customerId` ORDER BY `order`.`id` DESC) AS tt)"), 'userReport'],
                    [sequelize.literal("(SELECT COUNT(*) FROM (SELECT `order`.`id` FROM `order` AS `order` INNER JOIN `user` AS `customer` ON `order`.`customerId` = `customer`.`id` LEFT OUTER JOIN `userDetail` AS `customer->userDetail` ON `customer`.`id` = `customer->userDetail`.`userId` INNER JOIN `user` AS `vendor` ON `order`.`vendorId` = `vendor`.`id` LEFT OUTER JOIN `vendorDetail` AS `vendor->vendorDetail` ON `vendor`.`id` = `vendor->vendorDetail`.`userId` GROUP BY `vendorId` ORDER BY `order`.`id` DESC) AS tt)"), 'sellerReport'],
                    [sequelize.literal("(SELECT COUNT(*) FROM (SELECT `order`.`id` FROM `order` AS `order` INNER JOIN `user` AS `customer` ON `order`.`customerId` = `customer`.`id` LEFT OUTER JOIN `userDetail` AS `customer->userDetail` ON `customer`.`id` = `customer->userDetail`.`userId` INNER JOIN `user` AS `vendor` ON `order`.`vendorId` = `vendor`.`id` LEFT OUTER JOIN `vendorDetail` AS `vendor->vendorDetail` ON `vendor`.`id` = `vendor->vendorDetail`.`userId` GROUP BY `vendorId` ORDER BY `order`.`id` DESC) AS tt)"), 'taxReport'],
                    [sequelize.literal("(SELECT COUNT(*) FROM (SELECT `order`.`id` FROM `order` AS `order` INNER JOIN `user` AS `customer` ON `order`.`customerId` = `customer`.`id` LEFT OUTER JOIN `userDetail` AS `customer->userDetail` ON `customer`.`id` = `customer->userDetail`.`userId` INNER JOIN `user` AS `vendor` ON `order`.`vendorId` = `vendor`.`id` LEFT OUTER JOIN `vendorDetail` AS `vendor->vendorDetail` ON `vendor`.`id` = `vendor->vendorDetail`.`userId` GROUP BY `vendorId` ORDER BY `order`.`id` DESC) AS tt)"), 'commissionReport'],
                ],
                raw: true
            });
            console.log(getCounts, '===============>getCounts');

            return res.render('admin/home/dashboard', { getCounts });
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
                // securitykey: req.headers.securitykey,
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
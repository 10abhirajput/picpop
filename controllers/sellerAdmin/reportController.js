const models = require('../../models');
const helper = require('../../helpers/helper');
const Paginator = require("paginator");
const sequelize = require("sequelize");
const { request } = require('express');
const { Op } = sequelize;
// const User = models.user;
// const UserDetail = models.userDetail;
// const DriverDetail = models.driverDetail;

global.model = "order";
global.modelTitle = "Order";
global.modelDataTable = "reportDataTable";

const roleTypes = {
    0: 'Admin',
    1: 'User',
    2: 'Driver',
    3: 'Vendor'
}
const userRoleModels = {
    0: 'adminetail',
    1: 'userDetail',
    2: 'driverDetail',
    3: 'vendorDetail',
}

module.exports = {
    salesReport: async (req, res) => {
        try {
            global.currentModule = 'Report';
            global.currentSubModule = 'Sales Report';
            global.currentSubModuleSidebar = 'salesReport';

            const { from, to } = req.query;

            const listing = await models[model].findAll({
                where: {
                    ...(
                        from && to
                            ? {
                                [Op.and]: [
                                    sequelize.literal(`DATE(order.createdAt) >= "${from}" AND DATE(order.createdAt) < "${moment(to, "YYYY-MM-DD").add('days', 1).format("YYYY-MM-DD")}"`)
                                ]
                            } : {}
                    ),
                    vendorId: adminData.id
                },
                include: [
                    {

                        model: models['user'],
                        as: 'customer',
                        required: true,
                        include: [
                            {
                                model: models['userDetail'],
                                attributes: {
                                    include: [
                                        [sequelize.literal(`(IF (\`customer->userDetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`customer->userDetail\`.\`image\`)) )`), 'image']
                                    ]
                                }
                            },
                        ]
                    },
                    {

                        model: models['user'],
                        as: 'vendor',
                        required: true,
                        include: [
                            {
                                model: models['vendorDetail'],
                                attributes: {
                                    include: [
                                        [sequelize.literal(`(IF (\`vendor->vendorDetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`vendor->vendorDetail\`.\`image\`)) )`), 'image']
                                    ]
                                }
                            },
                        ]
                    },
                ],
                attributes: {
                    include: [
                        [sequelize.literal(`DATE(order.createdAt)`), 'createdAt'],
                        [sequelize.literal(`DATE(\`order\`.\`createdAt\`)`), 'grouped_date'],
                        [sequelize.literal(`COUNT(*)`), 'count'],
                        [sequelize.fn('SUM', sequelize.col('total')), 'totalAmount'],
                        [sequelize.fn('SUM', sequelize.col('netAmount')), 'totalNetAmount'],
                        [sequelize.fn('SUM', sequelize.col('qty')), 'totalQty'],
                        [sequelize.fn('SUM', sequelize.col('taxCharged')), 'totalTaxCharged'],
                        [sequelize.fn('SUM', sequelize.col('shippingCharges')), 'totalShippingCharges'],
                    ]
                },
                order: [['id', 'DESC']],
                group: [
                    sequelize.col('grouped_date'),
                ],
                // offset: parseInt(start),
                // limit: parseInt(length),
                raw: true,
                nest: true
            });
            // console.log(listing, '===========================================>listing');
            // return;

            const headerColumns = Object.values({
                sno: '#',
                date: 'Date',
                noOfOrders: 'No. of Orders',
                orderNetAmount: 'Order Net Amount',
                noOfQty: 'No. of QTY',
                taxCharged: 'Tax Charged',
                shippingCharges: 'Shipping Charges',
                salesEarning: 'Sales Earning',
            });

            const data = listing.map((report, index) => {
                return Object.values({
                    sno: parseInt(index) + 1,
                    date: moment(report.createdAt).format('YYYY-MM-DD'),
                    noOfOrders: report.count,
                    orderNetAmount: report.totalNetAmount,
                    noOfQty: report.totalQty,
                    taxCharged: report.totalTaxCharged,
                    shippingCharges: report.totalShippingCharges,
                    salesEarning: report.totalAmount,
                    // action
                });
            });

            return res.render('sellerAdmin/report/salesReport', { headerColumns, data, from, to });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    userReport: async (req, res) => {
        try {
            global.currentModule = 'Report';
            global.currentSubModule = 'User Report';
            global.currentSubModuleSidebar = 'userReport';

            const { from, to } = req.query;

            const listing = await models[model].findAll({
                where: {
                    ...(
                        from && to
                            ? {
                                [Op.and]: [
                                    sequelize.literal(`DATE(order.createdAt) >= "${from}" AND DATE(order.createdAt) < "${moment(to, "YYYY-MM-DD").add('days', 1).format("YYYY-MM-DD")}"`)
                                ]
                            } : {}
                    )
                },
                include: [
                    {

                        model: models['user'],
                        as: 'customer',
                        required: true,
                        include: [
                            {
                                model: models['userDetail'],
                                attributes: {
                                    include: [
                                        [sequelize.literal(`(IF (\`customer->userDetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`customer->userDetail\`.\`image\`)) )`), 'image']
                                    ]
                                }
                            },
                        ]
                    },
                    {

                        model: models['user'],
                        as: 'vendor',
                        required: true,
                        include: [
                            {
                                model: models['vendorDetail'],
                                attributes: {
                                    include: [
                                        [sequelize.literal(`(IF (\`vendor->vendorDetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`vendor->vendorDetail\`.\`image\`)) )`), 'image']
                                    ]
                                }
                            },
                        ]
                    },
                ],
                attributes: {
                    include: [
                        [sequelize.literal(`DATE(\`order\`.\`createdAt\`)`), 'grouped_date'],
                        [sequelize.literal(`COUNT(*)`), 'count'],
                        [sequelize.fn('SUM', sequelize.col('total')), 'totalAmount'],
                        [sequelize.fn('SUM', sequelize.col('netAmount')), 'totalNetAmount'],
                        [sequelize.fn('SUM', sequelize.col('qty')), 'totalQty'],
                        [sequelize.fn('SUM', sequelize.col('taxCharged')), 'totalTaxCharged'],
                        [sequelize.fn('SUM', sequelize.col('shippingCharges')), 'totalShippingCharges'],
                        [sequelize.literal('(SELECT COUNT(*) FROM `order` AS o WHERE o.customerId=customer.id)'), 'ordersPlaced'],
                        [sequelize.literal('(SELECT COUNT(*) FROM `order` AS o WHERE o.customerId=customer.id)'), 'puchases'],
                        [sequelize.literal('(SELECT SUM(o.total) FROM `order` AS o WHERE o.customerId=customer.id)'), 'amountSpent'],
                    ]
                },
                order: [['id', 'DESC']],
                group: [
                    sequelize.col('customerId'),
                ],
                raw: true,
                nest: true
            });
            // console.log(listing, '===========================================>listing');
            // return;
            
            const headerColumns = Object.values({
                sno: '#',
                name: 'Name',
                email: 'Email',
                ordersPlaced: 'Orders Placed',
                puchases: 'Purchases',
                amountSpent: 'Amount Spent',
            });

            const data = listing.map((order, index) => {
                return Object.values({
                    sno: parseInt(index) + 1,
                    name: order.customer.userDetail.name,
                    email: order.customer.email,
                    ordersPlaced: order.ordersPlaced,
                    puchases: order.puchases,
                    amountSpent: order.amountSpent,
                    // date: moment(report.createdAt).format('YYYY-MM-DD'),
                    // action
                });
            });

            return res.render('admin/report/userReport', { headerColumns, data, from, to });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    sellerReport: async (req, res) => {
        try {
            global.currentModule = 'Report';
            global.currentSubModule = 'Seller Report';
            global.currentSubModuleSidebar = 'sellerReport';

            const { from, to } = req.query;

            const listing = await models[model].findAll({
                where: {
                    ...(
                        from && to
                            ? {
                                [Op.and]: [
                                    sequelize.literal(`DATE(order.createdAt) >= "${from}" AND DATE(order.createdAt) < "${moment(to, "YYYY-MM-DD").add('days', 1).format("YYYY-MM-DD")}"`)
                                ]
                            } : {}
                    )
                },
                include: [
                    {

                        model: models['user'],
                        as: 'customer',
                        required: true,
                        include: [
                            {
                                model: models['userDetail'],
                                attributes: {
                                    include: [
                                        [sequelize.literal(`(IF (\`customer->userDetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`customer->userDetail\`.\`image\`)) )`), 'image']
                                    ]
                                }
                            },
                        ]
                    },
                    {

                        model: models['user'],
                        as: 'vendor',
                        required: true,
                        include: [
                            {
                                model: models['vendorDetail'],
                                attributes: {
                                    include: [
                                        [sequelize.literal(`(IF (\`vendor->vendorDetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`vendor->vendorDetail\`.\`image\`)) )`), 'image']
                                    ]
                                }
                            },
                        ]
                    },
                ],
                attributes: {
                    include: [
                        [sequelize.literal(`DATE(\`order\`.\`createdAt\`)`), 'grouped_date'],
                        [sequelize.literal(`COUNT(*)`), 'count'],
                        [sequelize.fn('SUM', sequelize.col('total')), 'totalAmount'],
                        [sequelize.fn('SUM', sequelize.col('netAmount')), 'totalNetAmount'],
                        [sequelize.fn('SUM', sequelize.col('qty')), 'totalQty'],
                        [sequelize.fn('SUM', sequelize.col('taxCharged')), 'totalTaxCharged'],
                        [sequelize.fn('SUM', sequelize.col('shippingCharges')), 'totalShippingCharges'],
                        [sequelize.literal('(SELECT COUNT(*) FROM `order` AS o WHERE o.vendorId=vendor.id)'), 'ordersRecieved'],
                        [sequelize.literal('(SELECT COUNT(*) FROM `order` AS o WHERE o.customerId=customer.id)'), 'puchases'],
                        [sequelize.literal('(SELECT SUM(o.total) - SUM(o.adminCommission) FROM `order` AS o WHERE o.vendorId=vendor.id)'), 'soldAmountReceived'],
                    ]
                },
                order: [['id', 'DESC']],
                group: [
                    sequelize.col('vendorId'),
                ],
                raw: true,
                nest: true
            });
            // console.log(listing, '===========================================>listing');
            // return;
            const headerColumns = Object.values({
                sno: '#',
                name: 'Name',
                email: 'Email',
                ordersRecieved: 'Orders Received',
                soldAmountReceived: 'Sold Amount Received',
            });

            const data = listing.map((order, index) => {
                return Object.values({
                    sno: parseInt(index) + 1,
                    name: order.vendor.vendorDetail.name,
                    email: order.vendor.email,
                    ordersRecieved: order.ordersRecieved,
                    soldAmountReceived: order.soldAmountReceived,
                    // date: moment(report.createdAt).format('YYYY-MM-DD'),
                    // action
                });
            });

            return res.render('admin/report/sellerReport', { headerColumns, data, from, to });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    taxReport: async (req, res) => {
        try {
            global.currentModule = 'Report';
            global.currentSubModule = 'Tax Report';
            global.currentSubModuleSidebar = 'taxReport';

            const { from, to } = req.query;

            const listing = await models[model].findAll({
                where: {
                    ...(
                        from && to
                            ? {
                                [Op.and]: [
                                    sequelize.literal(`DATE(order.createdAt) >= "${from}" AND DATE(order.createdAt) < "${moment(to, "YYYY-MM-DD").add('days', 1).format("YYYY-MM-DD")}"`)
                                ]
                            } : {}
                    )
                },
                include: [
                    {

                        model: models['user'],
                        as: 'customer',
                        required: true,
                        include: [
                            {
                                model: models['userDetail'],
                                attributes: {
                                    include: [
                                        [sequelize.literal(`(IF (\`customer->userDetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`customer->userDetail\`.\`image\`)) )`), 'image']
                                    ]
                                }
                            },
                        ]
                    },
                    {

                        model: models['user'],
                        as: 'vendor',
                        required: true,
                        include: [
                            {
                                model: models['vendorDetail'],
                                attributes: {
                                    include: [
                                        [sequelize.literal(`(IF (\`vendor->vendorDetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`vendor->vendorDetail\`.\`image\`)) )`), 'image']
                                    ]
                                }
                            },
                        ]
                    },
                ],
                attributes: {
                    include: [
                        [sequelize.literal(`DATE(\`order\`.\`createdAt\`)`), 'grouped_date'],
                        [sequelize.literal(`COUNT(*)`), 'count'],
                        [sequelize.fn('SUM', sequelize.col('total')), 'totalAmount'],
                        [sequelize.fn('SUM', sequelize.col('netAmount')), 'totalNetAmount'],
                        [sequelize.fn('SUM', sequelize.col('qty')), 'totalQty'],
                        [sequelize.fn('SUM', sequelize.col('taxCharged')), 'totalTaxCharged'],
                        [sequelize.fn('SUM', sequelize.col('shippingCharges')), 'totalShippingCharges'],
                        [sequelize.literal('(SELECT COUNT(*) FROM `order` AS o WHERE o.vendorId=vendor.id)'), 'ordersRecieved'],
                        [sequelize.literal('(SELECT COUNT(*) FROM `order` AS o WHERE o.customerId=customer.id)'), 'puchases'],
                        [sequelize.literal('(SELECT SUM(o.total) - SUM(o.adminCommission) FROM `order` AS o WHERE o.vendorId=vendor.id)'), 'soldAmountReceived'],
                        [sequelize.literal('(SELECT SUM(o.taxCharged) FROM `order` AS o WHERE o.vendorId=vendor.id)'), 'taxReceived'],
                    ]
                },
                order: [['id', 'DESC']],
                group: [
                    sequelize.col('customerId'),
                ],
                raw: true,
                nest: true
            });
            // console.log(listing, '===========================================>listing');
            // return;

            const headerColumns = Object.values({
                sno: '#',
                name: 'Name',
                email: 'Customer Email',
                orders: 'Orders',
                tax: 'Tax',
            });

            const data = listing.map((order, index) => {
                return Object.values({
                    sno: parseInt(index) + 1,
                    name: order.customer.userDetail.name,
                    email: order.customer.email,
                    orders: order.ordersRecieved,
                    tax: order.taxReceived,
                    // date: moment(report.createdAt).format('YYYY-MM-DD'),
                    // action
                });
            });

            return res.render('sellerAdmin/report/taxReport', { headerColumns, data, from, to });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    totalIncomeReport: async (req, res) => {
        try {
            global.currentModule = 'Report';
            global.currentSubModule = 'Total Income Report Report';
            global.currentSubModuleSidebar = 'totalIncomeReport';

            const { from, to } = req.query;

            const listing = await models[model].findAll({
                where: {
                    ...(
                        from && to
                            ? {
                                [Op.and]: [
                                    sequelize.literal(`DATE(order.createdAt) >= "${from}" AND DATE(order.createdAt) < "${moment(to, "YYYY-MM-DD").add('days', 1).format("YYYY-MM-DD")}"`)
                                ]
                            } : {}
                    )
                },
                include: [
                    {

                        model: models['user'],
                        as: 'customer',
                        required: true,
                        include: [
                            {
                                model: models['userDetail'],
                                attributes: {
                                    include: [
                                        [sequelize.literal(`(IF (\`customer->userDetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`customer->userDetail\`.\`image\`)) )`), 'image']
                                    ]
                                }
                            },
                        ]
                    },
                    {

                        model: models['user'],
                        as: 'vendor',
                        required: true,
                        include: [
                            {
                                model: models['vendorDetail'],
                                attributes: {
                                    include: [
                                        [sequelize.literal(`(IF (\`vendor->vendorDetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`vendor->vendorDetail\`.\`image\`)) )`), 'image']
                                    ]
                                }
                            },
                        ]
                    },
                ],
                attributes: {
                    include: [
                        [sequelize.literal(`DATE(\`order\`.\`createdAt\`)`), 'grouped_date'],
                        [sequelize.literal(`COUNT(*)`), 'count'],
                        [sequelize.fn('SUM', sequelize.col('total')), 'totalAmount'],
                        [sequelize.fn('SUM', sequelize.col('netAmount')), 'totalNetAmount'],
                        [sequelize.fn('SUM', sequelize.col('qty')), 'totalQty'],
                        [sequelize.fn('SUM', sequelize.col('taxCharged')), 'totalTaxCharged'],
                        [sequelize.fn('SUM', sequelize.col('shippingCharges')), 'totalShippingCharges'],
                        [sequelize.literal('(SELECT COUNT(*) FROM `order` AS o WHERE o.vendorId=vendor.id)'), 'ordersRecieved'],
                        [sequelize.literal('(SELECT COUNT(*) FROM `order` AS o WHERE o.customerId=customer.id)'), 'puchases'],
                        [sequelize.literal('(SELECT SUM(o.total) - SUM(o.adminCommission) FROM `order` AS o WHERE o.vendorId=vendor.id)'), 'soldAmountReceived'],
                        [sequelize.literal('(SELECT SUM(o.taxCharged) FROM `order` AS o WHERE o.vendorId=vendor.id)'), 'taxReceived'],
                        [sequelize.literal('(SELECT SUM(o.adminCommission) FROM `order` AS o WHERE o.vendorId=vendor.id)'), 'totalCommission'],
                    ]
                },
                order: [['id', 'DESC']],
                // group: [
                //     sequelize.col('vendorId'),
                // ],
                // offset: parseInt(start),
                // limit: parseInt(length),
                raw: true,
                nest: true
            });
            // console.log(listing, '===========================================>listing');
            // return;

            const headerColumns = Object.values({
                sno: '#',
                orderId: 'Order ID',
                OrderPrice: 'Order Price',
                commissionAmount: 'Commission Amount',
                taxAmount: 'Tax Amount',
                totalEarning: 'Total Earning',
            });

            const data = listing.map((order, index) => {
                return Object.values({
                    sno: parseInt(index) + 1,
                    orderId: order.orderNo,
                    OrderPrice: order.total,
                    commissionAmount: order.adminCommission,
                    taxAmount: order.taxCharged,
                    totalEarning: order.adminCommission,
                    // date: moment(report.createdAt).format('YYYY-MM-DD'),
                    // action
                });
            });

            return res.render('sellerAdmin/report/totalIncomeReport', { headerColumns, data, from, to });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    commissionReport: async (req, res) => {
        try {
            global.currentModule = 'Report';
            global.currentSubModule = 'Commission Report';
            global.currentSubModuleSidebar = 'commissionReport';

            const { from, to } = req.query;

            const listing = await models[model].findAll({
                where: {
                    ...(
                        from && to
                            ? {
                                [Op.and]: [
                                    sequelize.literal(`DATE(order.createdAt) >= "${from}" AND DATE(order.createdAt) < "${moment(to, "YYYY-MM-DD").add('days', 1).format("YYYY-MM-DD")}"`)
                                ]
                            } : {}
                    )
                },
                include: [
                    {

                        model: models['user'],
                        as: 'customer',
                        required: true,
                        include: [
                            {
                                model: models['userDetail'],
                                attributes: {
                                    include: [
                                        [sequelize.literal(`(IF (\`customer->userDetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`customer->userDetail\`.\`image\`)) )`), 'image']
                                    ]
                                }
                            },
                        ]
                    },
                    {

                        model: models['user'],
                        as: 'vendor',
                        required: true,
                        include: [
                            {
                                model: models['vendorDetail'],
                                attributes: {
                                    include: [
                                        [sequelize.literal(`(IF (\`vendor->vendorDetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`vendor->vendorDetail\`.\`image\`)) )`), 'image']
                                    ]
                                }
                            },
                        ]
                    },
                ],
                attributes: {
                    include: [
                        [sequelize.literal(`DATE(\`order\`.\`createdAt\`)`), 'grouped_date'],
                        [sequelize.literal(`COUNT(*)`), 'count'],
                        [sequelize.fn('SUM', sequelize.col('total')), 'totalAmount'],
                        [sequelize.fn('SUM', sequelize.col('netAmount')), 'totalNetAmount'],
                        [sequelize.fn('SUM', sequelize.col('qty')), 'totalQty'],
                        [sequelize.fn('SUM', sequelize.col('taxCharged')), 'totalTaxCharged'],
                        [sequelize.fn('SUM', sequelize.col('shippingCharges')), 'totalShippingCharges'],
                        [sequelize.literal('(SELECT COUNT(*) FROM `order` AS o WHERE o.vendorId=vendor.id)'), 'ordersRecieved'],
                        [sequelize.literal('(SELECT COUNT(*) FROM `order` AS o WHERE o.customerId=customer.id)'), 'puchases'],
                        [sequelize.literal('(SELECT SUM(o.total) - SUM(o.adminCommission) FROM `order` AS o WHERE o.vendorId=vendor.id)'), 'soldAmountReceived'],
                        [sequelize.literal('(SELECT SUM(o.taxCharged) FROM `order` AS o WHERE o.vendorId=vendor.id)'), 'taxReceived'],
                        [sequelize.literal('(SELECT SUM(o.adminCommission) FROM `order` AS o WHERE o.vendorId=vendor.id)'), 'totalCommission'],
                    ]
                },
                order: [['id', 'DESC']],
                group: [
                    sequelize.col('vendorId'),
                ],
                // offset: parseInt(start),
                // limit: parseInt(length),
                raw: true,
                nest: true
            });
            // console.log(listing, '===========================================>listing');
            // return;

            const headerColumns = Object.values({
                sno: '#',
                name: 'Name',
                email: 'Store Owner Email',
                sales: 'Sales',
                commission: 'Commission',
            });

            const data = listing.map((order, index) => {
                return Object.values({
                    sno: parseInt(index) + 1,
                    name: order.vendor.vendorDetail.name,
                    email: order.vendor.email,
                    sales: order.ordersRecieved,
                    commission: order.totalCommission,
                    // date: moment(report.createdAt).format('YYYY-MM-DD'),
                    // action
                });
            });

            return res.render('admin/report/commissionReport', { headerColumns, data, from, to });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    revenueReport: async (req, res) => {
        try {
            global.currentModule = 'Report';
            global.currentSubModule = 'Revenue Report';
            global.currentSubModuleSidebar = 'revenueReport';

            const { from, to } = req.query;

            const listing = await models[model].findAll({
                where: {
                    ...(
                        from && to
                            ? {
                                [Op.and]: [
                                    sequelize.literal(`DATE(order.createdAt) >= "${from}" AND DATE(order.createdAt) < "${moment(to, "YYYY-MM-DD").add('days', 1).format("YYYY-MM-DD")}"`)
                                ]
                            } : {}
                    )
                },
                include: [
                    {

                        model: models['user'],
                        as: 'customer',
                        required: true,
                        include: [
                            {
                                model: models['userDetail'],
                                attributes: {
                                    include: [
                                        [sequelize.literal(`(IF (\`customer->userDetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`customer->userDetail\`.\`image\`)) )`), 'image']
                                    ]
                                }
                            },
                        ]
                    },
                    {

                        model: models['user'],
                        as: 'vendor',
                        required: true,
                        include: [
                            {
                                model: models['vendorDetail'],
                                attributes: {
                                    include: [
                                        [sequelize.literal(`(IF (\`vendor->vendorDetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`vendor->vendorDetail\`.\`image\`)) )`), 'image']
                                    ]
                                }
                            },
                        ]
                    },
                ],
                attributes: {
                    include: [
                        [sequelize.literal(`DATE(\`order\`.\`createdAt\`)`), 'grouped_date'],
                        [sequelize.literal(`COUNT(*)`), 'count'],
                        [sequelize.fn('SUM', sequelize.col('total')), 'totalAmount'],
                        [sequelize.fn('SUM', sequelize.col('netAmount')), 'totalNetAmount'],
                        [sequelize.fn('SUM', sequelize.col('qty')), 'totalQty'],
                        [sequelize.fn('SUM', sequelize.col('taxCharged')), 'totalTaxCharged'],
                        [sequelize.fn('SUM', sequelize.col('shippingCharges')), 'totalShippingCharges'],
                        [sequelize.literal('(SELECT COUNT(*) FROM `order` AS o WHERE o.vendorId=vendor.id)'), 'ordersRecieved'],
                        [sequelize.literal('(SELECT COUNT(*) FROM `order` AS o WHERE o.customerId=customer.id)'), 'puchases'],
                        [sequelize.literal('(SELECT SUM(o.total) - SUM(o.adminCommission) FROM `order` AS o WHERE o.vendorId=vendor.id)'), 'soldAmountReceived'],
                        [sequelize.literal('(SELECT SUM(o.taxCharged) FROM `order` AS o WHERE o.vendorId=vendor.id)'), 'taxReceived'],
                        [sequelize.literal('(SELECT SUM(o.adminCommission) FROM `order` AS o WHERE o.vendorId=vendor.id)'), 'totalCommission'],
                    ]
                },
                order: [['id', 'DESC']],
                // group: [
                //     sequelize.col('vendorId'),
                // ],
                // offset: parseInt(start),
                // limit: parseInt(length),
                raw: true,
                nest: true
            });
            // console.log(listing, '===========================================>listing');
            // return;

            const headerColumns = Object.values({
                sno: '#',
                orderId: 'Order ID',
                OrderPrice: 'Order Price',
                commissionAmount: 'Commission Amount',
                taxAmount: 'Tax Amount',
                totalEarning: 'Total Earning',
            });

            const data = listing.map((order, index) => {
                return Object.values({
                    sno: parseInt(index) + 1,
                    orderId: order.orderNo,
                    OrderPrice: order.total,
                    commissionAmount: order.adminCommission,
                    taxAmount: order.taxCharged,
                    totalEarning: order.adminCommission,
                    // date: moment(report.createdAt).format('YYYY-MM-DD'),
                    // action
                });
            });

            return res.render('admin/report/revenueReport', { headerColumns, data, from, to });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    view: async (req, res) => {
        try {
            global.currentModule = 'User';
            global.currentSubModuleSidebar = 'listing';

            const user = await module.exports.findOneUser(req.params.id);
            global.currentSubModule = `View ${roleTypes[user.role]}`;

            return res.render('admin/user/view', { user });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    salesReportDataTable: async (req, res) => {
        try {
            const model = "order";
            const modelTitle = "Report";
            const queryParameters = req.query;
            const { draw, search, start, length } = queryParameters;
            // console.log(queryParameters, '======================>queryParameters');

            const recordsTotal = await models[model].count({
                where: {

                }
            });

            const listing = await models[model].findAll({
                where: {
                    // [Op.and]: [
                    //     sequelize.literal(`order.orderNo LIKE '%${search.value}%' || customer.email LIKE '%${search.value}%' || \`customer->userDetail\`.\`name\` LIKE '%${search.value}%'`)
                    // ]
                },
                include: [
                    {

                        model: models['user'],
                        as: 'customer',
                        required: true,
                        include: [
                            {
                                model: models['userDetail'],
                                attributes: {
                                    include: [
                                        [sequelize.literal(`(IF (\`customer->userDetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`customer->userDetail\`.\`image\`)) )`), 'image']
                                    ]
                                }
                            },
                        ]
                    },
                    {

                        model: models['user'],
                        as: 'vendor',
                        required: true,
                        include: [
                            {
                                model: models['vendorDetail'],
                                attributes: {
                                    include: [
                                        [sequelize.literal(`(IF (\`vendor->vendorDetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`vendor->vendorDetail\`.\`image\`)) )`), 'image']
                                    ]
                                }
                            },
                        ]
                    },
                ],
                attributes: {
                    include: [
                        [sequelize.literal(`DATE(\`order\`.\`createdAt\`)`), 'grouped_date'],
                        [sequelize.literal(`COUNT(*)`), 'count'],
                        [sequelize.fn('SUM', sequelize.col('total')), 'totalAmount'],
                        [sequelize.fn('SUM', sequelize.col('netAmount')), 'totalNetAmount'],
                        [sequelize.fn('SUM', sequelize.col('qty')), 'totalQty'],
                        [sequelize.fn('SUM', sequelize.col('taxCharged')), 'totalTaxCharged'],
                        [sequelize.fn('SUM', sequelize.col('shippingCharges')), 'totalShippingCharges'],
                    ]
                },
                order: [['id', 'DESC']],
                group: [
                    sequelize.col('grouped_date'),
                ],
                offset: parseInt(start),
                limit: parseInt(length),
                raw: true,
                nest: true
            });
            console.log(listing, '===========================================>listing');
            // return;
            let responseData = [];
            const data = listing.map((report, index) => {
                return Object.values({
                    sno: parseInt(start) + parseInt(index) + 1,
                    date: moment(report.createdAt).format('YYYY-MM-DD'),
                    noOfOrders: report.count,
                    orderNetAmount: report.totalNetAmount,
                    noOfQty: report.totalQty,
                    taxCharged: report.totalTaxCharged,
                    shippingCharges: report.totalShippingCharges,
                    salesEarning: report.totalAmount,
                    // action
                });
            });

            // console.log(data, '=======================>data');
            // console.log(recordsTotal, '=======================>recordsTotal');

            responseData = {
                draw: parseInt(draw),
                recordsTotal,
                recordsFiltered: listing.length,
                data
            }

            return res.send(responseData);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    userReportDataTable: async (req, res) => {
        try {
            const model = "order";
            const modelTitle = "Report";
            const queryParameters = req.query;
            const { draw, search, start, length } = queryParameters;
            // console.log(queryParameters, '======================>queryParameters');

            const recordsTotal = await models[model].count({
                where: {

                }
            });

            const listing = await models[model].findAll({
                where: {
                    // [Op.and]: [
                    //     sequelize.literal(`order.orderNo LIKE '%${search.value}%' || customer.email LIKE '%${search.value}%' || \`customer->userDetail\`.\`name\` LIKE '%${search.value}%'`)
                    // ]
                },
                include: [
                    {

                        model: models['user'],
                        as: 'customer',
                        required: true,
                        include: [
                            {
                                model: models['userDetail'],
                                attributes: {
                                    include: [
                                        [sequelize.literal(`(IF (\`customer->userDetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`customer->userDetail\`.\`image\`)) )`), 'image']
                                    ]
                                }
                            },
                        ]
                    },
                    {

                        model: models['user'],
                        as: 'vendor',
                        required: true,
                        include: [
                            {
                                model: models['vendorDetail'],
                                attributes: {
                                    include: [
                                        [sequelize.literal(`(IF (\`vendor->vendorDetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`vendor->vendorDetail\`.\`image\`)) )`), 'image']
                                    ]
                                }
                            },
                        ]
                    },
                ],
                attributes: {
                    include: [
                        [sequelize.literal(`DATE(\`order\`.\`createdAt\`)`), 'grouped_date'],
                        [sequelize.literal(`COUNT(*)`), 'count'],
                        [sequelize.fn('SUM', sequelize.col('total')), 'totalAmount'],
                        [sequelize.fn('SUM', sequelize.col('netAmount')), 'totalNetAmount'],
                        [sequelize.fn('SUM', sequelize.col('qty')), 'totalQty'],
                        [sequelize.fn('SUM', sequelize.col('taxCharged')), 'totalTaxCharged'],
                        [sequelize.fn('SUM', sequelize.col('shippingCharges')), 'totalShippingCharges'],
                        [sequelize.literal('(SELECT COUNT(*) FROM `order` AS o WHERE o.customerId=customer.id)'), 'ordersPlaced'],
                        [sequelize.literal('(SELECT COUNT(*) FROM `order` AS o WHERE o.customerId=customer.id)'), 'puchases'],
                        [sequelize.literal('(SELECT SUM(o.total) FROM `order` AS o WHERE o.customerId=customer.id)'), 'amountSpent'],
                    ]
                },
                order: [['id', 'DESC']],
                group: [
                    sequelize.col('customerId'),
                ],
                offset: parseInt(start),
                limit: parseInt(length),
                raw: true,
                nest: true
            });
            console.log(listing, '===========================================>listing');
            // return;
            let responseData = [];
            const data = listing.map((order, index) => {
                return Object.values({
                    sno: parseInt(start) + parseInt(index) + 1,
                    name: order.customer.userDetail.name,
                    email: order.customer.email,
                    ordersPlaced: order.ordersPlaced,
                    puchases: order.puchases,
                    amountSpent: order.amountSpent,
                    // date: moment(report.createdAt).format('YYYY-MM-DD'),
                    // action
                });
            });
            console.log(data, '=======================>data');
            // console.log(recordsTotal, '=======================>recordsTotal');

            responseData = {
                draw: parseInt(draw),
                recordsTotal,
                recordsFiltered: listing.length,
                data
            }

            return res.send(responseData);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    sellerReportDataTable: async (req, res) => {
        try {
            const model = "order";
            const modelTitle = "Report";
            const queryParameters = req.query;
            const { draw, search, start, length } = queryParameters;
            // console.log(queryParameters, '======================>queryParameters');

            const recordsTotal = await models[model].count({
                where: {

                }
            });

            const listing = await models[model].findAll({
                where: {
                    // [Op.and]: [
                    //     sequelize.literal(`order.orderNo LIKE '%${search.value}%' || customer.email LIKE '%${search.value}%' || \`customer->userDetail\`.\`name\` LIKE '%${search.value}%'`)
                    // ]
                },
                include: [
                    {

                        model: models['user'],
                        as: 'customer',
                        required: true,
                        include: [
                            {
                                model: models['userDetail'],
                                attributes: {
                                    include: [
                                        [sequelize.literal(`(IF (\`customer->userDetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`customer->userDetail\`.\`image\`)) )`), 'image']
                                    ]
                                }
                            },
                        ]
                    },
                    {

                        model: models['user'],
                        as: 'vendor',
                        required: true,
                        include: [
                            {
                                model: models['vendorDetail'],
                                attributes: {
                                    include: [
                                        [sequelize.literal(`(IF (\`vendor->vendorDetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`vendor->vendorDetail\`.\`image\`)) )`), 'image']
                                    ]
                                }
                            },
                        ]
                    },
                ],
                attributes: {
                    include: [
                        [sequelize.literal(`DATE(\`order\`.\`createdAt\`)`), 'grouped_date'],
                        [sequelize.literal(`COUNT(*)`), 'count'],
                        [sequelize.fn('SUM', sequelize.col('total')), 'totalAmount'],
                        [sequelize.fn('SUM', sequelize.col('netAmount')), 'totalNetAmount'],
                        [sequelize.fn('SUM', sequelize.col('qty')), 'totalQty'],
                        [sequelize.fn('SUM', sequelize.col('taxCharged')), 'totalTaxCharged'],
                        [sequelize.fn('SUM', sequelize.col('shippingCharges')), 'totalShippingCharges'],
                        [sequelize.literal('(SELECT COUNT(*) FROM `order` AS o WHERE o.vendorId=vendor.id)'), 'ordersRecieved'],
                        [sequelize.literal('(SELECT COUNT(*) FROM `order` AS o WHERE o.customerId=customer.id)'), 'puchases'],
                        [sequelize.literal('(SELECT SUM(o.total) - SUM(o.adminCommission) FROM `order` AS o WHERE o.vendorId=vendor.id)'), 'soldAmountReceived'],
                    ]
                },
                order: [['id', 'DESC']],
                group: [
                    sequelize.col('vendorId'),
                ],
                offset: parseInt(start),
                limit: parseInt(length),
                raw: true,
                nest: true
            });
            console.log(listing, '===========================================>listing');
            // return;
            let responseData = [];
            const data = listing.map((order, index) => {
                return Object.values({
                    sno: parseInt(start) + parseInt(index) + 1,
                    name: order.vendor.vendorDetail.name,
                    email: order.vendor.email,
                    ordersRecieved: order.ordersRecieved,
                    soldAmountReceived: order.soldAmountReceived,
                    // date: moment(report.createdAt).format('YYYY-MM-DD'),
                    // action
                });
            });
            console.log(data, '=======================>data');
            // console.log(recordsTotal, '=======================>recordsTotal');

            responseData = {
                draw: parseInt(draw),
                recordsTotal,
                recordsFiltered: listing.length,
                data
            }

            return res.send(responseData);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    taxReportDataTable: async (req, res) => {
        try {
            const model = "order";
            const modelTitle = "Report";
            const queryParameters = req.query;
            const { draw, search, start, length } = queryParameters;
            // console.log(queryParameters, '======================>queryParameters');

            const recordsTotal = await models[model].count({
                where: {

                }
            });

            const listing = await models[model].findAll({
                where: {
                    // [Op.and]: [
                    //     sequelize.literal(`order.orderNo LIKE '%${search.value}%' || customer.email LIKE '%${search.value}%' || \`customer->userDetail\`.\`name\` LIKE '%${search.value}%'`)
                    // ]
                },
                include: [
                    {

                        model: models['user'],
                        as: 'customer',
                        required: true,
                        include: [
                            {
                                model: models['userDetail'],
                                attributes: {
                                    include: [
                                        [sequelize.literal(`(IF (\`customer->userDetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`customer->userDetail\`.\`image\`)) )`), 'image']
                                    ]
                                }
                            },
                        ]
                    },
                    {

                        model: models['user'],
                        as: 'vendor',
                        required: true,
                        include: [
                            {
                                model: models['vendorDetail'],
                                attributes: {
                                    include: [
                                        [sequelize.literal(`(IF (\`vendor->vendorDetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`vendor->vendorDetail\`.\`image\`)) )`), 'image']
                                    ]
                                }
                            },
                        ]
                    },
                ],
                attributes: {
                    include: [
                        [sequelize.literal(`DATE(\`order\`.\`createdAt\`)`), 'grouped_date'],
                        [sequelize.literal(`COUNT(*)`), 'count'],
                        [sequelize.fn('SUM', sequelize.col('total')), 'totalAmount'],
                        [sequelize.fn('SUM', sequelize.col('netAmount')), 'totalNetAmount'],
                        [sequelize.fn('SUM', sequelize.col('qty')), 'totalQty'],
                        [sequelize.fn('SUM', sequelize.col('taxCharged')), 'totalTaxCharged'],
                        [sequelize.fn('SUM', sequelize.col('shippingCharges')), 'totalShippingCharges'],
                        [sequelize.literal('(SELECT COUNT(*) FROM `order` AS o WHERE o.vendorId=vendor.id)'), 'ordersRecieved'],
                        [sequelize.literal('(SELECT COUNT(*) FROM `order` AS o WHERE o.customerId=customer.id)'), 'puchases'],
                        [sequelize.literal('(SELECT SUM(o.total) - SUM(o.adminCommission) FROM `order` AS o WHERE o.vendorId=vendor.id)'), 'soldAmountReceived'],
                        [sequelize.literal('(SELECT SUM(o.taxCharged) FROM `order` AS o WHERE o.vendorId=vendor.id)'), 'taxReceived'],
                    ]
                },
                order: [['id', 'DESC']],
                group: [
                    sequelize.col('vendorId'),
                ],
                offset: parseInt(start),
                limit: parseInt(length),
                raw: true,
                nest: true
            });
            console.log(listing, '===========================================>listing');
            // return;
            let responseData = [];
            const data = listing.map((order, index) => {
                return Object.values({
                    sno: parseInt(start) + parseInt(index) + 1,
                    name: order.vendor.vendorDetail.name,
                    email: order.vendor.email,
                    orders: order.ordersRecieved,
                    tax: order.taxReceived,
                    // date: moment(report.createdAt).format('YYYY-MM-DD'),
                    // action
                });
            });
            console.log(data, '=======================>data');
            // console.log(recordsTotal, '=======================>recordsTotal');

            responseData = {
                draw: parseInt(draw),
                recordsTotal,
                recordsFiltered: listing.length,
                data
            }

            return res.send(responseData);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    commissionReportDataTable: async (req, res) => {
        try {
            const model = "order";
            const modelTitle = "Report";
            const queryParameters = req.query;
            const { draw, search, start, length } = queryParameters;
            // console.log(queryParameters, '======================>queryParameters');

            const recordsTotal = await models[model].count({
                where: {

                }
            });

            const listing = await models[model].findAll({
                where: {
                    // [Op.and]: [
                    //     sequelize.literal(`order.orderNo LIKE '%${search.value}%' || customer.email LIKE '%${search.value}%' || \`customer->userDetail\`.\`name\` LIKE '%${search.value}%'`)
                    // ]
                },
                include: [
                    {

                        model: models['user'],
                        as: 'customer',
                        required: true,
                        include: [
                            {
                                model: models['userDetail'],
                                attributes: {
                                    include: [
                                        [sequelize.literal(`(IF (\`customer->userDetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`customer->userDetail\`.\`image\`)) )`), 'image']
                                    ]
                                }
                            },
                        ]
                    },
                    {

                        model: models['user'],
                        as: 'vendor',
                        required: true,
                        include: [
                            {
                                model: models['vendorDetail'],
                                attributes: {
                                    include: [
                                        [sequelize.literal(`(IF (\`vendor->vendorDetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`vendor->vendorDetail\`.\`image\`)) )`), 'image']
                                    ]
                                }
                            },
                        ]
                    },
                ],
                attributes: {
                    include: [
                        [sequelize.literal(`DATE(\`order\`.\`createdAt\`)`), 'grouped_date'],
                        [sequelize.literal(`COUNT(*)`), 'count'],
                        [sequelize.fn('SUM', sequelize.col('total')), 'totalAmount'],
                        [sequelize.fn('SUM', sequelize.col('netAmount')), 'totalNetAmount'],
                        [sequelize.fn('SUM', sequelize.col('qty')), 'totalQty'],
                        [sequelize.fn('SUM', sequelize.col('taxCharged')), 'totalTaxCharged'],
                        [sequelize.fn('SUM', sequelize.col('shippingCharges')), 'totalShippingCharges'],
                        [sequelize.literal('(SELECT COUNT(*) FROM `order` AS o WHERE o.vendorId=vendor.id)'), 'ordersRecieved'],
                        [sequelize.literal('(SELECT COUNT(*) FROM `order` AS o WHERE o.customerId=customer.id)'), 'puchases'],
                        [sequelize.literal('(SELECT SUM(o.total) - SUM(o.adminCommission) FROM `order` AS o WHERE o.vendorId=vendor.id)'), 'soldAmountReceived'],
                        [sequelize.literal('(SELECT SUM(o.taxCharged) FROM `order` AS o WHERE o.vendorId=vendor.id)'), 'taxReceived'],
                        [sequelize.literal('(SELECT SUM(o.adminCommission) FROM `order` AS o WHERE o.vendorId=vendor.id)'), 'totalCommission'],
                    ]
                },
                order: [['id', 'DESC']],
                group: [
                    sequelize.col('vendorId'),
                ],
                offset: parseInt(start),
                limit: parseInt(length),
                raw: true,
                nest: true
            });
            console.log(listing, '===========================================>listing');
            // return;
            let responseData = [];
            const data = listing.map((order, index) => {
                return Object.values({
                    sno: parseInt(start) + parseInt(index) + 1,
                    name: order.vendor.vendorDetail.name,
                    email: order.vendor.email,
                    sales: order.ordersRecieved,
                    commission: order.totalCommission,
                    // date: moment(report.createdAt).format('YYYY-MM-DD'),
                    // action
                });
            });
            console.log(data, '=======================>data');
            // console.log(recordsTotal, '=======================>recordsTotal');

            responseData = {
                draw: parseInt(draw),
                recordsTotal,
                recordsFiltered: listing.length,
                data
            }

            return res.send(responseData);
        } catch (err) {
            return helper.error(res, err);
        }
    },

}
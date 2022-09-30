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
global.modelDataTable = "orderDataTable";

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

const orderStatusTexts = {
    0: 'Pending',
    1: 'Accepted',
    2: 'Packed',
    3: 'Shipped',
    4: 'Delivered',
    5: 'Cancelled',
}

const orderStatus = {
    0: {
        value: `Pending`,
        backgroundCssColor: `red`,
    },
    1: {
        value: `Accepted`,
        backgroundCssColor: `green`,
    },
    2: {
        value: `Packed`,
        backgroundCssColor: `#ffc107`,
    },
    3: {
        value: `Shipped`,
        backgroundCssColor: `cadetblue`,
    },
    4: {
        value: `Delivered`,
        backgroundCssColor: `orange`,
    },
    5: {
        value: `Cancelled`,
        backgroundCssColor: `red`,
    },
}

const paymentMethodText = {
    0: 'Wallet',
    1: 'Card',
}

module.exports = {
    view: async (req, res) => {
        try {
            // global.currentModule = 'Order';
            global.currentSubModule = 'Detail';
            global.currentSubModuleSidebar = 'View';

            const order = await module.exports.findOneOrder(req.params.id);
            console.log(JSON.stringify(order, null, 2), '=========================>order');
            order.orderStatusText = orderStatusTexts[order.orderStatus];
            order.paymentMethodText = paymentMethodText[order.paymentMethod];

            const headerColumns = Object.values({
                sno: '#',
                Image: 'Image',
                orderParticulars: 'Order Particulars',
                qty: 'Quantity',
                shippingCharges: 'Shipping Charges',
                price: 'Price',
                taxCharged: 'Tax Charged',
                total: 'Total',
            });

            const data = order.orderItems.map((orderItem, index) => {

                return Object.values({
                    sno: parseInt(index) + 1,
                    image: `<img alt="image" src="${orderItem.product.image}" class="datatable_list_image" data-toggle="tooltip" title="${orderItem.product.image}">`,
                    orderParticulars: `Name: ${orderItem.product.name}<br/>
                                   Brand: ${orderItem.product.brandName}`,                    
                    qty: orderItem.qty,
                    shippingCharges: orderItem.shippingCharges,
                    price: orderItem.netAmount,
                    taxCharged: orderItem.taxCharged,
                    total: orderItem.total,
                });
            });

            return res.render('sellerAdmin/order/view', { order, headerColumns, data, orderStatus });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    orders: async (req, res) => {
        try {
            global.currentModule = 'Orders';
            global.currentSubModule = '';
            global.currentSubModuleSidebar = 'orders';

            const model = "order";
            const modelTitle = "Order";

            const listing = await models[model].findAndCountAll({
                where: {
                    // [Op.and]: [
                    //     sequelize.literal(`order.orderNo LIKE '%${search.value}%' || customer.email LIKE '%${search.value}%' || \`customer->userDetail\`.\`name\` LIKE '%${search.value}%'`)
                    // ]
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
                order: [['id', 'DESC']],
                raw: true,
                nest: true
            });

            const headerColumns = Object.values({
                sno: '#',
                orderId: 'Order ID',
                customerName: 'Customer',
                orderDate: 'Order Date',
                total: 'Total',
                orderStatus: 'Order Status',
                action: 'Action',
            });

            const data = listing.rows.map((order, index) => {
                // const orderStatus = {
                //     0: {
                //         value: `Pending`,
                //         backgroundCssColor: `red`,
                //     },
                //     1: {
                //         value: `In Progress`,
                //         backgroundCssColor: `#ffc107`,
                //     },
                //     2: {
                //         value: `Complete`,
                //         backgroundCssColor: `green`,
                //     },
                // }

                let orderStatusSelect = ``;
                orderStatusSelect += `<select class="changeOrderRequestStatus" model="${model}" model_title="${modelTitle}" model_id="${order.id}" field="orderStatus" style="background: ${orderStatus[order.orderStatus].backgroundCssColor}; color: #fff; font-weight: 600;" >`;
                for (let status in orderStatus) {
                    orderStatusSelect += `<option value="${status}" ${status == order.orderStatus ? 'selected' : ''} style="background: ${orderStatus[status].backgroundCssColor}; color: #fff; font-weight: 600;" >${orderStatus[status].value}</option>`;
                }
                orderStatusSelect += `</select>`;

                return Object.values({
                    sno: parseInt(index) + 1,
                    orderId: order.orderNo,
                    customerName: `Name: ${order.customer.userDetail.name}<br/>
                                   Email: ${order.customer.email}`,
                    orderDate: moment(order.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                    total: order.total,
                    orderStatus: orderStatusSelect,
                    action: `
                    <a href="/sellerAdmin/order/view/${order.id}">
                        <button type="button" class="btn btn-warning">View</button>
                    </a>`,
                });
            });

            return res.render('sellerAdmin/order/orders', { headerColumns, data });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    cancellationRequests: async (req, res) => {
        try {
            global.currentModule = 'Cancellation Requests';
            global.currentSubModule = '';
            global.currentSubModuleSidebar = '';

            const model = "orderCancellationRequest";
            const modelTitle = 'Order Cancel Request';

            const listing = await models[model].findAll({
                where: {
                    vendorId: adminData.id
                },
                include: [
                    {
                        model: models['order'],
                        required: true,
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
                                                [sequelize.literal(`(IF (\`order->customer->userDetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`order->customer->userDetail\`.\`image\`)) )`), 'image']
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
                                                [sequelize.literal(`(IF (\`order->vendor->vendorDetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`order->vendor->vendorDetail\`.\`image\`)) )`), 'image']
                                            ]
                                        }
                                    },
                                ]
                            },
                        ],
                    }
                ],
                order: [['id', 'DESC']],
                raw: true,
                nest: true
            });
            console.log(listing, '===========================================>listing');
            // return;

            const headerColumns = Object.values({
                sno: '#',
                seller: 'Seller',
                customer: 'Customer',
                requestDetails: 'Request Details',
                orderDate: 'Date',
                amount: 'Amount',
                status: 'Status',
                action: 'Action',
            });

            const data = listing.map((orderCancellationRequest, index) => {
                // const orderStatus = {
                //     0: `Pending`,
                //     1: `In Progress`,
                //     2: `Complete`,
                // }
                const orderStatus = orderStatusTexts;

                const orderRequestStatus = {
                    0: {
                        value: `Pending`,
                        backgroundCssColor: `#ffc107`,
                    },
                    1: {
                        value: `Approved`,
                        backgroundCssColor: `green`,
                    },
                    2: {
                        value: `Disapproved`,
                        backgroundCssColor: `red`,
                    },
                }

                let orderRequestSelect = ``;
                orderRequestSelect += `<select class="changeOrderRequestStatus" field="status" model="${model}" model_title="${modelTitle}" model_id="${orderCancellationRequest.id}" style="background: ${orderRequestStatus[orderCancellationRequest.status].backgroundCssColor}; color: #fff; font-weight: 600;" >`;
                for (let status in orderRequestStatus) {
                    orderRequestSelect += `<option value="${status}" ${status == orderCancellationRequest.status ? 'selected' : ''} style="background: ${orderRequestStatus[status].backgroundCssColor}; color: #fff; font-weight: 600;" >${orderRequestStatus[status].value}</option>`;
                }
                orderRequestSelect += `</select>`;



                return Object.values({
                    sno: parseInt(index) + 1,
                    seller: `Name: ${orderCancellationRequest.order.vendor.vendorDetail.name}<br/>
                            Email: ${orderCancellationRequest.order.vendor.email}`,
                    customer: `Name: ${orderCancellationRequest.order.customer.userDetail.name}<br/>
                               Email: ${orderCancellationRequest.order.customer.email}`,
                    requestDetails: `Order/Invoice: ${orderCancellationRequest.order.orderNo}<br/>
                                     Order Status: ${orderStatus[orderCancellationRequest.order.orderStatus]}<br/>
                                     Reason: ${orderCancellationRequest.reason}<br/>
                                     Comments: ${orderCancellationRequest.comments}
                                     `,
                    date: moment(orderCancellationRequest.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                    amount: orderCancellationRequest.order.total,
                    status: orderRequestSelect,
                    action: `
                    <a href="/sellerAdmin/order/view/${orderCancellationRequest.order.id}">
                        <button type="button" class="btn btn-warning">View</button>
                    </a>`,
                });
            });

            return res.render('sellerAdmin/order/cancellationRequests', { headerColumns, data });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    orderReturnRequests: async (req, res) => {
        try {
            global.currentModule = 'Order Return Requests';
            global.currentSubModule = '';
            global.currentSubModuleSidebar = 'orderReturnRequests';

            const model = "orderRefundRequest";
            const modelTitle = 'Order Return Request';

            const listing = await models['orderRefundRequest'].findAndCountAll({
                where: {
                    vendorId: adminData.id
                },
                include: [
                    {
                        model: models['order'],
                        required: true,
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
                                                [sequelize.literal(`(IF (\`order->customer->userDetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`order->customer->userDetail\`.\`image\`)) )`), 'image']
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
                                                [sequelize.literal(`(IF (\`order->vendor->vendorDetail\`.\`image\`='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', \`order->vendor->vendorDetail\`.\`image\`)) )`), 'image']
                                            ]
                                        }
                                    },
                                ]
                            },
                        ],
                    }
                ],
                order: [['id', 'DESC']],
                raw: true,
                nest: true
            });
            console.log(listing, '===========================================>listing');
            // return;

            const headerColumns = Object.values({
                sno: '#',
                seller: 'Seller',
                customer: 'Customer',
                requestDetails: 'Request Details',
                orderDate: 'Date',
                amount: 'Amount',
                status: 'Status',
                action: 'Action'
            });

            const data = listing.rows.map((orderCancellationRequest, index) => {
                const orderStatus = orderStatusTexts;
                // const orderStatus = {
                //     0: `Pending`,
                //     1: `In Progress`,
                //     2: `Complete`,
                // }

                const orderRequestStatus = {
                    0: {
                        value: `Pending`,
                        backgroundCssColor: `#ffc107`,
                    },
                    1: {
                        value: `Approved`,
                        backgroundCssColor: `green`,
                    },
                    2: {
                        value: `Disapproved`,
                        backgroundCssColor: `red`,
                    },
                }

                let orderRequestSelect = ``;
                orderRequestSelect += `<select class="changeOrderRequestStatus" field="status" model="${model}" model_title="${modelTitle}" model_id="${orderCancellationRequest.id}" style="background: ${orderRequestStatus[orderCancellationRequest.status].backgroundCssColor}; color: #fff; font-weight: 600;" >`;
                for (let status in orderRequestStatus) {
                    orderRequestSelect += `<option value="${status}" ${status == orderCancellationRequest.status ? 'selected' : ''} style="background: ${orderRequestStatus[status].backgroundCssColor}; color: #fff; font-weight: 600;" >${orderRequestStatus[status].value}</option>`;
                }
                orderRequestSelect += `</select>`;

                return Object.values({
                    sno: parseInt(index) + 1,
                    seller: `Name: ${orderCancellationRequest.order.vendor.vendorDetail.name}<br/>
                            Email: ${orderCancellationRequest.order.vendor.email}`,
                    customer: `Name: ${orderCancellationRequest.order.customer.userDetail.name}<br/>
                               Email: ${orderCancellationRequest.order.customer.email}`,
                    requestDetails: `Order/Invoice: ${orderCancellationRequest.order.orderNo}<br/>
                                     Order Status: ${orderStatus[orderCancellationRequest.order.orderStatus]}<br/>
                                     Reason: ${orderCancellationRequest.reason}<br/>
                                     Comments: ${orderCancellationRequest.comments}
                                     `,
                    date: moment(orderCancellationRequest.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                    amount: orderCancellationRequest.order.total,
                    status: orderRequestSelect,
                    action: `
                    <a href="/sellerAdmin/order/view/${orderCancellationRequest.order.id}">
                        <button type="button" class="btn btn-warning">View</button>
                    </a>`,
                    // action
                });
            });

            return res.render('sellerAdmin/order/orderReturnRequests', { headerColumns, data });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    findOneOrder: async (id) => {
        let order = await models['order'].findOne({
            where: {
                id
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
                {

                    model: models['orderItem'],
                    required: false,
                    include: [
                        {
                            model: models['product'],
                            required: true,
                            attributes: {
                                include: [
                                    [sequelize.literal(`(IF (\`orderItems->product\`.\`image\`='', '${baseUrl}/uploads/default/default_image.jpg', CONCAT('${baseUrl}/uploads/product/', \`orderItems->product\`.\`image\`)) )`), 'image']
                                ]
                            }
                        }
                    ]
                },
            ],
        });

        if (!order) throw "Invalid orderId.";
        return order.toJSON();


    },
}
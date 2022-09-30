/*
|--------------------------------------------------------------------------------------------------------------------
|   Modules Configuration File
|--------------------------------------------------------------------------------------------------------------------
|
|   * All modules listing configured in this file.
|   * title => value will be shown as title for this module.
|   * dashboard => set to true will show the module into dashboard.
|   * sidebar => set to true will show the module into sidebar.
|   * permissions => set to true will show this module into sub-admins module for giving permissions to particalar 
|     Sub Admins.
|   * icon => icon class specified here.
|   * link => link for the module.
|   * count => count selector from admin dashboard method in controller or count value in integer.
|   * sidebarAnchorClass => to set class on the anchor attached to the sidebar link for single link element like "Logout" or "Dashboard"
*/

global.modules = {
    'admin': {
        'dashboard': {
            'title': 'Dashboard',
            'dashboard': false,
            'sidebar': true,
            'permissions': false,
            'icon': 'fas fa-fire',
            'link': '/admin/dashboard',
            'count': 1
        },
        'user': {
            'title': 'User',
            'dashboard': true,
            'dashboardLink': '/admin/user/listing',
            'sidebar': true,
            'permissions': true,
            'icon': 'far fa-user',
            'link': [
                {
                    'title': 'Listing',
                    'link': '/admin/user/listing',
                    'subModule': 'listing',
                },
                // {
                //     'title': 'Add',
                //     'link': '/admin/user/add',
                //     'subModule': 'add'
                // }
                
                
            ],
            'count': 'user' 
        },
        // 'locationOwner': {
        //     'title': 'Location Owner',
        //     'dashboard': true,
        //     'dashboardLink': '/admin/locationOwner/listing',
        //     'sidebar': true,
        //     'permissions': true,
        //     'icon': 'fas fa-calendar',
        //     'link': '/admin/locationOwner/listing',
        //     'count': 'businessProfessionalDetail',
        //     'link': [
        //         {   
        //             'title': 'Listing',
        //             'link': '/admin/locationOwner/listing',
        //             'subModule': 'listing',
        //         }
        //     ],
        //     'count': 'user' 
        // },
        // 'businessProfessionalDetail': {
        //     'title': 'Business Professional',
        //     'dashboard': true,
        //     'dashboardLink': '/admin/businessProfessional/listing',
        //     'sidebar': true,
        //     'permissions': true,
        //     'icon': 'fas fa-calendar',
        //     'link': '/admin/businessProfessional/listing',
        //     'count': 'businessProfessionalDetail',
        //     'link': [
        //         {   
        //             'title': 'Listing',
        //             'link': '/admin/businessProfessional/listing',
        //             'subModule': 'listing',
        //         }
        //     ],
        //     'count': 'user' 
        // },
        'locationOwner': {
            'title': 'Location owners',
            'dashboard': true,
            'sidebar': false,
            'permissions': false,
            'icon': 'fas fa-building',
            'link': '/admin/user/listing',
            'count': 'locationOwner'
        },
        'vendor': {
            'title': 'Business Professional',
            'dashboard': true,
            'sidebar': false,
            'permissions': false,
            'icon': 'fas fa-user-tie',
            'link': '/admin/user/listing',
            'count': 'businessProfessional'
        },
        'banner': {
            'title': 'Banner',
            'dashboard': false,
            'dashboardLink': '/admin/banner/listing',
            'sidebar': true,
            'permissions': true,
            'icon': 'fas fa-camera',
            'link': [
                {
                    'title': 'Listing',
                    'link': '/admin/banner/listing',
                    'subModule': 'listing',
                },
                {
                    'title': 'Add',
                    'link': '/admin/banner/add',
                    'subModule': 'add'
                },
            ],
            'count': 'banner'
        },
        'category': {
            'title': 'Category',
            'dashboard': true,
            'dashboardLink': '/admin/category/listing',
            'sidebar': true,
            'permissions': true,
            'icon': 'fas fa-list',
            'link': [
                {
                    'title': 'Listing',
                    'link': '/admin/category/listing',
                    'subModule': 'listing',
                },
                {
                    'title': 'Add',
                    'link': '/admin/category/add',
                    'subModule': 'add'
                },
            ],
            'count': 'category'
        },
        'bookings': {
            'title': 'Bookings',
            'Bookings': true,
            'dashboard': true,
            'dashboardLink': '/admin/booking/listing',
            'sidebar': true,
            'permissions': true,
            'icon': 'fas fa-calendar',
            'link': '/admin/booking/listing',
            'count': 'bookings',
            'link': [
                {   
                    'title': 'Listing',
                    'link': '/admin/booking/listing',
                    'subModule': 'listing',
                }
            ],
            'count': 'bookings' 
        },
        'transaction': {
            'title': 'Transactions',
            // 'Bookings': true,
            'dashboard': true,
            'dashboardLink': '/admin/transaction/listing',
            'sidebar': true,
            'permissions': true,
            'icon': 'fas fa-calendar',
            'link': '/admin/transaction/listing',
            'count': 'transaction',
            'link': [
                {   
                    'title': 'Listing',
                    'link': '/admin/transaction/listing',
                    'subModule': 'listing',
                }
            ],
            'count': 'transaction' 
        },
        // 'featurePlan': {
        //     'title': 'Feature Plan',
        //     'dashboard': true,
        //     'dashboardLink': '/admin/featurePlan/listing',
        //     'sidebar': true,
        //     'permissions': true,
        //     'icon': 'fas fa-list',
        //     'link': [
        //         {
        //             'title': 'Listing',
        //             'link': '/admin/featurePlan/listing',
        //             'subModule': 'listing',
        //         },
        //         {
        //             'title': 'Add',
        //             'link': '/admin/featurePlan/add',
        //             'subModule': 'add'
        //         },
        //     ],
        //     'count': 'featurePlan'
        // },
        // 'product': {
        //     'title': 'Product',
        //     'dashboard': true,
        //     'dashboardLink': '/admin/product/listing',
        //     'sidebar': true,
        //     'permissions': true,
        //     'icon': 'fas fa-cubes',
        //     'link': [
        //         {
        //             'title': 'Listing',
        //             'link': '/admin/product/listing',
        //             'subModule': 'listing',
        //         },
        //         {
        //             'title': 'Add',
        //             'link': '/admin/product/add',
        //             'subModule': 'add'
        //         },
        //     ],
        //     'count': 'product'
        // },
        // 'order': {
        //     'title': 'Order',
        //     'dashboard': true,
        //     // 'dashboardLink': '/admin/order/customerOrders',
        //     'sidebar': true,
        //     'permissions': true,
        //     'icon': 'fas fa-truck',
        //     'link': [
        //         {
        //             'title': 'Customer Orders',
        //             'link': '/admin/order/customerOrders',
        //             'subModule': 'customerOrders',
        //             'dashboard': true,
        //             'icon': 'fas fa-user',
        //             'count': 'order'
        //         },
        //         {
        //             'title': 'Seller Orders',
        //             'link': '/admin/order/sellerOrders',
        //             'subModule': 'sellerOrders',
        //             'dashboard': true,
        //             'icon': 'fas fa-truck',
        //             'count': 'order'
        //         },
        //         {
        //             'title': 'Cancellation Requests',
        //             'link': '/admin/order/cancellationRequests',
        //             'subModule': 'cancellationRequests',
        //             'dashboard': true,
        //             'dashboardTitle': 'Order Cancellation Requests',
        //             'icon': 'fas fa-truck',
        //             'count': 'orderCancellationRequest'
        //         },
        //         {
        //             'title': 'Refund Requests',
        //             'link': '/admin/order/refundRequests',
        //             'subModule': 'refundRequests',
        //             'dashboard': true,
        //             'dashboardTitle': 'Order Refund Requests',
        //             'icon': 'fas fa-truck',
        //             'count': 'orderRefundRequest'
        //         },
        //         {
        //             'title': 'Withdrawal Requests',
        //             'link': '/admin/order/withdrawalRequests',
        //             'subModule': 'withdrawalRequests',
        //             'dashboard': true,
        //             'dashboardTitle': 'Order Withdrawal Requests',
        //             'icon': 'fas fa-truck',
        //             'count': 'orderWithdrawalRequests'
        //         },
        //     ],
        //     'count': 'order'
        // },
            // 'report': {
            //     'title': 'Report',
            //     'dashboard': true,
            //     // 'dashboardLink': '/admin/report/salesReport',
            //     'sidebar': true,
            //     'permissions': true,
            //     'icon': 'fas fa-list-alt',
            //     'link': [
            //         {
            //             'title': 'Feature Plan Income Report',
            //             'link': '/admin/report/salesReport',
            //             'subModule': 'salesReport',
            //             'dashboard': true,
            //             'icon': 'fas fa-list-alt',
            //             'count': 'salesReport'
            //         },
            //         {
            //             'title': 'User Report',
            //             'link': '/admin/report/userReport',
            //             'subModule': 'userReport',
            //             'dashboard': true,
            //             'icon': 'fas fa-list-alt',
            //             'count': 'userReport'
            //         },
            //         // {
            //         //     'title': 'Sales Report',
            //         //     'link': '/admin/report/salesReport',
            //         //     'subModule': 'salesReport',
            //         //     'dashboard': true,
            //         //     'icon': 'fas fa-list-alt',
            //         //     'count': 'salesReport'
            //         // },
            //         // {
            //         //     'title': 'Seller Report',
            //         //     'link': '/admin/report/sellerReport',
            //         //     'subModule': 'sellerReport',
            //         //     'dashboard': true,
            //         //     'icon': 'fas fa-list-alt',
            //         //     'count': 'sellerReport'
            //         // },
            //         // {
            //         //     'title': 'Tax Report',
            //         //     'link': '/admin/report/taxReport',
            //         //     'subModule': 'taxReport',
            //         //     'dashboard': true,
            //         //     'icon': 'fas fa-list-alt',
            //         //     'count': 'taxReport'
            //         // },
            //         // {
            //         //     'title': 'Commission Report',
            //         //     'link': '/admin/report/commissionReport',
            //         //     'subModule': 'commissionReport',
            //         //     'dashboard': true,
            //         //     'icon': 'fas fa-list-alt',
            //         //     'count': 'commissionReport'
            //         // },
            //         // {
            //         //     'title': 'Revenue Report',
            //         //     'link': '/admin/report/revenueReport',
            //         //     'subModule': 'revenueReport',
            //         //     'dashboard': true,
            //         //     'icon': 'fas fa-list-alt',
            //         //     'count': 'revenueReport'
            //         // },
            //     ],
            //     'count': 'order'
            // },
        'rating': {
            'title': 'Review',
            'dashboard': true,
            'dashboardLink': '/admin/review',
            'sidebar': true,
            'permissions': false,
            'icon': 'fas fa-star',
            'link': '/admin/review',
            'count': 'review'
        },
        'contact_us': {
            'title': 'Contact Us',
            'dashboard': false,
            'dashboardLink': '/admin/contact_us',
            'sidebar': true,
            'permissions': false,
            'icon': 'fas fa-star',
            'link': '/admin/contact_us',
            'count': 'review'
        },
        'page': {
            'title': 'Page',
            'dashboard': true,
            'dashboardLink': 'javascript:void(0)',
            'sidebar': true,
            'permissions': true,
            'icon': 'fas fa-feather-alt',
            'link': [
                {
                    'title': 'Terms And Conditions',
                    'link': '/admin/page/termsAndConditions',
                    'subModule': 'termsAndConditions'
                },
                {
                    'title': 'Privacy Policy',
                    'link': '/admin/page/privacyPolicy',
                    'subModule': 'privacyPolicy'
                },
                {
                    'title': 'About Us',
                    'link': '/admin/page/aboutUs',
                    'subModule': 'aboutUs'
                },
            ],
            'count': 3
        },
        'setting': {
            'title': 'Setting',
            'dashboard': true,
            'sidebar': true,
            'permissions': true,
            'icon': 'fas fa-cog',
            'link': '/admin/setting',
            'count': 1
        },
        'logout': {
            'title': 'Log Out',
            'dashboard': false,
            'sidebar': true,
            'sidebarAnchorClass': 'logout_btn',
            'permissions': false,
            'icon': 'fas fa-sign-out-alt',
            'color': 'bg-blue',
            'link': '/admin/logout',
            'count': 1
        },
    },
    'sellerAdmin': {
        'dashboard': {
            'title': 'Dashboard',
            'dashboard': false,
            'sidebar': true,
            'permissions': false,
            'icon': 'fas fa-fire',
            'link': '/sellerAdmin/dashboard',
            'count': 1
        },
        'manageShop': {
            'title': 'Manage Shop',
            'dashboard': true,
            'sidebar': true,
            'permissions': false,
            'icon': 'fas fa-store',
            'link': '/sellerAdmin/manageShop',
            'count': 1
        },
        // 'category': {
        //     'title': 'Category',
        //     'dashboard': true,
        //     'dashboardLink': '/sellerAdmin/category/listing',
        //     'sidebar': true,
        //     'permissions': true,
        //     'icon': 'fas fa-list',
        //     'link': [
        //         {
        //             'title': 'Listing',
        //             'link': '/sellerAdmin/category/listing',
        //             'subModule': 'listing',
        //         },
        //         {
        //             'title': 'Add',
        //             'link': '/sellerAdmin/category/add',
        //             'subModule': 'add'
        //         },
        //     ],
        //     'count': 'category'
        // },
        // 'subCategory': {
        //     'title': 'Sub Category',
        //     'dashboard': true,
        //     'dashboardLink': '/sellerAdmin/subCategory/listing',
        //     'sidebar': true,
        //     'permissions': true,
        //     'icon': 'fas fa-list',
        //     'link': [
        //         {
        //             'title': 'Listing',
        //             'link': '/sellerAdmin/subCategory/listing',
        //             'subModule': 'listing',
        //         },
        //         {
        //             'title': 'Add',
        //             'link': '/sellerAdmin/subCategory/add',
        //             'subModule': 'add'
        //         },
        //     ],
        //     'count': 'subCategory'
        // },
        'product': {
            'title': 'Product',
            'dashboard': true,
            'dashboardLink': '/sellerAdmin/product/listing',
            'sidebar': true,
            'permissions': true,
            'icon': 'fas fa-cubes',
            'link': [
                {
                    'title': 'Listing',
                    'link': '/sellerAdmin/product/listing',
                    'subModule': 'listing',
                },
                {
                    'title': 'Add',
                    'link': '/sellerAdmin/product/add',
                    'subModule': 'add'
                },
            ],
            'count': 'product'
        },
        'orders': {
            'title': 'Orders',
            'dashboard': true,
            'sidebar': true,
            'permissions': false,
            'icon': 'fas fa-truck',
            'link': '/sellerAdmin/orders',
            'count': 'order'
        },
        'cancellationRequests': {
            'title': 'Cancellation Requests',
            'dashboard': true,
            'sidebar': true,
            'permissions': false,
            'icon': 'fas fa-ban',
            'link': '/sellerAdmin/cancellationRequests',
            'count': 'cancellationRequests'
        },
        'orderReturnRequests': {
            'title': 'Order Return Requests',
            'dashboard': true,
            'sidebar': true,
            'permissions': false,
            'icon': 'fas fa-undo-alt',
            'link': '/sellerAdmin/orderReturnRequests',
            'count': 'orderReturnRequests'
        },
        // 'taxCategory': {
        //     'title': 'Tax Category',
        //     'dashboard': true,
        //     'dashboardLink': '/sellerAdmin/taxCategory/listing',
        //     'sidebar': true,
        //     'permissions': false,
        //     'icon': 'fas fa-hand-holding-usd',
        //     'link': [
        //         {
        //             'title': 'Listing',
        //             'link': '/sellerAdmin/taxCategory/listing',
        //             'subModule': 'listing',
        //         },
        //         {
        //             'title': 'Add',
        //             'link': '/sellerAdmin/taxCategory/add',
        //             'subModule': 'add'
        //         },
        //     ],
        //     'count': 'taxCategory'
        // },
        'report': {
            'title': 'Report',
            'dashboard': true,
            // 'dashboardLink': '/admin/report/salesReport',
            'sidebar': true,
            'permissions': true,
            'icon': 'fas fa-list-alt',
            'link': [
                {
                    'title': 'Sales Report',
                    'link': '/sellerAdmin/report/salesReport',
                    'subModule': 'salesReport',
                    'dashboard': true,
                    'icon': 'fas fa-list-alt',
                    'count': 'salesReport'
                },
                {
                    'title': 'Tax Report',
                    'link': '/sellerAdmin/report/taxReport',
                    'subModule': 'taxReport',
                    'dashboard': true,
                    'icon': 'fas fa-list-alt',
                    'count': 'taxReport'
                },
                {
                    'title': 'Total Income Report',
                    'link': '/sellerAdmin/report/totalIncomeReport',
                    'subModule': 'totalIncomeReport',
                    'dashboard': true,
                    'icon': 'fas fa-list-alt',
                    'count': 'totalIncomeReport'
                },
            ],
            'count': 'order'
        },
        'setting': {
            'title': 'Setting',
            'dashboard': true,
            'sidebar': true,
            'permissions': true,
            'icon': 'fas fa-cog',
            'link': '/sellerAdmin/setting',
            'count': 1
        },
        'logout': {
            'title': 'Log Out',
            'dashboard': false,
            'sidebar': true,
            'sidebarAnchorClass': 'logout_btn',
            'permissions': false,
            'icon': 'fas fa-sign-out-alt',
            'color': 'bg-blue',
            'link': '/sellerAdmin/logout',
            'count': 1
        },
    },
    'reviewAdmin': {
        'dashboard': {
            'title': 'Dashboard',
            'dashboard': false,
            'sidebar': true,
            'permissions': false,
            'icon': 'fas fa-fire',
            'link': '/reviewAdmin/dashboard',
            'count': 1
        },
        'restaurantType': {
            'title': 'Restaurant Type',
            'dashboard': true,
            'dashboardLink': '/reviewAdmin/restaurantType/listing',
            'sidebar': true,
            'permissions': true,
            'icon': 'fas fa-pizza-slice',
            'link': [
                {
                    'title': 'Listing',
                    'link': '/reviewAdmin/restaurantType/listing',
                    'subModule': 'listing',
                },
                {
                    'title': 'Add',
                    'link': '/reviewAdmin/restaurantType/add',
                    'subModule': 'add'
                },
            ],
            'count': 'restaurantType'
        },
        'foodType': {
            'title': 'Food Type',
            'dashboard': true,
            'dashboardLink': '/reviewAdmin/foodType/listing',
            'sidebar': true,
            'permissions': true,
            'icon': 'fas fa-drumstick-bite',
            'link': [
                {
                    'title': 'Listing',
                    'link': '/reviewAdmin/foodType/listing',
                    'subModule': 'listing',
                },
                {
                    'title': 'Add',
                    'link': '/reviewAdmin/foodType/add',
                    'subModule': 'add'
                },
            ],
            'count': 'foodType'
        },
        'restaurant': {
            'title': 'Restaurant',
            'dashboard': true,
            'dashboardLink': '/reviewAdmin/restaurant/listing',
            'sidebar': true,
            'permissions': true,
            'icon': 'fas fa-hamburger',
            'link': [
                {
                    'title': 'Listing',
                    'link': '/reviewAdmin/restaurant/listing',
                    'subModule': 'listing',
                },
                {
                    'title': 'Add',
                    'link': '/reviewAdmin/restaurant/add',
                    'subModule': 'add'
                },
            ],
            'count': 'restaurant'
        },
        'logout': {
            'title': 'Log Out',
            'dashboard': false,
            'sidebar': true,
            'sidebarAnchorClass': 'logout_btn',
            'permissions': false,
            'icon': 'fas fa-sign-out-alt',
            'color': 'bg-blue',
            'link': '/reviewAdmin/logout',
            'count': 1
        },
    },
};

module.exports = modules;
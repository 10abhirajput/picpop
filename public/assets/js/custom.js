/**
 *
 * You can write your JS code here, DO NOT touch the default style file
 * because it will make it harder for you to update.
 *
 */

"use strict";
const securityKey = '__picpop';

/*
|------------------------------------------------------------------------------------------------------------------------------------------
|   PreLoader
|------------------------------------------------------------------------------------------------------------------------------------------
|
*/
var overlay = document.getElementById("overlay");

window.addEventListener('load', function () {
    overlay.style.display = 'none';
})

$(function () {


    /*
    |------------------------------------------------------------------------------------------------------------------------------------------
    |   Jquery DataTables
    |------------------------------------------------------------------------------------------------------------------------------------------
    |
    */
    $(".datatable").DataTable({
        "columnDefs": [
            // {
            //     "sortable": false,
            //     "targets": [0, 1, 2, 3, 4, 5, 6]
            // }
        ],
        "processing": true,
        "serverSide": false,
        "stateSave": false,
        "stateDuration": -1,
        "lengthMenu": [10, 25, 50, 100, 500],
        "fnStateSave": function (oSettings, oData) {
            localStorage.setItem('DataTables_' + window.location.pathname, JSON.stringify(oData));
        },
        "fnStateLoad": function (oSettings) {
            var data = localStorage.getItem('DataTables_' + window.location.pathname);
            return JSON.parse(data);
        }
    })  

    /*
    |------------------------------------------------------------------------------------------------------------------------------------------
    |   Jquery upload preview
    |------------------------------------------------------------------------------------------------------------------------------------------
    |
    */
    $(".select2_tags").select2({
        tags: true
    });
    $(".select2_tag").select2({
        tags: true
    });
    /*
    |------------------------------------------------------------------------------------------------------------------------------------------
    |   Jquery upload preview
    |------------------------------------------------------------------------------------------------------------------------------------------
    |
    */
    $.uploadPreview({
        input_field: "#image-upload",   // Default: .image-upload
        preview_box: "#image-preview",  // Default: .image-preview
        label_field: "#image-label",    // Default: .image-label
        label_default: "Choose File",   // Default: Choose File
        label_selected: "Change File",  // Default: Change File
        no_label: false,                // Default: false
        success_callback: null          // Default: null
    });

    /*
    |------------------------------------------------------------------------------------------------------------------------------------------
    |   Check Password Strength on password field
    |------------------------------------------------------------------------------------------------------------------------------------------
    |
    */
    $(".pwstrength").pwstrength();

    /*
    |------------------------------------------------------------------------------------------------------------------------------------------
    |   History Back
    |------------------------------------------------------------------------------------------------------------------------------------------
    |
    */
    $(document.body).on('click', '.cancel_btn', function () {
        window.history.back();
    });

    /*
    |------------------------------------------------------------------------------------------------------------------------------------------
    |   DataTables
    |------------------------------------------------------------------------------------------------------------------------------------------
    |
    */

    const modelDataTables = {
        'userDataTable': $("#userDataTable").DataTable({
            "columnDefs": [
                {
                    "sortable": false,
                    "targets": [0, 1, 2, 3, 4, 5, 6]
                }
            ],
            "processing": true,
            "serverSide": true,
            "stateSave": false,
            "stateDuration": -1,
            "lengthMenu": [10, 25, 50, 100, 500],
            // "ajax": "/admin/userDatatable"
            "ajax": {
                "url": "/admin/user/datatable",
                // "data": function ( d ) {
                //   return $.extend( {}, d, {
                //     "extra_search": $('#extra').val()
                //   } );
                // }
            },
            "fnStateSave": function (oSettings, oData) {
                localStorage.setItem('DataTables_' + window.location.pathname, JSON.stringify(oData));
            },
            "fnStateLoad": function (oSettings) {
                var data = localStorage.getItem('DataTables_' + window.location.pathname);
                return JSON.parse(data);
            }
        }),
        'customerOrderDataTable': $("#customerOrderDataTable").DataTable({
            "columnDefs": [
                {
                    "sortable": false,
                    "targets": [0, 1, 2, 3, 4, 5]
                }
            ],
            "processing": true,
            "serverSide": true,
            "stateSave": false,
            "stateDuration": -1,
            "lengthMenu": [10, 25, 50, 100, 500],
            // "ajax": "/admin/userDatatable"
            "ajax": {
                "url": "/admin/order/customerOrderDataTable",
                // "data": function ( d ) {
                //   return $.extend( {}, d, {
                //     "extra_search": $('#extra').val()
                //   } );
                // }
            },
            "fnStateSave": function (oSettings, oData) {
                localStorage.setItem('DataTables_' + window.location.pathname, JSON.stringify(oData));
            },
            "fnStateLoad": function (oSettings) {
                var data = localStorage.getItem('DataTables_' + window.location.pathname);
                return JSON.parse(data);
            }
        }),
        'sellerOrderDataTable': $("#sellerOrderDataTable").DataTable({
            "columnDefs": [
                {
                    "sortable": false,
                    "targets": [0, 1, 2, 3, 4, 5]
                }
            ],
            "processing": true,
            "serverSide": true,
            "stateSave": false,
            "stateDuration": -1,
            "lengthMenu": [10, 25, 50, 100, 500],
            // "ajax": "/admin/userDatatable"
            "ajax": {
                "url": "/admin/order/sellerOrderDataTable",
                // "data": function ( d ) {
                //   return $.extend( {}, d, {
                //     "extra_search": $('#extra').val()
                //   } );
                // }
            },
            "fnStateSave": function (oSettings, oData) {
                localStorage.setItem('DataTables_' + window.location.pathname, JSON.stringify(oData));
            },
            "fnStateLoad": function (oSettings) {
                var data = localStorage.getItem('DataTables_' + window.location.pathname);
                return JSON.parse(data);
            }
        }),
        'cancellationRequestsDataTable': $("#cancellationRequestsDataTable").DataTable({
            "columnDefs": [
                {
                    "sortable": false,
                    "targets": [0, 1, 2, 3, 4, 5, 6]
                }
            ],
            "processing": true,
            "serverSide": true,
            "stateSave": false,
            "stateDuration": -1,
            "lengthMenu": [10, 25, 50, 100, 500],
            // "ajax": "/admin/userDatatable"
            "ajax": {
                "url": "/admin/order/cancellationRequestsDataTable",
                // "data": function ( d ) {
                //   return $.extend( {}, d, {
                //     "extra_search": $('#extra').val()
                //   } );
                // }
            },
            "fnStateSave": function (oSettings, oData) {
                localStorage.setItem('DataTables_' + window.location.pathname, JSON.stringify(oData));
            },
            "fnStateLoad": function (oSettings) {
                var data = localStorage.getItem('DataTables_' + window.location.pathname);
                return JSON.parse(data);
            }
        }),
        'refundRequestsDataTable': $("#refundRequestsDataTable").DataTable({
            "columnDefs": [
                {
                    "sortable": false,
                    "targets": [0, 1, 2, 3, 4, 5, 6]
                }
            ],
            "processing": true,
            "serverSide": true,
            "stateSave": false,
            "stateDuration": -1,
            "lengthMenu": [10, 25, 50, 100, 500],
            // "ajax": "/admin/userDatatable"
            "ajax": {
                "url": "/admin/order/refundRequestsDataTable",
                // "data": function ( d ) {
                //   return $.extend( {}, d, {
                //     "extra_search": $('#extra').val()
                //   } );
                // }
            },
            "fnStateSave": function (oSettings, oData) {
                localStorage.setItem('DataTables_' + window.location.pathname, JSON.stringify(oData));
            },
            "fnStateLoad": function (oSettings) {
                var data = localStorage.getItem('DataTables_' + window.location.pathname);
                return JSON.parse(data);
            }
        }),
        'withdrawalRequestsDataTable': $("#withdrawalRequestsDataTable").DataTable({
            "columnDefs": [
                {
                    "sortable": false,
                    "targets": [0, 1, 2, 3, 4, 5, 6]
                }
            ],
            "processing": true,
            "serverSide": true,
            "stateSave": false,
            "stateDuration": -1,
            "lengthMenu": [10, 25, 50, 100, 500],
            // "ajax": "/admin/userDatatable"
            "ajax": {
                "url": "/admin/order/withdrawalRequestsDataTable",
                // "data": function ( d ) {
                //   return $.extend( {}, d, {
                //     "extra_search": $('#extra').val()
                //   } );
                // }
            },
            "fnStateSave": function (oSettings, oData) {
                localStorage.setItem('DataTables_' + window.location.pathname, JSON.stringify(oData));
            },
            "fnStateLoad": function (oSettings) {
                var data = localStorage.getItem('DataTables_' + window.location.pathname);
                return JSON.parse(data);
            }
        }),
        'salesReportDataTable': $("#salesReportDataTable").DataTable({
            "columnDefs": [
                {
                    "sortable": false,
                    "targets": [0, 1, 2, 3, 4, 5, 6]
                }
            ],
            "processing": true,
            "serverSide": true,
            "stateSave": false,
            "stateDuration": -1,
            "lengthMenu": [10, 25, 50, 100, 500],
            // "ajax": "/admin/userDatatable"
            "ajax": {
                "url": "/admin/report/salesReportDataTable",
                // "data": function ( d ) {
                //   return $.extend( {}, d, {
                //     "extra_search": $('#extra').val()
                //   } );
                // }
            },
            "fnStateSave": function (oSettings, oData) {
                localStorage.setItem('DataTables_' + window.location.pathname, JSON.stringify(oData));
            },
            "fnStateLoad": function (oSettings) {
                var data = localStorage.getItem('DataTables_' + window.location.pathname);
                return JSON.parse(data);
            }
        }),
        'userReportDataTable': $("#userReportDataTable").DataTable({
            "columnDefs": [
                {
                    "sortable": false,
                    "targets": [0, 1, 2, 3, 4]
                }
            ],
            "processing": true,
            "serverSide": true,
            "stateSave": false,
            "stateDuration": -1,
            "lengthMenu": [10, 25, 50, 100, 500],
            // "ajax": "/admin/userDatatable"
            "ajax": {
                "url": "/admin/report/userReportDataTable",
                // "data": function ( d ) {
                //   return $.extend( {}, d, {
                //     "extra_search": $('#extra').val()
                //   } );
                // }
            },
            "fnStateSave": function (oSettings, oData) {
                localStorage.setItem('DataTables_' + window.location.pathname, JSON.stringify(oData));
            },
            "fnStateLoad": function (oSettings) {
                var data = localStorage.getItem('DataTables_' + window.location.pathname);
                return JSON.parse(data);
            }
        }),
        'sellerReportDataTable': $("#sellerReportDataTable").DataTable({
            "columnDefs": [
                {
                    "sortable": false,
                    "targets": [0, 1, 2, 3, 4]
                }
            ],
            "processing": true,
            "serverSide": true,
            "stateSave": false,
            "stateDuration": -1,
            "lengthMenu": [10, 25, 50, 100, 500],
            // "ajax": "/admin/userDatatable"
            "ajax": {
                "url": "/admin/report/sellerReportDataTable",
                // "data": function ( d ) {
                //   return $.extend( {}, d, {
                //     "extra_search": $('#extra').val()
                //   } );
                // }
            },
            "fnStateSave": function (oSettings, oData) {
                localStorage.setItem('DataTables_' + window.location.pathname, JSON.stringify(oData));
            },
            "fnStateLoad": function (oSettings) {
                var data = localStorage.getItem('DataTables_' + window.location.pathname);
                return JSON.parse(data);
            }
        }),
        'taxReportDataTable': $("#taxReportDataTable").DataTable({
            "columnDefs": [
                {
                    "sortable": false,
                    "targets": [0, 1, 2, 3, 4]
                }
            ],
            "processing": true,
            "serverSide": true,
            "stateSave": false,
            "stateDuration": -1,
            "lengthMenu": [10, 25, 50, 100, 500],
            // "ajax": "/admin/userDatatable"
            "ajax": {
                "url": "/admin/report/taxReportDataTable",
                // "data": function ( d ) {
                //   return $.extend( {}, d, {
                //     "extra_search": $('#extra').val()
                //   } );
                // }
            },
            "fnStateSave": function (oSettings, oData) {
                localStorage.setItem('DataTables_' + window.location.pathname, JSON.stringify(oData));
            },
            "fnStateLoad": function (oSettings) {
                var data = localStorage.getItem('DataTables_' + window.location.pathname);
                return JSON.parse(data);
            }
        }),
        'commissionReportDataTable': $("#commissionReportDataTable").DataTable({
            "columnDefs": [
                {
                    "sortable": false,
                    "targets": [0, 1, 2, 3, 4]
                }
            ],
            "processing": true,
            "serverSide": true,
            "stateSave": false,
            "stateDuration": -1,
            "lengthMenu": [10, 25, 50, 100, 500],
            // "ajax": "/admin/userDatatable"
            "ajax": {
                "url": "/admin/report/commissionReportDataTable",
                // "data": function ( d ) {
                //   return $.extend( {}, d, {
                //     "extra_search": $('#extra').val()
                //   } );
                // }
            },
            "fnStateSave": function (oSettings, oData) {
                localStorage.setItem('DataTables_' + window.location.pathname, JSON.stringify(oData));
            },
            "fnStateLoad": function (oSettings) {
                var data = localStorage.getItem('DataTables_' + window.location.pathname);
                return JSON.parse(data);
            }
        }),
    }

    /*
    |------------------------------------------------------------------------------------------------------------------------------------------
    |   Summernote Editor
    |------------------------------------------------------------------------------------------------------------------------------------------
    |
    */
    // if (jQuery().summernote) {
    //     $(".summernote-page").summernote({
    //         dialogsInBody: true,
    //         minHeight: 250,
    //         focus: true,
    //         toolbar: [
    //             ['style', ['bold', 'italic', 'underline', 'clear']],
    //             ['font', ['bold', 'underline', 'clear', 'strikethrough']],
    //             ['fontname', ['fontname']],
    //             ['fontsize', ['fontsize']],
    //             ['para', ['ul', 'ol', 'paragraph']],
    //             ['color', ['color']],
    //             ['table', ['table']],
    //             ['view', [
    //                 // 'fullscreen', 
    //                 'codeview', 'help']]
    //         ]
    //     });
    // }


    $(document.body).on('change', '.locationStatus', function () {
        const id = $(this).attr('model_id');
        const model = $(this).attr('model');
        const modelTitle = $(this).attr('model_title');
        const field = $(this).attr('field');
        const fieldValue = $(this).val();
        const modelDataTable = $(this).attr('datatable');
        const statusText = $("option:selected", this).text();
        console.log('=============================>response',field);
      
        if (id && model && modelTitle) {
          $.ajax({
            type: 'PUT',
            url: '/admin/changeField',
            // headers: {
            //   'securitykey': securityKey,
            // },
            data: {
              id,
              model,
              field,
              fieldValue,
            },
            beforeSend: () => {
      
            },
            success: (response) => {
              console.log(response, '=============================>response');
              setTimeout(() => {
                // console.log(this,"======================setTimeout");
      
                const color = $('option:selected', this).css('background-color');
                // console.log(color, 'jhjhjhjhhjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj');
                
                $(this).css('background-color', color);
      
                iziToast[response.success ? 'success' : 'error']({
                  // title: response.message,
                  title: `${modelTitle} status changed to ${statusText}`,
                  // message: '',
                  position: 'topRight'
                });
              }, 500);
            }
          });
        }
      
      
      });

    /*
    |------------------------------------------------------------------------------------------------------------------------------------------
    |   Update Page Content Ajax
    |------------------------------------------------------------------------------------------------------------------------------------------
    |
    */
    $("#updateContent").on('click', function () {
        const id = $('#id').val();
        const title = $('#title').val();
        const content = $('.summernote-page').val();

        $.ajax({
            type: 'PUT',
            url: '/admin/page/updatePage',
            headers: {
                'securitykey': securityKey,
            },
            data: {
                id,
                title,
                content
            },
            beforeSend: () => {
                $(this).attr('disabled', 'true');
                $(this).html('Updating');
                $(this).prepend('<i class="fa fa-spinner" style="margin-right: 7px;"></i>');
            },
            success: (response) => {
                setTimeout(() => {
                    $(this).removeAttr('disabled');
                    $(this).find('i').remove();
                    $(this).html('Update');
                    iziToast[response.success ? 'success' : 'error']({
                        title: response.message,
                        // message: '',
                        position: 'topRight'
                    });
                }, 1000);
            }
        });
    });

    /*
    |------------------------------------------------------------------------------------------------------------------------------------------
    |   Update Status Ajax
    |------------------------------------------------------------------------------------------------------------------------------------------
    |
    */
    $(document.body).on('click', '.status_btn', function () {
        let status = $(this).attr('status');
        const id = $(this).attr('model_id');
        const model = $(this).attr('model');

        status = status == 0 ? 1 : 0;

        $.ajax({
            type: 'PUT',
            url: '/admin/updateStatus',
            headers: {
                'securitykey': securityKey,
            },
            data: {
                id,
                model,
                status
            },
            beforeSend: () => {
                $(this).attr('disabled', 'true');
                $(this).prepend('<i class="fa fa-spinner" style="margin-right: 7px;"></i>');
            },
            success: (response) => {
                console.log(response, '=============================>response');
                setTimeout(() => {
                    $(this).find('i').remove();
                    $(this).removeAttr('disabled');
                    $(this).attr('status', status);

                    if (status == 0) {
                        $(this).html('Inactive');
                        $(this).removeClass('btn-outline-success');
                        $(this).addClass('btn-outline-danger');
                    } else {
                        $(this).html('Active');
                        $(this).removeClass('btn-outline-danger');
                        $(this).addClass('btn-outline-success');
                    }

                    iziToast[response.success ? 'success' : 'error']({
                        title: response.message,
                        // message: '',
                        position: 'topRight'
                    });
                }, 500);
            }
        });
    });

    /*
    |------------------------------------------------------------------------------------------------------------------------------------------
    |   Delete Module Entry Ajax
    |------------------------------------------------------------------------------------------------------------------------------------------
    |
    */
    $(document.body).on('click', '.delete_btn', function () {
        const id = $(this).attr('model_id');
        const model = $(this).attr('model');
        const modelTitle = $(this).attr('model_title');
        const modelDataTable = $(this).attr('datatable');

        // $(this).parents('tr').remove();
        // return;


        // console.log(modelDataTable, '===================>modelDataTable')
        // console.log(userDataTable, '======>userDataTable')
        // console.log(modelDataTable, '======>modelDataTable')
        // console.log(modelDataTables[String(modelDataTable)], '======>modelDataTables[modelDataTable]')
        // console.log(modelDataTables['userDataTable'])

        // console.log(modelDataTables[modelDataTable]
        //     .row( $(this).parents('tr') ), '===================>tr')

        // // table
        // //     .row( $(this).parents('tr') )
        // //     .remove()
        // //     .draw();
        // console.log($(this).parents('tr'), "$(this).parents('tr')");
        //     var row = table.row( $(this).parents('tr') );
        //     // var rowNode = row.node();
        //     row.remove().draw();

        // table2
        //     .row.add( rowNode )
        //     .draw();

        // return;

        if (id && model && modelTitle) {
            swal({
                title: 'Are you sure?',
                text: `You will not be able to recover this ${modelTitle}!`,
                icon: 'warning',
                buttons: true,
                dangerMode: true,
            }).then((isConfirm) => {
                console.log(isConfirm, 'isConfirm');
                if (isConfirm) {
                    $.ajax({
                        type: 'DELETE',
                        url: '/admin/delete',
                        headers: {
                            'securitykey': securityKey,
                        },
                        data: {
                            id,
                            model,
                        },
                        beforeSend: () => {
                            $(this).attr('disabled', 'true');
                            $(this).prepend('<i class="fa fa-spinner" style="margin-right: 7px;"></i>');
                        },
                        success: (response) => {
                            console.log(response, '=============================>response');
                            setTimeout(() => {
                                swal({
                                    title: "Deleted!",
                                    text: `${modelTitle} has been deleted.`,
                                    icon: "success",
                                    timer: '1000',
                                    buttons: false,
                                });

                                $(this).find('i').remove();
                                $(this).removeAttr('disabled');

                                $(this).parents('tr').remove();

                                // modelDataTables[modelDataTable]
                                // .row( $(this).parents('tr') )
                                // .remove()
                                // .draw();

                                // iziToast[response.success ? 'success' : 'error']({
                                //     title: response.message,
                                //     // message: '',
                                //     position: 'topRight'
                                // }); 
                            }, 500);
                        }
                    });

                } else {
                    // swal("Cancelled", `${item} is safe !`, "error");
                    swal({
                        title: "Cancelled",
                        text: `${modelTitle} is safe !`,
                        icon: "error",
                        timer: '1000',
                        buttons: false,
                    });
                }
            });
        }


    });

    /*
    |------------------------------------------------------------------------------------------------------------------------------------------
    |   Logout Ajax
    |------------------------------------------------------------------------------------------------------------------------------------------
    |
    */
    $(document.body).on('click', '.logout_btn', function (e) {
        e.preventDefault();
        swal({
            title: 'Are you sure?',
            text: `Do you really want to logout!`,
            icon: 'warning',
            buttons: true,
            dangerMode: true,
        }).then((isConfirm) => {
            console.log(isConfirm, 'isConfirm');
            if (isConfirm) {
                $('#hidden_logout')[0].click();
                console.log($('#hidden_logout'));
            } else {
                swal({
                    title: "Cancelled",
                    text: `You have prevented logout !`,
                    icon: "error",
                    timer: '1000',
                    buttons: false,
                });
            }
        });


    });

    /*
    |------------------------------------------------------------------------------------------------------------------------------------------
    |   Dashboard Counters
    |------------------------------------------------------------------------------------------------------------------------------------------
    |
    */
    const dashbordCounter = () => {
        const counters = document.querySelectorAll('.counter');
        const speed = 400; // The higer the slower

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.getAttribute('current-count');

                // Lower inc to slow and higher to slow
                const inc = target / speed;

                // console.log(inc);
                // console.log(count);

                // Check if target is reached
                if (count < target) {
                    // Add inc to count and output in counter
                    counter.setAttribute('current-count', count + inc);
                    // console.log(count + inc)
                    counter.innerText = Math.round(count + inc);
                    // Call function every ms
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target;
                }
            };

            updateCount();
        });
    }
    dashbordCounter();

    /*
    |------------------------------------------------------------------------------------------------------------------------------------------
    |   Change Order Status
    |------------------------------------------------------------------------------------------------------------------------------------------
    |
    */
    $(document.body).on('change', '.changeOrderRequestStatus', function () {
        const id = $(this).attr('model_id');
        const model = $(this).attr('model');
        const modelTitle = $(this).attr('model_title');
        const field = $(this).attr('field');
        const fieldValue = $(this).val();
        const modelDataTable = $(this).attr('datatable');
        const statusText = $("option:selected", this).text();
        if (id && model && modelTitle) {
            $.ajax({
                type: 'PUT',
                url: '/admin/changeField',
                headers: {
                    'securitykey': securityKey,
                },
                data: {
                    id,
                    model,
                    field,
                    fieldValue,
                },
                beforeSend: () => {

                },
                success: (response) => {
                    console.log(response, '=============================>response');
                    setTimeout(() => {
                        const color = $('option:selected', this).css('background-color');
                        $(this).css('background-color', color);

                        iziToast[response.success ? 'success' : 'error']({
                            // title: response.message,
                            title: `${modelTitle} status changed to ${statusText}`,
                            // message: '',
                            position: 'topRight'
                        });
                    }, 500);
                }
            });
        }


    });
    /*
    |------------------------------------------------------------------------------------------------------------------------------------------
    |   Profile Setting Form Ajax
    |------------------------------------------------------------------------------------------------------------------------------------------
    |
    */
    $(document.body).on('submit', '#profile_setting_from', function (e) {
        e.preventDefault();
        let formData = new FormData($(this)[0]);
        // console.log(formData)
        // return
        $.ajax({
            url: '/admin/user/addUpdateUser',
            data: formData,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                window.location.reload();

                iziToast[response.success ? 'success' : 'error']({
                    title: response.message,
                    position: 'topRight'
                });
            }
        });
    });

    $(document.body).on('submit', '.profile_setting_from', function (e) {
        e.preventDefault();
        let formData = new FormData($(this)[0]);

        $.ajax({
            url: '/sellerAdmin/user/updateUser',
            data: formData,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                window.location.reload();

                iziToast[response.success ? 'success' : 'error']({
                    title: response.message,
                    position: 'topRight'
                });
            }
        });
    });

    $(document.body).on('submit', '#changePasswordSettingForm', function (e) {
        e.preventDefault();
        let formData = new FormData($(this)[0]);

        $.ajax({
            url: '/sellerAdmin/user/changePasswordSetting',
            data: formData,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                console.log(response, '========>response');
                if (response.success) {
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000);
                }

                iziToast[response.success ? 'success' : 'error']({
                    title: response.message,
                    position: 'topRight'
                });
            }
        });
    });

    $(document.body).on('submit', '#changeEmailSettingForm', function (e) {
        e.preventDefault();
        let formData = new FormData($(this)[0]);

        $.ajax({
            url: '/sellerAdmin/user/changeEmailSetting',
            data: formData,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                console.log(response, '========>response');
                if (response.success) {
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000);
                }

                iziToast[response.success ? 'success' : 'error']({
                    title: response.message,
                    position: 'topRight'
                });
            }
        });
    });
    /*
    |------------------------------------------------------------------------------------------------------------------------------------------
    |   Universal Form for Settings Ajax
    |------------------------------------------------------------------------------------------------------------------------------------------
    |
    */
    $(document.body).on('submit', '.updateSettings', function (e) {
        e.preventDefault();
        let formData = new FormData($(this)[0]);

        const checkbox = $($(this)[0]).find("input[type=checkbox]");
        $.each(checkbox, function (key, val) {
            formData.set($(val).attr('name'), formData.has($(val).attr('name')) ? '1' : '0');
        });

        $.ajax({
            url: '/admin/setting/updateSettings',
            data: formData,
            processData: false,
            contentType: false,
            type: 'PUT',
            success: function (response) {

                iziToast[response.success ? 'success' : 'error']({
                    title: response.message,
                    position: 'topRight'
                });
            }
        });
    });
    /*
    |------------------------------------------------------------------------------------------------------------------------------------------
    |   Form for Site Comission Ajax
    |------------------------------------------------------------------------------------------------------------------------------------------
    |
    */
    $(document.body).on('submit', '.updateSiteComission', function (e) {
        e.preventDefault();
        let formData = new FormData($(this)[0]);

        $.ajax({
            url: '/admin/setting/updateSiteComission',
            data: formData,
            processData: false,
            contentType: false,
            type: 'PUT',
            success: function (response) {

                iziToast[response.success ? 'success' : 'error']({
                    title: response.message,
                    position: 'topRight'
                });
            }
        });
    });

    /*
    |------------------------------------------------------------------------------------------------------------------------------------------
    |   Category Based SubCategory in Product module Ajax
    |------------------------------------------------------------------------------------------------------------------------------------------
    |
    */
    $(document.body).on('change', '#productCategorySelect', function () {
        const categoryId = $(this).val();

        console.log(categoryId, '=====>categoryId');

        $.ajax({
            url: '/sellerAdmin/product/productCategorySelect',
            data: {
                categoryId: categoryId
            },
            type: 'POST',
            success: function (response) {
                $('.subCategoryContainer').html(response.body);
                $(".select2").select2();
            }
        });
    });

    /*
    |------------------------------------------------------------------------------------------------------------------------------------------
    |   Date Range Picker
    |------------------------------------------------------------------------------------------------------------------------------------------
    |
    */
    $('.daterange-picker').daterangepicker({
        autoUpdateInput: false,
        locale: {
            format: 'YYYY-MM-DD',
            cancelLabel: 'Clear',
        },
        maxDate: moment().format('YYYY-MM-DD'),
        drops: 'down',
        opens: 'right'
    });
    $('.daterange-picker').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'));

        /*
        |------------------------------------------------------------------------------------------------------
        |   For Report Filter
        |------------------------------------------------------------------------------------------------------
        |
        */
        if ($(this).hasClass('filter_report')) {

            const value = $(this).val();
            const reportsModule = $(this).attr('module_name');
            const prefix = $(this).attr('prefix');

            let [from, to] = value.split(' - ').map(date => date.trim());
            console.log(from, '============>from');
            console.log(to, '============>to');

            window.location.replace(`/${prefix ? prefix : 'admin'}/report/${reportsModule}?from=${from}&to=${to}`);
        }
        /*
        |------------------------------------------------------------------------------------------------------
        */

    });
    $('.daterange-picker').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });

    $('.daterange-btn').daterangepicker({
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        startDate: moment().subtract(29, 'days'),
        endDate: moment()
    }, function (start, end) {
        $('.daterange-btn span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'))
    });

    /*
    |------------------------------------------------------------------------------------------------------------------------------------------
    | Reports Filter Ajax
    |------------------------------------------------------------------------------------------------------------------------------------------
    |
    */
    // $(document.body).on('change', '.filter_report', function () {
    //     console.log('here');
    //     const value = $(this).val();
    //     const reportsModule = $(this).attr('module_name');

    //     let [from, to] = value.split(' - ').map(date => date.trim());
    //     console.log(from, '============>from');
    //     console.log(to, '============>to');

    //     window.location.replace(`/admin/report/${reportsModule}?from=${from}&to=${to}`);
    // });


    /*
    |------------------------------------------------------------------------------------------------------------------------------------------
    | Admin Commission rows
    |------------------------------------------------------------------------------------------------------------------------------------------
    |
    */




    /*
    |------------------------------------------------------------------------------------------------------------------------------------------
    | Add Product Specification
    |------------------------------------------------------------------------------------------------------------------------------------------
    |
    */
    $(document.body).on('click', '.add_product_specification', function () {
        let html = ``;

        html += `<div class="row single_row_container">
                    <div class="col-5 col-md-5 col-lg-5">
                        <div class="form-group">
                        <label>&nbsp;</label>

                        <div class="input-group">
                        <!-- <div class="input-group-prepend">
                            <div class="input-group-text">
                                <i class="fas fa-signature"></i>
                            </div>
                            </div> -->
                            <input type="text" class="form-control" name="specificationName"
                            value=""
                            required>
                        </div>
                        </div>
                    </div>
                    <div class="col-5 col-md-5 col-lg-5">
                        <label>&nbsp;</label>
                        <div class="form-group">
                        <div class="input-group">
                        <!--
                            <div class="input-group-prepend">
                            <div class="input-group-text">
                                <i class="fas fa-signature"></i>
                            </div>
                            </div>
                            -->
                            <input type="text" class="form-control" name="speecificationValue"
                            value=""
                            required>
                        </div>
                        </div>
                    </div>
                    <div class="col-2 col-md-2 col-lg-2">
                        <label>&nbsp;</label>
                        <div class="form-group">
                            <a href="javascript:void(0)" class="btn btn-icon btn-danger delete_product_specification_row"><i class="fas fa-times"></i></a>
                        </div>
                    </div>
                    </div>
                `;

        $('.product_specification_container').append(html);
    });

    $(document.body).on('click', '.delete_product_specification_row', function (e) {
        e.preventDefault;
        $(this).closest('div.single_row_container').remove();
    });



    /*
    |------------------------------------------------------------------------------------------------------------------------------------------
    | 
    |------------------------------------------------------------------------------------------------------------------------------------------
    |
    */


    // Daterangepicker
    if (jQuery().daterangepicker) {
        if ($(".datepicker").length) {
            $('.datepicker').daterangepicker({
                locale: { format: 'YYYY-MM-DD' },
                singleDatePicker: true,
            });
        }
        if ($(".datetimepicker").length) {
            $('.datetimepicker').daterangepicker({
                locale: { format: 'YYYY-MM-DD hh:mm' },
                singleDatePicker: true,
                timePicker: true,
                timePicker24Hour: true,
            });
        }
        if ($(".daterange").length) {
            $('.daterange').daterangepicker({
                locale: { format: 'YYYY-MM-DD' },
                drops: 'down',
                opens: 'right'
            });
        }
    }

    // Timepicker
    if (jQuery().timepicker && $(".timepicker").length) {
        $(".timepicker").timepicker({
            icons: {
                up: 'fas fa-chevron-up',
                down: 'fas fa-chevron-down'
            }
        });
    }

});
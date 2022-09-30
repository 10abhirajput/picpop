const models = require("../../models");
const helper = require("../../helpers/helper");
const Paginator = require("paginator");
const sequelize = require("sequelize");
const { request } = require("express");
const category = require("../../models/category");
const { Op } = sequelize;

const prefixBaseName = "admin";
const model = "bookings";
const modelBaseName = "bookings";
const modelTitle = "Bookings";
const modelImageFolder = "bookings";
const modelDataTable = "";
// 	bookings.hasMany(models.user, { onDelete: 'cascade', hooks: false });\

module.exports = {
  listing: async (req, res) => {
    try {
      global.currentModule = modelTitle;
      global.currentSubModule = "Listing";
      global.currentSubModuleSidebar = "listing";

      const listing = await models[model].findAll({
        // order: [['id', 'DESC']],
        // hierarchy: true,
        where: {},
        include: [
          {
            model: models["user"],
            as: "user",
            required: true,
            include: [
              {
                model: models["userDetail"],
              },
            ],
          },
          {
            model: models["locationOwnerDetail"],
            on: {
              col1: sequelize.where(
                sequelize.col("bookings.locationOwnerId"),
                "=",
                sequelize.col("locationOwnerDetail.id")
              ),
            },
          },
          {
            model: models["businessProfessionalDetail"],
            on: {
              col1: sequelize.where(
                sequelize.col("bookings.serviceProviderId"),
                "=",
                sequelize.col("businessProfessionalDetail.id")
              ),
            },
          },
          {
            model: models["category"],
          },
        ],

        raw: true,
        nest: true,
        order: [['id', 'DESC']]
      });
      console.log("0-----------------------------------------listing", listing);

      //  listing.map(listing => {
      //   return listing.toJSON();
      //  });

      // console.log(listing,"listing");
      // console.log(JSON.stringify(listing, null, 2), '===============>listing');
      // return;

      // console.log(
      //   JSON.stringify(listing, null, 2),
      //   "======================================>listing"
      // );
      // return;

      const parent = await module.exports.getParent();

      const parentCategoryObj = {};

      if (parent.length > 0) {
        parent.forEach((child) => {
          parentCategoryObj[child.value] = child.label;
        });
      }

      const data = await Promise.all(
        listing.map(async (row, index) => {
          console.log("-------------------------------------",row);
          
          const statusButton = {
            0: `<span model_id="${row.id}" model="${model}" status="${row.status}" class="btn btn-outline-warning" >Pending</span>`,
            1: `<span model_id="${row.id}" model="${model}" status="${row.status}" class="btn btn-outline-success" >Accepted</span>`,
            // 2: `<span model_id="${row.id}" model="${model}" status="${row.status}" class="btn btn-outline-danger" >Reject</span>`,
          };

          const viewButton = `<a href="/${prefixBaseName}/${modelBaseName}/view/${row.id}" class="btn btn-outline-info" >View</a>`;
          // const editButton = `<a href="/${prefixBaseName}/${modelBaseName}/edit/${row.id}" class="btn btn-outline-warning" >Edit</a>`;
          // const deleteButton = `<button model_id="${row.id}" model="${model}" model_title="${modelTitle}" datatable="${modelDataTable}" class="btn btn-outline-danger delete_btn" >Delete</button>`;

          let action = "";
          action += viewButton;
          action += "&nbsp;";
          // action += editButton;
          // action += '&nbsp;';
          // action += deleteButton;
          var date = new Date(1641967582*1000);
          var aaaaaa = new Date(1641968725*1000);
          console.log(date,aaaaaa);
          
          row.startBookingDate = new Date(row.startBookingDate*1000);
          row.endBookingDate = new Date(row.endBookingDate*1000);
          // console.log(moment(date).format("YYYY-MM-DD HH:mm:ss"));
          return Object.values({
            sno: parseInt(index) + 1,
            name: row.user.userDetail.name,
            service: row.businessProfessionalDetail.businessName,
            location: row.locationOwnerDetail.adress,
            category: row.category.name,
            date: moment(row.startBookingDate).format("YYYY-MM-DD HH:mm:ss"),
            time: moment(row.endBookingDate).format("YYYY-MM-DD HH:mm:ss"),
            // parentCategory: parentCategoryObj[row.id] == row.name ? 'Parent Category' : parentCategoryObj[row.id],
            // dateCreated: moment(row.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a'),
            status: statusButton[row.status],
            action,
          });
        })
      );

      const headerColumns = Object.values({
        sno: "#",
        name: "User Name",
        service: "Service Provider",
        location: "Location Owner",
        category: "Category",
        date: "Start Booking DateTime",
        time: "End Booking DateTime",
        status: "Status",
        action: "Action",
      });

      return res.render(`${prefixBaseName}/${modelBaseName}/listing`, {
        headerColumns,
        data,
      });
    } catch (err) {
      return helper.error(res, err);
    }
  },

  approvel: async (req, res) => {
    try {
      global.currentModule = modelTitle;
      global.currentSubModule = "Listing";
      global.currentSubModuleSidebar = "listing";

      const listing = await models[model].findAll({
        // order: [['id', 'DESC']],
        // hierarchy: true,
        where: {
          status: 1
        },
        include: [
          {
            model: models["user"],
            as: "user",
            required: true,
            include: [
              {
                model: models["userDetail"],
              },
            ],
          },
          {
            model: models["locationOwnerDetail"],
            on: {
              col1: sequelize.where(
                sequelize.col("bookings.locationOwnerId"),
                "=",
                sequelize.col("locationOwnerDetail.userId")
              ),
            },
          },
          {
            model: models["businessProfessionalDetail"],
            on: {
              col1: sequelize.where(
                sequelize.col("bookings.serviceProviderId"),
                "=",
                sequelize.col("businessProfessionalDetail.userId")
              ),
            },
          },
          {
            model: models["category"],
          },
        ],

        raw: true,
        nest: true,
      });
      console.log("0-----------------------------------------listing", listing);

      //  listing.map(listing => {
      //   return listing.toJSON();
      //  });

      // console.log(listing,"listing");
      // console.log(JSON.stringify(listing, null, 2), '===============>listing');
      // return;

      console.log(
        JSON.stringify(listing, null, 2),
        "======================================>listing"
      );
      // return;

      const parent = await module.exports.getParent();

      const parentCategoryObj = {};

      if (parent.length > 0) {
        parent.forEach((child) => {
          parentCategoryObj[child.value] = child.label;
        });
      }

      const data = await Promise.all(
        listing.map(async (row, index) => {
          const statusButton = {
            0: `<span model_id="${row.id}" model="${model}" status="${row.status}" class="btn btn-outline-warning" >Pending</span>`,
            1: `<span model_id="${row.id}" model="${model}" status="${row.status}" class="btn btn-outline-success" >Accepted</span>`,
            // 2: `<span model_id="${row.id}" model="${model}" status="${row.status}" class="btn btn-outline-danger" >Reject</span>`,
          };

          const viewButton = `<a href="/${prefixBaseName}/${modelBaseName}/view/${row.id}" class="btn btn-outline-info" >View</a>`;
          // const editButton = `<a href="/${prefixBaseName}/${modelBaseName}/edit/${row.id}" class="btn btn-outline-warning" >Edit</a>`;
          // const deleteButton = `<button model_id="${row.id}" model="${model}" model_title="${modelTitle}" datatable="${modelDataTable}" class="btn btn-outline-danger delete_btn" >Delete</button>`;

          let action = "";
          action += viewButton;
          action += "&nbsp;";
          // action += editButton;
          // action += '&nbsp;';
          // action += deleteButton;

          return Object.values({
            sno: parseInt(index) + 1,
            name: row.user.userDetail.name,
            service: row.businessProfessionalDetail.name,
            location: row.locationOwnerDetail.location,
            category: row.category.name,
            date: row.createdAt.toLocaleString("en-US"),
            // parentCategory: parentCategoryObj[row.id] == row.name ? 'Parent Category' : parentCategoryObj[row.id],
            // dateCreated: moment(row.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a'),
            status: statusButton[row.status],
            action,
          });
        })
      );

      const headerColumns = Object.values({
        sno: "#",
        name: "User Name",
        service: "Service Provider",
        location: "Location",
        category: "Category",
        date: "Booking Time",
        status: "Status",
        action: "Action",
      });

      return res.render(`${prefixBaseName}/${modelBaseName}/approvel`, {
        headerColumns,
        data,
      });
    } catch (err) {
      return helper.error(res, err);
    }
  },

  pending: async (req, res) => {
    try {
      global.currentModule = modelTitle;
      global.currentSubModule = "Listing";
      global.currentSubModuleSidebar = "listing";

      const listing = await models[model].findAll({
        // order: [['id', 'DESC']],
        // hierarchy: true,
        where: {
          status: 0
        },
        include: [
          {
            model: models["user"],
            as: "user",
            required: true,
            include: [
              {
                model: models["userDetail"],
              },
            ],
          },
          {
            model: models["locationOwnerDetail"],
            on: {
              col1: sequelize.where(
                sequelize.col("bookings.locationOwnerId"),
                "=",
                sequelize.col("locationOwnerDetail.userId")
              ),
            },
          },
          {
            model: models["businessProfessionalDetail"],
            on: {
              col1: sequelize.where(
                sequelize.col("bookings.serviceProviderId"),
                "=",
                sequelize.col("businessProfessionalDetail.userId")
              ),
            },
          },
          {
            model: models["category"],
          },
        ],

        raw: true,
        nest: true,
      });
      console.log("0-----------------------------------------listing", listing);

      //  listing.map(listing => {
      //   return listing.toJSON();
      //  });

      // console.log(listing,"listing");
      // console.log(JSON.stringify(listing, null, 2), '===============>listing');
      // return;

      console.log(
        JSON.stringify(listing, null, 2),
        "======================================>listing"
      );
      // return;

      const parent = await module.exports.getParent();

      const parentCategoryObj = {};

      if (parent.length > 0) {
        parent.forEach((child) => {
          parentCategoryObj[child.value] = child.label;
        });
      }

      const data = await Promise.all(
        listing.map(async (row, index) => {
          const statusButton = {
            0: `<span model_id="${row.id}" model="${model}" status="${row.status}" class="btn btn-outline-warning" >Pending</span>`,
            1: `<span model_id="${row.id}" model="${model}" status="${row.status}" class="btn btn-outline-success" >Accepted</span>`,
            // 2: `<span model_id="${row.id}" model="${model}" status="${row.status}" class="btn btn-outline-danger" >Reject</span>`,
          };

          const viewButton = `<a href="/${prefixBaseName}/${modelBaseName}/view/${row.id}" class="btn btn-outline-info" >View</a>`;
          // const editButton = `<a href="/${prefixBaseName}/${modelBaseName}/edit/${row.id}" class="btn btn-outline-warning" >Edit</a>`;
          // const deleteButton = `<button model_id="${row.id}" model="${model}" model_title="${modelTitle}" datatable="${modelDataTable}" class="btn btn-outline-danger delete_btn" >Delete</button>`;

          let action = "";
          action += viewButton;
          action += "&nbsp;";
          // action += editButton;
          // action += '&nbsp;';
          // action += deleteButton;

          return Object.values({
            sno: parseInt(index) + 1,
            name: row.user.userDetail.name,
            service: row.businessProfessionalDetail.name,
            location: row.locationOwnerDetail.location,
            category: row.category.name,
            date: row.createdAt.toLocaleString("en-US"),
            // parentCategory: parentCategoryObj[row.id] == row.name ? 'Parent Category' : parentCategoryObj[row.id],
            // dateCreated: moment(row.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a'),
            status: statusButton[row.status],
            action,
          });
        })
      );

      const headerColumns = Object.values({
        sno: "#",
        name: "User Name",
        service: "Service Provider",
        location: "Location",
        category: "Category",
        date: "Booking Time",
        status: "Status",
        action: "Action",
      });

      return res.render(`${prefixBaseName}/${modelBaseName}/pending`, {
        headerColumns,
        data,
      });
    } catch (err) {
      return helper.error(res, err);
    }
  },

  add: async (req, res) => {
    try {
      global.currentModule = modelTitle;
      global.currentSubModule = "Add";
      global.currentSubModuleSidebar = "add";

      const parent = await module.exports.getParent();

      return res.render(`${prefixBaseName}/${modelBaseName}/addEdit`, {
        row: undefined,
        prefixBaseName,
        modelBaseName,
        parent,
      });
    } catch (err) {
      return helper.error(res, err);
    }
  },

  edit: async (req, res) => {
    try {
      global.currentModule = modelTitle;
      global.currentSubModuleSidebar = "";
      global.currentSubModule = `Edit`;

      const row = await module.exports.findOne(req.params.id);

      const parent = await module.exports.getParent(req.params.id);

      return res.render(`${prefixBaseName}/${modelBaseName}/addEdit`, {
        row,
        prefixBaseName,
        modelBaseName,
        parent,
      });
    } catch (err) {
      return helper.error(res, err);
    }
  },

  view: async (req, res) => {
    try {
      global.currentModule = modelTitle;
      global.currentSubModuleSidebar = "listing";

      global.currentSubModule = `View`;
      const row = await module.exports.findOne(req.params.id);
console.log("-------------------",row);

      // console.log(
      //   JSON.stringify(row, null, 2),
      //   "====================================>row"
      // );
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

      // const parent = await module.exports.getParent();

      return res.render(`${prefixBaseName}/${modelBaseName}/view`, {
        row,
        moment,
        prefixBaseName,
        modelBaseName,
        // parent,
      });
    } catch (err) {
      return helper.error(res, err);
    }
  },
  addUpdate: async (req, res) => {
    try {
      const required = {
        vendorId: adminData.id,
        name: req.body.name,
      };
      const nonRequired = {
        id: req.body.id,
        image: req.files && req.files.image,
        parentId: req.body.parentId,
      };

      let requestData = await helper.vaildObject(required, nonRequired);

      console.log(requestData, "====================>requestData");

      if (req.files && req.files.image) {
        requestData.image = helper.imageUpload(
          req.files.image,
          modelImageFolder
        );
      }

      if (requestData.parentId == "") requestData.parentId = null;

      console.log(requestData, "===============>requestData after");

      const rowId = await helper.save(models[model], requestData);
      const row = await module.exports.findOne(rowId);
      console.log(row, "=================================================>row");

      let message = `${modelTitle} ${
        requestData.hasOwnProperty("id") ? `Updated` : "Added"
      } Successfully.`;

      req.flash("flashMessage", { color: "success", message });

      res.redirect(`/${prefixBaseName}/${modelBaseName}/listing`);
    } catch (err) {
      err.code = 200;
      return helper.error(res, err);
    }
  },

  findOne: async (id) => {
    return await models[model].findOne({
      where: { id },
      include: [
        {
          model: models["user"],
          as: "user",
          required: true,
          include: [
            {
              model: models["userDetail"],
            },
          ],
        },
        {
          model: models["locationOwnerDetail"],
          on: {
            col1: sequelize.where(
              sequelize.col("bookings.locationOwnerId"),
              "=",
              sequelize.col("locationOwnerDetail.id")
            ),
          },
        },
        {
          model: models["businessProfessionalDetail"],
          on: {
            col1: sequelize.where(
              sequelize.col("bookings.serviceProviderId"),
              "=",
              sequelize.col("businessProfessionalDetail.id")
            ),
          },
        },
        {
          model: models["category"],
        },
      ],
      raw: true,
      nest: true
    });
  },


  

  getParent: async (id = undefined) => {
    const categories = await models[model].findAll({
      order: [["id", "DESC"]],
      // hierarchy: true,
      raw: true,
    });

    console.log(
      JSON.stringify(categories, null, 2),
      "===============>categories"
    );

    let parent = [];

    const checkChildren = (children, hierarchyArray) => {
      if (children.length == 0) return;

      children.forEach((child) => {
        if (id && child.id == id) return;

        console.log(child.name, "================>child.name");
        const newHierarchyArray = JSON.parse(JSON.stringify(hierarchyArray));
        newHierarchyArray.push(child.name);
        parent.push({
          value: child.id,
          label: newHierarchyArray.join("->"),
        });

        if (child.hasOwnProperty("children") && child.children.length > 0) {
          checkChildren(child.children, newHierarchyArray);
        }
      });
    };

    if (categories.length > 0) {
      categories.forEach((category) => {
        parent.push({
          value: category.id,
          label: category.name,
        });

        if (
          category.hasOwnProperty("children") &&
          category.children.length > 0
        ) {
          const hierarchyArray = [];
          hierarchyArray.push(category.name);
          checkChildren(category.children, hierarchyArray);
        }
      });
    }

    // console.log(JSON.stringify(parent, null, 2), "===================>data");
    // return;

    parent.unshift({
      value: null,
      label: "Choose as a Parent Category",
    });

    return parent;
  },

  categoryBasedChildCategories: async (req, res) => {
    try {
      const requestData = helper.clone(req.body);
      console.log(requestData, "=============>requestData");

      const childCategories = await models[model].findAll({
        where: {
          parentId: requestData.id,
          status: 1,
        },
        raw: true,
      });

      return helper.success(
        res,
        `Child Categories fetched successfully`,
        childCategories
      );
    } catch (err) {
      err.code = 200;
      return helper.error(res, err);
    }
  },
};

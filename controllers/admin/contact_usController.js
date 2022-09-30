const models = require("../../models");
const helper = require("../../helpers/helper");
const Paginator = require("paginator");
const sequelize = require("sequelize");
const { request } = require("express");
const { Op } = sequelize;
// const User = models.user;
// const UserDetail = models.userDetail;
// const DriverDetail = models.driverDetail;

const model = "contact_us";
const modelTitle = "Contact Us";
const modelDataTable = "";
const prefixBaseName = 'website';
const modelBaseName = 'picspop';

module.exports = {
  listing: async (req, res) => {
    try {
      global.currentModule = "Contact Us";
      // global.currentSubModule = '';
      // global.currentSubModuleSidebar = '';

      const listing = await models[model]
        .findAll({
          order: [["id", "DESC"]]
        })
        .map(data => data.toJSON());

      // return res.json(listing)
      console.log(
        JSON.stringify(listing),
        "===========================================>review listing"
      );
      //   return;

      const headerColumns = Object.values({
        sno: "#",
        name: "Name",
        email: "Email",
        message: "Message"
      });

    

      const data = listing.map((contactUs, index) => {
        console.log(JSON.stringify(contactUs));

      

        return Object.values({
          sno: parseInt(index) + 1,
          name: contactUs.name,
          email: contactUs.email,
          message: contactUs.message,
        });
      });

      return res.render("admin/contact_us/listing", { headerColumns, data });
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

        return res.render(`${prefixBaseName}/index`);
    } catch (err) {
        return helper.error(res, err);
    }
},

};

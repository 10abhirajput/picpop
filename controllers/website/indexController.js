const models = require("../../models");
const helper = require("../../helpers/helper");
const Paginator = require("paginator");
const sequelize = require("sequelize");
const { request } = require("express");
const { Op } = sequelize;
// const User = models.user;
// const UserDetail = models.userDetail;
// const DriverDetail = models.driverDetail;
const users = models.user;
const model = "contact_us";
const adminDetail = "adminDetail";
const modelTitle = "Contact Us";
const modelDataTable = "";
const prefixBaseName = 'website';
const modelBaseName = 'picspop';

module.exports = {
 
  index: async (req, res) => {
    try {
        global.currentModule = modelTitle;
        global.currentSubModule = 'Add';
        global.currentSubModuleSidebar = 'add';
        console.log("----------111111111111111111111111111111-------------------");

        //const parent = await module.exports.getParent();
        let data = await models['adminDetail'].findOne({
            where: { 
            id :1
            },
            include: [
                {
                  model: users,
                  required: false
                }
              ],
            raw:true,
            nest:true
            })
        var page_detail = await models['page'].findAll({
           raw:true
          });
        //   console.log("-----------------------------",data);
          
        return res.render(`${prefixBaseName}/index`, { admin: data , page_detail:page_detail});
    } catch (err) {
        return helper.error(res, err);
    }
},
addUpdate: async (req, res) => {
    try {
        const required = {
            name:req.body.name,
            email:req.body.email,
            message:req.body.message,
        };
        console.log("==============================",req);
        
        const nonRequired = {
            // id: req.body.id,
            
           // parentId: req.body.parentId,
        };

        let requestData = await helper.vaildObject(required, nonRequired);
        
        //console.log(req.files, '====================>requestData');


        const rowId = await helper.save(models[model], requestData);
        // const row = await module.exports.findOne(rowId);
        // console.log(row, '=================================================>row');

        // let message = `${modelTitle} ${requestData.hasOwnProperty('id') ? `Updated` : 'Added'} Successfully.`;

        // req.flash('flashMessage', { color: 'success', message });
        console.log("here----------")
         res.redirect('/index.html#contact');
        // return res.render(`${prefixBaseName}/index`);
    } catch (err) {
        err.code = 200;
        return helper.error(res, err);
    }
},
datashow: async (req, res) => {
    try {
        var page_detail = await models['page'].findOne({
            where: { 
                id :1
                },
                // raw:true,
                // nest:true
           });
           let data = await models['adminDetail'].findOne({
            where: { 
            id :1
            },
            include: [
                {
                  model: users,
                  required: false
                }
              ],
            // raw:true,
            // nest:true
            })
        // console.log("==============================",page_detail);
       
        res.send({responseJson:page_detail, adminData:data})
    } catch (err) {
        return helper.error(res, err);
    }
},
};

const model = require('../../models');
const helper = require('../../helpers/helper');
const Paginator = require("paginator");
const sequelize = require("sequelize");
const { Op } = require('sequelize');
const { request } = require('express');
const Page = model.page;

module.exports = {
    getPage: (accessor) => { 
        return async (req, res) => {
            try {
                global.currentModule = 'Page';
                global.currentSubModule = modules[moduleRoles[adminData.role]].page.link.find(pageLink => pageLink.subModule == accessor).title;
                global.currentSubModuleSidebar = modules[moduleRoles[adminData.role]].page.link.find(pageLink => pageLink.subModule == accessor).subModule;

                console.log(currentSubModuleSidebar, '========================>global.currentSubModuleSidebar');

                const page = await Page.findOne({
                    where: {
                        accessor
                    },
                    raw: true
                });
                
                return res.render(`admin/page/pageView`, { page });   
            } catch (err) {
                return helper.error(res, err);
            }
        }
    },
    updatePage: async (req, res) => {
        try {
            const required = {                
                securitykey: req.headers.securitykey,
                id: req.body.id,
                title: req.body.title,
                content: req.body.content
            };
            const nonRequired = {};
            let requestData = await helper.vaildObject(required, nonRequired);
            
            const page = await helper.save(Page, requestData, true);

            return helper.success(res, `${page.title} Updated Successfully.`, page);            
        } catch (err) {
            err.code = 200;
            return helper.error(res, err);
        }
    },

    // share: (accessor) => { 
    //     return async (req, res) => {
    //         try {
    //             return res.render(`admin/share`);   
    //         } catch (err) {
    //             return helper.error(res, err);
    //         }
    //     }
    // },
}
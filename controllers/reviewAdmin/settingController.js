const models = require('../../models');
const helper = require('../../helpers/helper');
const Paginator = require("paginator");
const sequelize = require("sequelize");
const { request } = require('express');
const { Op } = sequelize;
// const User = models.user;
// const UserDetail = models.userDetail;
// const DriverDetail = models.driverDetail;

const prefixBaseName = 'reviewAdmin';
const model = "setting";
global.modelTitle = "Setting"

module.exports = {
    setting: async (req, res) => {
        try {
            global.currentModule = 'Setting';
            global.currentSubModuleSidebar = '';
            
            const admin = req.session.admin;

            const settingData = await models[model].findAll({
                raw: true
            });

            const settings = {};
            settingData.forEach(setting => {
                settings[setting.name] = setting.value;
            });
            console.log(settings, '===============>settings');
            
            return res.render(`${prefixBaseName}/${model}/index`, { admin, settingData, settings });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    updateSettings: async (req, res) => {
        try {
            global.currentModule = 'Setting';
            global.currentSubModuleSidebar = '';
            
            const requestData = helper.clone(req.body);
            console.log(requestData, '=============>requestData');

            const { moduleName } = requestData;
            delete requestData.moduleName;
            
            const settingData = await models[model].findAll({
                raw: true
            });
            const settingsIds = {};
            settingData.forEach(setting => {
                settingsIds[setting['name']] = setting.id;
            });

            let updateArray = [];
            for(let i in requestData) {
                updateArray.push({
                    id: settingsIds[i],
                    name: i,
                    value: requestData[i]
                });
            }
            console.log(updateArray, '=============================>updateArray');

            await models[model].bulkCreate(updateArray, { updateOnDuplicate: ["value"] });
            
            return helper.success(res, `${moduleName} updated successfully`, {});
        } catch (err) {
            err.code = 200;
            return helper.error(res, err);
        }
    },
    
}
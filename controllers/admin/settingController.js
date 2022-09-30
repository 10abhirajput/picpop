const models = require('../../models');
const helper = require('../../helpers/helper');
const Paginator = require("paginator");
const sequelize = require("sequelize");
const { request } = require('express');
const siteComission = require('../../models/siteComission');
const { Op } = sequelize;
// const User = models.user;
// const UserDetail = models.userDetail;
// const DriverDetail = models.driverDetail;

const model = "setting";
global.modelTitle = "Setting"

module.exports = {
    setting: async (req, res) => {
        try {
            global.currentModule = 'Setting';
            global.currentSubModuleSidebar = '';

            const admin = req.session.admin;

            const siteComissions = await models['siteComission'].findAll({
                raw: true
            });
            // console.log(siteComissions, '=============>siteComissions');

            let siteComissionHTML = ``;

            if (siteComissions.length > 1) {
                for (i = 1; i < siteComissions.length; i++) {
                    siteComissionHTML += `
                        <div class="row single_row_container">
                            <div class="col-3 col-md-3 col-lg-3">
                                <div class="form-group">
                                    <label>&nbsp;</label>

                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <div class="input-group-text">
                                                <i class="fas fa-sort-amount-down"></i>
                                            </div>
                                        </div>
                                        <input type="number" min="0" class="form-control" name="minimum"
                                            value="${siteComissions[i]['minimum']}" required>
                                    </div>
                                </div>
                            </div>
                            <div class="col-3 col-md-3 col-lg-3">
                                <label>&nbsp;</label>
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <div class="input-group-text">
                                                <i class="fas fa-sort-amount-up"></i>
                                            </div>
                                        </div>
                                        <input type="number" min="1" class="form-control" name="maximum"
                                            value="${siteComissions[i]['maximum']}" required>
                                    </div>
                                </div>
                            </div>
                            <div class="col-3 col-md-3 col-lg-3">
                                <label>&nbsp;</label>
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <div class="input-group-text">
                                                <i class="fas fa-dollar-sign"></i>
                                            </div>
                                        </div>
                                        <input type="text" class="form-control" name="comission"
                                            value="${siteComissions[i]['comission']}" required>
                                    </div>
                                </div>
                            </div>
                            <div class="col-3 col-md-3 col-lg-3">
                                <label>&nbsp;</label>
                                <div class="form-group">
                                    <input type="hidden" class="form-control" name="id" value="${siteComissions[i]['id']}" required>
                                    <a href="javascript:void(0)" class="btn btn-icon btn-danger delete_row"><i class="fas fa-times"></i></a>
                                </div>
                            </div>
                        </div>`;
                }
            }



            const settingData = await models[model].findAll({
                raw: true
            });

            const settings = {};
            settingData.forEach(setting => {
                settings[setting.name] = setting.value;
            });
            // console.log(settings, '===============>settings');

            return res.render('admin/setting/index', { admin, settingData, settings, siteComissions, siteComissionHTML });
        } catch (err) {
            return helper.error(res, err);
        }
    },
    updateSettings: async (req, res) => {
        try {
            global.currentModule = 'Setting';
            global.currentSubModuleSidebar = '';

            const requestData = helper.clone(req.body);
            console.log('=============777777777777777777777777777777777777777777777777777777777777777777777777777777777777>requestData');

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
            for (let i in requestData) {
                updateArray.push({
                    id: settingsIds[i],
                    name: i,
                    value: requestData[i]
                });
            }
            await models[model].bulkCreate(updateArray, { updateOnDuplicate: ["value"] });
            console.log('=============777777777777777777777777777777777777777777777777777777777777777777777777777777777777>requestData');
            return helper.success(res, `${moduleName} updated successfully`, {});
        } catch (err) {
            err.code = 200;
            return helper.error(res, err);
        }
    },
    updateSiteComission: async (req, res) => {
        try {
            global.currentModule = 'Setting';
            global.currentSubModuleSidebar = '';

            const requestData = helper.clone(req.body);

            const { moduleName } = requestData;
            delete requestData.moduleName;


            // console.log(requestData, '=============>requestData');

            // if (requestData.minimum.length > 0) {
                // await models['siteComission'].destroy(
                //     {
                //         where: {},
                //         // truncate: true
                //     }
                // );
                
                const addSiteComission = [];

                // for (let i in requestData.minimum) {
                    addSiteComission.push({
                        // minimum: requestData.minimum[i],
                        // maximum: requestData.maximum[i],
                        comission: requestData.comission,
                        ...(requestData.hasOwnProperty('id') ? { id: requestData.id } : {})
                    });
                // }

                // console.log(addSiteComission, '=================>addSiteComission');
                await models['siteComission'].bulkCreate(addSiteComission, { updateOnDuplicate: ['minimum', 'maximum', 'comission'] });
            // }


            return helper.success(res, `${moduleName} updated successfully`, {});
        } catch (err) {
            err.code = 200;
            return helper.error(res, err);
        }
    },

}
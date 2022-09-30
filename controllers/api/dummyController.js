const models = require('../../models');
// const database = require('../../db/db');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const helper = require('../../helpers/helper');
const { request } = require('express');
// const constants = require('../../config/constants');

const model = 'user_exercise_records';
const modelName = 'Workout';

module.exports = {
    myWorkoutList: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
            };

            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            let modelItems = await models[model].findAll({
                where: {
                    userId: req.user.id,
                },
                // attributes: {
                //     include: [
                //         [sequelize.literal('IFNULL(IF(`categories`.`image`="", "", CONCAT("'+req.protocol+'://'+req.get('host')+'/uploads/categories/", `categories`.`image`)), "")'), 'image']
                //     ],
                // },
                order: [['id', 'DESC']],
                raw: true
            });

            return helper.success(res, `${modelName} listing fetched successfully.`, modelItems);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    workoutDetail: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                id: req.body.id,
            };

            const nonRequired = {};

            let requestData = await helper.vaildObject(required, nonRequired);

            const modelDetail = await module.exports.getOne(req, {
                id: requestData.id
            });


            return helper.success(res, `${modelName} detail fetched successfully.`, modelDetail);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    createOwnWorkout: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                programId: req.body.programId,
                exerciseId: req.body.exerciseId,
                sets: req.body.sets,
                tuts: req.body.tuts,
                // image: req.files && req.files.image,
            };

            const nonRequired = {

            };

            let requestData = await helper.vaildObject(required, nonRequired);

            if (!helper.isJson(requestData.sets)) {
                throw "Invalid JSON in params sets.";
            }
            requestData.sets = JSON.parse(requestData.sets); 
            // console.log(helper.isJson(requestData.sets), '===========>helper.isJson(requestData.sets)');
            // return;

            
            const checkProgram = await models['programs'].findOne({
                where: {
                    id: requestData.programId,
                }
            });
            if (!checkProgram) throw "Invalid programId.";

            const checkExercise = await models['exercises'].findOne({
                where: {
                    id: requestData.exerciseId,
                }
            });
            if (!checkExercise) throw "Invalid exerciseId.";

            // if (requestData.image) {
            //     requestData["image"] = helper.imageUpload(
            //         requestData.image,
            //         "programs"
            //     );
            // }

            requestData.userId = req.user.id;

            const modelId = await helper.save(models[model], requestData);

            const modelData = await models[model].findOne({
                where: {
                    id: modelId,
                },
                // attributes: {
                //     include: [
                //         [
                //             sequelize.literal(
                //                 'IFNULL(IF(`foodMenuItems`.`image`="", "", CONCAT("' +
                //                 req.protocol +
                //                 "://" +
                //                 req.get("host") +
                //                 '/uploads/foodMenuItems/", `foodMenuItems`.`image`)), "")'
                //             ),
                //             "image",
                //         ],
                //     ],
                // },
            });

            return helper.success(res, `${modelName} added successfully.`, modelData);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    editProgram: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                id: req.body.id,
                // image: req.files && req.files.image,
            };

            const nonRequired = {
                name: req.body.name,
            };

            let requestData = await helper.vaildObject(required, nonRequired);

            const checkModelItem = await models[model].findOne({
                where: {
                    id: requestData.id,
                    userId: req.user.id
                }
            });
            if (!checkModelItem) throw "Invalid id.";

            // if (requestData.image) {
            //     requestData["image"] = helper.imageUpload(
            //         requestData.image,
            //         "programs"
            //     );
            // }

            requestData.userId = req.user.id;

            const modelId = await helper.save(models[model], requestData);

            const modelData = await models[model].findOne({
                where: {
                    id: modelId,
                },
                // attributes: {
                //     include: [
                //         [
                //             sequelize.literal(
                //                 'IFNULL(IF(`foodMenuItems`.`image`="", "", CONCAT("' +
                //                 req.protocol +
                //                 "://" +
                //                 req.get("host") +
                //                 '/uploads/foodMenuItems/", `foodMenuItems`.`image`)), "")'
                //             ),
                //             "image",
                //         ],
                //     ],
                // },
            });

            return helper.success(res, `${modelName} updated successfully.`, modelData);
        } catch (err) {
            return helper.error(res, err);
        }
    },
    deleteProgram: async (req, res) => {
        try {
            const required = {
                securitykey: req.headers.securitykey,
                id: req.body.id,
                // image: req.files && req.files.image,
            };

            const nonRequired = {

            };

            let requestData = await helper.vaildObject(required, nonRequired);

            const checkModelItem = await models[model].findOne({
                where: {
                    id: requestData.id,
                    userId: req.user.id
                }
            });
            if (!checkModelItem) throw "Invalid id.";

            await helper.delete(models[model], requestData.id);

            return helper.success(res, `${modelName} deleted successfully.`, {});
        } catch (err) {
            return helper.error(res, err);
        }
    },
    getOne: async (req, where = {}) => {
        let data = await models[model].findOne({
          where: {
            ...where
          },
          include: [
            {
                model: models['programs'],
                required: true,
            },
            {
                model: models['exercises'],
                required: true,
            },
          ],
        //   raw: true,
        });
        if (!data) throw `Invalid id.`;
        
        data = data.toJSON();
        
        return data;
      },
      getAll: async (req, where = {}) => {
        let data = await models[model].findAll({
          where: {
            ...where
          },
          order: [['id', 'DESC']],
        //   raw: true,
        }).map(data => data.toJSON());
    
        return data;
      },
}
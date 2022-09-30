const db = require("../../models");
const jsonDataqq = require("../../config/jsonData");
const jsonData = require("../../config/jsonData");
var crypto = require("crypto");
const database = require("../../db/db");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const jwt = require("jsonwebtoken");
const helper = require("../../helpers/helper");
const constants = require("../../config/constants");
const userDetail = require("../../models/userDetail");
const { triggerAsyncId } = require("async_hooks");
const { ErrorEvent, userRoleModels } = require("../../config/constants");
const userController = require("./userController");
const secretKey = constants.jwtSecretKey;
const user = db.user;
const user_detail = db.userDetail;
const businessImage = db.businessImage;
const page = db.page;

const category = db.category;
const sub_category = db.userSubCategory;
const reviews = db.reviews;
const hoursOfOperation = db.hoursOfOperation;
const locationOwnerDetailImage = db.locationOwnerDetailImage;
const professional_review = db.businessProfessionalReview;
const card_payment = db.card_payment;
const user_notification = db.notification;
// const business = db.businessDetail;
const business_prof = db.businessProfessionalDetail;
const bookings = db.bookings;
const user_order = db.order;
const chatConstant = db.chatConstant;
const notification = db.notification;
const order_name = db.orderStatusName;
const bannerImages = db.banner;
const message = db.message;

const bankDetail = db.bankDetail;
const siteComission = db.siteComission;

const locationOwnerDetail = db.locationOwnerDetail;
const user_product = db.product;
const favourite = db.favourite;
const bcrypt = require("bcrypt");
const { makeImageUrlSql } = require("../../helpers/helper");
const salt = bcrypt.genSaltSync(10);
let hash = bcrypt.hashSync("s0//P4$$w0rD", salt);
hash = hash.replace("$2b$", "$2y$");
const stripe = require("stripe")("sk_test_51KPS3bD5gXwxOcThsVv01FP4t84oxvVExOd8ngvVhV4JxoxzEZ1NGmVxTICBCllzxCrjGhFkFpkRK30s04Aus56M00ruXJy3Ku");
// business_prof.hasMany(reviews)
// user.belongsTo(reviews)

// business.hasMany(reviews)
// locationOwnerDetail.hasMany(reviews, { foreignKey: 'userId', targetKey: 'businessId' })
// locationOwnerDetail.hasMany(reviews)
// reviews.hasMany(user_detail)
// business_prof.hasMany(professional_review, { foreignKey: 'userId' })
favourite.belongsTo(locationOwnerDetail, { foreignKey: "locationId" });
favourite.belongsTo(business_prof, { foreignKey: "businessId" });
favourite.hasMany(sub_category);
// user.hasMany(bookings, { foreignKey: 'userId'})
user.hasMany(user_detail);
// user.hasMany(locationOwnerDetail);
// user_detail.hasMany(locationOwnerDetailImage);
notification.belongsTo(user, {
  foreignKey: "senderId",
  sourceKey: "id"
});
    // bookings.belongsTo(models.locationOwnerDetailImage,{foreignKey: "locationOwnerId",sourceKey: "locationid" });

    // bookings.hasMany(locationOwnerDetailImage,{foreignKey:'locationOwnerId'})
    // locationOwnerDetailImage.hasMany(bookings,{foreignKey:'locationid'})
notification.belongsTo(locationOwnerDetail, {
  foreignKey: "receiverId",
  sourceKey: "id"
});
user_detail.hasMany(locationOwnerDetailImage, {
  foreignKey: "id",
  targetKey: "locationid"
});
user_detail.hasMany(businessImage, {
  foreignKey: "id",
  targetKey: "businessId"
});
// // locationOwnerDetail.hasMany(bookings, { foreignKey: 'locationOwnerId'})
// business_prof.hasMany(bookings, { foreignKey: 'serviceProviderId'})
// category.hasMany(bookings, { foreignKey: 'categoryId'})
// reviews.hasMany(bookings)
bookings.belongsTo(user, {
  foreignKey: "userId",
  sourceKey: "id"
});
bookings.belongsTo(user, {
  foreignKey: "userId",
  sourceKey: "id",
  as: "locationUser"
});
bookings.belongsTo(user, {
  foreignKey: "userId",
  sourceKey: "id",
  as: "bussinessUser"
});
user.hasMany(user_detail, { as: "locationUser" });
user.hasMany(user_detail, { as: "bussinessUser" });

bookings.belongsTo(bankDetail, {
  foreignKey: "cardId",
  sourceKey: "id"
});
bookings.belongsTo(business_prof, {
  foreignKey: "serviceProviderId",
  sourceKey: "userId"
});
bookings.belongsTo(locationOwnerDetail, {
  foreignKey: "locationOwnerId",
  sourceKey: "userId"
});
bookings.belongsTo(category, {
  foreignKey: "categoryId",
  sourceKey: "id"
});
// locationOwnerDetail.belongsTo(user, { foreignKey: "userId", sourceKey: "id" });
user.hasMany(reviews, { foreignKey: "businessId", targetKey: "id" });
// category.hasMany(locationOwnerDetail, { foreignKey: "categoryId", targetKey: "id" });
locationOwnerDetail.hasMany(reviews, {
  foreignKey: "userId",
  targetKey: "businessId"
});
locationOwnerDetail.belongsTo(user, {
  foreignKey: "userId",
  targetKey: "id"
});
business_prof.hasMany(reviews, {
  foreignKey: "userId",
  targetKey: "businessId"
});
business_prof.hasMany(businessImage, {
  foreignKey: "businessId"
});
locationOwnerDetail.hasMany(locationOwnerDetailImage, {
  foreignKey: "locationid"
});
// locationOwnerDetailImage.belongsTo(locationOwnerDetail, {
//   foreignKey: "locationid",
//   sourceKey: "id"
// });
// locationOwnerDetail.hasMany(reviews, {
//   foreignKey: "businessId",
//   // targetKey: "userId"
// });
const userRole = {
  1: user_detail,
  2: locationOwnerDetail,
  3: business_prof
};
module.exports = {
  ////////////////////////FILE UPLOAD////////////////////////////////////
  file_upload: async function(req, res) {
    // console.log("req.files ========== 2@@@@@@@@@@@@@@2 ",req.files)
    let PAYLOAD = req.body;
    var FILE_TYPE = PAYLOAD.type; // image,video,etc
    var FOLDER = PAYLOAD.folder; // user,category,products,etc4
    try {
      var image_data = [];
      if (req.files && req.files.image && Array.isArray(req.files.image)) {
        // console.log("FOLDER---------------------------")
        for (var imgkey in req.files.image) {
          var image_url = await helper.fileUploadApi(
            req.files.image[imgkey],
            FOLDER,
            FILE_TYPE
          );
          image_data.push(image_url);
        }
        let msg = "Successufully";
        return jsonData.true_status(res, image_data, msg);
      } else if (req.files.image.name != "") {
        console.log("image-----------------------");

        var image_url = await helper.fileUploadApi(
          req.files.image,
          FOLDER,
          FILE_TYPE
        );
        image_data.push(image_url);
        let msg = "Successufully";
        return jsonData.true_status(res, image_data, msg);
      } else {
        let msg = "Successufully";
        image_data = [];
        return jsonData.true_status(res, image_data, msg);
      }
    } catch (err) {
      //return res.status(400).json({ status: 0, msg: "Something went wrong" });
      let msg = "Something went wrong";
      return jsonData.wrong_status(res, msg);
    }
  },
  user_signup: async function(req, res) {
    try {
      const required = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        role: req.body.roolType,
        phone: req.body.phone,
        location: req.body.location,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        country_code: req.body.country_code
      };
      const non_required = {
        device_token: req.body.device_token,
        device_type: req.body.device_type,
        image: req.body.image,
        socialId: req.body.socialId,
        socialType: req.body.socialType, // 1 => facebook, 2 => google
        password: req.body.password,
        gender: req.body.gender //1= male, 2=female,3=other,4=prefer not to awnser
      };
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      let check_email_pass = await user.count({
        where: {
          email: req.body.email
        }
      });
      // console.log(check_email_pass,'jnj=====');return false;
      if (check_email_pass > 0) {
        let msg = "Email already exists";
        res.status(400).json({
          success: 0,
          code: 400,
          msg: msg,
          body: []
        });
        return false;
      }
      let check_phone_pass = await user.count({
        where: {
          phone: req.body.phone
        }
      });
      // console.log(check_email_pass,'jnj=====');return false;
      if (check_phone_pass > 0) {
        let msg = "Phone already exist";
        res.status(400).json({
          success: 0,
          code: 400,
          msg: msg,
          body: []
        });
        return false;
      }
      var randomNumber = Math.floor(1000 + Math.random() * 9000);
//       console.log("=======================",requestdata.country_code+requestdata.phone);
      
// return
      // await helper.twilioResponse("Your otp is "+randomNumber, requestdata.country_code+requestdata.phone);

      var auth_create = crypto.randomBytes(20).toString("hex");
      let hashdata = bcrypt.hashSync(req.body.password, salt);
      hash = hashdata.replace("$2b$", "$2y$");
      let create_user = await user.create({
        email: req.body.email,
        role: requestdata.role,
        password: hash,
        username: requestdata.firstName + " " + requestdata.lastName,
        firstName: requestdata.firstName,
        lastName: requestdata.lastName,
        location: req.body.location,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        phone: requestdata.phone,
        country_code: req.body.country_code,
        deviceToken: requestdata.device_token,
        deviceType: req.body.device_type,
        image: req.body.image,
        socialId: req.body.socialId,
        socialType: req.body.socialType,
        otp: randomNumber
      });

      let user_details = await user.findOne({
        attributes: [
          `id`,
          `role`,
          `verified`,
          `status`,
          `firstName`,
          `lastName`,
          `username`,
          `email`,
          `password`,
          `phone`,
          `otp`,
          `country_code`,
          `image`,
          `socialId`,
          `socialType`,
          `deviceType`,
          `deviceToken`,
          `createdAt`,
          `updatedAt`
        ],

        // attributes:['*',helper.makeImageUrlSql('user','image')],

        where: {
          id: create_user.id
        },
        raw: true
      });

      // let html = 'here is your otp ' + (randomNumber);

      let logo = "http://" + req.get("host") + "/uploads/logo.png";
      // console.log(logo, '===================================here'); return

      let html = `<body class="body" style="padding:0 !important; margin:0 auto !important; display:block !important; min-width:100% !important; width:100% !important; background:#f4ecfa; -webkit-text-size-adjust:none;">
      <center>
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0; padding: 0; width: 100%; height: 100%;" bgcolor="#f4ecfa" class="gwfw">
          <tr>
            <td style="margin: 0; padding: 0; width: 100%; height: 100%;" align="center" valign="top">
              <table width="600" border="0" cellspacing="0" cellpadding="0" class="m-shell">
                <tr>
                  <td class="td" style="width:600px; min-width:600px; font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td class="mpx-10">
                          <!-- Top -->
                          <table width="100%" border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                <td class="text-12 c-grey l-grey a-right py-20" style="font-size:12px; line-height:16px; font-family:'PT Sans', Arial, sans-serif; min-width:auto !important; color:#6e6e6e; text-align:right; padding-top: 20px; padding-bottom: 20px;">
                                  <a href="#" target="_blank" class="link c-grey" style="text-decoration:none; color:#6e6e6e;"><span class="link c-grey" style="text-decoration:none; color:#6e6e6e;">View this email in your browser</span></a>
                                </td>
                              </tr>
                            </table>											<!-- END Top -->
                          
                          <!-- Container -->
                          <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <td class="gradient pt-10" style="border-radius: 10px 10px 0 0; padding-top: 10px;" bgcolor="#26c5f8">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                  <tr>
                                    <td style="border-radius: 10px 10px 0 0;" bgcolor="#ffffff">
                                      <!-- Logo -->
                                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                          <td class="img-center p-30 px-15" style="font-size:0pt; line-height:0pt; text-align:center; padding: 30px; padding-left: 15px; padding-right: 15px;">
                                            <a href="#" target="_blank"><img src="${logo}" width="230"  border="0" alt="" /></a>
                                          </td>
                                        </tr>
                                      </table>
                                      <!-- Logo -->
                          
                                      <!-- Main -->
                                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                          <td class="px-50 mpx-15" style="padding-left: 50px; padding-right: 50px;">
                                            <!-- Section - Intro -->
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                              <tr>
                                                <td class="pb-50" style="padding-bottom: 50px;">
                                                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                    
                                                    <tr>
                                                      <td class="title-36 a-center pb-15" style="font-size:36px; line-height:40px; color:#282828; font-family:'PT Sans', Arial, sans-serif; min-width:auto !important; text-align:center; padding-bottom: 15px;">
                                                        <strong>Activate with Code</strong>
                                                      </td>
                                                    </tr>
                                                    
                                                    <tr>
                                                      <td class="pb-30" style="padding-bottom: 30px;">
                                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                          <tr>
                                                            <td class="title-22 a-center py-20 px-50 mpx-15" style="border-radius: 10px; border: 1px dashed #b4b4d4; font-size:22px; line-height:26px; color:#282828; font-family:'PT Sans', Arial, sans-serif; min-width:auto !important; text-align:center; padding-top: 20px; padding-bottom: 20px; padding-left: 50px; padding-right: 50px;" bgcolor="#f4ecfa">
                                                              <strong>USE CODE : <span class="c-purple" style="color:#9128df;">
                                                              ${randomNumber}</span></strong>
                                                            </td>
                                                          </tr>
                                                        </table>
                                                      </td>
                                                    </tr>
                                                    
                                                  </table>
                                                </td>
                                              </tr>
                                            </table>
                                            <!-- END Section - Intro -->
                                          </td>
                                        </tr>
                                      </table>
                                      <!-- END Main -->
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                          <!-- END Container -->
                          
                          <!-- Footer -->
                          <table width="100%" border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                <td class="p-50 mpx-15" bgcolor="#26c5f8" style="border-radius: 0 0 10px 10px; padding: 50px;">
                                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                      <td align="center" class="pb-20" style="padding-bottom: 20px;">
                                        <!-- Socials -->
                                        <table border="0" cellspacing="0" cellpadding="0">
                                          <tr>
                                            <td class="img" width="34" style="font-size:0pt; line-height:0pt; text-align:left;">
                                              <a href="#" target="_blank"><img src=" f.png" width="34" height="34" border="0" alt="" /></a>
                                            </td>
                                            <td class="img" width="15" style="font-size:0pt; line-height:0pt; text-align:left;"></td>
                                            <td class="img" width="34" style="font-size:0pt; line-height:0pt; text-align:left;">
                                              <a href="#" target="_blank"><img src="g.png" width="34" height="34" border="0" alt="" /></a>
                                            </td>
                                            <td class="img" width="15" style="font-size:0pt; line-height:0pt; text-align:left;"></td>
                                            <td class="img" width="34" style="font-size:0pt; line-height:0pt; text-align:left;">
                                              <a href="#" target="_blank"><img src="t.png" width="34" height="34" border="0" alt="" /></a>
                                            </td>
                                            <td class="img" width="15" style="font-size:0pt; line-height:0pt; text-align:left;"></td>
                                            <td class="img" width="34" style="font-size:0pt; line-height:0pt; text-align:left;">
                                              <a href="#" target="_blank"><img src="p.png" width="34" height="34" border="0" alt="" /></a>
                                            </td>
                                          </tr>
                                        </table>
                                        <!-- END Socials -->
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="text-14 lh-24 a-center c-white l-white pb-20" style="font-size:14px; font-family:'PT Sans', Arial, sans-serif; min-width:auto !important; line-height: 24px; text-align:center; color:#ffffff; padding-bottom: 20px;">
                                        Address name St. 12, City Name, State, Country Name
                                        <br />
                                        <a href="tel:+17384796719" target="_blank" class="link c-white" style="text-decoration:none; color:#ffffff;"><span class="link c-white" style="text-decoration:none; color:#ffffff;">(738) 479-6719</span></a> - <a href="tel:+13697181973" target="_blank" class="link c-white" style="text-decoration:none; color:#ffffff;"><span class="link c-white" style="text-decoration:none; color:#ffffff;">(369) 718-1973</span></a>
                                        <br />
                                        <a href="mailto:info@website.com" target="_blank" class="link c-white" style="text-decoration:none; color:#ffffff;"><span class="link c-white" style="text-decoration:none; color:#ffffff;">info@website.com</span></a> - <a href="www.website.com" target="_blank" class="link c-white" style="text-decoration:none; color:#ffffff;"><span class="link c-white" style="text-decoration:none; color:#ffffff;">www.website.com</span></a>
                                      </td>
                                    </tr>
                                    
                                  </table>
                                </td>
                              </tr>
                            </table>											<!-- END Footer -->
                          
                          <!-- Bottom -->
                          <table width="100%" border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                <td class="text-12 lh-22 a-center c-grey- l-grey py-20" style="font-size:12px; color:#6e6e6e; font-family:'PT Sans', Arial, sans-serif; min-width:auto !important; line-height: 22px; text-align:center; padding-top: 20px; padding-bottom: 20px;">
                                  <a href="#" target="_blank" class="link c-grey" style="text-decoration:none; color:#6e6e6e;"><span class="link c-grey" style="white-space: nowrap; text-decoration:none; color:#6e6e6e;">UNSUBSCRIBE</span></a> &nbsp;|&nbsp; <a href="#" target="_blank" class="link c-grey" style="text-decoration:none; color:#6e6e6e;"><span class="link c-grey" style="white-space: nowrap; text-decoration:none; color:#6e6e6e;">WEB VERSION</span></a> &nbsp;|&nbsp; <a href="#" target="_blank" class="link c-grey" style="text-decoration:none; color:#6e6e6e;"><span class="link c-grey" style="white-space: nowrap; text-decoration:none; color:#6e6e6e;">SEND TO A FRIEND</span></a>
                                </td>
                              </tr>
                            </table>											<!-- END Bottom -->
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </center>
    </body>`;
      let emailData = {
        to: req.body.email,
        subject: `${appName} OTP`,
        html: html
      };
      await helper.sendEmail(emailData);

      var create_user_detail = await user_detail.create({
        userId: create_user.id,
        name: req.body.firstName,
        lastName: req.body.lastName,
        location: req.body.location,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        image: req.body.image
      });

      user_details.Details = create_user_detail;

      let userData = {
        id: user_details.id,
        email: user_details.email
      };
      let token = jwt.sign(
        {
          data: userData
        },
        secretKey
      );
      user_details.token = token;

      let msg = "Signup successfully";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: user_details
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },
  user_login: async function(req, res) {
    try {
      const required = {
        email: req.body.email,
        password: req.body.password,
        role: req.body.roolType
      };
      // console.log("drdddddddddddddddddddddddddddddddddddddddd",req.body.roolType);

      const non_required = {
        security_key: req.headers.security_key,
        device_token: req.body.device_token,
        device_type: req.body.device_type
      };
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      const userRoleModels = {
        0: "adminDetail",
        1: "userDetail",
        2: "locationOwnerDetail",
        3: "businessProfessionalDetail"
      };
      let hashdata = bcrypt.hashSync(req.body.password, salt);
      hash = hashdata.replace("$2b$", "$2y$");

      let user_login = await user.findOne({
        where: {
          email: req.body.email,
          role: requestdata.role
          //password: hash,
        },
        raw: true
      });

      //console.log(user_login.id,'user_login=======');return
      //console.log(user_login,'kk===========');return
      if (user_login) {
        checkPassword = await helper.comparePass(
          requestdata.password,
          user_login.password
        );
        if (!checkPassword) {
          throw "Email or Password did not match, Please try again.";
        }
        let update_token = await user.update(
          {
            deviceToken: req.body.device_token,
            deviceType: req.body.device_type
          },
          {
            where: {
              email: req.body.email
            }
          }
        );
        let getUsers = await user.findOne({
          attributes: [
            `id`,
            `role`,
            `verified`,
            `notification`,
            `status`,
            `firstName`,
            `lastName`,
            `username`,
            `email`,
            `password`,
            `phone`,
            `otp`,
            `country_code`,
            `image`,
            `socialId`,
            `socialType`,
            `deviceType`,
            `deviceToken`,
            `createdAt`,
            `updatedAt`
          ],
          where: {
            id: user_login.id
          },
          include: [
            {
              attributes: [
                `id`,
                `userId`,
                `name`,
                `image`,
                `location`,
                `latitude`,
                `longitude`,
                `created`,
                `updated`,
                `createdAt`,
                `updatedAt`,
                `lastName`,
                `state`
              ],
              model: user_detail
            }
          ]
        });

        if (getUsers) getUsers = getUsers.toJSON();

        let userData = {
          id: getUsers.id,
          email: getUsers.email
        };

        let token = jwt.sign(
          {
            data: userData
          },
          secretKey
        );

        //   console.log(token, '==========>token')
        //  return;
        getUsers.token = token;

        let msg = "Login successfully";
        res.status(200).json({
          success: 1,
          code: 200,
          msg: msg,
          body: getUsers
        });
      } else {
        let msg = "Invalid login details";
        res.status(400).json({
          success: 0,
          code: 400,
          msg: msg,
          body: []
        });
        return false;
      }
    } catch (error) {
      return helper.error(res, error);
      // throw error;
    }
  },
  user_privacy: async function(req, res) {
    try {
      const required = {};
      const non_required = {};
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      let get_privacy = await page.findAll({
        attributes: ["id", "title", "content"],
        where: {
          id: 3
        },
        raw: true
      });
      let msg = "Privacy policy";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: get_privacy
      });
    } catch (error) {
      throw error;
    }
  },
  user_term: async function(req, res) {
    try {
      const required = {};
      const non_required = {};
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      let get_term = await page.findAll({
        attributes: ["id", "title", "content"],
        where: {
          id: 2
        },
        raw: true
      });
      let msg = "Terms and Conditions";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: get_term
      });
    } catch (error) {
      throw error;
    }
  },
  user_about_us: async function(req, res) {
    try {
      const required = {};
      const non_required = {};
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      let get_about_us = await page.findAll({
        attributes: ["id", "title", "content"],
        where: {
          id: 1
        },
        raw: true
      });
      let msg = "About us";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: get_about_us
      });
    } catch (error) {
      throw error;
    }
  },
  social_login: async function(req, res) {
    try {
      const required = {
        socialId: req.body.socialId,
        socialType: req.body.socialType // 1 => facebook, 2 => google
      };
      const non_required = {
        email: req.body.email,
        device_token: req.body.device_token,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        role: req.body.role,
        device_type: req.body.device_type,
        country_code: req.body.country_code,
        phone: req.body.phone
      };
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      var get_social = await user.findOne({
        attributes: ["id", "socialId"],
        where: {
          socialId: req.body.socialId,
          socialType: req.body.socialType // 1 => google 2 => fb 3=> twitter
        },
        raw: true
      });
      //console.log(get_social,'get========');return
      if (get_social) {
        var update_detail = await user.update(
          {
            email: req.body.email,
            role: requestdata.role,
            username: requestdata.firstName + " " + requestdata.lastName,
            firstName: requestdata.firstName,
            lastName: requestdata.lastName,
            phone: requestdata.phone,
            country_code: req.body.country_code,
            deviceToken: requestdata.device_token,
            deviceType: req.body.device_type,
            image: req.body.image,
            socialId: req.body.socialId,
            socialType: req.body.socialType
          },
          {
            where: {
              socialId: req.body.socialId,
              socialType: req.body.socialType //1 => google 2 => fb 3=> twitter
            },
            raw: true
          }
        );

        // console.log("------------------------------------------------",get_social);

        var edit_profiles = await user_detail.update(
          {
            name: req.body.firstName,
            lastName: req.body.lastName,
            image: req.body.image
          },
          {
            where: {
              userId: get_social.id
            }
          }
        );
        var get_socials = await user.findOne({
          where: {
            socialId: req.body.socialId,
            socialType: req.body.socialType // 1 => google 2 => fb 3=> twitter
          }

          //raw: true
        });

        // console.log(update_detail, 'asdhfhasd'); return
      } else {
        console.log("els");

        // let check_email = await user.count({
        //   where: {
        //     email: req.body.email
        //   }
        // });

        // if (check_email > 0) {
        //   let msg = "email already exist";
        //   res.status(400).json({
        //     success: 0,
        //     code: 400,
        //     msg: msg,
        //     body: []
        //   });
        //   return false;
        // }
        var update_detail = await user.create({
          email: req.body.email,
          role: requestdata.role,
          username: requestdata.firstName + " " + requestdata.lastName,
          firstName: requestdata.firstName,
          lastName: requestdata.lastName,
          phone: requestdata.phone,
          country_code: req.body.country_code,
          deviceToken: requestdata.device_token,
          deviceType: req.body.device_type,
          image: req.body.image,
          socialId: req.body.socialId,
          socialType: req.body.socialType
        });
        console.log("user");

        var create_user_detail = await user_detail.create({
          userId: update_detail.id,
          name: req.body.firstName,
          lastName: req.body.lastName,
          image: req.body.image
        });
        console.log("user_detale");

        // console.log(update_detail);
        // return;

        var get_socials = await user.findOne({
          where: {
            id: update_detail.dataValues.id
          }
          // raw: true
        });
      }

      console.log("djdjdjdjdjdj");

      get_socials.Details = create_user_detail;

      let userData = {
        id: get_socials.id,
        email: get_socials.email
      };
      let token = jwt.sign(
        {
          data: userData
        },
        secretKey
      );

      get_socials.dataValues.token = token;
      // console.log("22222222222222222222222222222222222222",get_socials);
      // console.log("22222222222222222222222222222222222222",token);

      return helper.success(res, "login successfull", get_socials);
    } catch (error) {
      throw error;
    }
  },
  // social_login: async function(req, res) {
  //   try {
  //     const required = {
  //       // security_key: req.headers.security_key,
  //       role: req.body.role,
  //       socialId: req.body.socialId,
  //       socialType: req.body.socialType // 1 => facebook, 2 => google
  //     };
  //     const non_required = {
  //       device_token: req.body.device_token,
  //       device_type: req.body.device_type,
  //       name: req.body.name
  //     };
  //     let requestdata = await helper.vaildObjectUser(
  //       required,
  //       non_required,
  //       res
  //     );

  //     let get_social = await user.findOne({
  //       // attributes: ['socialId'],
  //       where: {
  //         socialId: req.body.socialId,
  //         socialType: req.body.socialType, // 1 => facebook, 2 => google
  //         role: req.body.role
  //       },

  //       raw: true
  //     });
  //     //console.log(get_social,'get========');return
  //     if (get_social) {
  //       let update_detail = await user.update(
  //         {
  //           deviceToken: req.body.device_token,
  //           deviceType: req.body.device_type,
  //           checked: 1,
  //           username: requestdata.name
  //         },
  //         {
  //           where: {
  //             socialId: req.body.socialId,
  //             socialType: req.body.socialType, // 1 => facebook, 2 => google
  //             role: req.body.role
  //           }
  //         }
  //       );
  //       let find_detail = await user
  //         .findOne({
  //           where: {
  //             socialId: req.body.socialId,
  //             socialType: req.body.socialType,
  //             role: req.body.role // 1 => facebook, 2 => google
  //           },
  //           include: [
  //             {
  //               model: db[userRoleModels[get_social.role]]
  //             }
  //           ]
  //         })
  //         .then(userData => {
  //           if (!userData) return userData;
  //           userData = userData.toJSON();

  //           for (let i in userRoleModels) {
  //             if (
  //               userData.hasOwnProperty(userRoleModels[i]) &&
  //               !userData[userRoleModels[i]]
  //             ) {
  //               userData[userRoleModels[i]] = {};
  //             }
  //           }

  //           return userData;
  //         });
  //       // console.log(find_detail, '==========================>find_detail');
  //       // return;
  //       // if (find_detail) find_detail = find_detail.toJSON();

  //       let userData = {
  //         id: find_detail.id,
  //         email: find_detail.email
  //       };

  //       let token = jwt.sign(
  //         {
  //           data: userData
  //         },
  //         secretKey
  //       );

  //       // console.log(find_detail)

  //       find_detail.token = token;
  //       let msg = "already login";
  //       res.status(200).json({
  //         success: 1,
  //         code: 200,
  //         msg: msg,
  //         body: find_detail
  //       });
  //       // console.log(update_detail, 'asdhfhasd'); return
  //     } else {
  //       let msg = "id not exists";
  //       res.status(400).json({
  //         success: 0,
  //         code: 400,
  //         msg: msg,
  //         body: {}
  //       });
  //       return false;
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // },

  change_password: async (req, res) => {
    try {
      const required = {
        // securitykey: req.headers.securitykey,
        password: req.body.password,
        new_password: req.body.new_password
      };
      // console.log(
      //   "-------------------------------------------------",
      //   req.body.password,
      //   req.body.new_password
      // );
      const nonRequired = {
        // imageFolders: {
        //   image: "users"
        // }
      };
      // console.log(req.user.password);

      let requestData = await helper.vaildObject(required, nonRequired);

      checkPassword = await helper.comparePass(
        requestData.password,
        req.user.password
      );
      if (!checkPassword) {
        throw "old password did not match.";
      }

      requestData.hashPassword = helper.bcryptHash(requestData.new_password);
      requestData.id = req.user.id;

      // console.log(requestData.hashPassword);

      let update_new = await user.update(
        {
          password: requestData.hashPassword
        },
        {
          where: {
            id: req.user.id
          }
        }
      );
      // let user = await helper.save(models["user"], requestData, true, req);

      return helper.success(res, "User password changed successfully.", {});
    } catch (err) {
      return helper.error(res, err);
    }
  },
  // change_password: async function (req, res) {
  //   try {
  //     const required = {
  //       password: req.body.password,
  //       new_password: req.body.new_password,
  //     };
  //     const non_required = {
  //       security_key: req.headers.security_key,
  //     };
  //     let requestdata = await helper.vaildObjectUser(required, non_required, res);
  //     //   const confirm_password = crypto.createHash('sha1').update(req.body.password).digest('hex');
  //     let find_old_password = await user.findOne({
  //       attributes: ['id', 'username', 'email', helper.makeImageUrlSql('user', 'image', 'user')],
  //       where: {
  //         id: req.user.id,
  //       },
  //       raw: true
  //     })
  //     dbPass = req.user.password.replace('$2y$', '$2b$');
  //     const match = await bcrypt.compare(req.body.password, dbPass);
  //     //  console.log(match,'match=======');return
  //     if (match == true) {
  //       let hashdata = bcrypt.hashSync(req.body.new_password, salt);
  //       hash = hashdata.replace('$2b$', '$2y$');

  //       // console.log(hash,"hash====");return
  //       let update_new = await user.update({
  //         password: hash,
  //       }, {
  //         where: {
  //           id: req.user.id,
  //         }
  //       })
  //       let msg = 'password update successfull';
  //       res.status(200).json({
  //         'success': 1,
  //         'code': 200,
  //         'msg': msg,
  //         'body': find_old_password,
  //       });
  //     } else {
  //       let msg = 'Old password not matched';
  //       res.status(400).json({
  //         'success': 0,
  //         'code': 400,
  //         'msg': msg,
  //         'body': {},
  //       });
  //       return false;
  //     }

  //   } catch (error) {
  //     throw error;
  //   }
  // },
  forgot_password: async (req, res) => {
    try {
      const required = {
        email: req.body.email
      };

      const non_required = {
        roolType: req.body.roolType,
        security_key: req.headers.security_key
      };

      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );

      let existingUser = await user.findOne({
        where: {
          email: requestdata.email,
          role: requestdata.roolType
        },
        raw: true
      });
      if (!existingUser) throw "Email does not exist.";

      existingUser.forgotPasswordHash = helper.createSHA1();

      let html = `Click here to change your password <a href="${
        req.protocol
      }://${req.get("host")}/api/forgot_url/${
        existingUser.forgotPasswordHash
      }"> Click</a>`;

      let emailData = {
        to: requestdata.email,
        subject: `${appName} Forgot Password`,
        html: html
      };

      await helper.sendEmail(emailData);

      const user_email = await helper.save(user, existingUser, true);

      return helper.success(
        res,
        "Forgot Password email sent successfully.",
        {}
      );
    } catch (err) {
      return helper.error(res, err);
    }
  },
  forgotUrl: async (req, res) => {
    try {
      let user_detail = await user.findOne({
        where: {
          forgotPasswordHash: req.params.hash
        }
      });

      if (user_detail) {
        res.render("admin/reset_password", {
          title: appName,
          response: user_detail,
          //   message: req.flash('message'),
          hash: req.params.hash
        });
      } else {
        const html = `
            <br/>
            <br/>
            <br/>
            <div style="font-size: 50px;" >
                <b><center>Link has been expired!</center><p>
            </div>
          `;
        res.status(403).send(html);
      }
    } catch (err) {
      throw err;
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { password, forgotPasswordHash } = { ...req.body };

      const forgot_user = await user.findOne({
        where: {
          forgotPasswordHash
        },
        raw: true
      });
      if (!forgot_user) throw "Something went wrong.";

      const updateObj = {};
      updateObj.password = await helper.bcryptHash(password);
      updateObj.forgotPasswordHash = "";
      updateObj.id = forgot_user.id;

      const updatedUser = await helper.save(user, updateObj);

      if (updatedUser) {
        return helper.success(res, "Password updated successfully.", {});
        // res.render("admin/success_page", {
        //     title: appName,
        //     message: "Password Change successfull"
        // });
      } else {
        throw "Invalid User.";
      }
    } catch (err) {
      return helper.error(res, err);
      // if (typeof err  === 'string') {
      //     res.render("admin/success_page", {
      //         message: err
      //     });
      // } else {
      //     console.log(err);
      // }
    }
  },
  get_category_list: async function(req, res) {
    try {
      const required = {};
      const non_required = {
        security_key: req.headers.security_key
      };
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      let get_categories = await category.findAll({
        attributes:[`id`, `status`, `name`, `image`, `createdAt`, `updatedAt`,
        [sequelize.literal('(SELECT case when count(id)=0 then 0 else 1 end as countss FROM `businessProfessionalDetail` WHERE `categoryId`= category.id)'), 'is_category']],
        where: {
          status: 1
        },
        order: [['id', 'DESC']]
      });
      let msg = "Get category list";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: get_categories
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },

  category_details: async function(req, res) {
    try {
      const required = {
        categoryId: req.body.categoryId
      };
      const non_required = {};
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      var find_busines_category = await category.findOne({
        //   attributes: {
        //     include: [
        //       [sequelize.literal('(SELECT count(id) FROM reviews WHERE reviews.businessId = `businessProfessionalDetails`.`id` )'), 'Count'],

        //       [sequelize.literal('ifnull((truncate((SELECT AVG(rating) FROM reviews WHERE reviews.businessId = `businessProfessionalDetails`.`id`), 1) ), "0.0")'), 'avgRating']
        //     ],
        // },
        where: {
          id: requestdata.categoryId
        },
        include: [
          {
            attributes: [
              `id`,
              `userId`,
              `categoryId`,
              `businessName`,
              `businessPhone`,
              `businessEmail`,
              `countryCode`,
              `adress`,
              `location`,
              `latitude`,
              `longitude`,
              `about`,
              `pricePerService`,
              `offerPrice`,
              `offers`,

              [
                sequelize.literal(
                  "(SELECT count(id) FROM reviews WHERE reviews.businessId = `businessProfessionalDetails`.`id` )"
                ),
                "Count"
              ],

              [
                sequelize.literal(
                  "ifnull((truncate((SELECT AVG(rating) FROM reviews WHERE reviews.businessId = `businessProfessionalDetails`.`id`), 1) ), '0.0')"
                ),
                "avgRating"
              ]
            ],
            model: business_prof,
            required: false,
            include: [
              {
                model: businessImage,
                required: false
              }
            ]
          }
        ]
        // raw:true
      });
      let msg = "Category detail";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: find_busines_category
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },

  home_categories: async function(req, res) {
    try {
      const required = {};
      const non_required = {
        security_key: req.headers.security_key
      };
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      let get_categories = await category.findAll({
        attributes: {
          include: [helper.makeImageUrlSql("category", "image", "category")],
          exclude: [
            "parentId",
            "createdAt",
            "updatedAt",
            "hierarchyLevel",
            "created",
            "updated",
            "status"
          ]
        },
        where: {
          parentId: null
        },
        limit: 6
      });
      let msg = "Home categories";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: get_categories
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },
  all_categories: async function(req, res) {
    try {
      const required = {};
      const non_required = {
        security_key: req.headers.security_key
      };
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      let get_categories = await category.findAll({
        attributes: {
          include: [helper.makeImageUrlSql("category", "image", "category")],
          exclude: [
            "parentId",
            "createdAt",
            "updatedAt",
            "hierarchyLevel",
            "created",
            "updated",
            "status"
          ]
        },
        where: {
          parentId: null
        },
        raw: true
      });
      //console.log(get_categories,"get_categories");return
      for (var i in get_categories) {
        let get_subcategory = await category.findAll({
          attributes: ["id", "name"],
          where: {
            parentId: get_categories[i].id
          },
          raw: true
        });
        get_categories[i].subcategory = get_subcategory;
      }
      let msg = "Home categories";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: get_categories
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },
  homeapi: async function(req, res) {
    try {
      var url_get = "http://" + req.host + ":7800/uploads/user/";

      const required = {};
      const non_required = {
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        id: req.body.id,
        range: req.body.range || 10
      };
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );

      // console.log(req.user, '============>req.user check 123 testing testing');
      // return;

      const loggedInUser =
        req.hasOwnProperty("user") &&
        typeof req.user == "object" &&
        Object.keys(req.user).length > 0
          ? req.user
          : false;
      const bannerImage = await bannerImages.findAll({
        where: {
          status: 1
        }
      });
      const categoryDetale = await category.findAll({
        where: {
          status: 1
        },
        order:[
          ['id', 'DESC']
        ]
      });
      const locations = await user
        .findAll({
          where: {
            role: 2
            // id:req.user.id
          },
          // attributes: [
          //   ...(requestdata.latitude && requestdata.longitude
          //     ? [
          //         [
          //           sequelize.literal(
          //             `round(
          //                   ( 3959 * acos( least(1.0,
          //                     cos( radians(${requestdata.latitude}) )
          //                     * cos( radians(\`businessDetail\`.\`latitude\`) )
          //                     * cos( radians(\`businessDetail\`.\`longitude\`) - radians(${requestdata.longitude}) )
          //                     + sin( radians(${requestdata.latitude}) )
          //                     * sin( radians(\`businessDetail\`.\`latitude\`)
          //                   ) ) )
          //                 ), 1)`
          //           ),
          //           "distance"
          //         ]
          //       ]
          //     : [[sequelize.literal(`0`), "distance"]])
          // ],
          include: [
            {
              attributes: [
                `id`,
                `userId`,
                `name`,
                `adress`,
                `image`,
                `location`,
                ['adress', 'locationName'],
                `isFav`,
                `latitude`,
                `longitude`,
                `hourOfOpration`,
                `PricePerDay`,
                `offrerPricePerDay`,
                `offers`,
                `about`,
                `loc_country_code`, `loc_phone`, `loc_email`,
                `createdAt`,
                `updatedAt`
                // [sequelize.literal('(SELECT COUNT(id) FROM reviews WHERE businessId = locationOwnerDetail.userId )'), 'ratingCount'],
                // [sequelize.literal('ifnull((SELECT AVG(rating) FROM reviews WHERE businessId = locationOwnerDetail.userId ), "0.0")'), 'avgRating'],
              ],
              model: locationOwnerDetail
              // where: {
              //   role: 2,
              // },
              // attributes: [],
            }
            // {
            //   attributes: ['id', 'review', 'rating', 'userId', 'created', 'updated', [sequelize.literal('(SELECT CONCAT(name," ",lastName) FROM userDetail WHERE reviews.userId = userDetail.userId )'), 'ratingGivenBy'], /* [sequelize.literal('(SELECT image FROM user WHERE reviews.userId = user.id )'), 'image'] */
            //     // [sequelize.literal('(SELECT case when `user`.`image`="" then "" else concat("' + url_get + '",`user`.`image`) end FROM user WHERE id = reviews.userId )'), 'senderImage']
            //   ],
            //   model: reviews,
            // },
            // {
            //   attributes: [`id`, `businessId`, `createdAt`, `updatedAt`, makeImageUrlSql('locationOwnerDetailImage', 'image', 'locationOwnerDetail')],
            //   model: locationOwnerDetailImage
            // }
          ]
        })
        .map(data => {
          data = data.toJSON();
          if (data.locationOwnerDetail == null) {
            data.locationOwnerDetail = {};
          }
          return data;
        });

      // const businessProfessionals = await user.findAll({
      //   where: {
      //     role: 3,
      //     ...(
      //       loggedInUser
      //         ? {
      //           id: {
      //             // = 3
      //             [Op.ne]: loggedInUser.id,
      //           },
      //         } : {}
      //     )
      //   },
      //   // attributes: [
      //   //   ...(requestdata.latitude && requestdata.longitude ? [
      //   //     [
      //   //       sequelize.literal(
      //   //         `round(
      //   //                   ( 3959 * acos( least(1.0,
      //   //                     cos( radians(${requestdata.latitude}) )
      //   //                     * cos( radians(\`businessProfessionalDetail\`.\`latitude\`) )
      //   //                     * cos( radians(\`businessProfessionalDetail\`.\`longitude\`) - radians(${requestdata.longitude}) )
      //   //                     + sin( radians(${requestdata.latitude}) )
      //   //                     * sin( radians(\`businessProfessionalDetail\`.\`latitude\`)
      //   //                   ) ) )
      //   //                 ), 1)`
      //   //       ),
      //   //       "distance",
      //   //     ],
      //   //   ] : [
      //   //     [sequelize.literal(`0`), "distance"]
      //   //   ]),
      //   // ],
      //   include: [
      //     {
      //       attributes: [`id`, `userId`, `name`, `socialImage`, `location`, `latitude`, `longitude`, `categoryId`, `about`, `created`, `updated`, `createdAt`, `updatedAt`, `lastName`, `firstName`, `gender`, `isFav`, 'isShowAddressOther', makeImageUrlSql('businessProfessionalDetail', 'bannerImage', 'business'), [sequelize.literal('(SELECT COUNT(id) FROM reviews WHERE businessId = businessProfessionalDetail.userId )'), 'ratingCount'],
      //         [sequelize.literal('ifnull((SELECT AVG(rating) FROM reviews WHERE businessId = businessProfessionalDetail.userId ), "0.0")'), 'avgRating'],

      //       ],
      //       model: business_prof,
      //       // where: {
      //       //   role: 2,
      //       // },
      //       // attributes: [],
      //     },
      //     {
      //       attributes: ['id', 'review', 'rating', 'userId', 'created', 'updated', [sequelize.literal('(SELECT CONCAT(name," ",lastName) FROM userDetail WHERE reviews.userId = userDetail.userId )'), 'ratingGivenBy'], /* [sequelize.literal('(SELECT image FROM user WHERE reviews.userId = user.id )'), 'image'] */
      //         [sequelize.literal('(SELECT case when `user`.`image`="" then "" else concat("' + url_get + '",`user`.`image`) end FROM user WHERE user.id = reviews.userId )'), 'senderImage']
      //       ],
      //       model: reviews,
      //     },
      //     {
      //       attributes: [`id`, `businessId`, `createdAt`, `updatedAt`, makeImageUrlSql('businessImages', 'image', 'business')],
      //       model: businessImage
      //     }

      //   ],
      // }).map(data => {
      //   data = data.toJSON()
      //   if (data.businessProfessionalDetail == null) {
      //     data.businessProfessionalDetail = {};
      //   }
      //   return data
      // });

      // let allData = [
      //   ...locations,
      //   ...bannerImage
      //   // ...businessProfessionals
      // ];

      let allData = {
        locations: locations,
        bannerImage: bannerImage,
        categoryDetale: categoryDetale
        // ...businessProfessionals
      };
      // allData.reviews = get_review
      // allData = allData.sort((a, b) => a.distance - b.distance);

      let msg = "Home data";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: allData
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },
  home: async function(req, res) {
    try {
      var url_get = "http://" + req.host + ":7800/uploads/user/";

      const required = {
        latitude: req.body.latitude,
        longitude: req.body.longitude
      };
      const non_required = {
        price: req.body.price,
        radius: req.body.radius,
        categoryId: req.body.categoryId,
        limit: req.body.limit
        // startPriceRange: req.body.startPriceRange,
        // endPriceRange: req.body.endPriceRange
      };
      console.log(
        "ppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp",
        req.body.limit
      );

      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      const bannerImage = await bannerImages.findAll({
        where: {
          status: 1
        }
      });
      // const categoryDetale = await category.findAll({
      //   where: {
      //     status: 1
      //   },
      //   limit: 6
      // });
      var distance_data = "80";
      if (requestdata.radius) {
        distance_data = requestdata.radius;
      }
      console.log(
        "requestdata.latitude",
        requestdata.latitude,
        requestdata.longitude
      );
      var startDate = 0;

      const where = {};
      // if (requestdata.startPriceRange && requestdata.endPriceRange) {
      //   where["[Op.between]"] = [requestdata.startPriceRange, requestdata.endPriceRange];
      // }

      if (startDate && requestdata.price) {
        where = {
          PricePerDay: {
            [Op.between]: [startDate, requestdata.price]
          }
        };
      }
      var asdf = req.body.limit;
      // if (requestdata.categoryId) {
      //   where["category"] = requestdata.categoryId;
      // }
      console.log(where, "where");
      // return;
      const location_owner_detale = await locationOwnerDetail.findAll({
        attributes: [
          `id`,
          `userId`,
          `name`,
          `adress`,
          `image`,
          `location`,
          `latitude`,
          `longitude`,
          `hourOfOpration`,
          ['adress', 'locationName'],
          `PricePerDay`,
          `isFav`,
          `offrerPricePerDay`,
          `offers`,
          `about`,
          `createdAt`,
          `updatedAt`,
          `loc_country_code`,
          `loc_phone`,
          `loc_email`,
          [
            sequelize.literal(
              "(SELECT COUNT(id) FROM reviews WHERE businessId = locationOwnerDetail.id )"
            ),
            "ratingCount"
          ],
          [
            sequelize.literal(
              "ifnull((truncate((SELECT AVG(rating) FROM reviews WHERE businessId = locationOwnerDetail.id), 1) ), '0.0')"
            ),
            "avgRating"
          ],
          
          ...(requestdata.latitude && requestdata.longitude
            ? [
                [
                  sequelize.literal(
                    `round(
                        ( 3959 * acos( least(1.0,
                          cos( radians(${requestdata.latitude}) )
                          * cos( radians(\`locationOwnerDetail\`.\`latitude\`) )
                          * cos( radians(\`locationOwnerDetail\`.\`longitude\`) - radians(${requestdata.longitude}) )
                          + sin( radians(${requestdata.latitude}) )
                          * sin( radians(\`locationOwnerDetail\`.\`latitude\`)
                        ) ) )
                      ), 1)`
                  ),
                  "distance"
                ]
              ]
            : [[sequelize.literal(`0`), "distance"]])

          // [sequelize.literal('(SELECT CONCAT(firstName," ",lastName) FROM user WHERE locationOwnerDetail.userId = user.id )'), 'locationOwnerName'],
          // [sequelize.literal('(SELECT image FROM user WHERE locationOwnerDetail.userId = user.id )'), 'locationOwnerImage'],
        ],
        where: where,
        having: {
          distance: {
            [Op.lte]: distance_data
          }
        },

        include: [
          {
            attributes:[`id`, `locationid`, `image`, `status`, `createdAt`, `updatedAt`],
            model:locationOwnerDetailImage,
             on: {
                col1: sequelize.where(sequelize.col('locationOwnerDetailImages.locationid'), '=', sequelize.col('locationOwnerDetail.id')),
              },
          },
          {
            attributes: [
              `id`,
              `role`,
              `firstName`,
              `lastName`,
              `username`,
              `email`,
              `phone`,
              `country_code`,
              `image`
            ],
            model: user,
            required: false
          }
        ],
       
        limit: +req.body.limit || 4,
        order: [[sequelize.col("distance"), "ASC"]]
        
      });
      // var endDate=40
      // console.log("=========================================================================",location_owner_detale);
      // if (requestdata.categoryId || requestdata.price ) {
      //   var find_busines_category = await business_prof.findAll({
      //     where: {
      //       // categoryId: requestdata.categoryId,
      //       [Op.or]: [
      //         {
      //           categoryId:
      //           {
      //               $eq: requestdata.categoryId
      //           }
      //       },
      //       {
      //         "pricePerService" : {[Op.between] : [startDate , requestdata.price ]}
      //     },
      //       ],
      //       //  "pricePerService" : {[Op.between] : [startDate , endDate ]}

      //     },

      //     // raw:true
      //   });
      // }else{
      var find_category = await category.findAll({
        where: {
          status: 1
        },
        limit: 6,
        order: [['id', 'DESC']]
      });
      // }

      // console.log("=========================================================================",find_category);

      let homeData = {
        bannerImage: bannerImage,
        // categoryDetale: categoryDetale,
        location_owner_detale: location_owner_detale,
        find_category: find_category
      };

      let msg = "Home data";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: homeData
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },
  // get_by_category: async function(req, res) {
  //   try {
  //     // console.log(req.user, '============hre'); return
  //     var url_get = "http://" + req.host + ":7800/uploads/user/";

  //     const required = {
  //       // security_key: req.headers.security_key,
  //       categoryId: req.body.categoryId
  //     };
  //     const non_required = {};
  //     let requestdata = await helper.vaildObjectUser(
  //       required,
  //       non_required,
  //       res
  //     );
  //     let get_count = await category.findOne({
  //       attributes: ["id"],
  //       where: {
  //         id: req.body.categoryId
  //       }
  //     });
  //     const loggedInUser =
  //       req.hasOwnProperty("user") &&
  //       typeof req.user == "object" &&
  //       Object.keys(req.user).length > 0
  //         ? req.user
  //         : false;
  //     if (get_count) {
  //       //[sequelize.fn('Round', sequelize.fn('AVG',  sequelize.col('rating'))), 'ratingAvg']
  //       let get_data = await business
  //         .findAll({
  //           attributes: [
  //             `id`,
  //             `name`,
  //             `location`,
  //             "latitude",
  //             "categoryId",
  //             "firstName",
  //             "city",
  //             "state",
  //             "apt",
  //             "zipCode",
  //             "lastName",
  //             "longitude",
  //             "userId",
  //             "isShowAddressOther",
  //             // [
  //             //   sequelize.literal(
  //             //     "(SELECT role FROM user WHERE user.id = businessDetail.userId )"
  //             //   ),
  //             //   "role"
  //             // ],
  //             // [
  //             //   sequelize.literal(
  //             //     "(SELECT image FROM user WHERE user.id = businessDetail.userId )"
  //             //   ),
  //             //   "image"
  //             // ],
  //             // [
  //             //   sequelize.literal(
  //             //     "(SELECT COUNT(id) FROM reviews WHERE businessId = businessDetail.userId )"
  //             //   ),
  //             //   "ratingCount"
  //             // ],
  //             // [
  //             //   sequelize.literal(
  //             //     "ifnull((SELECT AVG(rating) FROM reviews WHERE businessId = businessDetail.userId ), '0.0')"
  //             //   ),
  //             //   "avgRating"
  //             // ],
  //             // makeImageUrlSql("businessDetail", "bannerImage", "business")
  //           ],
  //           where: {
  //             categoryId: requestdata.categoryId,
  //             ...(loggedInUser
  //               ? {
  //                   id: {
  //                     // = 3
  //                     [Op.ne]: loggedInUser.id
  //                   }
  //                 }
  //               : {})
  //           },
  //           include: [
  //             {
  //               attributes: [
  //                 "id",
  //                 "subCategoryId",
  //                 [
  //                   sequelize.literal(
  //                     `ifnull((SELECT name FROM category WHERE id = userSubCategories.subCategoryId), '')`
  //                   ),
  //                   "Subname"
  //                 ]
  //               ],
  //               model: sub_category,
  //               // on: {
  //               //   col1: sequelize.where(
  //               //     sequelize.col("businessDetail.userId"),
  //               //     "=",
  //               //     sequelize.col("userSubCategories.userId")
  //               //   )
  //               // }
  //             },
  //             {
  //               attributes: [
  //                 "id",
  //                 "review",
  //                 "rating",
  //                 "userId",
  //                 "created",
  //                 "updated",
  //                 [
  //                   sequelize.literal(
  //                     '(SELECT CONCAT(name," ",lastName) FROM userDetail WHERE reviews.userId = userDetail.userId )'
  //                   ),
  //                   "ratingGivenBy"
  //                 ] /* [sequelize.literal('(SELECT image FROM user WHERE reviews.userId = user.id )'), 'image'] */,
  //                 [
  //                   sequelize.literal(
  //                     '(SELECT case when `user`.`image`="" then "" else concat("' +
  //                       url_get +
  //                       '",`user`.`image`) end FROM user WHERE user.id = reviews.userId )'
  //                   ),
  //                   "senderImage"
  //                 ]
  //               ],
  //               model: reviews,
  //               on: {
  //                 col1: sequelize.where(
  //                   sequelize.col("businessDetail.userId"),
  //                   "=",
  //                   sequelize.col("reviews.businessId")
  //                 )
  //               }
  //             },
  //             {
  //               attributes: [
  //                 `id`,
  //                 `businessId`,
  //                 `createdAt`,
  //                 `updatedAt`,
  //                 makeImageUrlSql("businessImages", "image", "business")
  //               ],
  //               model: businessImage,
  //               // on: {
  //               //   col1: sequelize.where(
  //               //     sequelize.col("businessDetail.userId"),
  //               //     "=",
  //               //     sequelize.col("businessImages.businessId")
  //               //   )
  //               // }
  //             }
  //           ]
  //         })
  //         .map(data => data.toJSON());
  //       let get_dataa = await business_prof
  //         .findAll({
  //           attributes: [
  //             "id",
  //             "name",
  //             "location",
  //             "latitude",
  //             "categoryId",
  //             "firstName",
  //             "city",
  //             "state",
  //             "apt",
  //             "zipCode",
  //             "lastName",
  //             "longitude",
  //             "userId",
  //             "isShowAddressOther",
  //             [
  //               sequelize.literal(
  //                 "(SELECT role FROM user WHERE user.id = businessProfessionalDetail.userId )"
  //               ),
  //               "role"
  //             ],
  //             [
  //               sequelize.literal(
  //                 "(SELECT COUNT(id) FROM reviews WHERE businessId = businessProfessionalDetail.userId )"
  //               ),
  //               "ratingCount"
  //             ],
  //             [
  //               sequelize.literal(
  //                 "ifnull((SELECT AVG(rating) FROM reviews WHERE businessId = businessProfessionalDetail.userId ), '0.0')"
  //               ),
  //               "avgRating"
  //             ],
  //             makeImageUrlSql(
  //               "businessProfessionalDetail",
  //               "bannerImage",
  //               "business"
  //             )
  //           ],
  //           where: {
  //             categoryId: requestdata.categoryId,
  //             ...(loggedInUser
  //               ? {
  //                   id: {
  //                     // = 3
  //                     [Op.ne]: loggedInUser.id
  //                   }
  //                 }
  //               : {})
  //           },
  //           // raw:true,
  //           include: [
  //             {
  //               attributes: [
  //                 "id",
  //                 "subCategoryId",
  //                 [
  //                   sequelize.literal(
  //                     `ifnull((SELECT name FROM category WHERE id = userSubCategories.subCategoryId), '')`
  //                   ),
  //                   "Subname"
  //                 ]
  //               ],
  //               model: sub_category,
  //               on: {
  //                 col1: sequelize.where(
  //                   sequelize.col("userSubCategories.userId"),
  //                   "=",
  //                   sequelize.col("businessProfessionalDetail.userId")
  //                 )
  //               }
  //             },
  //             {
  //               attributes: [
  //                 "id",
  //                 "review",
  //                 "rating",
  //                 "userId",
  //                 "created",
  //                 "updated",
  //                 [
  //                   sequelize.literal(
  //                     '(SELECT CONCAT(name," ",lastName) FROM userDetail WHERE reviews.userId = userDetail.userId )'
  //                   ),
  //                   "ratingGivenBy"
  //                 ] /* [sequelize.literal('(SELECT image FROM user WHERE reviews.userId = user.id )'), 'image'] */,
  //                 [
  //                   sequelize.literal(
  //                     '(SELECT case when `user`.`image`="" then "" else concat("' +
  //                       url_get +
  //                       '",`user`.`image`) end FROM user WHERE user.id = reviews.userId )'
  //                   ),
  //                   "senderImage"
  //                 ]
  //               ],
  //               model: reviews,
  //               on: {
  //                 col1: sequelize.where(
  //                   sequelize.col("businessProfessionalDetail.userId"),
  //                   "=",
  //                   sequelize.col("reviews.businessId")
  //                 )
  //               }
  //             },
  //             {
  //               attributes: [
  //                 `id`,
  //                 `businessId`,
  //                 `createdAt`,
  //                 `updatedAt`,
  //                 makeImageUrlSql("businessImages", "image", "business")
  //               ],
  //               model: businessImage,
  //               on: {
  //                 col1: sequelize.where(
  //                   sequelize.col("businessProfessionalDetail.userId"),
  //                   "=",
  //                   sequelize.col("businessImages.businessId")
  //                 )
  //               }
  //             }
  //           ]
  //         })
  //         .map(data => data.toJSON());

  //       let alldata = [...get_data, ...get_dataa];

  //       if (alldata.length > 0) {
  //         var msg = "list by category";
  //       } else {
  //         var msg = "Data not found";
  //       }

  //       res.status(200).json({
  //         success: 1,
  //         code: 200,
  //         msg: msg,
  //         body: alldata
  //       });
  //     } else {
  //       let msg = "invalid category";
  //       res.status(400).json({
  //         success: 0,
  //         code: 400,
  //         msg: msg,
  //         body: {}
  //       });
  //       return false;
  //     }
  //   } catch (error) {
  //     return helper.error(res, error);
  //   }
  // },
  all_reviews: async function(req, res) {
    try {
      const required = {
        security_key: req.headers.security_key,
        cafeId: req.body.cafeId
      };
      const non_required = {};
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      // let get_review = await reviews.findAll({
      //   attributes: [`id`, `rating`, `review`, `createdAt`, 'created', 'updated', [sequelize.literal('(SELECT CONCAT(name," ",lastName) FROM userDetail WHERE reviews.userId = userDetail.userId )'), 'ratingGivenBy']],
      //   where: {
      //     businessId: req.body.cafeId,
      //   },
      //   include: [{
      //     model: user,
      //     attributes: ['image', makeImageUrlSql('user', 'image', 'user')],
      //     on: {

      //       col1: sequelize.where(sequelize.col('reviews.userId'), '=', sequelize.col('user.id')),
      //     },

      //   }]
      // });
      var get_review = await reviews.findAll({
        // attributes: [`id`, `rating`, `review`, `createdAt`, 'created', 'updated', [sequelize.literal('(SELECT CONCAT(name," ",lastName) FROM userDetail WHERE reviews.userId = userDetail.userId )'), 'ratingGivenBy']],
        attributes: [
          `id`,
          `userId`,
          `rating`,
          `review`,
          `createdAt`,
          "created",
          "updated",
          [
            sequelize.literal(
              "(SELECT role FROM user WHERE id = reviews.userId )"
            ),
            "userRole"
          ]
        ],
        where: {
          businessId: req.body.cafeId
        },
        include: [
          {
            model: user,
            attributes: ["image", makeImageUrlSql("user", "image", "user")],
            on: {
              col1: sequelize.where(
                sequelize.col("reviews.userId"),
                "=",
                sequelize.col("user.id")
              )
            }
          }
        ]
      });

      get_review = await Promise.all(
        get_review.map(async data => {
          data = data.toJSON();
          if (data.userRole == 1) {
            let findName = await user_detail.findOne({
              where: {
                userId: data.userId
              }
            });

            if (findName) {
              data.ratingGivenBy = findName.name + " " + findName.lastName;
            } else {
              data.ratingGivenBy = "";
            }
          } else if (data.userRole == 2) {
            let findName = await business.findOne({
              where: {
                userId: data.userId
              }
            });

            if (findName) {
              data.ratingGivenBy = findName.name + " " + findName.lastName;
            } else {
              data.ratingGivenBy = "";
            }
          } else if (data.userRole == 3) {
            let findName = await business_prof.findOne({
              where: {
                userId: data.userId
              }
            });

            if (findName) {
              data.ratingGivenBy = findName.name + " " + findName.lastName;
            } else {
              data.ratingGivenBy = "";
            }
          } else {
            console.log("----------------------error------------------------");
          }

          return data;
        })
      );
      // console.log(get_review,"===========get_review");
      var msg = "All reviews";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: get_review
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },
  
  addCard: async (req, res) => {
    try {
      console.log(
        "//////////////////////////////////////////////////////////////"
      );

      const required = {
        // securitykey: req.headers.securitykey,
        // cardType: req.body.cardType,
        cardHolderName: req.body.cardHolderName,
        cardNumber: req.body.cardNumber,
        expiryMonth: req.body.expiryMonth,
        expiryYear: req.body.expiryYear
      };
      const nonRequired = {
        isDefault: req.body.isDefault
      };

      let requestData = await helper.vaildObject(required, nonRequired);

      // if (isNaN(Number(requestData.cardType))) throw "cardType should only be a number.";

      requestData.cardNumber = requestData.cardNumber.replace(/\s/g, "");

      const now = moment().unix();
      const cardExpiry = moment(
        `${requestData.expiryYear}/${requestData.expiryMonth}/01`,
        "YYYY/MM/DD"
      ).unix();

      // const month = now.format('M');
      // const day = now.format('D');
      // const year = now.format('YYYY');

      // console.log(year, month, day);
      console.log(now, "=========>now");
      console.log(cardExpiry, "=======>cardExpirty");

      var cardNumberCheck = await bankDetail.findOne({
        where: {
          cardNumber: req.body.cardNumber,
          userId	:req.user.id
        },
        raw: true
      });
      if (cardNumberCheck) throw "Card Number Already Exists";
      if (cardExpiry < now) throw "Invalid Expiry.";

      if (requestData.cardNumber.length != 16)
        throw "Card number should be 16 digit long.";
      if (requestData.expiryMonth.length != 2)
        throw "Month should be 2 digit long.";
      if (requestData.expiryYear.length != 4)
        throw "Year should be 4 digit long.";

      // await bankDetail.update({
      //     isDefault: 0
      // }, {
      //     where: {
      //         userId: req.user.id
      //     }
      // });
      console.log(
        "-----------------------------------------------",
        req.user.id,requestData.expiryMonth,
        "--------------"
      );
      await stripe.tokens.create(
        {
          card: {
                number: requestData.cardNumber,
                exp_month: requestData.expiryMonth,
                exp_year: requestData.expiryYear,
          }
        },
        async (err, token) => {
          if (err) {
            console.log("==============================");
            
            return helper.error(res, err.raw.message);
          } else {
            // console.log(token)
            let add_fav = await bankDetail.create({
              userId: req.user.id,
              isDefault: requestData.isDefault,
              // cardType: requestData.cardType,
              cardHolderName: requestData.cardHolderName,
              cardNumber: requestData.cardNumber,
              expiryMonth: requestData.expiryMonth,
              expiryYear: requestData.expiryYear
            });


            var addBankDetail = await bankDetail.findOne({
              where: {
                id: add_fav.id
              },
              raw: true
            });
            var msg = "Add card successufully";
            res.status(200).json({
              success: 1,
              code: 200,
              msg: msg,
              body: addBankDetail
            });



          }
        }
      );

      
    } catch (err) {
      return helper.error(res, err);
    }
  },

  getCardList: async function(req, res) {
    try {
      const required = {};
      const non_required = {};
      let requestData = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );

      // console.log("0000000000000000000000000000000000000000000000000000000000",req.user.id);

      let cardList = await bankDetail.findAll({
        where: {
          userId: req.user.id
        }
      });

      var msg = "Get card list";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: cardList
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },
  add_remove_fav: async function(req, res) {
    try {
      const required = {
        jobId: req.body.jobId,
        jobRole: req.body.jobRole
      };
      const non_required = {};
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );

      let user_exists = await user.count({
        where: {
          id: req.user.id,
          role: {
            [Op.in]: [1]
          }
        }
      });
      if (!user_exists) throw "Invalid userId.";

      //console.log(count_fav,'count_fav=====');return
      if (requestdata.jobRole == 2) {
        let count_fav = await favourite.count({
          where: {
            favBy: req.user.id,

            locationId: requestdata.jobId
          }
        });
        if (!count_fav) {
          let add_fav = await favourite.create({
            locationId: requestdata.jobId,
            businessId: 0,
            favBy: req.user.id,
            is_fav: 1,
            type: requestdata.jobRole
          });

          var msg = "Added to favourites";
          res.status(200).json({
            success: 1,
            code: 200,
            msg: msg,
            body: {}
          });
        } else {
          let remove_fav = await favourite.destroy({
            where: {
              locationId: requestdata.jobId,
              favBy: req.user.id,
              type: requestdata.jobRole
            }
          });

          var msg = "Removed from favourite";
          res.status(200).json({
            success: 1,
            code: 200,
            msg: msg,
            body: {}
          });
        }
      }

      if (requestdata.jobRole == 3) {
        let count_fav = await favourite.count({
          where: {
            favBy: req.user.id,

            businessId: requestdata.jobId
          }
        });
        if (!count_fav) {
          let add_fav = await favourite.create({
            businessId: requestdata.jobId,
            locationId: 0,
            favBy: req.user.id,
            is_fav: 1,
            type: requestdata.jobRole
          });
          var update_fav_business = await business_prof.update(
            {
              isFav: 1
            },
            {
              where: {
                id: requestdata.jobId
              }
            }
          );
          var msg = "Added to favourite";
          res.status(200).json({
            success: 1,
            code: 200,
            msg: msg,
            body: {}
          });
        } else {
          let remove_fav = await favourite.destroy({
            where: {
              businessId: requestdata.jobId,
              favBy: req.user.id,
              type: requestdata.jobRole
            }
          });
          var update_fav_business = await business_prof.update(
            {
              isFav: 0
            },
            {
              where: {
                id: requestdata.jobId
              }
            }
          );
          var msg = "Removed from favourite";
          res.status(200).json({
            success: 1,
            code: 200,
            msg: msg,
            body: {}
          });
        }
      }
    } catch (error) {
      return helper.error(res, error);
    }
  },
  profile: async function(req, res) {
    try {
      const required = {
        // security_key: req.headers.security_key,
      };
      const non_required = {};
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      var get_profile = await user.findOne({
        attributes: [
          `id`,
          `role`,
          `verified`,
          `status`,
          `notification`,
          `firstName`,
          `lastName`,
          `username`,
          `email`,
          `password`,
          `forgotPasswordHash`,
          `facebookId`,
          `phone`,
          `otp`,
          `country_code`,
          `image`,
          `checked`,
          `socialId`,
          `socialType`,
          `googleId`,
          `deviceType`,
          `deviceToken`,
          `created`,
          `updated`,
          `createdAt`,
          `updatedAt`
          // makeImageUrlSql("user", "image", "user")
        ],
        include: [
          {
            model: user_detail,
            required: false
          }
        ],
        where: {
          id: req.user.id
        }
      });

      var msg = "User profile";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: get_profile
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },

  edit_profile: async function(req, res) {
    try {
      const required = {};
      const non_required = {
        image: req.body.image,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        role: req.body.roolType,
        phone: req.body.phone,
        location: req.body.location,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        country_code: req.body.country_code
      };
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );

      if (requestdata.email) {
        let check_email = await user.count({
          where: {
            email: req.body.email,
            id: {
              // = 3
              [Op.ne]: req.user.id
            }
          }
        });
        // console.log(check_email_pass,'jnj=====');return false;
        if (check_email > 0) {
          let msg = "Email already exists";
          res.status(400).json({
            success: 0,
            code: 400,
            msg: msg,
            body: []
          });
          return false;
        }
      }
      if (requestdata.phone) {
        let check_phone_pass = await user.count({
          where: {
            phone: req.body.phone,
            id: {
              // = 3
              [Op.ne]: req.user.id
            }
          }
        });
        // console.log(check_email_pass,'jnj=====');return false;
        if (check_phone_pass > 0) {
          let msg = "Phone already exists";
          res.status(400).json({
            success: 0,
            code: 400,
            msg: msg,
            body: []
          });
          return false;
        }
      }

      let edit_profile = await user.update(
        {
          email: req.body.email,
          role: requestdata.role,
          username: requestdata.firstName + " " + requestdata.lastName,
          firstName: requestdata.firstName,
          lastName: requestdata.lastName,
          location: req.body.location,
          latitude: req.body.latitude,
          longitude: req.body.longitude,
          phone: requestdata.phone,
          country_code: req.body.country_code,
          deviceToken: requestdata.device_token,
          deviceType: req.body.device_type,
          image: req.body.image
        },
        {
          where: {
            id: req.user.id
          }
        }
      );
      var edit_profiles = await user_detail.update(
        {
          name: req.body.firstName,
          lastName: req.body.lastName,
          location: req.body.location,
          latitude: requestdata.latitude,
          longitude: requestdata.longitude,
          image: req.body.image
        },
        {
          where: {
            userId: req.user.id
          }
        }
      );

      let get_detail = await user.findOne({
        attributes: [
          `id`,
          `role`,
          `verified`,
          `status`,
          `notification`,
          `firstName`,
          `lastName`,
          `username`,
          `email`,
          `password`,
          `forgotPasswordHash`,
          `facebookId`,
          `phone`,
          `otp`,
          `country_code`,
          `image`
          // helper.makeImageUrlSql("user", "image", "user")
        ],
        where: {
          id: req.user.id
        },
        include: [
          {
            model: user_detail
          }
        ]
      });
      // if (get_detail) get_detail = get_detail.toJSON();

      var msg = "Profile updated succcessfully";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: get_detail
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },

  edit_location_profile: async function(req, res) {
    try {
      const required = {
        location: req.body.locationId
      };
      const non_required = {
        // userid: req.body.userid,
        // locationName: req.body.locationName,
        adress: req.body.adress,
        PricePerDay: req.body.PricePerDay,
        offers: req.body.offers,
        offrerPrice: req.body.offrerPrice,
        about: req.body.about,
        // hoursOfOperation:
        //   typeof req.body.hoursOfOperation === "object"
        //     ? req.body.hoursOfOperation
        //     : JSON.parse(req.body.hoursOfOperation),
        location: req.body.location,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        // loc_phone: req.body.loc_phone,
        // loc_email: req.body.loc_email,
        profile_image:
          typeof req.body.profile_image === "object"
            ? req.body.profile_image
            : JSON.parse(req.body.profile_image)
        // profile_image:
        //   typeof req.body.profile_image === "object"
        //     ? req.body.profile_image
        //     : JSON.parse(req.body.profile_image)
      };
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );

      // if (requestdata.loc_phone) {
      //   let check_phone_pass = await locationOwnerDetail.count({
      //     where: {
      //       loc_phone: req.body.loc_phone,
      //       id: {
      //         // = 3
      //         [Op.ne]: req.body.locationId
      //       }
      //     }
      //   });
      //   // console.log(check_phone_pass,'jnj=====');return false;
      //   if (check_phone_pass > 0) {
      //     let msg = "phone already exist";
      //     res.status(400).json({
      //       success: 0,
      //       code: 400,
      //       msg: msg,
      //       body: []
      //     });
      //     return false;
      //   }
      // }

      // if (requestdata.email) {
      //   let check_email = await user.count({
      //     where: {
      //       email: req.body.email,
      //       id: {
      //         // = 3
      //         [Op.ne]: req.user.id
      //       }
      //     }
      //   });
      //   // console.log(check_email_pass,'jnj=====');return false;
      //   if (check_email > 0) {
      //     let msg = "email already exist";
      //     res.status(400).json({
      //       success: 0,
      //       code: 400,
      //       msg: msg,
      //       body: []
      //     });
      //     return false;
      //   }
      // }
      // let image = req.user.image;

      // if (requestdata.image) {
      //   image = await helper.imageUpload(requestdata.image, 'user');
      // }

      // let edit_profile = await user.update(
      //   {
      //     phone: requestdata.phone,
      //     email: req.body.email
      //   },
      //   {
      //     where: {
      //       id: req.user.id
      //     }
      //   }
      // );
      // console.log(requestdata.latitude,'================');return
      if (
        Array.isArray(requestdata.profile_image) &&
        requestdata.profile_image &&
        requestdata.profile_image.length > 0
      ) {
        await locationOwnerDetailImage.destroy({
          where: {
            locationid: req.body.locationId
          }
        });
        for (let i in requestdata.profile_image) {
          await locationOwnerDetailImage.create({
            image: requestdata.profile_image[i].image,
            locationid: req.body.locationId
          });
        }
      }
      let edit_profiles = await locationOwnerDetail.update(
        {
          // locationName: requestdata.locationName,
          // bannerImage: bannerImage,
          about: req.body.about,
          categoryId: req.body.categoryId,
          loc_phone: req.body.loc_phone,
          // loc_email: req.body.loc_email,
          location: req.body.location,
          latitude: req.body.latitude,
          longitude: req.body.longitude,

          adress: req.body.adress,
          PricePerDay: req.body.PricePerDay,
          offers: req.body.offers,
          offrerPricePerDay: req.body.offrerPrice,
          loc_country_code: req.body.country_code
        },
        {
          where: {
            id: req.body.locationId
          }
        }
      );

      let get_detail = await user.findOne({
        // attributes: [
        //   "id",
        //   "email",
        //   "phone",
        //   "name",
        //   // helper.makeImageUrlSql("user", "image", "user")
        // ],
        where: {
          id: req.user.id
        },
        include: [
          {
            // attributes: [
            //   `id`,
            //   `userId`,
            //   `name`,
            //   `location`,
            //   `latitude`,
            //   `longitude`,
            //   `createdAt`,
            //   `updatedAt`,
            //   // helper.makeImageUrlSql("locationOwnerDetail", "image", "user")
            // ],
            model: locationOwnerDetail,
            required: false,
            include: [
              {
                // attributes: [
                //   `id`,
                //   `locationId`,
                //   `image`,
                //   `createdAt`,
                //   `updatedAt`,
                //   // helper.makeImageUrlSql("locationOwnerDetail", "image", "user")
                // ],
                model: locationOwnerDetailImage,
                required: false,

                where: {
                  locationId: req.body.locationId
                }
              }
            ],
            where: {
              id: req.body.locationId
            }
          }
        ]
      });
      console.log(
        "===================================================================",
        get_detail
      );

      // if (get_detail) get_detail = get_detail.toJSON();

      var msg = "Location profile updated succcessfully";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: get_detail
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },

  serviceOrLocationDelete: async function(req, res) {
    try {
      const required = {
        jobId: req.body.jobId,
        role: req.body.role
      };
      const non_required = {};
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      if (requestdata.role == 2) {
        let del_location = await locationOwnerDetail.destroy({
          where: {
            id: requestdata.jobId,
            userId: req.user.id
          }
        });

        let del_location_favourite = await favourite.destroy({
          where: {
            locationId: requestdata.jobId,
            favBy: req.user.id,
            type: 2
          }
        });
      }

      if (requestdata.role == 3) {
        let del_business = await business_prof.destroy({
          where: {
            id: requestdata.jobId,
            userId: req.user.id
          }
        });
        let del_business_favourite = await favourite.destroy({
          where: {
            businessId: requestdata.jobId,
            favBy: req.user.id,
            type: 3
          }
        });
      }

      let msg = "Service Or Location delete succcessfully";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: {}
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },
  edit_profile_business_prof: async function(req, res) {
    try {
      const required = {};
      const non_required = {
        security_key: req.headers.security_key,
        image: req.body.image,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        phone: req.body.phone,
        location: req.body.location,
        country_code: req.body.country_code
      };
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );

      if (requestdata.phone) {
        let check_phone_pass = await user.count({
          where: {
            phone: req.body.phone,
            id: {
              // = 3
              [Op.ne]: req.user.id
            }
          }
        });
        // console.log(check_email_pass,'jnj=====');return false;
        if (check_phone_pass > 0) {
          let msg = "Phone already exists";
          res.status(400).json({
            success: 0,
            code: 400,
            msg: msg,
            body: []
          });
          return false;
        }
      }

      if (requestdata.email) {
        let check_email = await user.count({
          where: {
            email: req.body.email,
            id: {
              // = 3
              [Op.ne]: req.user.id
            }
          }
        });
        // console.log(check_email_pass,'jnj=====');return false;
        if (check_email > 0) {
          let msg = "Email already exists";
          res.status(400).json({
            success: 0,
            code: 400,
            msg: msg,
            body: []
          });
          return false;
        }
      }
      // let image = req.user.image;

      // if (requestdata.image) {
      //   image = await helper.imageUpload(requestdata.image, 'user');
      // }

      let edit_profile = await user.update(
        {
          phone: requestdata.phone,
          email: req.body.email
        },
        {
          where: {
            id: req.user.id
          }
        }
      );
      // console.log(requestdata.latitude,'================');return

      let edit_profiles = await business_prof.update(
        {
          name: req.body.firstName + " " + req.body.lastName,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          location: req.body.location,
          image: requestdata.image,
          latitude: req.body.latitude,
          longitude: req.body.longitude
        },
        {
          where: {
            userId: req.user.id
          }
        }
      );
      let get_detail = await user.findOne({
        attributes: [
          "id",
          "email",
          "phone",
          helper.makeImageUrlSql("user", "image", "user")
        ],
        where: {
          id: req.user.id
        },
        include: [
          {
            attributes: [
              `id`,
              `userId`,
              `categoryId`,
              `name`,
              `bannerImage`,
              `socialImage`,
              `location`,
              `zipCode`,
              `apt`,
              `city`,
              `state`,
              `latitude`,
              `longitude`,
              `about`,
              `lastName`,
              `firstName`,
              `gender`,
              `isFav`,
              `speciality`,
              `isShowAddressOther`,
              `hourOfOprations`,
              `pricePerService`,
              `offers`,
              `offerPrice`,
              `created`,
              `updated`,
              `updatedAt`,
              `createdAt`,
              helper.makeImageUrlSql(
                "businessProfessionalDetail",
                "image",
                "user"
              )
            ],
            model: business_prof
          }
        ]
      });
      if (get_detail) get_detail = get_detail.toJSON();

      var msg = "Profile updated succcessfully";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: get_detail
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },
  favourites_list: async function(req, res) {
    try {
      const required = {};
      const non_required = {};
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      let get_favourites_locations = await favourite.findAll({
        attributes: [`id`, `favBy`, `type`, `locationId`, `businessId`],
        where: {
          favBy: req.user.id
          // type: 2
        },
        include: [
          // ...
          {
            attributes: [
              `id`,
              `userId`,
              `adress`,
              ['adress', 'locationName'],
              `location`,
              `about`,
              `loc_country_code`, `loc_phone`, `loc_email`,
              // [sequelize.literal('(SELECT image FROM locationOwnerDetailImage WHERE locationOwnerDetailImage.locationid = favourite.locationId)'), 'image'],
              [
                sequelize.literal(
                  "(SELECT COUNT(id) FROM reviews WHERE businessId = locationOwnerDetail.id )"
                ),
                "ratingCount"
              ],
              [
                sequelize.literal(
                  "ifnull((truncate((SELECT AVG(rating) FROM reviews WHERE businessId = locationOwnerDetail.id), 1) ), '0.0')"
                ),
                "avgRating"
              ]
            ],
            model: locationOwnerDetail,
            required: false,
            // where:{
            //   id:locationId
            // }
            include: [
              {
                model: locationOwnerDetailImage
              }
            ]
          },
          {
            attributes: [
              `id`,
              `userId`,
              `categoryId`,
              `businessName`,
              `location`,
              `about`,
              `adress`,
              [
                sequelize.literal(
                  "(SELECT COUNT(id) FROM reviews WHERE businessId = businessProfessionalDetail.id )"
                ),
                "ratingCount"
              ],
              [
                sequelize.literal(
                  "ifnull((truncate((SELECT AVG(rating) FROM reviews WHERE businessId = businessProfessionalDetail.id), 1) ), '0.0')"
                ),
                "avgRating"
              ]
            ],
            model: business_prof,
            required: false,
            include: [
              {
                model: businessImage
              }
            ]
            // where:{
            //   type:businessId
            // }
            // include:[
            //   {
            // model: category,
            // required: false,
            //   }
            // ]
          }
        ]
        // include: [
        //   {
        //     model: sub_category,
        //     attributes: ['subCategoryId',
        //       [sequelize.literal('(SELECT `name` FROM `category` where id= subCategoryId)'), 'subcatename'],
        //     ],
        //     on: {
        //       col1: sequelize.where(sequelize.col('userSubCategories.userId'), '=', sequelize.col('favourite.favTo')),
        //     },
        //   }
        // ],
      });
      // let get_favourites_business = await favourite
      // .findAll({
      //   attributes: [`id`, `favBy`, `type`, `favTo`],
      //   where: {
      //     favBy: req.user.id,
      //     type: 3
      //   },
      //   include: [
      //     {
      //       model: business_prof,
      //       required: false,

      //     }

      //   ],
      // })
      // console.log("---------------------------------------",get_favourites_locations);

      // .map(async favouriteData => {
      //   favouriteData.favTo = await userController.findOne(req, {
      //     id: favouriteData.favTo
      //   });
      //   return favouriteData;
      // });
      // let data ={
      //   get_favourites_locations: get_favourites_locations,
      //   get_favourites_business: get_favourites_business
      // }
      var msg = " Favourites list";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: get_favourites_locations
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },
  add_review: async function(req, res) {
    try {
      const required = {
        userId: req.body.userId,
        rating: req.body.rating,
        review: req.body.review,
        role: req.body.role
      };
      const non_required = {};
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );


      let getReview = await reviews.count({
        where: {
          userId: req.user.id,
          businessId: requestdata.userId,
          role: req.body.role
        }
      });
      if (getReview) {
        throw "You can only give one review";
      }

      let add_review = await reviews.create({
        rating: requestdata.rating,
        review: requestdata.review,
        userId: req.user.id,
        businessId: requestdata.userId,
        role: requestdata.role
      });
      
      
      var msg = "Review added successfully";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: add_review
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },
  logout: async function(req, res) {
    try {
      const required = {};
      const non_required = {};
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      let logout = await user.update(
        {
          deviceToken: "",
          deviceType: ""
        },
        {
          where: {
            id: req.user.id
          }
        }
      );
      var msg = "Logout successfullY";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: {}
      });
    } catch (error) {
      throw error;
    }
  },
  //###########################notification_on_off##########################
  notification_on_off: async function(req, res) {
    try {
      const required = {
        notification: req.body.status
      };
      const non_required = {};
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );

      const notificationstatus = await user.update(
        {
          notification: req.body.status
        },
        {
          where: {
            id: req.user.id
          }
        }
      );
      let changestatus = await user.findOne({
        attributes: [`id`, `role`, `notification`],
        where: {
          id: req.user.id
        },
        raw: true
      });

      // let msg = "Notification status update successfully";
      // jsonData.true_status(res, changestatus, msg);

      var msg = "Notification status update successfully";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: changestatus
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },
  notification_on_off_status: async function(req, res) {
    try {
      const required = {};
      const non_required = {};
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      let NotificationStatus = await user.findOne({
        attributes: [`id`, `role`, `notification`],
        where: {
          id: req.user.id
        },
        raw: true
      });

      // let msg = "Notification status update successfully";
      // jsonData.true_status(res, changestatus, msg);

      var msg = "Get notification status successfully";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: NotificationStatus
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },
  notification_list: async function(req, res) {
    try {
      const required = {
        // role: req.body.role
      };
      const non_required = {};
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      var get_notification = await notification.findAll({
        where: {
          receiverId: req.user.id
        },
        attributes: [
          `id`,
          `senderId`,
          `receiverId`,
          `message`,
          `data`,
          `isRead`,
          `notificationType`,
          `createdAt`,
          `updatedAt`,
          [
            sequelize.literal(
              "(SELECT username FROM user WHERE user.id = notification.senderId )"
            ),
            "Name"
          ],
          [
            sequelize.literal(
              "(SELECT image FROM user WHERE user.id = notification.senderId )"
            ),
            "receiverImage"
          ]
        ],
        order: [['id', 'DESC']]
      });
      // if (requestdata.role==3) {
      //   var get_notification = await notification.findAll({
      //     attributes: [
      //       `id`, `senderId`, `receiverId`, `message`, `data`, `isRead`, `notificationType`,
      //       [
      //         sequelize.literal(
      //           "(SELECT username FROM user WHERE user.id = notification.senderId )"
      //         ),
      //         "Name"
      //       ]
      //     ],
      //     where: {
      //       receiverId: req.user.id,
      //       notificationType: 3
      //     },
      //     // raw: true
      //   })
      // console.log(get_notification,'ggggggggggggggggggggggggggggggggggggggggggggggggg');

      // }
      // let responseObject = get_notification.map(object => {
      //   object.data = JSON.parse(object.data);
      //   return object;
      // });
      // console.log(get_notification.senderId,'=======id========');return
      var msg = "Notification list";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: get_notification
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },

  

  booking: async function(req, res) {
    try {
      const required = {
        location: req.body.location,
        cardId: req.body.cardId,
        cvc: req.body.cvc,
        lat: req.body.lat,
        lng: req.body.lng,
        startBookingDate: req.body.startBookingDate,
        endBookingDate: req.body.endBookingDate
      };
      const non_required = {
        order_id: req.body.order_id,
        locationPrice: req.body.locationPrice,
        serviceProviderPrice: req.body.serviceProviderPrice,
        locationOwnerId: req.body.locationOwnerId,
        serviceProviderId: req.body.serviceProviderId,
        categoryId: req.body.categoryId,
        userId: req.user.id
      };
      var rendom_num = Math.floor(1000 + Math.random() * 9000);
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      var adminComission = await siteComission.findOne({
        where: {
          id: 1
        },
        raw: true
      });
      var get_card_detail = await bankDetail.findOne({
        where: {
          userId: req.user.id,
          id: req.body.cardId
        },
        raw: true
      });
      if (!get_card_detail) {
        
        var msg = "Invalid Card";
        res.status(403).json({
          success: 1,
          code: 403,
          msg: msg,
          body: {}
        });
      }

        const token = await stripe.tokens.create({
            card: {
                number: get_card_detail.cardNumber,
                exp_month: get_card_detail.expiryMonth,
                exp_year: get_card_detail.expiryYear,
                cvc: requestdata.cvc,
            },
        });
        // console.log(req.user.username)
        // console.log(token,token.card.id);
        await stripe.customers.create({
            source:token.id,
            // source:requestdata.tokken,
            email: req.user.email,
            name: req.user.username
        }, async function(err, customer) {
            if (err) {
                jsonData.wrong_status(res, err.message)
                return;
            } else {

                var totPrice = Number(requestdata.locationPrice) + Number(requestdata.serviceProviderPrice);
                var finalPrice = parseFloat(totPrice).toFixed(2);
                let totAmount = parseInt(finalPrice*100);
                let adminLocationComission = parseInt(requestdata.locationPrice*adminComission.comission)/100;
                let adminBusinesComission = parseInt(requestdata.serviceProviderPrice*adminComission.comission)/100;
                // console.log(adminLocationComission);return
                await stripe.charges.create({
                    amount: totAmount,
                    currency: 'USD',
                    customer: customer.id,
                    description: 'Booking Payment',

                }, async function(err, charge) {
                    if (err) {
                        jsonDataqq.wrong_status(res, err.message)
                        return;
                    } else {

                        if (charge.status == "succeeded") {

                          if (req.body.serviceProviderId) {
                            var findbussinessUser = await business_prof.findOne({
                              where: {
                                id: req.body.serviceProviderId
                              },
                              raw: true
                            });
                            requestdata.bussinessUserId = findbussinessUser
                              ? findbussinessUser.userId
                              : 0;
                              requestdata.serviceProviderPrice = requestdata.serviceProviderPrice
                          }
                          // console.log("444444444444444444444444444444444444444",+requestdata.locationOwnerId);
                    
                          if (requestdata.locationOwnerId && requestdata.locationOwnerId > 0) {
                            var findlocationUser = await locationOwnerDetail.findOne({
                              where: {
                                id: requestdata.locationOwnerId
                              },
                              raw: true
                            });
                            requestdata.locationUserId = findlocationUser
                              ? findlocationUser.userId
                              : 0;
                              requestdata.locationPrice = requestdata.locationPrice
                          }
                          requestdata.order_id = +requestdata.locationOwnerId!==0 ? "pic"+rendom_num+requestdata.locationOwnerId
                          : "pic"+rendom_num+requestdata.bussinessUserId;
                          console.log("33333333333333333333333333333333",);
                          
                          let create_bookings = await bookings.create({
                            ...requestdata
                          });
                    
                          var booking_find = await bookings.findOne({
                            where: {
                              id: create_bookings.id
                            }
                            // raw:true
                          });
                          var jsonData = JSON.stringify(booking_find);
                          
                          // console.log(
                          //   "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
                          //   jsonData
                          // );
                          // console.log("00000000000000000000000000000000000000000",findlocationUser);
                    
                          //  return
                          if (findlocationUser) {
                            // console.log("2222222222222222222222222222222222222");
                    
                            let create_notification = await notification.create({
                              senderId: req.user.id,
                              receiverId: findlocationUser.userId,
                              message: "Your"+ " " + findlocationUser.adress+ " "+"is booked",
                              data: jsonData,
                              isRead: 0,
                              notificationType: 2
                            });
                            let create_card_payment = await card_payment.create({
                              userId: req.user.id,
                              // serviceProviderId: requestdata.serviceProviderId,
                              // bussinessUserId: requestdata.bussinessUserId,
                              locationPrice:requestdata.locationPrice,
                              locationOwnerId: requestdata.locationOwnerId,
                              locationUserId: requestdata.locationUserId,
                              booking_id: create_bookings.id,
                              cardId: requestdata.cardId,
                              locationComission: adminLocationComission,
                              comission: adminComission.comission
                            });
                            // console.log("usersssssssssssssssssssssssssssss-----req.user",req.user);
                            
                            var find_notification_locationUser = await user.findOne({
                              attributes: [`id`, `role`, `notification`,  `username`, `deviceType`, `deviceToken`,],
                              where: {
                                id: findlocationUser.userId
                              }
                            });
                            // console.log("00000000000000000000000000000000000000000",find_notification_locationUser);
                    
                            var locationUserDeviceToken = {
                              name:"Booking"+" "+findlocationUser.adress,
                              user_name:"Booking"+" "+req.user.username,
                              device_type:find_notification_locationUser.deviceType,
                              device_token:find_notification_locationUser.deviceToken,
                              role:2,
                              type:0,                     //booking
                              job_id:findlocationUser.id
                            }
                            // console.log("00000000000000000000000000000000000000000",locationUserDeviceToken);
                            
                            await helper.sendPushNotificationTifiFunction(locationUserDeviceToken);
                          }
                          if (findbussinessUser) {
                            let create_notification = await notification.create({
                              senderId: req.user.id,
                              receiverId: findbussinessUser.userId,
                              message: "You booking this bussines" + findbussinessUser.businessName,
                              data: jsonData,
                              isRead: 0,
                              notificationType: 3
                            });
                            var find_notification_bussinesUser = await user.findOne({
                              attributes: [`id`, `role`, `notification`,  `username`, `deviceType`, `deviceToken`,],
                              where: {
                                id: findbussinessUser.userId
                              }
                            });
                            // console.log("00000000000000000000000000000000000000000",find_notification_bussinesUser);
                            let create_card_payment = await card_payment.create({
                              userId: req.user.id,
                              serviceProviderId: requestdata.serviceProviderId,
                              bussinessUserId: requestdata.bussinessUserId,
                              // locationOwnerId: requestdata.locationOwnerId,
                              // locationUserId: requestdata.locationUserId,
                              serviceProviderPrice:requestdata.serviceProviderPrice,
                              businesComission: adminBusinesComission,
                              booking_id: create_bookings.id,
                              cardId: requestdata.cardId,
                              comission: adminComission.comission

                            });
                            var bussinessUserDeviceToken = {
                              name:"Booking" +" "+findbussinessUser.businessName,
                              user_name:"Booking" +" "+req.user.username,
                              device_type:find_notification_bussinesUser.deviceType,
                              device_token:find_notification_bussinesUser.deviceToken,
                              role:3,
                              type:0,                     //booking
                              job_id:findbussinessUser.id
                            }
                            // console.log("00000000000000000000000000000000000000000",locationUserDeviceToken);
                            if (find_notification_bussinesUser.notification==1) {
                            await helper.sendPushNotificationTifiFunction(bussinessUserDeviceToken);
                              
                            }
                          }
                    
                          // console.log(booking_find, "======");
                          var msg = "Booking succcessfully";
                          res.status(200).json({
                            success: 1,
                            code: 200,
                            msg: msg,
                            body: booking_find
                          });
            
                        }
                    }
                });
            }
        });
     
    } catch (error) {
      return helper.error(res, error);
    }
  },

  my_booking: async function(req, res) {
    try {
      const required = {
        action: req.body.action,
        role: req.body.role
      };
      const non_required = {
        currend_date: req.body.currend_date
        // userId: req.body.userId
      };
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      console.log("---------------------------,",requestdata.action);

      requestdata.action = requestdata.action.split(",");
      // console.log("---------------------------,",gender_ar);
      
      // const nowdate = moment().unix();
      // console.log("date",nowdate);
      if (requestdata.role && requestdata.role == 1) {
        var get_bookings = await bookings.findAll({
          attributes: [
            `id`,
            `order_id`,
            `serviceProviderId`,
            `bussinessUserId`,
            `categoryId`,
            `locationOwnerId`,
            `locationUserId`,
            `userId`,
            `cardId`,
            `location`,
            `lat`,
            `lng`,
            `startBookingDate`,
            `endBookingDate`,
            `status`,
            `status2`,
            `createdAt`,
            `updatedAt`,
          ],
          where: {
            userId: req.user.id,
            // status: requestdata.action,
            [Op.or]: [{status: requestdata.action,}, {status2: requestdata.action,}],
            // status2: requestdata.action,
            startBookingDate: {
              [Op.gte]: requestdata.currend_date
            }
          },
          include: [
            {
              attributes: [
                `id`,
                `role`,
                `firstName`,
                `lastName`,
                `username`,
                `email`,
                `image`
              ],
              model: user,
              required: false,
              // include: [
              //   {
              //     attributes: [
              //       `id`,
              //       `userId`,
              //       `name`,
              //       `image`,
              //       `location`,
              //       `latitude`,
              //       `longitude`
              //     ],

              //     model: user_detail,
              //     required: false
              //   }
              // ]
            },
            // {
            //   model: bankDetail,
            //   required: false,

            // },
            // {
            //   model: category,
            //   required: false,
            // },
            {
              attributes: [
                `id`,
                `userId`,
                [sequelize.literal('(SELECT username FROM user WHERE businessProfessionalDetail.userId = user.id )'), 'username'],
                [sequelize.literal('(SELECT image FROM user WHERE businessProfessionalDetail.userId = user.id )'), 'userImage'],
                // [sequelize.literal('ifnull((SELECT AVG(rating) FROM reviews WHERE businessId = businessProfessionalDetail.id ), "0.0")'), 'avgRating'],
                [
                  sequelize.literal(
                    "ifnull((truncate((SELECT AVG(rating) FROM reviews WHERE businessId = businessProfessionalDetail.id), 1) ), '0.0')"
                  ),
                  "avgRating"
                ],
                `categoryId`,
                `businessName`,
                `location`,
                `about`,
                
              ],

              model: business_prof,
              required: false,
              include: [
                {
                  model: reviews,
                  required: false,
                  on: {
                    col1: sequelize.where(
                      sequelize.col(`businessProfessionalDetail.id`),
                      "=",
                      sequelize.col(
                        `businessProfessionalDetail.reviews.businessId`
                      )
                    )
                  }
                }
              ]
            },

            {
              attributes: [
                `id`,
               `userId`,
               `loc_country_code`, `loc_phone`, `loc_email`,
               [sequelize.literal('(SELECT username FROM user WHERE locationOwnerDetail.userId = user.id )'), 'username'],
              [sequelize.literal('(SELECT image FROM user WHERE locationOwnerDetail.userId = user.id )'), 'userImage'],
              // [sequelize.literal('ifnull((SELECT AVG(rating) FROM reviews WHERE businessId = locationOwnerDetail.id ), "0.0")'), 'avgRating'],
              [
                sequelize.literal(
                  "ifnull((truncate((SELECT AVG(rating) FROM reviews WHERE businessId = locationOwnerDetail.id), 1) ), '0.0')"
                ),
                "avgRating"
              ], 
              `adress`,
              ['adress', 'locationName'], `location`, `about`,
              ],

              model: locationOwnerDetail,
              include: [
                {
                  model: reviews,
                  required: false,
                  on: {
                    col1: sequelize.where(
                      sequelize.col(`locationOwnerDetail.id`),
                      "=",
                      sequelize.col(`locationOwnerDetail.reviews.businessId`)
                    )
                  }
                }
              ]
            }
          ],
          order: [['id', 'DESC']],
          required: false,

          // raw: true,
          // nest: true
        });
      }

      if (requestdata.role && requestdata.role == 2) {
        // console.log(
        //   "--------------------------------------------22222222222222222222222222---------------------------"
        // );

        var get_bookings = await bookings.findAll({
          attributes: [
            `id`,
            `order_id`,
            `serviceProviderId`,
            `bussinessUserId`,
            `categoryId`,
            `locationOwnerId`,
            `locationUserId`,
            `userId`,
            `cardId`,
            `startBookingDate`,
            `endBookingDate`,
            `status`,
            `status2`,
            `createdAt`,
            `updatedAt`,
          ],
          where: {
            locationUserId: req.user.id,
            status: requestdata.action,
            startBookingDate: {
              [Op.gte]: requestdata.currend_date
            }
          },
          include: [
            {
              attributes: [
                `id`,
                `role`,
                `status`,
                `notification`,
                `firstName`,
                `lastName`,
                `username`,
                `email`,
                `phone`,
                `country_code`,
                `image`
              ],
              model: user,
              required: false,
              on: {
                col1: sequelize.where(
                  sequelize.col(`user.id`),
                  "=",
                  sequelize.col(`bookings.userId`)
                )
              },
            },
            // {
            //   model: user,as: "locationUser",
            //   required: false,

            //   include: [
            //     {
            //       model: user_detail,
            //       required: false,
            //       include: [
            //         {
            //           model: locationOwnerDetailImage,
            //           required: false
            //         }
            //       ]
            //     }
            //   ]
            // },
            {
              attributes: [
                `id`, `userId`, ['adress', 'locationName'], `name`, `adress`, `isFav`, `image`, `location`, `latitude`, `longitude`, `hourOfOpration`, `PricePerDay`, `offrerPricePerDay`, `offers`, `about`, `createdAt`, `updatedAt`, `loc_country_code`, `loc_phone`, `loc_email`,
                [sequelize.literal('ifnull((truncate((SELECT AVG(rating) FROM reviews WHERE businessId = locationOwnerDetail.id), 1) ), "0.0")'), 'avgRating'],

              ],
              model: locationOwnerDetail,
              required: false,
              on: {
                col1: sequelize.where(
                  sequelize.col(`locationOwnerDetail.id`),
                  "=",
                  sequelize.col(`bookings.locationOwnerId`)
                )
              }
            }
          ]
          // raw: true,
          // nest: true
        });
        var jjfjf =get_bookings.length
        console.log("44444444444444444444444444444444",jjfjf);
        
      }

      if (requestdata.role && requestdata.role == 3) {
        // console.log(
        //   "--------------------------------------------22222222222222222222222222---------------------------"
        // );

        var get_bookings = await bookings.findAll({
          attributes: [
            `id`,
            `order_id`,
            `serviceProviderId`,
            `bussinessUserId`,
            `categoryId`,
            `locationOwnerId`,
            `locationUserId`,
            `userId`,
            `cardId`,
            `startBookingDate`,
            `endBookingDate`,
            `status`,
            `status2`,
            `createdAt`,
            `updatedAt`,
          ],
          where: {
            bussinessUserId: req.user.id,
            status2: requestdata.action,
            startBookingDate: {
              [Op.gte]: requestdata.currend_date
            }
          },
          include: [
            {
              attributes:[`id`, `role`, `verified`, `status`,  `firstName`, `lastName`, `username`, `email`,`phone`,`country_code`, `image`, `created`, `updated`, `createdAt`, `updatedAt`,],
              model: user,
              required: false,
              on: {
                col1: sequelize.where(
                  sequelize.col(`user.id`),
                  "=",
                  sequelize.col(`bookings.userId`)
                )
              },
              // include: [
              //   {
              //     model: user_detail,
              //     required: false,
              //     include: [
              //       {
              //         model: businessImage,
              //         required: false
              //       }
              //     ]
              //   }
              // ]
            },
            // {
            //   model: category,
            //   required: false
            // },
            // {
            //   model: user,
            //   as: "locationUser",
            //   required: false,

            //   include: [
            //     {
            //       model: user_detail,
            //       required: false,
            //       include: [
            //         {
            //           model: businessImage,
            //           required: false
            //         }
            //       ]
            //     }
            //   ]
            // },
            {


              attributes:[`id`, `userId`, `categoryId`, `name`,  `businessName`, `businessPhone`, `businessEmail`, `countryCode`, `adress`,  `location`, `zipCode`, `apt`, `city`, `state`, `latitude`, `longitude`, `about`, `lastName`, `firstName`, `gender`, `isFav`, `speciality`, `isShowAddressOther`, `hourOfOprations`, `pricePerService`, `offers`, `offerPrice`, `created`, `updated`, `updatedAt`, `createdAt`,
                [sequelize.literal('ifnull((SELECT name FROM category WHERE id = businessProfessionalDetail.categoryId ), 0)'), 'categoryName'],
              ],
              model: business_prof,
              required: false,
                  include: [
                    {
                      model: businessImage,
                      required: false
                    }
                  ]
            }
          ],
          raw: true,
          nest: true
        });
        console.log("99999999999999999999999999999999999999999",get_bookings);
        
      }

      // var newJsoon = get_bookings.toJSON();
      // console.log(get_bookings);
      // return false;

      var msg = "My bookings";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: get_bookings
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },
  jobReqAcceptOrReject: async function(req, res) {
    try {
      const required = {
        role: req.body.role,
        jobReqID: req.body.jobReqID
      };
      const non_required = {
        status: req.body.status,
        status2: req.body.status2,
        // userId: req.body.userId
      };
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      const roleBasedlocation = {
        1: {
          message: 'Location accepted this job',
        },
        2: {
          message: 'Reject booking',
        },
        3: {
          message: 'Complet job',
        }
      }
      const roleBasedbussiness = {
        1: {
          message: 'Bussines accepted this job',
        },
        2: {
          message: 'Reject booking',
        },
        3: {
          message: 'Complet job',
        }
      }
      var find_booking_detale = await bookings.findOne({
        attributes: [`id`, `order_id`, `serviceProviderId`, `bussinessUserId`, `categoryId`, `locationOwnerId`, `locationUserId`, `userId`, `cardId`, `location`, `lat`, `lng`, `startBookingDate`, `endBookingDate`, `status`,`status2`, `createdAt`, `updatedAt`],
          where: {
            id: requestdata.jobReqID
          }
        });
        var find_user_detale = await user.findOne({
          attributes: [`id`, `role`, `status`, `notification`, `username`, `image`, `deviceType`, `deviceToken`,
          [sequelize.literal('(SELECT adress FROM locationOwnerDetail WHERE '+find_booking_detale.locationOwnerId+' = locationOwnerDetail.id )'), 'locationName'],
          [sequelize.literal('(SELECT businessName FROM businessProfessionalDetail WHERE '+find_booking_detale.serviceProviderId+' = businessProfessionalDetail.id )'), 'bussinesName']
         ],
          where: {
            id: find_booking_detale.userId
          },
          raw:true
        });
        console.log("99999999999999999999999999999999999",find_user_detale);
        // return
        // var find_location_detale = await locationOwnerDetail.findOne({
        //   where: {
        //     id: find_booking_detale.locationOwnerId
        //   }
        // });
      if (requestdata.role && requestdata.role == 1) {
        var get_bookings = await bookings.update(
          {
            status: requestdata.status,
            status2: requestdata.status2
          },
          {
            where: {
              userId: req.user.id,
              id: requestdata.jobReqID
            }
          }
        );
        let get_card_payment = await card_payment.update(
          {
            statuslocation: requestdata.status,
            statusbusines: requestdata.status2
          },
          {
            where: {
              userId: req.user.id,
              booking_id: requestdata.jobReqID
            }
          }
        );
      }
      if (requestdata.role && requestdata.role == 2) {
        var get_bookings = await bookings.update(
          {
            status: requestdata.status
          },
          {
            where: {
              locationUserId: req.user.id,
              id: requestdata.jobReqID
            }
          }
        );
        let get_card_payment = await card_payment.update(
          {
            statuslocation: requestdata.status,
          },
          {
            where: {
              locationUserId: req.user.id,
              booking_id: requestdata.jobReqID
            }
          }
        );
        var AcceptOrRejectlocation = {
          name: roleBasedlocation[requestdata.status].message+" "+ find_user_detale.locationName,
          user_name:find_user_detale.username,
          device_type:find_user_detale.deviceType,
          device_token:find_user_detale.deviceToken,
          role:req.user.role,
          type:requestdata.status,                              //1 accept 5 for rating
          job_id:find_booking_detale.locationOwnerId,
          order_id:find_booking_detale.order_id,
        }
        var jsonData = JSON.stringify(AcceptOrRejectlocation);

        let create_notification = await notification.create({
          senderId: req.user.id,
          receiverId: find_booking_detale.userId,
          message: roleBasedlocation[requestdata.status].message+ ' '+find_user_detale.locationName,
          data: jsonData,
          isRead: 0,
          notificationType: requestdata.status
        });
        // console.log("000000000000000000000000000000",AcceptOrRejectlocation);
        // console.log("000000000000000000000000000000",find_user_detale.notification);
        
        if (find_user_detale.notification==1) {
        // console.log("000000000000000000000000000000",);
          
          await helper.sendPushNotificationTifiFunction(AcceptOrRejectlocation);
          
        } 
        // else if (find_user_detale.notification==1) {
        //   await helper.sendPushNotificationTifiFunction(AcceptOrRejectlocation);
          
        // }

      }
      if (requestdata.role && requestdata.role == 3) {
        var get_bookings = await bookings.update(
          {
            status2: requestdata.status2
          },
          {
            where: {
              bussinessUserId: req.user.id,
              id: requestdata.jobReqID
            }
          }
        );
        let get_card_payment = await card_payment.update(
          {
            statusbusines: requestdata.status,
          },
          {
            where: {
              bussinessUserId: req.user.id,
              booking_id: requestdata.jobReqID
            }
          }
        );
        var AcceptOrRejectbussines = {
          name:roleBasedbussiness[requestdata.status2].message +" "+ find_user_detale.bussinesName,
          user_name:find_user_detale.username,
          device_type:find_user_detale.deviceType,
          device_token:find_user_detale.deviceToken,
          role:req.user.role,
          type:requestdata.status2,                              //1 accept 5 for rating
          job_id:find_booking_detale.serviceProviderId,
          order_id:find_booking_detale.order_id,
        }
        var jsonData = JSON.stringify(AcceptOrRejectbussines);

        let create_notification = await notification.create({
          senderId: req.user.id,
          receiverId: find_booking_detale.userId,
          message: roleBasedbussiness[requestdata.status2].message +" "+ find_user_detale.bussinesName,
          data: jsonData,
          isRead: 0,
          notificationType: requestdata.status2
        });
        console.log("000000000000000000000000000000",AcceptOrRejectbussines);

        if (find_user_detale.notification==1) {
          await helper.sendPushNotificationTifiFunction(AcceptOrRejectbussines);
          
        } 
        // else if (find_user_detale.notification==1)  {
        //   await helper.sendPushNotificationTifiFunction(AcceptOrRejectbussines);
          
        // }
      }
      var msg = "My Bookings or Job request status update succesfully";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: find_booking_detale
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },
  jobRequestDetail: async function(req, res) {
    try {
      const required = {
        role: req.body.role,
        jobReqID: req.body.jobReqID
      };
      const non_required = {
        // userId: req.body.userId
      };
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      if (requestdata.role && requestdata.role == 1) {
        var get_bookings = await bookings.findAll({
          where: {
            userId: req.user.id,
            id: requestdata.jobReqID
          },
          include: [
            {
              model: user,
              required: false,
              include: [
                {
                  model: user_detail,
                  required: false,
                  include: [
                    {
                      model: locationOwnerDetailImage,
                      required: false
                    }
                  ]
                }
              ]
            },
            {
              model: bankDetail,
              required: false
            },
            {
              model: category,
              required: false
            },
            {
              model: business_prof,
              required: false,
              include: [
                {
                  model: reviews,
                  required: false,
                  on: {
                    col1: sequelize.where(
                      sequelize.col(`businessProfessionalDetail.id`),
                      "=",
                      sequelize.col(
                        `businessProfessionalDetail.reviews.businessId`
                      )
                    )
                  }
                }
              ]
            },

            {
              attributes:[`id`, `userId`, `isFav`, ['adress', 'locationName'], `adress`, `image`, `location`, `latitude`, `longitude`, `PricePerDay`, `offrerPricePerDay`, `offers`, `about`, `loc_country_code`, `loc_phone`, `loc_email`, `createdAt`, `updatedAt`,],
              model: locationOwnerDetail,
              include: [
                {
                  model: reviews,
                  required: false,
                  on: {
                    col1: sequelize.where(
                      sequelize.col(`locationOwnerDetail.id`),
                      "=",
                      sequelize.col(`locationOwnerDetail.reviews.businessId`)
                    )
                  }
                }
              ]
            }
          ]
          // raw: true,
          // nest: true
        });
      }

      if (requestdata.role && requestdata.role == 2) {
        // console.log(
        //   "--------------------------------------------22222222222222222222222222---------------------------"
        // );

        var get_bookings = await bookings.findAll({
          attributes: [
            `id`,
            `serviceProviderId`,
            `bussinessUserId`,
            `categoryId`,
            `order_id`,
            `locationOwnerId`,
            `locationUserId`,
            `userId`,
            `cardId`,
            `location`,
            `lat`,
            `lng`,
            `startBookingDate`,
            `endBookingDate`,
            `status`,
            `status2`,
            `createdAt`
          ],
          where: {
            locationUserId: req.user.id,
            id: requestdata.jobReqID
          },
          include: [
            {
              model: user,
              required: false,
              on: {
                col1: sequelize.where(
                  sequelize.col(`user.id`),
                  "=",
                  sequelize.col(`bookings.userId`)
                )
              },
              include: [
                {
                  model: user_detail,
                  required: false,
                 
                }
              ]
            },
            {
              model: user,
              as: "locationUser",
              required: false,

              include: [
                {
                  model: user_detail,
                  required: false,
                  
                }
              ]
            },
            {
              attributes:[`id`, `userId`, `isFav`, ['adress', 'locationName'], `adress`, `image`, `location`, `latitude`, `longitude`, `PricePerDay`, `offrerPricePerDay`, `offers`, `about`, `loc_country_code`, `loc_phone`, `loc_email`, `createdAt`, `updatedAt`,],
              model: locationOwnerDetail,
              required: false
            }
          ]
          // raw: true,
          // nest: true
        });
      }

      if (requestdata.role && requestdata.role == 3) {
        // console.log(
        //   "--------------------------------------------333333333333333333333333333---------------------------"
        // );

        var get_bookings = await bookings.findAll({
          attributes: [
            `id`,
            `serviceProviderId`,
            `bussinessUserId`,
            `categoryId`,
            `locationOwnerId`,
            `order_id`,
            `locationUserId`,
            `userId`,
            `cardId`,
            `location`,
            `lat`,
            `lng`,
            `startBookingDate`,
            `endBookingDate`,
            `status`,
            `status2`,
            `createdAt`
          ],
          where: {
            bussinessUserId: req.user.id,
            id: requestdata.jobReqID
          },
          include: [
            {
              model: user,
              required: false,
              on: {
                col1: sequelize.where(
                  sequelize.col(`user.id`),
                  "=",
                  sequelize.col(`bookings.userId`)
                )
              },
              include: [
                {
                  model: user_detail,
                  required: false,
                  include: [
                    {
                      model: businessImage,
                      required: false
                    }
                  ]
                }
              ]
            },
            {
              model: category,
              required: false
            },
            {
              model: user,
              as: "locationUser",
              required: false,

              include: [
                {
                  model: user_detail,
                  required: false,
                  include: [
                    {
                      model: businessImage,
                      required: false
                    }
                  ]
                }
              ]
            },
            {
              model: business_prof,
              required: false
            }
          ]
          // raw: true,
          // nest: true
        });
      }

      // var newJsoon = get_bookings.toJSON();
      // console.log(get_bookings);
      // return false;

      var msg = "My bookings";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: get_bookings
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },

  myServicesOrLocations: async function(req, res) {
    try {
      const required = {
        // action: req.body.action,
        role: req.body.role
      };
      const non_required = {};
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );

      if (requestdata.role && requestdata.role == 2) {
        // console.log(
        //   "--------------------------------------------22222222222222222222222222---------------------------"
        // );

        var get_bookings = await user.findOne({
          attributes: [
            `id`,
            `role`,
            `firstName`,
            `lastName`,
            `username`,
            `email`,
            `phone`,
            `country_code`,
            `image`,
            `socialId`,
            `socialType`,
            `deviceType`,
            `deviceToken`
          ],
          where: {
            id: req.user.id,
            role: 2
            // status: 1,
          },
          include: [
            {
              attributes:[`id`, `userId`, `isFav`, ['adress', 'locationName'], `adress`, `image`, `location`, `latitude`, `longitude`, `PricePerDay`, `offrerPricePerDay`, `offers`, `about`,`loc_country_code`, `loc_phone`,`loc_email`, `createdAt`, `updatedAt`,],
              model: locationOwnerDetail,
              required: false,
              include: [
                {
                  model: locationOwnerDetailImage,
                  required: false
                }
              ]
            }
          ]
          // raw: true,
          // nest: true,
          // required: false
        });
      }
      console.log(
        "--------------------------------------------22222222222222222222222222---------------------------",
        get_bookings
      );

      if (requestdata.role && requestdata.role == 3) {
        console.log(
          "--------------------------------------------22222222222222222222222222---------------------------"
        );

        var get_bookings = await user.findOne({
          attributes: [
            `id`,
            `role`,
            `firstName`,
            `lastName`,
            `username`,
            `email`,
            `phone`,
            `country_code`,
            `image`,
            `socialId`,
            `socialType`,
            `deviceType`,
            `deviceToken`
          ],
          where: {
            id: req.user.id,
            role: 3
          },
          include: [
            // {
            //   model: category,
            //   required: false,
            // },

            {
              model: business_prof,
              attributes: [
                `id`,
                `userId`,
                `categoryId`,
                `name`,
                `image`,
                `businessName`,
                `businessPhone`,
                `businessEmail`,
                `countryCode`,
                `adress`,
                `bannerImage`,
                `location`,
                `latitude`,
                `longitude`,
                `about`,
                `lastName`,
                `firstName`,
                `gender`,
                `hourOfOprations`,
                `pricePerService`,
                `offers`,
                `offerPrice`
              ],
              required: false,
              include: [
                {
                  model: businessImage,
                  required: false
                }
              ]
            }
          ]
          // raw: true,
          // nest: true
        });
      }
      var msg = "My Services Or Locations";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: get_bookings
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },

  myServiceOrLocationDetail: async function(req, res) {
    try {
      const required = {
        ServiceOrLocationId: req.body.ServiceOrLocationId,
        role: req.body.role
      };
      const non_required = {};
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );

      if (requestdata.role && requestdata.role == 2) {
        console.log(
          "--------------------------------------------22222222222222222222222222---------------------------"
        );

        var get_bookings_detale = await locationOwnerDetail.findOne({
          attributes: [
            `id`,
            `userId`,
            ['adress', 'locationName'],
            `name`,
            `adress`,
            `image`,
            `location`,
            `latitude`,
            `longitude`,
            `hourOfOpration`,
            `PricePerDay`,
            `offrerPricePerDay`,
            `offers`,
            `about`,
            `isFav`,
            `loc_country_code`, `loc_phone`, `loc_email`,
            `createdAt`,
            `updatedAt`,
            [sequelize.literal('(SELECT username FROM user WHERE locationOwnerDetail.userId = user.id )'), 'username'],
            [sequelize.literal('ifnull((SELECT is_fav FROM favourite WHERE favourite.locationId = '+requestdata.ServiceOrLocationId+' AND favourite.favBy = '+req.user.id+'), 0)'), 'isLike'],
            [sequelize.literal('(SELECT case when count(id)=0 then 0 else 1 end as countss FROM `bookings` WHERE `locationOwnerId`= '+requestdata.ServiceOrLocationId+'  AND bookings.userId = '+req.user.id+' AND bookings.status = 1)'), 'is_booked']
           

          ],
          where: {
            id: req.body.ServiceOrLocationId
            // userId: req.user.id
            // status: 1,
          },
          include: [
            {
              model: locationOwnerDetailImage,
              required: false
            },
            {
              attributes: [
                `id`, `userId`, `businessId`, `rating`, `role`, `review`, `created`, `updated`, `createdAt`, `updatedAt`,
                [
                  sequelize.literal(
                    "(SELECT username FROM user WHERE user.id = reviews.userId )"
                  ),
                  "UserName"
                ],
                [
                  sequelize.literal(
                    "(SELECT image FROM user WHERE user.id = reviews.userId )"
                  ),
                  "UserImage"
                ]
              ],
              model: reviews,
              required: false,
              on: {
                col1: sequelize.where(
                  sequelize.col(`locationOwnerDetail.id`),
                  "=",
                  sequelize.col(`reviews.businessId`)
                )
              }
            }
          ]

          // raw: true,
          // nest: true,
          // required: false
        });
      }
      // console.log("--------------------------------------------22222222222222222222222222---------------------------",get_bookings_detale);

      if (requestdata.role && requestdata.role == 3) {
        // console.log("--------------------------------------------33333333333333333333333333333---------------------------");

        var get_bookings_detale = await business_prof.findOne({
          attributes: [
            `id`,
            `userId`,
            `categoryId`,
            `businessName`,
            `businessPhone`,
            `businessEmail`,
            `location`,
            `countryCode`,
            `adress`,
            `latitude`,
            `longitude`,
            `about`,
            `isFav`,
            `hourOfOprations`,
            `pricePerService`,
            `createdAt`,
            `updatedAt`,
            `offers`,
            `offerPrice`,
            [sequelize.literal('ifnull((SELECT is_fav FROM favourite WHERE favourite.businessId = '+requestdata.ServiceOrLocationId+' AND favourite.favBy = '+req.user.id+'), 0)'), 'isLike'],
            [sequelize.literal('(SELECT case when count(id)=0 then 0 else 1 end as countss FROM `bookings` WHERE `serviceProviderId`= '+requestdata.ServiceOrLocationId+'  AND bookings.userId = '+req.user.id+' AND bookings.status = 1)'), 'is_booked']
          ],
          where: {
            id: req.body.ServiceOrLocationId
            // userId: req.user.id
          },
          include: [
            {
              model: businessImage,
              required: false
            },
            {
              attributes: [
                `id`,
                `userId`,
                `businessId`,
                `rating`,
                `role`,
                `review`,
                `created`,
                `updated`,
                `createdAt`,
                `updatedAt`,
                [
                  sequelize.literal(
                    "(SELECT username FROM user WHERE user.id = reviews.userId )"
                  ),
                  "UserName"
                ],
                [
                  sequelize.literal(
                    "(SELECT image FROM user WHERE user.id = reviews.userId )"
                  ),
                  "UserImage"
                ]
              ],
              model: reviews,
              required: false,
              on: {
                col1: sequelize.where(
                  sequelize.col(`businessProfessionalDetail.id`),
                  "=",
                  sequelize.col(`reviews.businessId`)
                )
              }
            }
            // {
            //   model: category,
            //   required: false,
            // },
          ]
          // include:[
          //   {
          //     model: reviews,
          //     required: false ,
          //     on: {
          //       col1: sequelize.where(sequelize.col(`businessProfessionalDetail.id`), '=', sequelize.col(`businessProfessionalDetail.reviews.businessId`)),
          //     },
          //   }
          // ]
          // raw: true,
          // nest: true
        });
      }
      var msg = "My Services Or Locations detale";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: get_bookings_detale
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },
  //////////location_signup apis///////////////////////

  //  location_signup: async function (req, res) {
  //   try {
  //     const required = {

  //       firstName: req.body.firstName,
  //       lastName: req.body.lastName,
  //       email: req.body.email,
  //       role: 2,
  //       phone: req.body.phone,

  //     };
  //     const non_required = {
  //       security_key: req.headers.security_key,
  //       device_token: req.body.device_token,
  //       device_type: req.body.device_type,
  //       image: req.body.image,
  //       latitude: req.body.latitude,
  //       longitude: req.body.longitude,
  //       country_code: req.body.country_code,
  //       socialId: req.body.socialId,
  //       socialType: req.body.socialType, // 1 => facebook, 2 => google
  //       password: req.body.password,
  //       location: req.body.location,
  //       gender: req.body.gender, //1= male, 2=female,3=other,4=prefer not to awnser

  //     };
  //     let requestdata = await helper.vaildObjectUser(required, non_required, res);

  //     let check_email_pass = await user.count({
  //       where: {
  //         email: req.body.email,

  //       },
  //     })
  //     var randomNumber = Math.floor(1000 + Math.random() * 9000);
  //     // console.log(check_email_pass,'jnj=====');return false;
  //     if (check_email_pass > 0) {
  //       let msg = 'Email already exist';
  //       res.status(400).json({
  //         'success': 0,
  //         'code': 400,
  //         'msg': msg,
  //         'body': [],
  //       });
  //       return false;
  //     }
  //     let check_phone_pass = await user.count({
  //       where: {
  //         phone: req.body.phone,
  //       },
  //     })
  //     // console.log(check_email_pass,'jnj=====');return false;
  //     if (check_phone_pass > 0) {
  //       let msg = 'phone already exist';
  //       res.status(400).json({
  //         'success': 0,
  //         'code': 400,
  //         'msg': msg,
  //         'body': [],
  //       });
  //       return false;
  //     }
  //     // let profileImage = requestdata.profileImage;
  //     // console.log(profileImage, 'profileImage=====')
  //     // if (requestdata.profileImage) {
  //     //   profileImage = await helper.imageUpload(requestdata.profileImage, 'user');
  //     // }

  //     // let bannerImage = requestdata.bannerImage;
  //     // console.log(profileImage, 'profileImage=====')
  //     // if (requestdata.bannerImage) {
  //     //   bannerImage = await helper.imageUpload(requestdata.bannerImage, 'business');
  //     // }

  //     var auth_create = crypto.randomBytes(20).toString('hex');
  //     let hashdata = bcrypt.hashSync(req.body.password, salt);
  //     hash = hashdata.replace('$2b$', '$2y$');
  //     let create_user = await user.create({
  //       email: req.body.email,
  //       role: 2,
  //       password: hash,
  //       phone: req.body.phone,
  //       country_code: req.body.country_code,
  //       deviceToken: req.body.device_token,
  //       deviceType: req.body.device_type,
  //       // image: requestdata.profileImage,
  //       socialId: req.body.socialId,
  //       socialType: req.body.socialType,
  //       otp: randomNumber

  //     })
  // console.log("--------------------------------------------------------------------");

  //     let logo = 'http://' + req.get('host') + '/uploads/logo.png';
  //     // console.log(logo, '===================================here'); return

  //     let html = `<body class="body" style="padding:0 !important; margin:0 auto !important; display:block !important; min-width:100% !important; width:100% !important; background:#f4ecfa; -webkit-text-size-adjust:none;">
  //     <center>
  //       <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0; padding: 0; width: 100%; height: 100%;" bgcolor="#f4ecfa" class="gwfw">
  //         <tr>
  //           <td style="margin: 0; padding: 0; width: 100%; height: 100%;" align="center" valign="top">
  //             <table width="600" border="0" cellspacing="0" cellpadding="0" class="m-shell">
  //               <tr>
  //                 <td class="td" style="width:600px; min-width:600px; font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal;">
  //                   <table width="100%" border="0" cellspacing="0" cellpadding="0">
  //                     <tr>
  //                       <td class="mpx-10">
  //                         <!-- Top -->
  //                         <table width="100%" border="0" cellspacing="0" cellpadding="0">
  //                             <tr>
  //                               <td class="text-12 c-grey l-grey a-right py-20" style="font-size:12px; line-height:16px; font-family:'PT Sans', Arial, sans-serif; min-width:auto !important; color:#6e6e6e; text-align:right; padding-top: 20px; padding-bottom: 20px;">
  //                                 <a href="#" target="_blank" class="link c-grey" style="text-decoration:none; color:#6e6e6e;"><span class="link c-grey" style="text-decoration:none; color:#6e6e6e;">View this email in your browser</span></a>
  //                               </td>
  //                             </tr>
  //                           </table>											<!-- END Top -->

  //                         <!-- Container -->
  //                         <table width="100%" border="0" cellspacing="0" cellpadding="0">
  //                           <tr>
  //                             <td class="gradient pt-10" style="border-radius: 10px 10px 0 0; padding-top: 10px;" bgcolor="#26c5f8">
  //                               <table width="100%" border="0" cellspacing="0" cellpadding="0">
  //                                 <tr>
  //                                   <td style="border-radius: 10px 10px 0 0;" bgcolor="#ffffff">
  //                                     <!-- Logo -->
  //                                     <table width="100%" border="0" cellspacing="0" cellpadding="0">
  //                                       <tr>
  //                                         <td class="img-center p-30 px-15" style="font-size:0pt; line-height:0pt; text-align:center; padding: 30px; padding-left: 15px; padding-right: 15px;">
  //                                           <a href="#" target="_blank"><img src="${logo}" width="230"  border="0" alt="" /></a>
  //                                         </td>
  //                                       </tr>
  //                                     </table>
  //                                     <!-- Logo -->

  //                                     <!-- Main -->
  //                                     <table width="100%" border="0" cellspacing="0" cellpadding="0">
  //                                       <tr>
  //                                         <td class="px-50 mpx-15" style="padding-left: 50px; padding-right: 50px;">
  //                                           <!-- Section - Intro -->
  //                                           <table width="100%" border="0" cellspacing="0" cellpadding="0">
  //                                             <tr>
  //                                               <td class="pb-50" style="padding-bottom: 50px;">
  //                                                 <table width="100%" border="0" cellspacing="0" cellpadding="0">

  //                                                   <tr>
  //                                                     <td class="title-36 a-center pb-15" style="font-size:36px; line-height:40px; color:#282828; font-family:'PT Sans', Arial, sans-serif; min-width:auto !important; text-align:center; padding-bottom: 15px;">
  //                                                       <strong>Activate with Code</strong>
  //                                                     </td>
  //                                                   </tr>

  //                                                   <tr>
  //                                                     <td class="pb-30" style="padding-bottom: 30px;">
  //                                                       <table width="100%" border="0" cellspacing="0" cellpadding="0">
  //                                                         <tr>
  //                                                           <td class="title-22 a-center py-20 px-50 mpx-15" style="border-radius: 10px; border: 1px dashed #b4b4d4; font-size:22px; line-height:26px; color:#282828; font-family:'PT Sans', Arial, sans-serif; min-width:auto !important; text-align:center; padding-top: 20px; padding-bottom: 20px; padding-left: 50px; padding-right: 50px;" bgcolor="#f4ecfa">
  //                                                             <strong>USE CODE : <span class="c-purple" style="color:#9128df;">
  //                                                             ${randomNumber}</span></strong>
  //                                                           </td>
  //                                                         </tr>
  //                                                       </table>
  //                                                     </td>
  //                                                   </tr>

  //                                                 </table>
  //                                               </td>
  //                                             </tr>
  //                                           </table>
  //                                           <!-- END Section - Intro -->
  //                                         </td>
  //                                       </tr>
  //                                     </table>
  //                                     <!-- END Main -->
  //                                   </td>
  //                                 </tr>
  //                               </table>
  //                             </td>
  //                           </tr>
  //                         </table>
  //                         <!-- END Container -->

  //                         <!-- Footer -->
  //                         <table width="100%" border="0" cellspacing="0" cellpadding="0">
  //                             <tr>
  //                               <td class="p-50 mpx-15" bgcolor="#26c5f8" style="border-radius: 0 0 10px 10px; padding: 50px;">
  //                                 <table width="100%" border="0" cellspacing="0" cellpadding="0">
  //                                   <tr>
  //                                     <td align="center" class="pb-20" style="padding-bottom: 20px;">
  //                                       <!-- Socials -->
  //                                       <table border="0" cellspacing="0" cellpadding="0">
  //                                         <tr>
  //                                           <td class="img" width="34" style="font-size:0pt; line-height:0pt; text-align:left;">
  //                                             <a href="#" target="_blank"><img src=" f.png" width="34" height="34" border="0" alt="" /></a>
  //                                           </td>
  //                                           <td class="img" width="15" style="font-size:0pt; line-height:0pt; text-align:left;"></td>
  //                                           <td class="img" width="34" style="font-size:0pt; line-height:0pt; text-align:left;">
  //                                             <a href="#" target="_blank"><img src="g.png" width="34" height="34" border="0" alt="" /></a>
  //                                           </td>
  //                                           <td class="img" width="15" style="font-size:0pt; line-height:0pt; text-align:left;"></td>
  //                                           <td class="img" width="34" style="font-size:0pt; line-height:0pt; text-align:left;">
  //                                             <a href="#" target="_blank"><img src="t.png" width="34" height="34" border="0" alt="" /></a>
  //                                           </td>
  //                                           <td class="img" width="15" style="font-size:0pt; line-height:0pt; text-align:left;"></td>
  //                                           <td class="img" width="34" style="font-size:0pt; line-height:0pt; text-align:left;">
  //                                             <a href="#" target="_blank"><img src="p.png" width="34" height="34" border="0" alt="" /></a>
  //                                           </td>
  //                                         </tr>
  //                                       </table>
  //                                       <!-- END Socials -->
  //                                     </td>
  //                                   </tr>
  //                                   <tr>
  //                                     <td class="text-14 lh-24 a-center c-white l-white pb-20" style="font-size:14px; font-family:'PT Sans', Arial, sans-serif; min-width:auto !important; line-height: 24px; text-align:center; color:#ffffff; padding-bottom: 20px;">
  //                                       Address name St. 12, City Name, State, Country Name
  //                                       <br />
  //                                       <a href="tel:+17384796719" target="_blank" class="link c-white" style="text-decoration:none; color:#ffffff;"><span class="link c-white" style="text-decoration:none; color:#ffffff;">(738) 479-6719</span></a> - <a href="tel:+13697181973" target="_blank" class="link c-white" style="text-decoration:none; color:#ffffff;"><span class="link c-white" style="text-decoration:none; color:#ffffff;">(369) 718-1973</span></a>
  //                                       <br />
  //                                       <a href="mailto:info@website.com" target="_blank" class="link c-white" style="text-decoration:none; color:#ffffff;"><span class="link c-white" style="text-decoration:none; color:#ffffff;">info@website.com</span></a> - <a href="www.website.com" target="_blank" class="link c-white" style="text-decoration:none; color:#ffffff;"><span class="link c-white" style="text-decoration:none; color:#ffffff;">www.website.com</span></a>
  //                                     </td>
  //                                   </tr>

  //                                 </table>
  //                               </td>
  //                             </tr>
  //                           </table>											<!-- END Footer -->

  //                         <!-- Bottom -->
  //                         <table width="100%" border="0" cellspacing="0" cellpadding="0">
  //                             <tr>
  //                               <td class="text-12 lh-22 a-center c-grey- l-grey py-20" style="font-size:12px; color:#6e6e6e; font-family:'PT Sans', Arial, sans-serif; min-width:auto !important; line-height: 22px; text-align:center; padding-top: 20px; padding-bottom: 20px;">
  //                                 <a href="#" target="_blank" class="link c-grey" style="text-decoration:none; color:#6e6e6e;"><span class="link c-grey" style="white-space: nowrap; text-decoration:none; color:#6e6e6e;">UNSUBSCRIBE</span></a> &nbsp;|&nbsp; <a href="#" target="_blank" class="link c-grey" style="text-decoration:none; color:#6e6e6e;"><span class="link c-grey" style="white-space: nowrap; text-decoration:none; color:#6e6e6e;">WEB VERSION</span></a> &nbsp;|&nbsp; <a href="#" target="_blank" class="link c-grey" style="text-decoration:none; color:#6e6e6e;"><span class="link c-grey" style="white-space: nowrap; text-decoration:none; color:#6e6e6e;">SEND TO A FRIEND</span></a>
  //                               </td>
  //                             </tr>
  //                           </table>											<!-- END Bottom -->
  //                       </td>
  //                     </tr>
  //                   </table>
  //                 </td>
  //               </tr>
  //             </table>
  //           </td>
  //         </tr>
  //       </table>
  //     </center>
  //   </body>`;
  //     let emailData = {
  //       to: req.body.email,
  //       subject: `${appName} OTP`,
  //       html: html
  //     };
  //     await helper.sendEmail(emailData);

  //     // const hoursOfOperation = requestdata.hoursOfOperation.map(data => {
  //     //   return {
  //     //     ...data,
  //     //     userId: create_user.id
  //     //   }
  //     // });

  //     // await db['hoursOfOperation'].bulkCreate(hoursOfOperation);

  //     // let user_details = await locationOwnerDetail.findOne({
  //     //   // attributes:['*',helper.makeImageUrlSql('user','image')],
  //     //   attributes: {
  //     //     include: [
  //     //       helper.makeImageUrlSql('locationOwnerDetail', 'image', 'locationOwnerDetail'),
  //     //     ],
  //     //     exclude: [
  //     //       'password',
  //     //     ]
  //     //   },
  //     //   // include: [
  //     //   //   {
  //     //   //     model: db['hoursOfOperation'],
  //     //   //     required: false,
  //     //   //     separate: true,
  //     //   //     order: [
  //     //   //       ['sortOrder', 'ASC']
  //     //   //     ],
  //     //   //   }],
  //     //   where: {
  //     //     email: req.body.email,
  //     //   },
  //     //   // raw: true
  //     // }).then(data => data ? data.toJSON() : data);
  //     let create_location_Owner_detail = await locationOwnerDetail.create({
  //       userId: create_user.id,
  //       name: req.body.firstName+" "+req.body.lastName ,
  //       firstName: req.body.firstName,
  //       lastName: req.body.lastName,
  //       gender: req.body.gender,
  //       location: req.body.location,
  //       image: requestdata.image,
  //       latitude: req.body.latitude,
  //       longitude: req.body.longitude,

  //     })
  //     let location_Owner_detail= await locationOwnerDetail.findOne({
  //       where:{
  //         userId: create_user.id
  //       }
  //     })
  //     console.log("-------------------------------------------",location_Owner_detail);

  //     // let location_Owner_detail= create_location_Owner_detail
  //     // user_details.locationOwnerDetail = create_location_Owner_detail
  //     // console.log(requestdata.subCategoryId,'===============');return
  //     // if (requestdata.categoryId == 73) {

  //     //   let array_sub = await req.body.subCategoryId.split(",")
  //     //   // console.log(array_sub,"array_sub");return
  //     //   final_array = []
  //     //   for (var i in array_sub) {
  //     //     temp_obj = {
  //     //       userId: create_user.id,
  //     //       categoryId: req.body.categoryId,
  //     //       subCategoryId: 74,
  //     //     }
  //     //     final_array.push(temp_obj)

  //     //   }

  //     //   let create_subCategory = await sub_category.bulkCreate(final_array)
  //     // }
  //     // else {
  //     //   if (requestdata.subCategoryId) {
  //     //     let array_sub = await req.body.subCategoryId.split(",")
  //     //     // console.log(array_sub,"array_sub");return
  //     //     final_array = []
  //     //     for (var i in array_sub) {
  //     //       temp_obj = {
  //     //         userId: create_user.id,
  //     //         categoryId: req.body.categoryId,
  //     //         subCategoryId: array_sub[i],
  //     //       }
  //     //       final_array.push(temp_obj)

  //     //     }
  //     //     let create_subCategory = await sub_category.bulkCreate(final_array)
  //     //   }
  //     // }
  //     // let image = requestdata.image;
  //     //console.log(image, 'image====='); return
  //     // if (requestdata.image) {
  //     //   if (Array.isArray(requestdata.image)) {
  //     //     for (let i in requestdata.image) {
  //     //       image = await helper.imageUpload(requestdata.image[i], 'business');

  //     //       let add_image = await businessImage.create({
  //     //         businessId: create_user.id,
  //     //         image: image,
  //     //       })
  //     //     }
  //     //   } else {
  //     //     image = await helper.imageUpload(requestdata.image, 'business');
  //     //     let add_image = await businessImage.create({
  //     //       businessId: create_user.id,
  //     //       image: image,
  //     //     })
  //     //   }
  //     // }
  //     // let findImages = await businessImage.findAll({
  //     //   attributes: ['id', makeImageUrlSql('businessImage', 'image', 'business')],
  //     //   where: {
  //     //     businessId: create_user.id
  //     //   }
  //     // })
  //     // user_details.images = findImages

  //     // let findSub = await sub_category.findAll({
  //     //   attributes: ['id', 'userId', [sequelize.literal('(SELECT name FROM category WHERE id = userSubCategory.subCategoryId )'), 'subCategories']],
  //     //   where: {
  //     //     userId: create_user.id,
  //     //   }
  //     // })
  //     // user_details.SubCategories = findSub
  //     let location_details = {
  //       location_Owner: create_user,
  //       location_Owner_detail: location_Owner_detail,
  //     }
  //     let userData = {
  //       id: create_user.id,
  //       email: create_user.email,
  //     }
  //     let token = jwt.sign({
  //       data: userData
  //     }, secretKey);
  //     location_details.token = token;

  //     var msg = 'login Successfull';
  //     res.status(200).json({
  //       'success': 1,
  //       'code': 200,
  //       'msg': msg,
  //       'body': location_details,
  //     });

  //   } catch (error) {
  //     return helper.error(res, error);
  //   }
  // },
  //////////location_details apis///////////////////////

  location_details: async function(req, res) {
    try {
      const required = {};
      const non_required = {};
      let requestData = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );

      // console.log("0000000000000000000000000000000000000000000000000000000000",req.user.id);

      let location_find = await locationOwnerDetail.findAll({
        // where: {
        //   userId: req.user.id
        // },
        attributes:[`id`, `userId`, `isFav`, ['adress', 'locationName'], `adress`, `image`, `location`, `latitude`, `longitude`, `PricePerDay`, `offrerPricePerDay`, `offers`, `about`, `loc_country_code`, `loc_phone`, `loc_email`, `createdAt`, `updatedAt`,],
        include: [
          {
            model: locationOwnerDetailImage,
            required: false
          }
        ]
      });
      let location_details = location_find;

      // let location_details = {
      //   user_details: user_details,
      //   location_Owner_detail: location_find,
      //   locationOwnerImages: findlocationOwnerImage
      // };
      var msg = "Location profile";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: location_details
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },

  bookings_chat_details: async function(req, res) {
    try {
      const required = {
        senderId: req.body.senderId,
        receiverId: req.body.receiverId
      };
      const non_required = {
        role: req.body.role
      };
      let requestData = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );

      // console.log("0000000000000000000000000000000000000000000000000000000000");
      var final_array = []
      if (requestData.role==2) {
        var booking_find = await bookings.findAll({
          attributes: [`id`, `order_id`,`locationOwnerId`, `locationUserId`, `userId`, `cardId`, `location`, `lat`, `lng`, `startBookingDate`, `endBookingDate`, `status`,`status2`, `createdAt`, `updatedAt`,
          [sequelize.literal(`ifnull((SELECT businessName FROM businessProfessionalDetail WHERE id = serviceProviderId),'')`), 'businessName'],
          [sequelize.literal(`ifnull((SELECT adress FROM locationOwnerDetail WHERE id = locationOwnerId),'')`), 'locationName'],
          // [sequelize.literal('(SELECT count(id) FROM message WHERE ((senderId = '+requestData.senderId+' and receiverId = '+requestData.receiverId+') OR (senderId = '+requestData.receiverId+' and receiverId = '+requestData.senderId+') and booking_id=bookings.id and readStatus= 0))'), 'unreadCount'],
          [sequelize.literal('(SELECT count(id) FROM message WHERE senderId = '+requestData.receiverId+' and receiverId='+req.user.id+' and booking_id=bookings.id and readStatus= 0)'), 'unreadCount'],
          // [sequelize.literal('ifnull((SELECT updated FROM message WHERE chatConstant.lastMsgId  = message.id), 0)'), 'updated'],
          [sequelize.literal('ifnull((SELECT updated FROM message WHERE booking_id = bookings.id ORDER BY id DESC LIMIT 1), 0)'), 'updated']
          // [sequelize.literal('ifnull((SELECT type FROM blocked_users WHERE blocked_users.blocked_by = '+receiver_id+' and blocked_user_id= '+sender_id+'), 0)'), 'is_blocked'],

        ],
        include:[
          {
            model:locationOwnerDetailImage,
            // on: {
            //   col1: sequelize.where(sequelize.col('locationOwnerDetailImages.locationid'), '=', sequelize.col('locationOwnerDetailImages.bookings.locationOwnerId')),
            // },
          }
        ],
          where: {
            [Op.or]: [{
              userId: requestData.senderId,
              locationUserId: requestData.receiverId,
              // bussinessUserId: requestData.receiverId,
            }, {
              userId: requestData.receiverId,
              locationUserId: requestData.senderId,
              // bussinessUserId: requestData.senderId
  
            }],
            // [Op.and]: [{
            //   status: 0
            // }]
          }
          
        }).map(async data => {
          console.log("ggggggggggggggggggggggggggggggggggggggg",data);
          
         return data = data.toJSON();
  
        })
      } else if (requestData.role==3){
        var booking_find = await bookings.findAll({
          attributes: [`id`, `order_id`, `serviceProviderId`, `bussinessUserId`, `categoryId`,  `userId`, `cardId`, `location`, `lat`, `lng`, `startBookingDate`, `endBookingDate`, `status`,`status2`, `createdAt`, `updatedAt`,
          [sequelize.literal(`ifnull((SELECT businessName FROM businessProfessionalDetail WHERE id = serviceProviderId),'')`), 'businessName'],
          [sequelize.literal(`ifnull((SELECT adress FROM locationOwnerDetail WHERE id = locationOwnerId),'')`), 'locationName'],
          [sequelize.literal('(SELECT count(id) FROM message WHERE senderId = '+requestData.receiverId+' and receiverId='+req.user.id+' and booking_id=bookings.id and readStatus= 0)'), 'unreadCount'],
          [sequelize.literal('ifnull((SELECT updated FROM message WHERE booking_id = bookings.id ORDER BY id DESC LIMIT 1), 0)'), 'updated']
        ],
        include:[
          {
            model:businessImage,
          }
        ],
          where: {
            [Op.or]: [{
              userId: requestData.senderId,
              // locationUserId: requestData.receiverId,
              bussinessUserId: requestData.receiverId,
            }, {
              userId: requestData.receiverId,
              // locationUserId: requestData.senderId,
              bussinessUserId: requestData.senderId
  
            }],
            // [Op.and]: [{
            //   status: 0
            // }]
          }
          
        }).map(async data => {
         return data = data.toJSON();
  
        })
      }
      
      



     
      
    //  var kgfklgfklgfgfkl= await booking_find.map(async data => {
    //     data = data.toJSON();
    //     final_array.push(data.id)

    //   })
// console.log("994494949494949949494",booking_find);

      var msg = "Bookings Details";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: booking_find || {}
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },


  location_list: async function(req, res) {
    try {
      const required = {};
      const non_required = {};
      let requestData = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );

      // console.log("0000000000000000000000000000000000000000000000000000000000",req.user.id);

      let location_find = await locationOwnerDetail.findAll({
        attributes:[`id`, `userId`, `isFav`, ['adress', 'locationName'], `adress`, `image`, `location`, `latitude`, `longitude`, `PricePerDay`, `offrerPricePerDay`, `offers`, `about`, `loc_country_code`, `loc_phone`, `loc_email`, `createdAt`, `updatedAt`,],
        where: {
          userId: req.user.id
        },
        include: [
          {
            model: locationOwnerDetailImage,
            required: false
          }
        ]
      });
      let location_details = location_find;

      // let location_details = {
      //   user_details: user_details,
      //   location_Owner_detail: location_find,
      //   locationOwnerImages: findlocationOwnerImage
      // };
      var msg = "Location profile";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: location_details
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },
  //////////location_complete_profile apis///////////////////////

  add_location_profile: async function(req, res) {
    try {
      const required = {
        // userid: req.body.userid,
        // locationName: req.body.locationName,
        PricePerDay: req.body.PricePerDay,
        offers: req.body.offers,
        offrerPrice: req.body.offrerPrice,
        about: req.body.about,
        // hoursOfOperation:
        //   typeof req.body.hoursOfOperation === "object"
        //     ? req.body.hoursOfOperation
        //     : JSON.parse(req.body.hoursOfOperation),
        location: req.body.location,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        // about: req.body.about,
        // image: req.body.image,
        loc_phone: req.body.loc_phone,
        loc_email: req.body.loc_email,
      };

      const non_required = {
        adress: req.body.adress,
        country_code: req.body.country_code,
        profile_image:
          typeof req.body.profile_image === "object"
            ? req.body.profile_image
            : JSON.parse(req.body.profile_image)
        // subCategoryId: req.body.subCategoryId,
      };
      let requestData = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );

      let check_email_pass = await locationOwnerDetail.count({
        where: {
          loc_email: req.body.loc_email
        }
      });
      if (check_email_pass > 0) {
        let msg = "Email already exist";
        res.status(400).json({
          success: 0,
          code: 400,
          msg: msg,
          body: []
        });
        return false;
      }

      let check_phone_pass = await locationOwnerDetail.count({
        where: {
          loc_phone: req.body.loc_phone
        }
      });
      // console.log(check_phone_pass,'jnj=====');return false;
      if (check_phone_pass > 0) {
        let msg = "Phone already exists";
        res.status(400).json({
          success: 0,
          code: 400,
          msg: msg,
          body: []
        });
        return false;
      }

      let user_details = await user.findOne({
        where: {
          id: req.user.id
        }
      });
      // console.log(
      //   "=====================================================user_details==",
      //   user_details
      // );

      let create_location_Owner_detail = await locationOwnerDetail.create(
        {
          userId: req.user.id,
          // locationName: requestData.locationName,
          // bannerImage: bannerImage,
          about: req.body.about,
          categoryId: req.body.categoryId,
          loc_phone: req.body.loc_phone,
          loc_email: req.body.loc_email,
          location: req.body.location,
          latitude: req.body.latitude,
          longitude: req.body.longitude,

          adress: req.body.adress,
          PricePerDay: req.body.PricePerDay,
          offers: req.body.offers,
          offrerPricePerDay: req.body.offrerPrice,
          loc_country_code: req.body.country_code
        }
        // {
        //   where: {
        //     userId: req.user.id
        //   }
        // }
      );
      console.log(
        "========================================================",
        create_location_Owner_detail.loc_phone
      );

      if (
        Array.isArray(requestData.profile_image) &&
        requestData.profile_image &&
        requestData.profile_image.length > 0
      ) {
        for (let i in requestData.profile_image) {
          console.log(
            "------------------------------------------",
            requestData.profile_image[i].image,
            requestData.profile_image[i]
          );

          await locationOwnerDetailImage.create({
            image: requestData.profile_image[i].image,
            locationid: create_location_Owner_detail.id
          });
        }
      }

      // if (
      //   Array.isArray(requestData.hoursOfOperation) &&
      //   requestData.hoursOfOperation &&
      //   requestData.hoursOfOperation.length > 0
      // ) {
      //   for (let i in requestData.hoursOfOperation) {
      //     await hoursOfOperation.create({
      //       sortOrder: requestData.hoursOfOperation[i].sortOrder,
      //       day: requestData.hoursOfOperation[i].day,
      //       timeFrom: requestData.hoursOfOperation[i].timeFrom,
      //       timeTo: requestData.hoursOfOperation[i].timeTo,
      //       isActive: requestData.hoursOfOperation[i].isActive,
      //       userId: create_location_Owner_detail.id
      //     });
      //   }
      // }
      let findlocationOwnerImage = await locationOwnerDetailImage.findAll({
        where: {
          locationid: create_location_Owner_detail.id
        }
      });
      let location_find = await locationOwnerDetail.findOne({
        attributes:[`id`, `userId`, `isFav`, ['adress', 'locationName'], `adress`, `image`, `location`, `latitude`, `longitude`, `PricePerDay`, `offrerPricePerDay`, `offers`, `about`, `loc_country_code`, `loc_phone`, `loc_email`, `createdAt`, `updatedAt`,],
        where: {
          id: create_location_Owner_detail.id
        }
      });

      let location_details = {
        user_details: user_details,
        create_location_Owner_detail: location_find,
        locationOwnerImages: findlocationOwnerImage
      };

      var msg = " Add location complete profile successfull";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: location_details
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },

  /////////////////////////////////////////business_prof_complete_profile////////////////////////////////
  add_business_profile: async function(req, res) {
    try {
      const required = {
        // userid: req.body.userid,
        businessName: req.body.businessName,
        categoryId: req.body.categoryId,
        // hourOfOprations: req.body.hourOfOprations,
        PricePerService: req.body.PricePerService,
        offers: req.body.offerWeek,
        offerPrice: req.body.offersPrice,
        businessPhone: req.body.business_phone,
        businessEmail: req.body.business_email,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        // offrerPricePerDay: req.body.offrerPricePerDay,
        about: req.body.about,
        countryCode: req.body.country_code
      };
      const non_required = {
        adress: req.body.adress,
        userId: req.user.id,
        // country_code: req.body.country_code,
        profile_image:
          typeof req.body.profile_image === "object"
            ? req.body.profile_image
            : JSON.parse(req.body.profile_image)

        // subCategoryId: req.body.subCategoryId,
      };
      let requestData = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );

      // let check_email_pass = await locationOwnerDetail.count({
      //   where: {
      //     loc_email: req.body.loc_email
      //   }
      // });
      // if (check_email_pass > 0) {
      //   let msg = "Email already exist";
      //   res.status(400).json({
      //     success: 0,
      //     code: 400,
      //     msg: msg,
      //     body: []
      //   });
      //   return false;
      // }

      let check_phone_pass = await business_prof.count({
        where: {
          businessPhone: requestData.businessPhone
        }
      });
      // console.log(check_phone_pass,'jnj=====');return
      if (check_phone_pass > 0) {
        let msg = "Phone already exists";
        res.status(400).json({
          success: 0,
          code: 400,
          msg: msg,
          body: []
        });
        return false;
      }

      let create_business_prof_detail = await business_prof.create({
        ...requestData
      });
      // console.log("========================================================",create_location_Owner_detail.loc_phone);
      // let user_details = await user.findOne({
      //   where: {
      //     id: req.user.id
      //   }
      // });

      if (
        Array.isArray(requestData.profile_image) &&
        requestData.profile_image &&
        requestData.profile_image.length > 0
      ) {
        for (let i in requestData.profile_image) {
          // console.log("------------------------------------------",requestData.profile_image[i].image,requestData.profile_image[i]);

          await businessImage.create({
            image: requestData.profile_image[i].image,
            businessId: create_business_prof_detail.id
          });
        }
      }

      // if (
      //   Array.isArray(requestData.hoursOfOperation) &&
      //   requestData.hoursOfOperation &&
      //   requestData.hoursOfOperation.length > 0
      // ) {
      //   for (let i in requestData.hoursOfOperation) {
      //     await hoursOfOperation.create({
      //       sortOrder: requestData.hoursOfOperation[i].sortOrder,
      //       day: requestData.hoursOfOperation[i].day,
      //       timeFrom: requestData.hoursOfOperation[i].timeFrom,
      //       timeTo: requestData.hoursOfOperation[i].timeTo,
      //       isActive: requestData.hoursOfOperation[i].isActive,
      //       userId: create_location_Owner_detail.id
      //     });
      //   }
      // }
      let findBusinessProfImage = await businessImage.findAll({
        where: {
          businessId: create_business_prof_detail.id
        }
      });
      let business_prof_find = await business_prof.findOne({
        where: {
          id: create_business_prof_detail.id
        }
      });

      let business_details = {
        // user_details: user_details,
        create_business_prof_detail: business_prof_find,
        findBusinessProfImage: findBusinessProfImage
      };

      var msg = "Add business professional profile successfull";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: business_details
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },

  edit_business_prof: async function(req, res) {
    try {
      const required = {
        businessId: req.body.businessId
      };
      const non_required = {
        businessName: req.body.businessName,
        categoryId: req.body.categoryId,
        adress: req.body.adress,
        // hourOfOprations: req.body.hourOfOprations,
        PricePerService: req.body.PricePerService,
        offers: req.body.offerWeek,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        offerPrice: req.body.offersPrice,
        businessPhone: req.body.business_phone,
        businessEmail: req.body.business_email,
        // offrerPricePerDay: req.body.offrerPricePerDay,
        about: req.body.about,
        countryCode: req.body.country_code,
        profile_image:
          typeof req.body.profile_image === "object"
            ? req.body.profile_image
            : JSON.parse(req.body.profile_image),
        userId: req.user.id
      };
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );

      // if (requestdata.phone) {
      //   let check_phone_pass = await user.count({
      //     where: {
      //       phone: req.body.phone,
      //       id: {
      //         // = 3
      //         [Op.ne]: req.user.id
      //       }
      //     }
      //   });
      //   // console.log(check_email_pass,'jnj=====');return false;
      //   if (check_phone_pass > 0) {
      //     let msg = "phone already exist";
      //     res.status(400).json({
      //       success: 0,
      //       code: 400,
      //       msg: msg,
      //       body: []
      //     });
      //     return false;
      //   }
      // }

      // if (requestdata.email) {
      //   let check_email = await user.count({
      //     where: {
      //       email: req.body.email,
      //       id: {
      //         // = 3
      //         [Op.ne]: req.user.id
      //       }
      //     }
      //   });
      //   // console.log(check_email_pass,'jnj=====');return false;
      //   if (check_email > 0) {
      //     let msg = "email already exist";
      //     res.status(400).json({
      //       success: 0,
      //       code: 400,
      //       msg: msg,
      //       body: []
      //     });
      //     return false;
      //   }
      // }

      let edit_profiles = await business_prof.update(
        {
          ...requestdata
        },
        {
          where: {
            id: requestdata.businessId
          }
        }
      );
      if (
        Array.isArray(requestdata.profile_image) &&
        requestdata.profile_image &&
        requestdata.profile_image.length > 0
      ) {
        await businessImage.destroy({
          where: {
            businessId: requestdata.businessId
          }
        });
        for (let i in requestdata.profile_image) {
          await businessImage.create({
            image: requestdata.profile_image[i].image,
            businessId: requestdata.businessId
          });
        }
      }
      let get_detail = await user.findOne({
        attributes: [
          "id",
          "email",
          "phone",
          "username"
          // helper.makeImageUrlSql("user", "image", "user")
        ],
        where: {
          id: req.user.id
        },
        include: [
          {
            // attributes: [
            //   `id`,
            //   `userId`,
            //   `name`,
            //   `location`,
            //   `latitude`,
            //   `longitude`,
            //   `createdAt`,
            //   `updatedAt`,
            //   // helper.makeImageUrlSql("locationOwnerDetail", "image", "user")
            // ],
            model: business_prof,
            required: false,
            include: [
              {
                // attributes: [
                //   `id`,
                //   `locationId`,
                //   `image`,
                //   `createdAt`,
                //   `updatedAt`,
                //   // helper.makeImageUrlSql("locationOwnerDetail", "image", "user")
                // ],
                model: businessImage,
                required: false,

                where: {
                  businessId: req.body.businessId
                }
              }
            ],
            where: {
              id: req.body.businessId
            }
          }
        ]
      });

      var msg = "Business professional updated succcessfully";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: get_detail
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },
  
  business_reviews: async function(req, res) {
    try {
      const required = {
        security_key: req.headers.security_key
      };
      const non_required = {};
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      // let get_review = await reviews.findAll({
      //   attributes: ['id', 'rating', 'review', 'createdAt', 'created', 'updated', [sequelize.literal('(SELECT CONCAT(name," ",lastName) FROM userDetail WHERE reviews.userId = userDetail.userId )'), 'ratingGivenBy']],
      //   where: {
      //     businessId: req.user.id
      //   },
      //   include: [{
      //     model: user,
      //     attributes: ['image', makeImageUrlSql('user', 'image', 'user')],
      //     on: {

      //       col1: sequelize.where(sequelize.col('reviews.userId'), '=', sequelize.col('user.id')),
      //     },

      //   }]
      // })

      var get_review = await reviews.findAll({
        // attributes: [`id`, `rating`, `review`, `createdAt`, 'created', 'updated', [sequelize.literal('(SELECT CONCAT(name," ",lastName) FROM userDetail WHERE reviews.userId = userDetail.userId )'), 'ratingGivenBy']],
        attributes: [
          `id`,
          `userId`,
          `rating`,
          `review`,
          `createdAt`,
          "created",
          "updated",
          [
            sequelize.literal(
              "(SELECT role FROM user WHERE id = reviews.userId )"
            ),
            "userRole"
          ]
        ],
        where: {
          businessId: req.user.id
        },
        include: [
          {
            model: user,
            attributes: ["image", makeImageUrlSql("user", "image", "user")],
            on: {
              col1: sequelize.where(
                sequelize.col("reviews.userId"),
                "=",
                sequelize.col("user.id")
              )
            }
          }
        ]
      });

      get_review = await Promise.all(
        get_review.map(async data => {
          data = data.toJSON();
          if (data.userRole == 1) {
            let findName = await user_detail.findOne({
              where: {
                userId: data.userId
              }
            });

            if (findName) {
              data.ratingGivenBy = findName.name + " " + findName.lastName;
            } else {
              data.ratingGivenBy = "";
            }
          } else if (data.userRole == 2) {
            let findName = await business.findOne({
              where: {
                userId: data.userId
              }
            });

            if (findName) {
              data.ratingGivenBy = findName.name + " " + findName.lastName;
            } else {
              data.ratingGivenBy = "";
            }
          } else if (data.userRole == 3) {
            let findName = await business_prof.findOne({
              where: {
                userId: data.userId
              }
            });

            if (findName) {
              data.ratingGivenBy = findName.name + " " + findName.lastName;
            } else {
              data.ratingGivenBy = "";
            }
          } else {
            console.log("----------------------error------------------------");
          }

          return data;
        })
      );

      let msg = "Reviews list";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: get_review
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },
  business_profile: async function(req, res) {
    try {
      var url_get = "http://" + req.host + ":7800/uploads/user/";

      const required = {
        security_key: req.headers.security_key
      };
      const non_required = {};
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      let get_profile = await business.findOne({
        attributes: [
          "id",
          "location",
          "firstName",
          "name",
          "latitude",
          "city",
          "state",
          "zipCode",
          "apt",
          "longitude",
          "lastName",
          "isShowAddressOther",
          makeImageUrlSql("businessDetail", "bannerImage", "business"),
          [
            sequelize.literal(
              "(SELECT email FROM user WHERE businessDetail.userId = user.id )"
            ),
            "email"
          ],
          [
            sequelize.literal(
              "(SELECT phone FROM user WHERE businessDetail.userId = user.id )"
            ),
            "phone"
          ],
          [
            sequelize.literal(
              '(SELECT case when `user`.`image`="" then "" else concat("' +
                url_get +
                '",`user`.`image`) end FROM user WHERE id = businessDetail.userId )'
            ),
            "image"
          ]
        ],
        where: {
          userId: req.user.id
        }
      });
      let msg = "Business profile";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: get_profile
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },
  edit_business_profile: async function(req, res) {
    try {
      const required = {
        security_key: req.headers.security_key,
        location: req.body.location,
        city: req.body.city,
        state: req.body.state,
        zipCode: req.body.zipCode
      };
      const non_required = {
        country_code: req.bodycountry_code,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        phone: req.body.phone,
        businessName: req.body.businessName,
        image: req.files && req.files.image,
        apt: req.body.apt
      };
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );

      let check_phone_pass = await user.count({
        where: {
          phone: req.body.phone,
          id: {
            // = 3
            [Op.ne]: req.user.id
          }
        }
      });
      // console.log(check_email_pass,'jnj=====');return false;
      if (check_phone_pass > 0) {
        let msg = "Phone already exist";
        res.status(400).json({
          success: 0,
          code: 400,
          msg: msg,
          body: []
        });
        return false;
      }

      /////for image

      // let bannerImage = requestdata.bannerImage;
      // if (requestdata.bannerImage) {
      //   bannerImage = await helper.imageUpload(requestdata.bannerImage, 'business')
      // }

      let image = requestdata.image;
      // console.log(profileImage, 'profileImage=====')
      if (requestdata.image) {
        image = await helper.imageUpload(requestdata.image, "user");
      }

      let update_user = await user.update(
        {
          phone: req.body.phone,
          image: image
        },
        {
          where: {
            id: req.user.id
          }
        }
      );

      let update_profile = await business.update(
        {
          gender: req.body.gender,
          location: req.body.location,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          // bannerImage: bannerImage,
          latitude: req.body.latitude,
          longitude: req.body.longitude,
          city: req.body.city,
          state: req.body.state,
          zipCode: req.body.zipCode,
          apt: req.body.apt,
          name: req.body.businessName
        },
        {
          where: {
            userId: req.user.id
          }
        }
      );
      let get_detail = await user.findOne({
        attributes: [
          "phone",
          "email",
          makeImageUrlSql("user", "image", "user")
        ],
        where: {
          id: req.user.id
        },
        include: [
          {
            attributes: [
              "firstName",
              "name",
              "lastName",
              "latitude",
              "longitude",
              "city",
              "state",
              "zipCode",
              "apt",
              "location",
              "isShowAddressOther",
              makeImageUrlSql("businessDetail", "bannerImage", "business")
            ],
            model: business
          }
        ]
      });

      if (get_detail) get_detail = get_detail.toJSON();

      let userData = {
        id: get_detail.id,
        email: get_detail.email
      };
      let token = jwt.sign(
        {
          data: userData
        },
        secretKey
      );

      get_detail.token = token;

      let msg = "Business profile";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: get_detail
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },
  delete_profile: async function(req, res) {
    try {
      const required = {
      };
      const non_required = {};
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      let del_profile = await user.destroy({
        where: {
          id: req.user.id
        }
      });
      let del_userDetail = await user_detail.destroy({
        where: {
          userId: req.user.id
        }
      });
     
      let del_reviews = await reviews.destroy({
        where: {
          [Op.or]: [{businessId: req.user.id,}, {userId: req.user.id,}],

          
        }
      });
      let del_images = await favourite.destroy({
        where: {
          favBy: req.user.id
        }
      });
      let del_card_payment = await card_payment.destroy({
        where: {
          userId: req.user.id
        }
      });
      let del_bookings = await bookings.destroy({
        where: {
          userId: req.user.id
        }
      });
      let del_message = await message.destroy({
        where: {
          [Op.or]: [{senderId: req.user.id,}, {receiverId: req.user.id,}],

        }
      });
      let del_notification = await notification.destroy({
        where: {
          [Op.or]: [{senderId: req.user.id,}, {receiverId: req.user.id,}],
        }
      });
      let del_hoursOfOperation = await bankDetail.destroy({
        where: {
          userId: req.user.id
        }
      });
      let msg = "Profile deleted successfully";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: {}
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },

  business_professional_reviews: async function(req, res) {
    try {
      const required = {
        security_key: req.headers.security_key
      };
      const non_required = {};
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      // let get_review = await reviews.findAll({
      //   attributes: ['id', 'rating', 'review', 'createdAt', [sequelize.literal('(SELECT CONCAT(name," ",lastName) FROM userDetail WHERE reviews.userId = userDetail.userId )'), 'ratingGivenBy']],
      //   where: {
      //     businessId: req.user.id
      //   },
      //   include: [{
      //     model: user,
      //     attributes: ['image', makeImageUrlSql('user', 'image', 'user')],
      //     on: {

      //       col1: sequelize.where(sequelize.col('reviews.userId'), '=', sequelize.col('user.id')),
      //     },

      //   }]
      // })

      var get_review = await reviews.findAll({
        // attributes: [`id`, `rating`, `review`, `createdAt`, 'created', 'updated', [sequelize.literal('(SELECT CONCAT(name," ",lastName) FROM userDetail WHERE reviews.userId = userDetail.userId )'), 'ratingGivenBy']],
        attributes: [
          `id`,
          `userId`,
          `rating`,
          `review`,
          `createdAt`,
          "created",
          "updated",
          [
            sequelize.literal(
              "(SELECT role FROM user WHERE id = reviews.userId )"
            ),
            "userRole"
          ]
        ],
        where: {
          businessId: req.user.id
        },
        include: [
          {
            model: user,
            attributes: ["image", makeImageUrlSql("user", "image", "user")],
            on: {
              col1: sequelize.where(
                sequelize.col("reviews.userId"),
                "=",
                sequelize.col("user.id")
              )
            }
          }
        ]
      });

      get_review = await Promise.all(
        get_review.map(async data => {
          data = data.toJSON();
          if (data.userRole == 1) {
            let findName = await user_detail.findOne({
              where: {
                userId: data.userId
              }
            });

            if (findName) {
              data.ratingGivenBy = findName.name + " " + findName.lastName;
            } else {
              data.ratingGivenBy = "";
            }
          } else if (data.userRole == 2) {
            let findName = await business.findOne({
              where: {
                userId: data.userId
              }
            });

            if (findName) {
              data.ratingGivenBy = findName.name + " " + findName.lastName;
            } else {
              data.ratingGivenBy = "";
            }
          } else if (data.userRole == 3) {
            let findName = await business_prof.findOne({
              where: {
                userId: data.userId
              }
            });

            if (findName) {
              data.ratingGivenBy = findName.name + " " + findName.lastName;
            } else {
              data.ratingGivenBy = "";
            }
          } else {
            console.log("----------------------error------------------------");
          }

          return data;
        })
      );

      let msg = "Reviews list";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: get_review
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },
  business_professional_profile: async function(req, res) {
    try {
      var url_get = "http://" + req.host + ":7800/uploads/user/";

      const required = {
        security_key: req.headers.security_key
      };
      const non_required = {};
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      let get_profile = await business_prof.findOne({
        attributes: [
          "id",
          "location",
          "firstName",
          "name",
          "latitude",
          "longitude",
          "lastName",
          "city",
          "state",
          "zipCode",
          "apt",
          "isShowAddressOther",
          makeImageUrlSql(
            "businessProfessionalDetail",
            "bannerImage",
            "business"
          ),
          [
            sequelize.literal(
              "(SELECT email FROM user WHERE businessProfessionalDetail.userId = user.id )"
            ),
            "email"
          ],
          [
            sequelize.literal(
              "(SELECT phone FROM user WHERE businessProfessionalDetail.userId = user.id )"
            ),
            "phone"
          ],
          [
            sequelize.literal(
              '(SELECT case when `user`.`image`="" then "" else concat("' +
                url_get +
                '",`user`.`image`) end FROM user WHERE id = businessProfessionalDetail.userId )'
            ),
            "image"
          ]
        ],
        where: {
          userId: req.user.id
        }
      });
      let msg = "Business professional profile";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: get_profile
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },
  edit_business_professional_profile: async function(req, res) {
    try {
      const required = {
        security_key: req.headers.security_key,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        location: req.body.location,
        city: req.body.city,
        state: req.body.state,
        zipCode: req.body.zipCode
      };
      const non_required = {
        // bannerImage: req.files && req.files.bannerImage,
        country_code: req.bodycountry_code,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        phone: req.body.phone,
        image: req.files && req.files.image,
        apt: req.body.apt
      };
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );

      let check_phone_pass = await user.count({
        where: {
          phone: req.body.phone,
          id: {
            // = 3
            [Op.ne]: req.user.id
          }
        }
      });
      // console.log(check_email_pass,'jnj=====');return false;
      if (check_phone_pass > 0) {
        let msg = "Phone already exists";
        res.status(400).json({
          success: 0,
          code: 400,
          msg: msg,
          body: []
        });
        return false;
      }

      /////for image
      let image = requestdata.image;
      // console.log(profileImage, 'profileImage=====')
      if (requestdata.image) {
        image = await helper.imageUpload(requestdata.image, "user");
      }

      // let bannerImage = requestdata.bannerImage;
      // if (requestdata.image) {
      //   bannerImage = await helper.imageUpload(requestdata.bannerImage, 'business')
      // }

      let update_user = await user.update(
        {
          phone: req.body.phone,
          image: image
        },
        {
          where: {
            id: req.user.id
          }
        }
      );

      let update_profile = await business_prof.update(
        {
          location: req.body.location,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          latitude: req.body.latitude,
          longitude: req.body.longitude,
          city: req.body.city,
          state: req.body.state,
          zipCode: req.body.zipCode,
          apt: req.body.apt
        },
        {
          where: {
            userId: req.user.id
          }
        }
      );
      let get_detail = await user.findOne({
        attributes: [
          "phone",
          "email",
          makeImageUrlSql("user", "image", "user")
        ],
        where: {
          id: req.user.id
        },
        include: [
          {
            attributes: [
              "firstName",
              "lastName",
              "latitude",
              "longitude",
              "city",
              "state",
              "zipCode",
              "apt",
              "location",
              makeImageUrlSql(
                "businessProfessionalDetail",
                "bannerImage",
                "business"
              )
            ],
            model: business_prof
          }
        ]
      });
      if (get_detail) get_detail = get_detail.toJSON();

      let userData = {
        id: get_detail.id,
        email: get_detail.email
      };
      let token = jwt.sign(
        {
          data: userData
        },
        secretKey
      );

      get_detail.token = token;

      let msg = "Business professional profile";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: get_detail
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },
  delete_business_professional_profile: async function(req, res) {
    try {
      const required = {
        security_key: req.headers.security_key
      };
      const non_required = {};
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      let del_profile = await user.destroy({
        where: {
          id: req.user.id
        }
      });
      let del_business = await business_prof.destroy({
        where: {
          userId: req.user.id
        }
      });
      let del_reviews = await reviews.destroy({
        where: {
          businessId: req.user.id
        }
      });
      let del_images = await businessImage.destroy({
        where: {
          businessId: req.user.id
        }
      });
      let del_subCategory = await sub_category.destroy({
        where: {
          userId: req.user.id
        }
      });
      let del_hoursOfOperation = await hours_of_operation.destroy({
        where: {
          userId: req.user.id
        }
      });
      let msg = "Profile deleted successfully";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: {}
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },
  delete_image: async function(req, res) {
    try {
      const required = {
        // security_key: req.headers.security_key,
        image_id: req.body.image_id
      };
      const non_required = {};
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      if (req.user.role==2) {
        let delImage = await locationOwnerDetailImage.destroy({
          where: {
            id: requestdata.image_id,
            // businessId: req.user.id
          }
        });
      }
if (req.user.role==3) {
  let delImage = await businessImage.destroy({
    where: {
      id: requestdata.image_id,
      // locationid: req.user.id
    }
  });
}

      // let delImage = await businessImage.destroy({
      //   where: {
      //     id: requestdata.image_id,
      //     businessId: req.user.id
      //   }
      // });
      let msg = "Image deleted successfully";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: {}
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },
  /////guest login/////
  guest_login: async function(req, res) {
    try {
      const required = {
        security_key: req.headers.security_key,
        email: req.body.email,
        password: req.body.password
      };
      const non_required = {
        deviceToken: req.body.deviceToken,
        deviceType: req.body.deviceType
      };
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      const userRoleModels = {
        0: "adminDetail",
        1: "userDetail"
      };
      let hashdata = bcrypt.hashSync(req.body.password, salt);
      hash = hashdata.replace("$2b$", "$2y$");
      let user_login = await user.findOne({
        where: {
          email: req.body.email
          //password: hash,
        },
        raw: true
      });
      //console.log(user_login.id,'user_login=======');return
      //console.log(user_login,'kk===========');return
      if (user_login) {
        checkPassword = await helper.comparePass(
          requestdata.password,
          user_login.password
        );
        if (!checkPassword) {
          throw "Email or Password did not match, Please try again.";
        }
        let update_token = await user.update(
          {
            deviceToken: req.body.deviceToken,
            deviceType: req.body.deviceType
          },
          {
            where: {
              email: req.body.email
            }
          }
        );
        let getUsers = await user.findOne({
          where: {
            id: user_login.id
          },
          include: [
            {
              model: db[userRoleModels[user_login.role]]
            }
          ]
        });

        if (getUsers) getUsers = getUsers.toJSON();

        let userData = {
          id: getUsers.id,
          email: getUsers.email
        };

        let token = jwt.sign(
          {
            data: userData
          },
          secretKey
        );

        getUsers.token = token;

        let msg = "Login successfull";
        res.status(200).json({
          success: 1,
          code: 200,
          msg: msg,
          body: getUsers
        });
      } else {
        let msg = "Invalid login details";
        res.status(400).json({
          success: 0,
          code: 400,
          msg: msg,
          body: []
        });
        return false;
      }
    } catch (error) {
      return error(res, error);
    }
  },
  verify_otp: async (req, res) => {
    try {
      const required = {
        otp: req.body.otp
      };
      const non_required = {};
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      if (req.user.otp == requestdata.otp) {
        let verify = await user.update(
          {
            verified: 1
          },
          {
            where: {
              id: req.user.id
            }
          }
        );
        let finduser = await user.findOne({
          where: {
            id: req.user.id
          },
          raw: true
        });
        let msg = "Otp matched";
        res.status(200).json({
          success: 1,
          code: 200,
          msg: msg,
          body: finduser
        });
      } else {
        throw "Incorrect otp";
      }
    } catch (error) {
      return helper.error(res, error);
    }
  },
  resend_otp: async (req, res) => {
    try {
      const required = {};
      const non_required = {
        email: req.body.email
      };
      let requestdata = await helper.vaildObjectUser(
        required,
        non_required,
        res
      );
      var randomNumber = Math.floor(1000 + Math.random() * 9000);

      let html = "here is your otp " + randomNumber;
      let emailData = {
        to: req.body.email,
        subject: `${appName} OTP`,
        html: html
      };
      await helper.sendEmail(emailData);
      let updateOtp = await user.update(
        {
          otp: randomNumber
        },
        {
          where: {
            email: req.body.email
          }
        }
      );
      let msg = "Otp sent successfully";
      res.status(200).json({
        success: 1,
        code: 200,
        msg: msg,
        body: {}
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },

  deeplinking: async (req, res) => {
    try {

      const userId = req.params.userId;
      console.log("req.useragent",req.useragent);
      
      const useragent = req.useragent;
      const appName = "Picspop";

      const androidAppLink = `com.mypicpop://details`;
      // const iosAppLink = `com.mypicpop://details=${userId}`;
      const iosAppLink = `com.live.picpop://details`;
      // console.log(iosAppLink,"iosAppLink");return
      const playStoreLink = "https://play.google.com/store/apps/details?id=com.mypicpop";
      const appsStoreLink = "https://apps.apple.com/in/app/mypicspop/id1624688047";

      const appLink = useragent.isiPad || useragent.isiPod || useragent.isiPhone ? iosAppLink : androidAppLink;
      const storeLink = useragent.isiPad || useragent.isiPod || useragent.isiPhone || useragent.isSafari || useragent.isMac ?  appsStoreLink : playStoreLink;

      console.log(useragent, "=========================++>useragent");
      console.log(appLink, "=========================++>appLink");
      console.log(storeLink, "=========================++>storeLink");

      const shareUrl = `${req.protocol}://${req.get("host")}/share/${userId}`;
      res.render("deeplinking", {
        useragent,
        appName,
        appLink,
        storeLink,
        userId,
        shareUrl
      });
      //console.log(shareUrl);return;
    } catch (error) {
      throw error
    }
  },





  async share(req, res, next) {
    try {
      const userId = req.params.userId;
      const useragent = req.useragent;
      const appName = "Picspop";

      // const androidAppLink = `com.ballerpage://details?post_id=${userId}`;
      const androidAppLink = `com.mypicpop://details`;
      // const iosAppLink = `com.mypicpop://details?post_id=${userId}`;
      const iosAppLink = `com.live.picpop://details`;
      const playStoreLink =
      "https://play.google.com/store/apps/details?id=com.mypicpop";
      const appsStoreLink =
        "https://apps.apple.com/in/app/mypicspop/id1624688047";

      const appLink = useragent.isiPad || useragent.isiPod || useragent.isiPhone ? iosAppLink : androidAppLink;
      const storeLink = useragent.isiPad || useragent.isiPod || useragent.isiPhone || useragent.isSafari || useragent.isMac ? appsStoreLink : playStoreLink;

      console.log(useragent, "=========================++>useragent");
      console.log(appLink, "=========================++>appLink");
      console.log(storeLink, "=========================++>storeLink");

      const shareUrl = `${req.protocol}://${req.get(
        "host"
      )}/share/${userId}`;

      res.render("sharePage", {
        useragent,
        appName,
        appLink,
        storeLink,
        userId,
        shareUrl
      });
    } catch (err) {
      return Helper.error(res, err);
    }
  },



};

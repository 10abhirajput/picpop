const db = require("../../models");


const models = require("../../models");
const database = require("../../db/db");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const jwt = require("jsonwebtoken");
const helper = require("../../helpers/helper");
const constants = require("../../config/constants");
const secretKey = constants.jwtSecretKey;
const sub_category = db.userSubCategory;

// const User = db.users;
// const Group = db.groups;
// const Notification = db.notifications;
// const Post = db.posts;
// const Community = db.communities;
// const Journal = db.journals;
// const PostMedia = db.post_media;
// const PostComment = db.postComments;
// const SearchedUser = db.searchedUsers;

// Notification.belongsTo(models['user'], { foreignKey: "byUserId" });
// SearchedUser.belongsTo(models['user'], {
//   foreignKey: "searchedUserId",
//   as: "searchedUser"
// });

const model = 'user';



module.exports = {
  getProfile: async (req, res) => {
    try {
      const required = {
        securitykey: req.headers.securitykey
      };

      const nonRequired = {};

      let requestData = await helper.vaildObject(required, nonRequired);

      const getUser = await module.exports.findOneUser(req.user.id);
      if (getUser.role == 1) {
        delete getUser.adminDetail;
        delete getUser.driverDetail;
        delete getUser.vendorDetail;
      } else if (getUser.role == 2) {
        delete getUser.adminDetail;
        delete getUser.userDetail;
        delete getUser.vendorDetail;
      } else if (getUser.role == 3) {
        delete getUser.adminDetail;
        delete getUser.userDetail;
        delete getUser.driverDetail;
      }

      return helper.success(res, "User profile fetched successfully.", getUser);
    } catch (err) {
      return helper.error(res, err);
    }
  },
  getOtherUserProfile: async (req, res) => {
    try {
      const required = {
        securitykey: req.headers.securitykey,
        userId: req.body.userId,
        isSearch: req.body.isSearch // 0 => when not hit from searched listing, 1 => when hit from searched listing
      };

      const nonRequired = {};

      let requestData = await helper.vaildObject(required, nonRequired);

      let user = await models['user'].findOne({
        where: {
          id: requestData.userId
        },
        attributes: {
          include: [
            sequelize.literal(
              `IF (image='', '', CONCAT("${req.protocol}://${req.get(
                "host"
              )}/uploads/users/", image)) as image`
            ),
            [
              sequelize.literal(
                `IF((SELECT COUNT(*) FROM followers AS f WHERE f.followedId=users.id && f.followedById=${req.user.id}) >= 1, 1, 0)`
              ),
              "isFollowed"
            ],
            [
              sequelize.literal(
                `(SELECT COUNT(*) FROM followers AS f WHERE f.followedId=users.id)`
              ),
              "followers"
            ],
            [
              sequelize.literal(
                `(SELECT COUNT(*) FROM followers AS f WHERE f.followedById=users.id)`
              ),
              "followings"
            ],
            [
              sequelize.literal(
                `(SELECT COUNT(*) FROM posts AS p WHERE p.userId=users.id && p.status=1)`
              ),
              "posts"
            ]
          ],
          exclude: ["password"]
        },
        raw: true
      });
      if (!user) throw "Invalid userId.";

      if (requestData.isSearch == 1) {
        await SearchedUser.destroy({
          where: {
            userId: req.user.id,
            searchedUserId: requestData.userId
          }
        });

        const addSearchedUser = {
          userId: req.user.id,
          searchedUserId: requestData.userId
        };
        await helper.save(SearchedUser, addSearchedUser);
      }

      const posts = await Post.findAll({
        where: {
          userId: requestData.userId,
          status: 1
        },
        include: [
          {
            model: User,
            required: true,
            where: {
              [Op.and]: [
                sequelize.literal(
                  `CASE WHEN user.id=${req.user.id} THEN 1 ELSE user.privacy!=1 && CASE WHEN user.privacy=0 THEN (SELECT COUNT(*) FROM followers as f WHERE f.followedById=${req.user.id} && f.followedId=user.id)!=0 WHEN user.privacy=2 THEN (SELECT COUNT(*) FROM group_members AS gm WHERE gm.groupId=user.privacyGroupId && gm.memberId=${req.user.id})!=0 ELSE 1 END END`
                )
              ]
            },
            attributes: [
              "id",
              "name",
              "email",
              // 'privacy',
              // 'privacyGroupId',
              // 'image',
              [
                sequelize.literal(
                  "IF(`user`.`image`='', '', CONCAT('" +
                  req.protocol +
                  "://" +
                  req.get("host") +
                  "/uploads/users/', `user`.`image`))"
                ),
                "image"
              ]
            ]
          },
          {
            model: Community
          },
          {
            model: Journal
          },
          {
            model: PostMedia,
            as: "postMedia",
            attributes: {
              include: [
                [
                  sequelize.literal(
                    "IF(`postMedia`.`media`='', '', CONCAT('" +
                    req.protocol +
                    "://" +
                    req.get("host") +
                    "/uploads/posts/', `postMedia`.`media`))"
                  ),
                  "media"
                ],
                [
                  sequelize.literal(
                    "IF(`postMedia`.`videoThumbnail`='', '', CONCAT('" +
                    req.protocol +
                    "://" +
                    req.get("host") +
                    "/uploads/posts/', `postMedia`.`videoThumbnail`))"
                  ),
                  "videoThumbnail"
                ]
              ]
            }
          },
          {
            model: PostComment,
            separate: true,
            order: [["id", "DESC"]]
          }
        ],
        attributes: {
          include: [
            [
              sequelize.literal(
                `IF((SELECT COUNT(*) FROM liked_posts as lp WHERE lp.userId=${req.user.id} && lp.postId=posts.id) >= 1, 1, 0)`
              ),
              "isLiked"
            ],
            [
              sequelize.literal(
                `(SELECT COUNT(DISTINCT(lp.userId)) FROM liked_posts as lp INNER JOIN users as u ON u.id=lp.userId WHERE lp.postId=posts.id)`
              ),
              "likesCount"
            ],
            [
              sequelize.literal(
                `(SELECT COUNT(*) FROM post_comments as pc INNER JOIN users as u ON u.id=pc.userId WHERE pc.postId=posts.id)`
              ),
              "commentsCount"
            ],
            [
              sequelize.literal(
                `IFNULL((SELECT ROUND(AVG(pr.rating),1) FROM post_ratings as pr INNER JOIN users as u ON u.id=pr.userId WHERE pr.postId=posts.id), 0)`
              ),
              "avgRating"
            ]
          ]
        },
        order: [["id", "DESC"]]
      });

      user.posts = posts;

      return helper.success(res, "User profile fetched successfully.", user);
    } catch (err) {
      return helper.error(res, err);
    }
  },
  editProfile: async (req, res) => {
    try {
      const required = {
        securitykey: req.headers.securitykey
      };

      const nonRequired = {
        name: req.body.name,
        email: req.body.email,
        // countryCode: req.body.countryCode,
        // phone: req.body.phone,
        location: req.body.location,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        image: req.files && req.files.image,
        imageFolders: {
          image: "users"
        }
      };

      let requestData = await helper.vaildObject(required, nonRequired);

      let checkUser = await models['user'].findOne({
        where: {
          id: req.user.id
        },
        attributes: [
          "email",
          ...(requestData.email
            ? [
              [
                sequelize.literal(
                  `(SELECT COUNT(*) FROM user as u WHERE u.email='${requestData.email}' && u.id!=${req.user.id})`
                ),
                "emailExists"
              ]
            ]
            : [[sequelize.literal("0"), "emailExists"]]),
          ...(requestData.countryCode && requestData.phone
            ? [
              [
                sequelize.literal(
                  `(SELECT COUNT(*) FROM user as u WHERE ( u.phone='${requestData.phone}' && u.countryCodePhone='${requestData.countryCode}${requestData.phone}' ) && u.id!=${req.user.id})`
                ),
                "phoneExists"
              ]
            ]
            : [[sequelize.literal("0"), "phoneExists"]])
        ],
        raw: true
      });

      if (checkUser.emailExists)
        throw "Email Already Exists, kindly use another.";
      if (!requestData.email) delete requestData["email"];

      if (checkUser.phoneExists)
        throw "Phone already exists, kindly use another.";

      if (requestData.image) {
        requestData['image'] = await helper.imageUpload(requestData.image, 'user');
      }

      requestData.id = req.user.id;
      const userId = await helper.save(models[model], requestData);
      const user = await module.exports.findOneUser(userId);
      console.log(user, '=================================================>user');

      user[userRoleModels[user.role]].id ? requestData.id = user[userRoleModels[user.role]].id : delete requestData.id;
      requestData.userId = user.id;

      await helper.save(models[userRoleModels[user.role]], requestData);

      let userData = {
        id: req.user.id,
        email: requestData.email ? requestData.email : checkUser.email
      };

      const nowTimestamp = helper.nowTimestamp();

      const updatedUser = await module.exports.findOneUser(userId);

      updatedUser.token = jwt.sign({
        data: userData,
        iat: nowTimestamp,
      }, secretKey);

      if (updatedUser.role == 1) {
        delete updatedUser.adminDetail;
        delete updatedUser.driverDetail;
        delete updatedUser.vendorDetail;
      } else if (user.role == 2) {
        delete updatedUser.adminDetail;
        delete updatedUser.userDetail;
        delete updatedUser.vendorDetail;
      } else if (updatedUser.role == 3) {
        delete updatedUser.adminDetail;
        delete updatedUser.userDetail;
        delete updatedUser.driverDetail;
      }

      return helper.success(res, "User profile updated successfully.", updatedUser);
    } catch (err) {
      return helper.error(res, err);
    }
  },
  changePassword: async (req, res) => {
    try {
      const required = {
        securitykey: req.headers.securitykey,
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword
      };

      const nonRequired = {
        imageFolders: {
          image: "users"
        }
      };

      let requestData = await helper.vaildObject(required, nonRequired);

      checkPassword = await helper.comparePass(
        requestData.oldPassword,
        req.user.password
      );
      if (!checkPassword) {
        throw "Old password did not match.";
      }

      requestData.password = helper.bcryptHash(requestData.newPassword);
      requestData.id = req.user.id;

      let user = await helper.save(models['user'], requestData, true, req);

      return helper.success(res, "User password changed successfully.", user);
    } catch (err) {
      return helper.error(res, err);
    }
  },

  checkPhoneBook: async (req, res) => {
    try {
      const required = {
        securitykey: req.headers.securitykey,
        numbers: req.body.numbers // comma seperated numbers
      };

      const nonRequired = {};

      let requestData = await helper.vaildObject(required, nonRequired);

      requestData.numbers = requestData.numbers.split(",");

      let users = await models['user'].findAll({
        where: {
          role: 1,
          otpVerified: 1,
          [Op.or]: [
            {
              phone: {
                [Op.in]: requestData.numbers
              }
            },
            {
              countryCodePhone: {
                [Op.in]: requestData.numbers
              }
            }
          ]
        },
        attributes: {
          include: [
            sequelize.literal(
              `IF (image='', '', CONCAT("${req.protocol}://${req.get(
                "host"
              )}/uploads/users/", image)) as image`
            )
          ],
          exclude: ["password"]
        },
        order: [["id", "DESC"]],
        raw: true
      });

      return helper.success(res, "Uses searched successfully.", users);
    } catch (err) {
      return helper.error(res, err, []);
    }
  },
  notificationListing: async (req, res) => {
    try {
      const required = {
        securitykey: req.headers.securitykey
      };

      const nonRequired = {};

      let requestData = await helper.vaildObject(required, nonRequired);

      let notifications = await Notification.findAll({
        where: {
          toUserId: req.user.id
        },
        include: [
          {
            model: models['user'],
            required: false,
            attributes: [
              "id",
              "name",
              "email",
              [
                sequelize.literal(
                  `IF (user.image='', '', CONCAT("${req.protocol}://${req.get(
                    "host"
                  )}/uploads/users/", user.image))`
                ),
                "image"
              ]
            ]
          }
        ],
        order: [["id", "DESC"]]
        // raw: true
      });

      return helper.success(
        res,
        "Notifications fetched successfully.",
        notifications
      );
    } catch (err) {
      return helper.error(res, err, []);
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const required = {
        securitykey: req.headers.securitykey,
        email: req.body.email
      };

      const nonRequired = {};

      let requestData = await helper.vaildObject(required, nonRequired);

      let existingUser = await models['user'].findOne({
        where: {
          email: requestData.email
        },
        raw: true
      });
      if (!existingUser) throw 'Email does not exist.';

      existingUser.forgotPasswordHash = helper.createSHA1();


      let html = `Click here to change your password <a href="${req.protocol}://${req.get('host')}/api/forgot_url/${existingUser.forgotPasswordHash}"> Click</a>`;

      let emailData = {
        to: requestData.email,
        subject: `${appName} Forgot Password`,
        html: html
      };

      await helper.sendEmail(emailData);

      const user = await helper.save(models['user'], existingUser, true);

      return helper.success(res, 'Forgot Password email sent successfully.', {});
    } catch (err) {
      return helper.error(res, err);
    }
  },
  forgotUrl: async (req, res) => {
    try {
      let user = await models['user'].findOne({
        where: {
          forgotPasswordHash: req.params.hash
        }
      });

      if (user) {
        res.render("admin/reset_password", {
          title: appName,
          response: user,
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

      const user = await models['user'].findOne({
        where: {
          forgotPasswordHash
        },
        raw: true
      });
      if (!user) throw "Something went wrong.";

      const updateObj = {};
      updateObj.password = await helper.bcryptHash(password);
      updateObj.forgotPasswordHash = '';
      updateObj.id = user.id;

      const updatedUser = await helper.save(models['user'], updateObj);

      if (updatedUser) {
        return helper.success(res, 'Password updated successfully.', {});
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
  changePrivacy: async (req, res) => {
    try {
      const required = {
        securitykey: req.headers.securitykey,
        type: req.body.type // 0=>public, 1=>private, 2=>group
      };

      const nonRequired = {};

      const validTypes = [0, 1, 2];
      if (!validTypes.includes(parseInt(required.type))) throw "Invalid type.";

      if (required.hasOwnProperty("type") && required.type == 2) {
        required["groupId"] = req.body.groupId;
      } else {
        required["privacyGroupId"] = 0;
      }

      let requestData = await helper.vaildObject(required, nonRequired);

      if (requestData.hasOwnProperty("groupId")) {
        let group = await Group.findOne({
          where: {
            id: requestData.groupId,
            userId: req.user.id
          },
          raw: true
        });
        if (!group) throw "Invaid groupId.";
        requestData["privacyGroupId"] = requestData["groupId"];
      }
      requestData["id"] = req.user.id;
      requestData["privacy"] = requestData.type;

      await helper.save(models['user'], requestData);

      return helper.success(res, "Privacy changed successfully.", {});
    } catch (err) {
      return helper.error(res, err, {});
    }
  },
  notificationsOnOff: async (req, res) => {
    try {
      const required = {
        securitykey: req.headers.securitykey,
        type: req.body.type, // 0=>off, 1=>on
        imageFolders: {
          image: "users"
        }
      };

      const nonRequired = {};

      const validTypes = [0, 1];
      if (!validTypes.includes(parseInt(required.type))) throw "Invalid type.";


      let requestData = await helper.vaildObject(required, nonRequired);

      requestData["id"] = req.user.id;
      requestData["notifications"] = requestData.type;

      const user = await helper.save(models['user'], requestData, true, req);

      return helper.success(res, `Notifications turned ${requestData.type == 1 ? 'on' : 'off'} successfully.`, user);
    } catch (err) {
      return helper.error(res, err, {});
    }
  },
  searchUser: async (req, res) => {
    try {
      const required = {
        securitykey: req.headers.securitykey,
        keyWord: req.body.keyWord
      };

      const nonRequired = {};

      let requestData = await helper.vaildObject(required, nonRequired);

      let users = await models['user'].findAll({
        where: {
          id: {
            [Op.ne]: req.user.id
          },
          role: 1,
          [Op.or]: [
            {
              email: {
                [Op.like]: `%${requestData.keyWord}%`
              }
            },
            {
              name: {
                [Op.like]: `%${requestData.keyWord}%`
              }
            },
            {
              phone: {
                [Op.like]: `%${requestData.keyWord}%`
              }
            },
            {
              countryCodePhone: {
                [Op.like]: `%${requestData.keyWord}%`
              }
            }
          ]
        },
        attributes: {
          include: [
            sequelize.literal(
              `IF (image='', '', CONCAT("${req.protocol}://${req.get(
                "host"
              )}/uploads/users/", image)) as image`
            )
          ],
          exclude: ["password"]
        },
        raw: true
      });

      return helper.success(res, "User searched successfully.", users);
    } catch (err) {
      return helper.error(res, err, []);
    }
  },
  recentSearchedUsers: async (req, res) => {
    try {
      const required = {
        securitykey: req.headers.securitykey
      };

      const nonRequired = {};

      let requestData = await helper.vaildObject(required, nonRequired);

      let users = await SearchedUser.findAll({
        where: {
          userId: req.user.id
        },
        include: [
          {
            model: User,
            as: "searchedUser",
            required: true,
            attributes: []
          }
        ],
        attributes: [
          sequelize.col("searchedUser.*"),
          [
            sequelize.literal(
              "IF (`searchedUser`.`image`='', '', CONCAT('" +
              req.protocol +
              "://" +
              req.get("host") +
              "/uploads/users/', `searchedUser`.`image`))"
            ),
            "image"
          ],
          "createdAt"
        ],
        order: [[sequelize.col("searchedUser.id"), "DESC"]],
        raw: true,
        nest: true
      });

      users = users.map(user => {
        delete user.password;
        return user;
      });

      return helper.success(
        res,
        "Recent searched users fetched successfully.",
        users
      );
    } catch (err) {
      return helper.error(res, err, []);
    }
  },
  clearRecentSearchedUsers: async (req, res) => {
    try {
      const required = {
        securitykey: req.headers.securitykey
      };

      const nonRequired = {};

      let requestData = await helper.vaildObject(required, nonRequired);

      await SearchedUser.destroy({
        where: {
          userId: req.user.id
        }
      });

      return helper.success(
        res,
        "Recent searched users cleared successfully.",
        {}
      );
    } catch (err) {
      return helper.error(res, err, []);
    }
  },
  findOneUser: async (id) => {
    let user = await models[model].findOne({
      where: {
        id
      },
      attributes: {
        exclude: 'password'
      },
      include: [
        {

          model: models['adminDetail'],
          attributes: {
            include: [
              [sequelize.literal(`(IF (adminDetail.image='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', adminDetail.image)) )`), 'image']
            ]
          }
        },
        {

          model: models['userDetail'],
          attributes: {
            include: [
              [sequelize.literal(`(IF (userDetail.image='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', userDetail.image)) )`), 'image']
            ]
          }
        },
        {
          model: models['driverDetail'],
          attributes: {
            include: [
              [sequelize.literal(`(IF (driverDetail.image='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', driverDetail.image)) )`), 'image']
            ]
          }
        },
        {
          model: models['vendorDetail'],
          attributes: {
            include: [
              [sequelize.literal(`(IF (vendorDetail.image='', '${baseUrl}/uploads/default/avatar-1.png', CONCAT('${baseUrl}/uploads/user/', vendorDetail.image)) )`), 'image']
            ]
          }
        },
      ],
      // raw: true,
      // nest: true,
    });

    if (user) user = user.toJSON();
    return user;
  },

  findOne: async (req, where = {}, modifyObj = {}) => {
    return await models[model].findOne({
      where: {
        ...where,
      },
      ...modifyObj
    }).then(async user => {
      if (!user) return user;
      user = user.toJSON();

      delete user.password;

      const detail = await models[userRoleModels[user.role]].findOne({
        where: {
          userId: user.id,
        },
        attributes: {
          include: [
            helper.makeImageUrlSql(userRoleModels[user.role], 'image', modelImageFolder[user.role]),
            ['id', 'detailId'],

            ...(
              user.hasOwnProperty('role') && (user.role == 2 || user.role == 3)
                ? [
                  [sequelize.literal(`(SELECT COUNT(*) FROM reviews AS br WHERE br.businessId=${user.id})`), 'ratingCount'],
                  [sequelize.literal(`ifnull((SELECT AVG(br.rating) FROM reviews AS br WHERE br.businessId=${user.id}),0)`), 'avgRating'],

                ] : []
            ),
          ],
          exclude: [
            'id',
            'isFav'
          ],
        },

      })
        .then(detailData => detailData ? detailData.toJSON() : detailData);

      if (detail) {
        user = {
          ...user,
          ...detail,
        }
      }

      return user;
    });
  }
};

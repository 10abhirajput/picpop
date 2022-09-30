const models = require("../../models");
const helper = require("../../helpers/helper");
const Paginator = require("paginator");
const sequelize = require("sequelize");
const { request } = require("express");
const { Op } = sequelize;
// const User = models.user;
// const UserDetail = models.userDetail;
// const DriverDetail = models.driverDetail;

const model = "reviews";
const modelTitle = "Review";
const modelDataTable = "";

const roleTypes = {
  0: "Admin",
  1: "User",
  2: "Location Owner",
  3: "Business Professional"
};
const userRoleModels = {
  0: "adminetail",
  1: "userDetail",
  2: "locationOwnerdetail",
  3: "businessProfessionalDetail"
};

module.exports = {
  listing: async (req, res) => {
    try {
      global.currentModule = "Review";
      // global.currentSubModule = '';
      // global.currentSubModuleSidebar = '';

      const listing = await models[model]
        .findAll({
          include: [
            {
              model: models["user"],
              as: "user",
              // required: true,
              include: [
                {
                  model: models["userDetail"]
                }
              ]
            },
            {
              model: models["businessProfessionalDetail"]
              // required:
            },
            {
              model: models["locationOwnerDetail"]
              // required: true
            }
          ],
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
        date: "Date",
        UserName: "User Name",
        serviceProvider: "Service provider Name",
        type: "Role",
        rating: "Rating",
        review: "Review"
      });

      const createStars = rating => {
        rating = parseInt(rating);
        let html = "";
        if (rating > 0) {
          for (i = 1; i <= rating; i++) {
            html += '<span class="fa fa-star rating_star_checked"></span>';
          }
        }

        for (i = 1; i <= 5 - rating; i++) {
          html += '<span class="fa fa-star"></span>';
        }
        return html;
      };

      const data = listing.map((Review, index) => {
        console.log(JSON.stringify(Review));

        const roleBased = {
          0: {
            user: " ",
            role: " "
          },
          2: {
            user: `${Review.locationOwnerDetail!=null ? Review.locationOwnerDetail.name:'abc'}<br/>`,
            role: '<div class="badge badge-danger">Location Owner</div>'
          },
          3: {
            user: `${
              Review.businessProfessionalDetail!=null
                ? Review.businessProfessionalDetail.name
                : "xyz"
            }<br/>`,
            role: '<div class="badge badge-dark">Business Professional</div>'
          }
        };

        console.log(Review)
        return Object.values({
          sno: parseInt(index) + 1,
          date: moment(Review.createdAt).format("YYYY-MM-DD"),
          name: Review.user.userDetail.name,
          serviceProviderName: roleBased[Review.role].user,
          role: roleBased[Review.role].role,
          rating: createStars(Review.rating),
          review: Review.review
        });
      });

      return res.render("admin/review/listing", { headerColumns, data });
    } catch (err) {
      return helper.error(res, err);
    }
  }
};

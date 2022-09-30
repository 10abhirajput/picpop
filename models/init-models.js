var DataTypes = require("sequelize").DataTypes;
var _bookings = require("./bookings");

function initModels(sequelize) {
  var bookings = _bookings(sequelize, DataTypes);


  return {
    bookings,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

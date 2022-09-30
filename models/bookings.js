const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const bookings = sequelize.define(
    "bookings",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      serviceProviderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bussinessUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      locationOwnerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      locationUserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      order_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: "order_id"
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: "userId"
      },
      cardId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: 'cardId',
          },
      location: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'location',
      },
      startBookingDate: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'startBookingDate',
      },
      endBookingDate: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'endBookingDate',
      },
      lat: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      lng: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "0=>pending 1=>accept 2=>reject",
      },
      status2: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'status2',
        comment: "0=>pending 1=>accept 2=>reject",
      },
    },
    {
      sequelize,
      tableName: "bookings",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
      ],
    }
  );
  bookings.associate = (models) => {
    bookings.belongsTo(models.user, {
      foreignKey: "userId",
      onDelete: "cascade",
      hooks: false,
    });
    bookings.belongsTo(models.businessProfessionalDetail, {
      foreignKey: "serviceProviderId",
      onDelete: "cascade",
      hooks: false,
    });
    // bookings.hasMany(models.locationOwnerDetailImage,{foreignKey: "serviceProviderId",sourceKey: "locationid" });
    bookings.hasMany(models.locationOwnerDetailImage,{foreignKey:'locationid',sourceKey: "locationOwnerId"})

    bookings.belongsTo(models.businessImage, {
      foreignKey: "serviceProviderId",
      targetKey: "businessId"

    });
    bookings.belongsTo(models.locationOwnerDetail, {
      foreignKey: "locationOwnerId",
      onDelete: "cascade",
      hooks: false,
    });
    bookings.belongsTo(models.category, {
      foreignKey: "categoryId",
      onDelete: "cascade",
      hooks: false,
    });
  };
  return bookings;
};

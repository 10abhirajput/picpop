const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  const card_payment = sequelize.define(
    "card_payment",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      serviceProviderId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      bussinessUserId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      locationOwnerId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      locationUserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      booking_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: "booking_id"
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: "userId"
      },
      locationPrice: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true,
        field: 'locationPrice',
        defaultValue: " ",

      },
      comission: {
        type: DataTypes.DECIMAL(7,2),
        allowNull: false,
        field: 'comission',
        defaultValue: 0.00,
      },
      locationComission: {
        type: DataTypes.DECIMAL(7,2),
        allowNull: false,
        field: 'locationComission',
        defaultValue: "",
      },
      serviceProviderPrice: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        field: 'serviceProviderPrice',
        defaultValue: " ",
      },
      businesComission: {
        type: DataTypes.DECIMAL(7,2),
        allowNull: true,
        field: 'businesComission',
      },
      cardId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: "cardId"
      },
      statuslocation: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "0=>pending 1=>accept 2=>reject"
      },
      statusbusines: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "statusbusines",
        comment: "0=>pending 1=>accept 2=>reject"
      }
    },
    {
      sequelize,
      tableName: "card_payment",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }]
        }
      ]
    }
  );
  card_payment.associate = models => {
    card_payment.belongsTo(models.user, {
        foreignKey: "userId",
        onDelete: "cascade",
        hooks: false,
      });
    card_payment.belongsTo(models.locationOwnerDetail, {
        foreignKey: "locationOwnerId",
        onDelete: "cascade",
        hooks: false,
      });
      card_payment.belongsTo(models.businessProfessionalDetail, {
        foreignKey: "serviceProviderId",
        onDelete: "cascade",
        hooks: false,
      });
  };
  return card_payment;
};

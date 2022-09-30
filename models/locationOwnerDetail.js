const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const locationOwnerDetail = sequelize.define('locationOwnerDetail', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    locationName:{
      type: DataTypes.STRING(200),
      allowNull: true
    }, 
    name:{
      type: DataTypes.STRING(200),
      allowNull: true
    }, 
    isFav: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    loc_email:{
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'loc_email',
    },
    loc_phone:{
      type: DataTypes.STRING(40),
      allowNull: true,
      field: 'loc_phone',
    },
    loc_country_code:{
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    adress: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    latitude: {
      type: DataTypes.DECIMAL(10,8),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(11,8),
      allowNull: true
    },
    hourOfOpration: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    PricePerDay: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    image:{
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'image',
			defaultValue: ''
    },
    offrerPricePerDay: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    offers: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    about: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'locationOwnerDetail',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  })

  locationOwnerDetail.associate = models => {
    locationOwnerDetail.hasMany(models.locationOwnerDetailImage, {foreignKey: 'locationid', onDelete: 'cascade', hooks: false });
    locationOwnerDetail.belongsTo(models.user, {foreignKey: 'userId', onDelete: 'cascade', hooks: false });

		// User.belongsTo(models.bookings, { foreignKey: 'userId', onDelete: 'cascade', hooks: false });
		// locationOwnerDetail.hasMany(models.notification, { onDelete: 'cascade', hooks: false });

	};
  return locationOwnerDetail;
};

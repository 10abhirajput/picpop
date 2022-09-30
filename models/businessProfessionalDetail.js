const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const businessProfessionalDetail =  sequelize.define('businessProfessionalDetail', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    businessName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    businessPhone: {
      type: DataTypes.BIGINT(16),
      allowNull: true
    },
    countryCode: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    businessEmail: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    adress: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    image: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    socialImage: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    zipCode: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    apt: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    state: {
      type: DataTypes.STRING(255),
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
    about: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    gender: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isFav: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "1= yes 0= no"
    },
    speciality:{
      type: DataTypes.STRING(255),
      allowNull: true
    },
    isShowAddressOther: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    },
    hourOfOprations: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    PricePerService: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    offers: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    offerPrice: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    created: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    updated: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'businessProfessionalDetail',
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
      {
        name: "cascade_delete_user_detail_user_idx",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
    ]
  }); 

  businessProfessionalDetail.associate = models => {
    businessProfessionalDetail.belongsTo(models.category, {foreignKey: 'categoryId', onDelete: 'cascade', hooks: false });
    businessProfessionalDetail.hasMany(models.businessImage, {foreignKey: "businessId", onDelete: 'cascade', hooks: false });
	};
  return businessProfessionalDetail;
};

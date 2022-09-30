/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	const carRentalDealerDetail = sequelize.define('carRentalDealerDetail', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		name: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'name',
			defaultValue: '',
		},
		image: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'image',
			defaultValue: '',
		},
		location: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'location',
			defaultValue: '',
		},
		latitude: {
			type: DataTypes.DECIMAL(10,8),
			allowNull: false,
			field: 'latitude',
			defaultValue: 0,
		},
		longitude: {
			type: DataTypes.DECIMAL(11,8),
			allowNull: false,
			field: 'longitude',
			defaultValue: 0,
		},
		created: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'created'
		},
		updated: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'updated'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'createdAt'
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'updatedAt'
		}
	}, {
		tableName: 'carRentalDealerDetail',
		hooks : {
			beforeCreate : (record, options) => {
				record.dataValues.created = Math.round(new Date().getTime() / 1000);
				record.dataValues.updated = Math.round(new Date().getTime() / 1000);
			},
			beforeUpdate : (record, options) => {
				record.dataValues.updated = Math.round(new Date().getTime() / 1000);
			},
			beforeBulkCreate : (records, options) => {
				if (Array.isArray(records)) {
					records.forEach(function (record) {
						record.dataValues.created = Math.round(new Date().getTime() / 1000);
						record.dataValues.updated = Math.round(new Date().getTime() / 1000);
					});
				}
			},
			beforeBulkUpdate : (records, options) => {
				if (Array.isArray(records)) {
					records.forEach(function (record) {
						record.dataValues.updated = Math.round(new Date().getTime() / 1000);
					});
				}
			}
		}
	});

	carRentalDealerDetail.associate = models => {
		carRentalDealerDetail.belongsTo(models.user, { onDelete: 'cascade', hooks: false });
		carRentalDealerDetail.hasMany(models.carRentalBrands, { foreignKey: 'carRentalDealerDetailId', onDelete: 'cascade', hooks: false });		
		// carRentalDealerDetail.belongsTo(models.restaurantType, { onDelete: 'cascade', hooks: false });
		// carRentalDealerDetail.belongsTo(models.foodType, { onDelete: 'cascade', hooks: false });
		// carRentalDealerDetail.hasMany(models.restaurantFoodTypes, { foreignKey: 'carRentalDealerDetailId', onDelete: 'cascade', hooks: false });		
		// User.hasOne(models.foodType, { as: 'restaurant', onDelete: 'cascade', hooks: false });
	};

	return carRentalDealerDetail;
};

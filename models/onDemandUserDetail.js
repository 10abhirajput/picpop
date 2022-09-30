/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	const onDemandUserDetail = sequelize.define('onDemandUserDetail', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		userId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'userId',
			defaultValue: 0,
		},
		onDemandUserCategoryId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'onDemandUserCategoryId',
			defaultValue: 0,
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
			type: DataTypes.DECIMAL(10, 8),
			allowNull: false,
			field: 'latitude',
			defaultValue: 0,
		},
		longitude: {
			type: DataTypes.DECIMAL(11, 8),
			allowNull: false,
			field: 'longitude',
			defaultValue: 0,
		},
		price: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'price',
			defaultValue: 0,
		},
		shopName: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'shopName',
			defaultValue: '',
		},
		aboutMe: {
			type: DataTypes.TEXT(),
			allowNull: false,
			field: 'aboutMe',
			defaultValue: '',
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
		tableName: 'onDemandUserDetail',
		hooks: {
			beforeCreate: (record, options) => {
				record.dataValues.created = Math.round(new Date().getTime() / 1000);
				record.dataValues.updated = Math.round(new Date().getTime() / 1000);
			},
			beforeUpdate: (record, options) => {
				record.dataValues.updated = Math.round(new Date().getTime() / 1000);
			},
			beforeBulkCreate: (records, options) => {
				if (Array.isArray(records)) {
					records.forEach(function (record) {
						record.dataValues.created = Math.round(new Date().getTime() / 1000);
						record.dataValues.updated = Math.round(new Date().getTime() / 1000);
					});
				}
			},
			beforeBulkUpdate: (records, options) => {
				if (Array.isArray(records)) {
					records.forEach(function (record) {
						record.dataValues.updated = Math.round(new Date().getTime() / 1000);
					});
				}
			}
		}
	});

	onDemandUserDetail.associate = models => {
		onDemandUserDetail.belongsTo(models.user, { onDelete: 'cascade', hooks: false });
		onDemandUserDetail.belongsTo(models.onDemandUserCategories, { onDelete: 'cascade', hooks: false });
		// onDemandUserDetail.hasMany(models.carRentalBrands, { foreignKey: 'onDemandUserDetailId', onDelete: 'cascade', hooks: false });		
		// onDemandUserDetail.belongsTo(models.foodType, { onDelete: 'cascade', hooks: false });
		// onDemandUserDetail.hasMany(models.restaurantFoodTypes, { foreignKey: 'onDemandUserDetailId', onDelete: 'cascade', hooks: false });		
		// User.hasOne(models.foodType, { as: 'restaurant', onDelete: 'cascade', hooks: false });
	};

	return onDemandUserDetail;
};

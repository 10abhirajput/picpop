/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	const restaurantDetail = sequelize.define('restaurantDetail', {
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
		restaurantTypeId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'restaurantTypeId',
			defaultValue: 0,
		},
		foodTypeId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'foodTypeId',
			defaultValue: 0,
		},
		name: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'name',
			defaultValue: '',
		},
		description: {
			type: DataTypes.TEXT(),
			allowNull: false,
			field: 'description',
			defaultValue: '',
		},
		coverImage: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'coverImage',
			defaultValue: '',
		},
		address: {
			type: DataTypes.TEXT(),
			allowNull: false,
			field: 'address',
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
		tableName: 'restaurantDetail',
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

	restaurantDetail.associate = models => {
		restaurantDetail.belongsTo(models.user, { onDelete: 'cascade', hooks: false });
		restaurantDetail.belongsTo(models.restaurantType, { onDelete: 'cascade', hooks: false });
		restaurantDetail.belongsTo(models.foodType, { onDelete: 'cascade', hooks: false });
		restaurantDetail.hasMany(models.restaurantImages, { foreignKey: 'restaurantDetailId', onDelete: 'cascade', hooks: false });		
		restaurantDetail.hasMany(models.restaurantFoodTypes, { foreignKey: 'restaurantDetailId', onDelete: 'cascade', hooks: false });		
		// User.hasOne(models.foodType, { as: 'restaurant', onDelete: 'cascade', hooks: false });
	};

	return restaurantDetail;
};

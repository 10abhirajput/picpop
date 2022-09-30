/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	const carRentalBrandCars = sequelize.define('carRentalBrandCars', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		carRentalDealerDetailId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'carRentalDealerDetailId',
			defaultValue: 0,
		},
		carRentalBrandId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'carRentalBrandId',
			defaultValue: 0,
		},
		carRentalCarTypeId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'carRentalCarTypeId',
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
		model: {
			type: DataTypes.STRING(4),
			allowNull: false,
			field: 'model',
			defaultValue: '',
		},
		price: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'price',
			defaultValue: 0,
		},
		amount: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'amount',
			defaultValue: 0,
		},
		about: {
			type: DataTypes.TEXT(),
			allowNull: false,
			field: 'about',
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
		tableName: 'carRentalBrandCars',
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

	carRentalBrandCars.associate = models => {
		carRentalBrandCars.belongsTo(models.carRentalDealerDetail, { foreignKey: 'carRentalDealerDetailId', onDelete: 'cascade', hooks: false });
		carRentalBrandCars.belongsTo(models.carRentalCarTypes, { foreignKey: 'carRentalCarTypeId', onDelete: 'cascade', hooks: false });
		carRentalBrandCars.belongsTo(models.carRentalBrands, { foreignKey: 'carRentalBrandId', onDelete: 'cascade', hooks: false });
	};
	
	return carRentalBrandCars;
};

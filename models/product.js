/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	const product = sequelize.define('product', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		status: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
			field: 'status',
			defaultValue: 0,
		},
		taxCategoryId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'taxCategoryId',
			defaultValue: 0,
		},
		vendorId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'vendorId',
			defaultValue: 0,
		},
		categoryId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'categoryId',
			defaultValue: 0,
		},
		subCategoryId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'subCategoryId',
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
		image: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'image',
			defaultValue: '',
		},
		brandName: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'brandName',
			defaultValue: '',
		},
		minimumSellingPrice: {
			type: DataTypes.DECIMAL(9, 2),
			allowNull: false,
			field: 'minimumSellingPrice',
			defaultValue: 0,
		},
		percentageDiscount: {
			type: DataTypes.INTEGER(6),
			allowNull: false,
			field: 'percentageDiscount',
			defaultValue: 0,
		},
		length: {
			type: DataTypes.DECIMAL(7, 2),
			allowNull: false,
			field: 'length',
			defaultValue: 0,
		},
		width: {
			type: DataTypes.DECIMAL(7, 2),
			allowNull: false,
			field: 'width',
			defaultValue: 0,
		},
		height: {
			type: DataTypes.DECIMAL(7, 2),
			allowNull: false,
			field: 'height',
			defaultValue: 0,
		},
		dimensionsUnit: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
			field: 'dimensionsUnit',
			defaultValue: 0,
		},
		weight: {
			type: DataTypes.DECIMAL(7, 2),
			allowNull: false,
			field: 'weight',
			defaultValue: 0,
		},
		weightUnit: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
			field: 'weightUnit',
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
		tableName: 'product',
		hooks: {
			beforeCreate: (record, options) => {
				record.dataValues.created = Math.round(new Date().getTime() / 1000);
				record.dataValues.updated = Math.round(new Date().getTime() / 1000);
			},
			beforeUpdate: (record, options) => {
				// console.log(record, '==================================>beforeUpdate')
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
				// console.log(records, '==========================>records'); 
				// console.log(options, '==========================>options'); 
				// return;
				if (Array.isArray(records)) {
					records.forEach(function (record) {
						record.dataValues.updated = Math.round(new Date().getTime() / 1000);
					});
				}
			}
		}
	});

	product.associate = models => {
		product.belongsTo(models.user, { foreignKey: 'vendorId', as: 'vendor', hooks: false });
		product.belongsTo(models.taxCategory, { foreignKey: 'taxCategoryId', hooks: false });
	};

	return product;
};

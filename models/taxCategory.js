/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	const taxCategory = sequelize.define('taxCategory', {
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
			defaultValue: 1,
		},
		vendorId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'vendorId',
			defaultValue: 0,
		},
		taxCategory: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'taxCategory',
			defaultValue: '',
		},
		taxInPercent: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'taxInPercent',
			defaultValue: '',
		},
		taxValue: {
			type: DataTypes.INTEGER(6),
			allowNull: false,
			field: 'taxValue',
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
		tableName: 'taxCategory',
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

	taxCategory.associate = models => {
		// taxCategory.belongsTo(models.user, { foreignKey: 'vendorId', as: 'vendor',  hooks: false });
	};

	return taxCategory;
};

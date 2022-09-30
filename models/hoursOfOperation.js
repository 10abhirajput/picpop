/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	const hoursOfOperation = sequelize.define('hoursOfOperation', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		userId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'userId',
			defaultValue: 0,
		},
		sortOrder: {
			type: DataTypes.STRING(4),
			allowNull: true,
			field: 'sortOrder',
			defaultValue: 0,
		},
		day: {
			type: DataTypes.STRING(10),
			allowNull: true,
			field: 'day',
			defaultValue: '',
		},
		timeFrom: {
			type: DataTypes.STRING(20),
			allowNull: true,
			field: 'timeFrom',
			defaultValue: '',
		},
		timeTo: {
			type: DataTypes.STRING(20),
			allowNull: true,
			field: 'timeTo',
			defaultValue: '',
		},
		isActive: {
			type: DataTypes.INTEGER(4),
			allowNull: true,
			field: 'isActive',
			defaultValue: 0,
		},
		isOpen: {
			type: DataTypes.INTEGER(4),
			allowNull: true,
			field: 'isOpen',
			defaultValue: 0,
		},
		created: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'created'
		},
		updated: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'updated'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'createdAt'
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'updatedAt'
		}
	}, {
		tableName: 'hoursOfOperation',
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

	// vendorDeliveryOptions.associate = models => {
	// 	// vendorDeliveryOptions.belongsTo(models.vendorDeliveryOptions, { foreignKey: 'parentId' });
	// };

	return hoursOfOperation;
};

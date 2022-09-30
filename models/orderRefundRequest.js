/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	const orderCancellationRequest = sequelize.define('orderRefundRequest', {
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
		orderId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'orderId',
			defaultValue: 0,
		},
		customerId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'customerId',
			defaultValue: 0,
		},
		vendorId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'vendorId',
			defaultValue: 0,
		},
		reason: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'reason',
			defaultValue: '',
		},
		comments: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'comments',
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
		tableName: 'orderRefundRequest',
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

	orderCancellationRequest.associate = models => {
		orderCancellationRequest.belongsTo(models.user, { foreignKey: 'customerId', as: 'customer', hooks: false });
		orderCancellationRequest.belongsTo(models.user, { foreignKey: 'vendorId', as: 'vendor', hooks: false });
		orderCancellationRequest.belongsTo(models.order, { foreignKey: 'orderId', hooks: false });
	};

	return orderCancellationRequest;
};

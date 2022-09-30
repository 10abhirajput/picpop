/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	const Order = sequelize.define('order', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		orderNo: {
			type: DataTypes.STRING(40),
			allowNull: false,
			field: 'orderNo',
			defaultValue: '',
		},
		orderStatus: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
			field: 'orderStatus',
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
		featurePlanId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'featurePlanId',
			defaultValue: 0,
		},
		netAmount: {
			type: DataTypes.DECIMAL(9, 2),
			allowNull: false,
			field: 'netAmount',
			defaultValue: 0,
		},
		qty: {
			type: DataTypes.INTEGER(9),
			allowNull: false,
			field: 'qty',
			defaultValue: 0,
		},
		taxCharged: {
			type: DataTypes.DECIMAL(9, 2),
			allowNull: false,
			field: 'taxCharged',
			defaultValue: 0,
		},
		shippingCharges: {
			type: DataTypes.DECIMAL(9, 2),
			allowNull: false,
			field: 'shippingCharges',
			defaultValue: 0,
		},
		adminCommission: {
			type: DataTypes.DECIMAL(9, 2),
			allowNull: false,
			field: 'adminCommission',
			defaultValue: 0,
		},
		total: {
			type: DataTypes.DECIMAL(9, 2),
			allowNull: false,
			field: 'total',
			defaultValue: 0,
		},
		paymentMethod: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
			field: 'paymentMethod',
			defaultValue: 0,
		},
		deliveryDate: {
			type: DataTypes.DATE(),
			allowNull: false,
			field: 'deliveryDate',
			defaultValue: '0000-00-00',
		},
		deliverySlot: {
			type: DataTypes.STRING(40),
			allowNull: false,
			field: 'deliverySlot',
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
		tableName: 'order',
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

	Order.associate = models => {
		Order.belongsTo(models.user, { foreignKey: 'customerId', as: 'customer', hooks: false });
		Order.belongsTo(models.user, { foreignKey: 'vendorId', as: 'vendor', hooks: false });
		Order.belongsTo(models.featurePlan, { foreignKey: 'featurePlanId', hooks: false });
		Order.hasMany(models.orderItem, { foreignKey: 'orderId', hooks: false });
	};

	return Order;
};

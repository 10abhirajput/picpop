/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('vendorDetail', {
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
		phone: {
			type: DataTypes.STRING(15),
			allowNull: false,
			field: 'phone',
			defaultValue: '',
		},
		shopName: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'shopName',
			defaultValue: '',
		},
		shopLogo: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'shopLogo',
			defaultValue: '',
		},
		city: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'city',
			defaultValue: '',
		},
		state: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'state',
			defaultValue: '',
		},
		country: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'country',
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
		geoLocation: {
			type: DataTypes.TEXT(),
			allowNull: false,
			field: 'geoLocation',
			defaultValue: '',
		},
		shopAddress: {
			type: DataTypes.TEXT(),
			allowNull: false,
			field: 'shopAddress',
			defaultValue: '',
		},
		shopDescription: {
			type: DataTypes.TEXT(),
			allowNull: false,
			field: 'shopDescription',
			defaultValue: '',
		},
		paymentPolicy: {
			type: DataTypes.TEXT(),
			allowNull: false,
			field: 'paymentPolicy',
			defaultValue: '',
		},
		deliveryPolicy: {
			type: DataTypes.TEXT(),
			allowNull: false,
			field: 'deliveryPolicy',
			defaultValue: '',
		},
		sellerInformation: {
			type: DataTypes.TEXT(),
			allowNull: false,
			field: 'sellerInformation',
			defaultValue: '',
		},
		taxInPercent: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
			field: 'taxInPercent',
			defaultValue: 0,
		},
		taxValue: {
			type: DataTypes.INTEGER(6),
			allowNull: false,
			field: 'taxValue',
			defaultValue: 0,
		},
		bankName: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'bankName',
			defaultValue: '',
		},
		accountHolderName: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'accountHolderName',
			defaultValue: '',
		},
		accountNumber: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'accountNumber',
			defaultValue: '',
		},
		ifscSwiftCode: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'ifscSwiftCode',
			defaultValue: '',
		},
		bankAddress: {
			type: DataTypes.TEXT(),
			allowNull: false,
			field: 'bankAddress',
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
		tableName: 'vendorDetail',
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
};

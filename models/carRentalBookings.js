/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	const carRentalBookings = sequelize.define('carRentalBookings', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		type: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
			field: 'type',
			defaultValue: 0,
		},
		userId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'userId',
			defaultValue: 0,
		},
		carRentalBrandCarId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'carRentalBrandCarId',
			defaultValue: 0,
		},
		amount: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'amount',
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
		date: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'date',
			defaultValue: '',
		},
		time: {
			type: DataTypes.STRING(50),
			allowNull: false,
			field: 'time',
			defaultValue: '',
		},
		endDate: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'endDate',
			defaultValue: '',
		},
		endTime: {
			type: DataTypes.STRING(50),
			allowNull: false,
			field: 'endTime',
			defaultValue: '',
		},
		bookingInterval: {
			type: DataTypes.STRING(50),
			allowNull: false,
			field: 'bookingInterval',
			defaultValue: '',
		},
		description: {
			type: DataTypes.TEXT(),
			allowNull: false,
			field: 'description',
			defaultValue: '',
		},
		json: {
			type: DataTypes.TEXT(),
			allowNull: false,
			field: 'json',
			defaultValue: '{}',
			get: function () {
				return JSON.parse(this.getDataValue('json'));
			},
			set: function (json) {
				this.setDataValue('json', JSON.stringify(json));
			},
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
		tableName: 'carRentalBookings',
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

	carRentalBookings.associate = models => {
		carRentalBookings.belongsTo(models.user, { foreignKey: 'userId', onDelete: 'cascade', hooks: false });
		carRentalBookings.belongsTo(models.carRentalBrandCars, { foreignKey: 'carRentalBrandCarId', onDelete: 'cascade', hooks: false });
	};

	return carRentalBookings;
};

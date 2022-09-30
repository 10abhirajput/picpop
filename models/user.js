/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	const User = sequelize.define('user', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		role: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
			field: 'role',
			defaultValue: 1,
		},
		verified: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
			field: 'verified',
			defaultValue: 0,
		},
		checked: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
			field: 'checked',
			defaultValue: 0,
		},
		socialType: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
			field: 'socialType',
			defaultValue: 0,
		},
		deviceType: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'deviceType',
			defaultValue: 0,
		},
		otp: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'otp',
			defaultValue: 0,
		},
		notification: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			field: 'notification',
			defaultValue: 1,
		},
		status: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
			field: 'status',
			defaultValue: 1,
		},
		country_code: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'country_code',
			defaultValue: '',
		},
		deviceToken: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'deviceToken',
			defaultValue: '',
		},
		username: {
			type: DataTypes.STRING(100),	
			allowNull: false,
			field: 'username',
			defaultValue: '',
		},
		firstName:{
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'firstName',
			defaultValue: '',
		},
		lastName:{
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'lastName',
			defaultValue: '',
		},
		email: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'email',
			defaultValue: '',
		},
		phone: {
			type: DataTypes.STRING(15),
			allowNull: false,
			field: 'phone',
			defaultValue: '',
		},
		image: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'image',
			defaultValue: '',
		},
		socialId: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'socialId',
			defaultValue: '',
		},
		password: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'password',
			defaultValue: '',
		},
		forgotPasswordHash: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'forgotPasswordHash',
			defaultValue: '',
		},
		facebookId: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'facebookId',
			defaultValue: '',
		},
		googleId: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'googleId',
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
		tableName: 'user',
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

	User.associate = models => {
		User.hasOne(models.adminDetail, { onDelete: 'cascade', hooks: false });
		User.hasOne(models.userDetail, { onDelete: 'cascade', hooks: false });
		// User.hasOne(models.businessDetail, { onDelete: 'cascade', hooks: false });
		User.hasMany(models.locationOwnerDetail, { onDelete: 'cascade', hooks: false })
		User.hasMany(models.businessProfessionalDetail, { onDelete: 'cascade', hooks: false });
		User.hasMany(models.notification, { onDelete: 'cascade', hooks: false });
		
		User.hasOne(models.bookings, { onDelete: 'cascade', hooks: false })

		// User.hasOne(models.driverDetail, { onDelete: 'cascade', hooks: false });
		User.hasOne(models.vendorDetail, { onDelete: 'cascade', hooks: false });
		// User.hasOne(models.restaurantDetail, { onDelete: 'cascade', hooks: false });
		// User.hasOne(models.carRentalDealerDetail, { onDelete: 'cascade', hooks: false });
		// User.hasOne(models.onDemandUserDetail, { onDelete: 'cascade', hooks: false });
		User.hasMany(models.hoursOfOperation, { foreignKey: 'userId', onDelete: 'cascade', hooks: false });
		// User.hasOne(models.foodType, { as: 'restaurant', onDelete: 'cascade', hooks: false });
		// User.hasMany(models.review, { foreignKey: 'userId', onDelete: 'cascade', hooks: false });
		// User.hasMany(models.businessImage, { foreignKey: 'businessId', onDelete: 'cascade', hooks: false });
		// User.belongsTo(models.adminDetail, { foreignKey: 'userId'});
		// User.hasMany(mode)

	};

	return User;
};


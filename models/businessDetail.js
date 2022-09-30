/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	const Business = sequelize.define('businessDetail', {
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
		bannerImage: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'bannerImage',
			defaultValue: '',
		},
		userId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'userId',
			defaultValue: 0,
		},
		city: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'city',
			defaultValue: '',
		},
		zipCode: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'zipCode',
			defaultValue: 0,
		},
		state: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'state',
			defaultValue: '',
		},
		apt: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'apt',
			defaultValue: "",
		},
		categoryId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'categoryId',
			defaultValue: 0,
		},
		isFav: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'isFav',
			defaultValue: 0,
		},
		socialImage: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'socialImage',
			defaultValue: '',
		},
		location: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'location',
			defaultValue: '',
		},
		lastName: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'lastName',
			defaultValue: '',
		},
		firstName: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'firstName',
			defaultValue: '',
		},
		gender: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'gender',
			defaultValue: 4,
		},
		about: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'about',
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
		isShowAddressOther: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'isShowAddressOther',
			defaultValue: 1,
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
		tableName: 'businessDetail',
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
	Business.associate = models => {
		Business.hasMany(models.userSubCategory, { foreignKey: 'userId', onDelete: 'cascade', hooks: false });
		Business.hasMany(models.businessImage, { foreignKey: 'businessId', onDelete: 'cascade', hooks: false });
	};

	return Business;
};

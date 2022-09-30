/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('userDetail', {
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
		city: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'city',
			defaultValue: '',
		},
		state: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'state',
			defaultValue: '',
		},
		gender: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'gender',
			defaultValue: 0,
		},
		apt: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'apt',
			defaultValue: ""
		},
		zipCode: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'zipCode',
			defaultValue: 4,
		},
		userId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'userId',
			defaultValue: 0,
		},
		latitude: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'latitude',
			defaultValue: 0,
		},
		longitude: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'longitude',
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
		tableName: 'userDetail',
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
};

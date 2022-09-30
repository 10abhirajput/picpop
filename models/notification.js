/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('notification', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		message: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'message',
			defaultValue: '',
		},
		data: {
			type: DataTypes.TEXT(),
			allowNull: false,
			field: 'data',
			defaultValue: '',
		},
        notificationType: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'notificationType',
			defaultValue: 0,
		},
		isRead: {
			type: DataTypes.INTEGER(2),
			allowNull: false,
			field: 'isRead',
			defaultValue: 0,
		},
		receiverId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'receiverId',
			defaultValue: 0,
		},
		senderId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'senderId',
			defaultValue: 0,
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
		tableName: 'notification',
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

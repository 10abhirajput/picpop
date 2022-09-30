/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('message', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		senderId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'senderId',
			defaultValue: 0,
		},
        receiverId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'receiverId',
			defaultValue: 0,
		},
		booking_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'booking_id',
			defaultValue: 0,
		},
        senderType: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'senderType',
			defaultValue: 0,
		},
        receiverType: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'receiverType',
			defaultValue: 0,
		},
        message: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'message',
			defaultValue: 0,
		},
        deletedId: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'deletedId',
			defaultValue: 0,
		},
        chatConstantId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'chatConstantId',
			defaultValue: 0,
		},
        readStatus: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'readStatus',
			defaultValue: 0,
		},
        messageType: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'messageType',
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
		tableName: 'message',
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

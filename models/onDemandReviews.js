/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	const onDemandReviews = sequelize.define('onDemandReviews', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		userId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'userId',
			defaultValue: 0,
		},
		onDemandUserDetailId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'onDemandUserDetailId',
			defaultValue: 0,
		},
		rating: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
			field: 'rating',
			defaultValue: 1,
		},
		comment: {
			type: DataTypes.TEXT(),
			allowNull: false,
			field: 'comment',
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
		tableName: 'onDemandReviews',
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

	onDemandReviews.associate = models => {
		onDemandReviews.belongsTo(models.user, { foreignKey: 'userId', as: 'user',  hooks: false });
		onDemandReviews.belongsTo(models.user, { foreignKey: 'onDemandUserDetailId', as: 'onDemandUserDetail',  hooks: false });
	};

	return onDemandReviews;
};

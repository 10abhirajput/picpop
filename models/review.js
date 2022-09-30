/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	const review = sequelize.define('review', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		featurePlanId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'featurePlanId',
			defaultValue: 0,
		},
		
		userId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'userId',
			defaultValue: 0,
		},
		serviceProviderId:{
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'serviceProviderId',
			defaultValue: 0,
		},
		rating: {
			type: DataTypes.FLOAT,
			allowNull: true,
			field: 'rating',
			defaultValue: 0,
		},
		review: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'review',
			defaultValue: '',
		},
		role:{
			type: DataTypes.INTEGER(10),
			allowNull: true,
			field: 'role',
		},
		created: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'created'
		},
		updated: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'updated'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'createdAt'
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'updatedAt'
		}
	}, {
		tableName: 'review',
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

	review.associate = models => {
		review.belongsTo(models.featurePlan, { foreignKey: 'featurePlanId', hooks: false });
		review.belongsTo(models.user, { foreignKey: 'userId', as: 'user', hooks: false });
		// review.belongsTo(models.user, { foreignKey: 'serviceProviderId', as: 'locationOwner', hooks: false });
		review.belongsTo(models.user, { foreignKey: 'serviceProviderId', as: 'serviceProvider', hooks: false });
	};

	return review;
};

/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	const reviews = sequelize.define('reviews', {
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
		businessId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'businessId',
			defaultValue: 0,
		},
		review: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'review',
			defaultValue: '',
		},
		rating: {
			type: DataTypes.FLOAT,
			allowNull: false,
			field: 'rating',
			defaultValue: 0,
		},
		role:{
			type: DataTypes.INTEGER(11),
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
		tableName: 'reviews',
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
	reviews.associate = models => {
		// reviews.belongsTo(models.user, { foreigen_key: 'userId' })


		reviews.belongsTo(models.user, { foreignKey: 'userId', as: 'user', hooks: false });
		// review.belongsTo(models.user, { foreignKey: 'serviceProviderId', as: 'locationOwner', hooks: false });
		reviews.belongsTo(models.locationOwnerDetail, { foreignKey: 'businessId' });
		reviews.belongsTo(models.businessProfessionalDetail, { foreignKey: 'businessId'});

	}
	//users.hasMany(models.userSkills, { foreignKey: 'user_id', hooks: false });

	return reviews;

};

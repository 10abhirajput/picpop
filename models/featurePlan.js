/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	const featurePlan = sequelize.define('featurePlan', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		status: {
			type: DataTypes.INTEGER(4),
			allowNull: true,
			field: 'status',
			defaultValue: 1,
		},
		name: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'name',
			defaultValue: '',
		},
		price: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'price',
			defaultValue: 0,
		},
		planExpiry: {
			type: DataTypes.STRING(20),
			allowNull: false,
			field: 'planExpiry',
			defaultValue: '',
		},
		// image: {
		// 	type: DataTypes.STRING(100),
		// 	allowNull: false,
		// 	field: 'image',
		// 	defaultValue: '',
		// },
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
		tableName: 'featurePlan',
		// freezeTableName: true,
		// hierarchy: true,
		hooks : {
			beforeCreate : (record, options) => {
				record.dataValues.created = Math.round(new Date().getTime() / 1000);
				record.dataValues.updated = Math.round(new Date().getTime() / 1000);
			},
			beforeUpdate : (record, options) => {
				// console.log(record, '==================================>beforeUpdate')
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

	featurePlan.associate = models => {
		// featurePlan.belongsTo(models.featurePlan, { foreignKey: 'parentId' });
	};

	return featurePlan;
};

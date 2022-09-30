
/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('banner', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
        },
		image: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'image'
        },
        status: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			field: 'status',
			defaultValue: 1,
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
		},
	}, {
		tableName: 'banner'
	});
};

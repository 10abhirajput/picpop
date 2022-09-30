
/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('bankDetail', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
        },
		userId: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			field: 'userId'
        },
        cardHolderName: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'cardHolderName',
        },
        cardNumber: {
			type: DataTypes.STRING(50),
			allowNull: false,
			field: 'cardNumber',
        },
        isDefault: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			field: 'isDefault',
			defaultValue: 1,
        },
        cardType: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			field: 'cardType',
			defaultValue: 1,
        },
        expiryMonth: {
			type: DataTypes.STRING(2),
			allowNull: false,
			field: 'expiryMonth',
        },
        expiryYear: {
			type: DataTypes.INTEGER(2),
			allowNull: false,
			field: 'expiryYear',
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
		tableName: 'bankDetail'
	});
};

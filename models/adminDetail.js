const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const adminDetail = sequelize.define(
    "adminDetail",
    {
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
		location: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'location',
			defaultValue: '',
		},
		country_code: {
			type: DataTypes.STRING(100),
			allowNull: true,
			field: 'country_code',
			defaultValue: '',
		},
		phone: {
			type: DataTypes.BIGINT(14),
			allowNull: false,
			field: 'phone',
			defaultValue: '',

		},
		image: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'image',
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
	},
    {
      sequelize,
      tableName: "adminDetail",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
      ],
    }
  );
  adminDetail.associate = (models) => {
	adminDetail.belongsTo(models.user, { foreignKey: 'userId'});
   

  };
  return adminDetail;
};

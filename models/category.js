const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
 const category = sequelize.define('category', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: "0=>inactive 1=>active",
      defaultValue:'1'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    image: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'category',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });

  category.associate = models => {
    category.hasMany(models.businessProfessionalDetail, { onDelete: 'cascade', hooks: false });
	};
  return category;
};

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
 const contact_us = sequelize.define('contact_us', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }, 
    name: {
        type: DataTypes.STRING(150),
        allowNull: false,
        field: 'name',
        defaultValue: '',
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'email',
        defaultValue: '',
    },
    message: {
        type: DataTypes.TEXT(),
        allowNull: false,
        field: 'message',
        defaultValue: '',
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: "0=>inactive 1=>active",
      defaultValue:1
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'created_at'
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'updated_at'
    }
  }, {
    sequelize,
    tableName: 'contact_us',
    timestamps: false,
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

  contact_us.associate = models => {
	};
  return contact_us;
};

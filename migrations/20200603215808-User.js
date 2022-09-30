'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
     return queryInterface.addColumn(
      'adminDetail', // name of Source model
      'userId', // name of the key we're adding 
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'user', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
     );
     
     return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
      },
      role: {
        type: Sequelize.INTEGER(4),
        allowNull: false,
        field: 'role',
        defaultValue: 1,
      },
      status: {
        type: Sequelize.INTEGER(4),
        allowNull: false,
        field: 'status',
        defaultValue: 1,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        field: 'email',
        defaultValue: '',
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: false,
        field: 'password',
        defaultValue: '',
      },
      created: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'created'
      },
      updated: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'updated'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'createdAt'
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'updatedAt'
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
    return queryInterface.removeColumn(
      'adminDetail', // name of Source model
      'userId' // key we want to remove
    );
     return queryInterface.dropTable('users');
  }
};

/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('businessProfessionalReview', {
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
        businessProId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            field: 'businessProId',
            defaultValue: 0,
        },
        review: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'review',
            defaultValue: '',
        },
        rating: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            field: 'rating',
            defaultValue: 0,
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
        tableName: 'businessProfessionalReview',
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
};

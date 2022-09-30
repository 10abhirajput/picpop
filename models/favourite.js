/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
    const Favourite = sequelize.define('favourite', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'id'
        },
        favBy: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            field: 'favBy',
            defaultValue: 0,
        },
        businessId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            field: 'businessId',
            defaultValue: 0,
        },
        locationId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            field: 'locationId',
            defaultValue: 0,
        },
        type: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            field: 'type',
            defaultValue: 0,
        },
        is_fav: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            field: 'is_fav',
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
        tableName: 'favourite',
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

    Favourite.associate = models => {
        Favourite.belongsTo(models.user, { foreignKey: 'favBy', as: 'favByUser', onDelete: 'cascade', hooks: false });
        Favourite.belongsTo(models.user, { foreignKey: 'favTo', as: 'favToUser', onDelete: 'cascade', hooks: false });
    };

    return Favourite

};

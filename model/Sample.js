const moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const sample = sequelize.define('Sample', {
        // Model attributes are defined here
        sampleSeq: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            field: 'sample_seq'
        },
        sampleTitle: {
            type: DataTypes.STRING(200),
            allowNull: false,
            field: 'sample_title'
        },
        sampleContent: {
            type: DataTypes.STRING(4000),
            field: 'sample_content'
        },
        deleteYn: {
            type: DataTypes.BOOLEAN,
            field: 'delete_yn'
        },
        regDate: {
            type: DataTypes.DATE,
            field: 'reg_date',
            get() {
                return moment(this.getDataValue('regDate')).format('YYYY-MM-DD hh:mm:ss');
            }
        },
        regUserSeq: {
            type: DataTypes.BIGINT,
            field: 'reg_user_seq'
        },
        updateDate: {
            type: DataTypes.DATE,
            field: 'update_date',
            get() {
                return moment(this.getDataValue('updateDate')).format('YYYY-MM-DD hh:mm:ss');
            }
        },
        updateUserSeq: {
            type: DataTypes.BIGINT,
            field: 'update_user_seq'
        },
    }, {
        tableName: 'serverless_sample',
        createdAt: false,
        updatedAt: false
    });

    return sample;
};

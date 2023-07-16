'use strict';

// lib import
const { Sequelize, DataTypes } = require('sequelize');

// common js import
const logger = require('../../../../common/logging/common-logging.js');
const commonResponse = require('../../../../common/response/response.js');

// DB 접속 정보 설정
const sequelize = new Sequelize(
    process.env.MAIN_MASTER_DATABASE,
    process.env.MAIN_MASTER_USERNAME,
    process.env.MAIN_MASTER_PASSWORD,
    {
        host: process.env.MAIN_MASTER_HOST,
        port: process.env.MAIN_MASTER_PORT,
        logging: process.env.PROFILE == "local" ? true : false,
        dialect: 'mysql',
        pool: {
          maxConnections: 5,
          maxIdleTime: 1000
        }
    });

// Sequelize Model
const Sample = require('../../../../model/Sample')(sequelize, DataTypes);

module.exports.main = async (event) => {
    const bodyData = JSON.parse(event.body);

    // data setting
    const insertData = {
        sampleTitle: bodyData.sample_title,
        sampleContent: bodyData.sample_content,
        regUserSeq: event.requestContext.authorizer['userSeq'],
        regDate: new Date().getTime() + 1000 * 60 * 60 * 9
    };

    // 데이터 등록
    const sampleData = await Sample.create(insertData);
    logger.info(event, "데이터 등록 완료. 데이터 : " + JSON.stringify(sampleData));

    return commonResponse.success(sampleData);
};

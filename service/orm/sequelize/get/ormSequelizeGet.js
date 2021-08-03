'use strict';

// lib import
const { Sequelize, DataTypes } = require('sequelize');

// common js import
const logger = require('../../../../common/logging/common-logging.js');
const jnResponse = require('../../../../common/response/response.js');

// DB 접속 정보 설정
const sequelize = new Sequelize(
    process.env.MAIN_SLAVE_DATABASE,
    process.env.MAIN_SLAVE_USERNAME,
    process.env.MAIN_SLAVE_PASSWORD,
    {
        host: process.env.MAIN_SLAVE_HOST,
        port: process.env.MAIN_SLAVE_PORT,
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

    // 데이터 조회
    const sampleData = await Sample.findByPk(event.pathParameters['sampleSeq']);
    logger.info(event, "데이터 조회 완료.");

    return jnResponse.success(sampleData);
};

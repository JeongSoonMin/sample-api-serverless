'use strict';

// lib import
const { Sequelize, DataTypes } = require('sequelize');

// common js import
const logger = require('../../../../common/logging/common-logging.js');
const commonResponse = require('../../../../common/response/response.js');

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

    // DB 접속 테스트
    /*try {
        await sequelize.authenticate();
        logger.info(event,'Connection has been established successfully.');
    } catch (error) {
        logger.error(event,'Unable to connect to the database:', error);
        return commonResponse.failed("DB 접속 오류", err);
    }*/

    // 목록 조회
    const sampleList = await Sample.findAll({ where: { deleteYn: false } });
    logger.info(event, "목록 조회 완료. 목록 갯수 : " + sampleList.length);
    //logger.info(event, JSON.stringify(testSample));

    return commonResponse.success(sampleList);
};

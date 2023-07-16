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

    // 데이터 삭제
    const sampleData = await Sample.destroy({
      where:
            { sampleSeq: event.pathParameters['sampleSeq'] }
      });
    logger.info(event, "데이터 삭제 완료. 데이터 : " + sampleData);

    /**
     * 데이터 완전 삭제가 아닌 deleteYn 변경시에는 업데이트 처리

     // 데이터 수정
     const sampleData = await Sample.update({deleteYn: true},
     { where:
            { sampleSeq: event.pathParameters['sampleSeq'] }
      });
     logger.info(event, "데이터 수정 완료. 데이터 : " + sampleData);

     */

    return commonResponse.success(sampleData);
};

'use strict';

// lib import
const { Sequelize, DataTypes } = require('sequelize');

// common js import
const logger = require('../../../../common/logging/common-logging.js');
const jnResponse = require('../../../../common/response/response.js');

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
        replication: {
            read: [
                {
                    host: process.env.MAIN_SLAVE1_HOST,
                    username: process.env.MAIN_SLAVE1_USERNAME,
                    password: process.env.MAIN_SLAVE1_PASSWORD
                },
                {
                    host: process.env.MAIN_SLAVE2_HOST,
                    username: process.env.MAIN_SLAVE2_USERNAME,
                    password: process.env.MAIN_SLAVE2_PASSWORD
                }
            ],
            write: {
                host: process.env.MAIN_MASTER_HOST,
                username: process.env.MAIN_MASTER_USERNAME,
                password: process.env.MAIN_MASTER_PASSWORD
            }
        },
        pool: { // If you want to override the options used for the read pool you can do so here
            maxConnections: 5,
            maxIdleTime: 1000
        },
});

// Sequelize Model
const Sample = require('../../../../model/Sample')(sequelize, DataTypes);

module.exports.main = async (event) => {
    const bodyData = JSON.parse(event.body);

    const t = await sequelize.transaction();

    try {

        // data setting
        const insertData = {
            sampleTitle: bodyData.sample_title,
            sampleContent: bodyData.sample_content,
            regUserSeq: event.requestContext.authorizer['userSeq']
        };

        // 데이터 등록
        const sampleData = await Sample.create(insertData, {transaction: t});
        logger.info(event, "데이터 등록 완료. 데이터 : " + JSON.stringify(sampleData));

        // **** findOne or findAll 사용시에는 테이블 락이 걸릴 수 있으니 유의하여 transaction 제외 시킬지 확인 필요 ****
        // transaction 제외 할 경우, commit 되기 전까지는 조회 되지 않음.
        const dbData = await Sample.findByPk(sampleData.sampleSeq, {transaction: t});
        logger.info(event, "데이터 조회 완료. 데이터 : " + JSON.stringify(dbData));

        // 테스트 강제 오류 발생
        throw new Error("throw new Error 강제 오류 발생.");

        // 성공시 commit
        await t.commit();

    } catch (error) {
        // 실패시 롤백
        logger.error(event, "쿼리 오류 발생. " + error);
        await t.rollback();
        return jnResponse.failed("오류가 발생하였습니다.");
    }

    return jnResponse.success(sampleData);
};

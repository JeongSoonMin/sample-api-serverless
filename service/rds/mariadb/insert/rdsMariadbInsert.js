'use strict';
const logger = require('../../../../common/logging/common-logging.js');
const jnResponse = require('../../../../common/response/response.js');
const mysql2 = require('mysql2/promise');

const mainMasterDbConfig = {
    host: process.env.MAIN_MASTER_HOST,
    port: process.env.MAIN_MASTER_PORT,
    user: process.env.MAIN_MASTER_USERNAME,
    database: process.env.MAIN_MASTER_DATABASE,
    password: process.env.MAIN_MASTER_PASSWORD
};

let connection = null;

module.exports.main = async (event) => {

    logger.info(event, `event: ${JSON.stringify(event)}`);

    const bodyData = JSON.parse(event.body);
    let data;

    // DB 접속
    try {
        connection = await mysql2.createConnection(mainMasterDbConfig);
    } catch(err) {
        logger.error(event, err);

        return jnResponse.failed("DB 접속 오류", err);
    }

    // 조회
    try {
        const query = "INSERT INTO serverless_sample (" +
            " sample_title" +
            " ,sample_content" +
            " ,reg_user_seq" +
            " ) VALUES (" +
            " '" + bodyData.sample_title + "'" +
            " ,'" + bodyData.sample_content + "'" +
            " ,'" + event.requestContext.authorizer['userSeq'] + "'" +
            " )";

        logger.info(event, 'Query: ' + query);

        const [rows, fields] = await connection.execute(query);

        logger.info(event, `rows: ${JSON.stringify(rows)}`);
        logger.info(event, `fields: ${JSON.stringify(fields)}`);

        data = {
            number: rows.length,
            contacts: rows
        };

    } catch(err) {
        logger.error(event, err);

        return jnResponse.failed("DB Query 오류", err);
    } finally {
        // 접속 종료
        if (connection != null) {
            await connection.end();
            logger.info(event, "DB 접속 종료");
        }
    }

    return jnResponse.success(data);
};

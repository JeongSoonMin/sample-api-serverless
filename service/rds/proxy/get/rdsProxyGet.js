'use strict';
const logger = require('../../../../common/logging/common-logging.js');
const commonResponse = require('../../../../common/response/response.js');
const mysql2 = require('mysql2/promise');

const rdsProxyMasterDbConfig = {
    host: process.env.RDS_PROXY_MASTER_HOST,
    port: process.env.RDS_PROXY_MASTER_PORT,
    user: process.env.RDS_PROXY_MASTER_USERNAME,
    database: process.env.RDS_PROXY_MASTER_DATABASE,
    password: process.env.RDS_PROXY_MASTER_PASSWORD
};

let connection = null;

module.exports.main = async (event) => {

    logger.info(event, `event: ${JSON.stringify(event)}`);

    let data;

    // DB 접속
    try {
        connection = await mysql2.createConnection(rdsProxyMasterDbConfig);
    } catch(err) {
        logger.error(event, err);

        return commonResponse.failed("DB 접속 오류", err);
    }

    // 조회
    try {
        const query = 'SELECT * FROM serverless_sample' +
            ' WHERE' +
            ' sample_seq = ' + event.pathParameters['sampleSeq'] +
            ' AND delete_yn = 0';

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

        return commonResponse.failed("DB Query 오류", err);
    } finally {
        // 접속 종료
        if (connection != null) {
            await connection.end();
            logger.info(event, "DB 접속 종료");
        }
    }

    return commonResponse.success(data);
};

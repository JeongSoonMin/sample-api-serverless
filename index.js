'use strict';
const commonResponse = require("./common/response/response");
const logger = require("./common/logging/common-logging");

module.exports.handler = async (event) => {
    logger.info(event, "RequestInfo");

    // local 일때만 authorizer 대신 헤더값 사용
    if (process.env.PROFILE == "local") {
        event.requestContext.authorizer['osName'] = event.headers['osname'];
        event.requestContext.authorizer['osVersion'] = event.headers['osversion'];
        event.requestContext.authorizer['appName'] = event.headers['appname'];
        event.requestContext.authorizer['appVersion'] = event.headers['appversion'];
    }

    // event에 담겨있는 값 확인
    logger.debug(event, JSON.stringify(event));

    // gateway에서 파싱해준 jwt token data. storeSeq 등 값 필요할 경우 꺼내서 사용.
    const authData = event.requestContext.authorizer;
    logger.debug(event, JSON.stringify(authData));

    const resourcePath = event['resource'];
    const method = event['httpMethod'];

    if (resourcePath == "/sample/getSample") {
        return require('./service/sample/get/sampleGet').getSample(event);
    } else if (resourcePath == "/html") {
        return require('./service/html/get/htmlGet').main(event);
    } else if (resourcePath.startsWith('/orm/sequelize')) {
        if (method == "GET") {
            if (event['pathParameters'] != null) {
                return await require('./service/orm/sequelize/get/ormSequelizeGet').main(event);
            } else {
                return await require('./service/orm/sequelize/list/ormSequelizeList').main(event);
            }
        } else if (method == "POST") {
            if (resourcePath == "/orm/sequelize/transaction") {
                return await require('./service/orm/sequelize/transaction/ormSequelizeTransaction').main(event);
            } else {
                return await require('./service/orm/sequelize/insert/ormSequelizeInsert').main(event);
            }
        } else if (method == "PUT") {
            return await require('./service/orm/sequelize/update/ormSequelizeUpdate').main(event);
        } else if (method == "DELETE") {
            return await require('./service/orm/sequelize/delete/ormSequelizeDelete').main(event);
        }
    } else if (resourcePath.startsWith('/rds/mariadb')) {
        if (method == "GET") {
            if (event['pathParameters'] != null) {
                return await require('./service/rds/mariadb/get/rdsMariadbGet').main(event);
            } else {
                return await require('./service/rds/mariadb/list/rdsMariadbList').main(event);
            }
        } else if (method == "POST") {
            return await require('./service/rds/mariadb/insert/rdsMariadbInsert').main(event);
        } else if (method == "PUT") {
            return await require('./service/rds/mariadb/update/rdsMariadbUpdate').main(event);
        } else if (method == "DELETE") {
            return await require('./service/rds/mariadb/delete/rdsMariadbDelete').main(event);
        }
    } else if (resourcePath.startsWith('/rds/proxy')) {
        if (method == "GET") {
            if (event['pathParameters'] != null) {
                return await require('./service/rds/proxy/get/rdsProxyGet').main(event);
            } else {
                return await require('./service/rds/proxy/list/rdsProxyList').main(event);
            }
        } else if (method == "POST") {
            return await require('./service/rds/proxy/insert/rdsProxyInsert').main(event);
        } else if (method == "PUT") {
            return await require('./service/rds/proxy/update/rdsProxyUpdate').main(event);
        } else if (method == "DELETE") {
            return await require('./service/rds/proxy/delete/rdsProxyDelete').main(event);
        }
    } else if (resourcePath.startsWith('/redis/')) {
        if (method == "GET") {
            return await require('./service/redis/get/redisGet').main(event);
        } else if (method == "POST") {
            return await require('./service/redis/post/redisPost').main(event);
        } else if (method == "DELETE") {
            return await require('./service/redis/delete/redisDelete').main(event);
        }
    } else {
        return commonResponse.error("404", "Not Found.");
    }
};

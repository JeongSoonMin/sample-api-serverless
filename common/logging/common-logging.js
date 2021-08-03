'use strict';

module.exports.debug = async (event, message, appendJsonName, appendJson) => {
    console.debug(parseLoggingData("DEBUG", event, message, appendJsonName, appendJson));
};

module.exports.info = async (event, message, appendJsonName, appendJson) => {
    console.info(parseLoggingData("INFO", event, message, appendJsonName, appendJson));
};

module.exports.warn = async (event, message, appendJsonName, appendJson) => {
    console.warn(parseLoggingData("WARN", event, message, appendJsonName, appendJson));
};

module.exports.error = async (event, message, appendJsonName, appendJson) => {
    console.error(parseLoggingData("ERROR", event, message, appendJsonName, appendJson));
};

// 공통 firehose 로깅 처리
function parseLoggingData(logLevel, event, message, appendJsonName, appendJson) {
    let loggingData = {
        "timestamp": new Date(),
        "profile": process.env.PROFILE,
        "level": logLevel,
        "service": process.env.SERVICE,
        "message": message
    };

    if (event != undefined && event != null) {
        const headerData = event.headers;
        const authData = event.requestContext.authorizer;

        // request 요청 정보
        if (event['resource'] != undefined) {
            loggingData['resource'] = event['resource'];
        }

        if (event['path'] != undefined) {
            loggingData['path'] = event['path'];
        }

        if (event['httpMethod'] != undefined) {
            loggingData['method'] = event['httpMethod'];
        }

        // 헤더의 로깅 필요 정보
        if (headerData != undefined) {
            if (headerData['Host'] != undefined) {
                loggingData['domain'] = headerData['Host'];
            }
        }

        // requestId 정보 셋팅
        if (event.requestContext['requestId'] != undefined) {
            loggingData['requestId'] = event.requestContext['requestId'];
        }
        // extendedRequestId 정보 셋팅
        if (event.requestContext['extendedRequestId'] != undefined) {
            loggingData['extendedRequestId'] = event.requestContext['extendedRequestId'];
        }

        // request 로깅 필요 정보
        if (authData != undefined) {
            // 중나 부가 필요정보
            if (authData['clientIp'] != undefined) {
                loggingData['clientIp'] = authData['clientIp'];
            }

            if (authData['appName'] != undefined) {
                loggingData['appName'] = authData['appName'];
            }

            if (authData['appVersion'] != undefined) {
                loggingData['appVersion'] = authData['appVersion'];
            }

            if (authData['osName'] != undefined) {
                loggingData['osName'] = authData['osName'];
            }

            if (authData['osVersion'] != undefined) {
                loggingData['osVersion'] = authData['osVersion'];
            }

            if (authData['userSeq'] != undefined) {
                loggingData['userSeq'] = authData['userSeq'];
            }
        }
    }

    if (appendJsonName != undefined && appendJsonName != "" && appendJson != undefined) {
        loggingData[appendJsonName] = appendJson;
    }

    return JSON.stringify(loggingData);
};


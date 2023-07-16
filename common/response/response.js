'use strict';

module.exports.success = async (data) => {

    let responseData = {
        "meta": {
            "code": 0,
            "message": "SUCCESS"
        }
    };

    if (data != undefined) {
        responseData['data'] = data;
    }

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELTE",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify(responseData)
    };
};

module.exports.failed = async (errMsg, responseMsg, errorCode) => {

    if (errorCode == undefined) {
        errorCode = "999999";
    }

    if (responseMsg == undefined) {
        responseMsg = errMsg;
    }

    let responseData = {
        "meta": {
            "code": 500,
            "message": errMsg
        },
        "error": {
            "code": errorCode,
            "detail": responseMsg,
            "title": "internal server error",
            "status": 500
        }
    };

    return {
        statusCode: 500,
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELTE",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify(responseData)
    };
};

module.exports.error = async (statusCode, errMsg, responseMsg, errorCode) => {

    if (errorCode == undefined) {
        errorCode = "999999";
    }

    if (responseMsg == undefined) {
        responseMsg = errMsg;
    }

    let responseData = {
        "meta": {
            "code": statusCode,
            "message": errMsg
        },
        "error": {
            "code": errorCode,
            "detail": responseMsg,
            "status": statusCode
        }
    };

    return {
        statusCode: statusCode,
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Method": "OPTIONS,GET,POST,PUT,DELTE",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify(responseData)
    };
};

module.exports.html = async (html) => {

    let responseData = "<html>";

    responseData += "<head>";
    responseData += "<meta charset='UTF-8'>";
    responseData += "<title>샘플</title>";
    responseData += "</head>";
    responseData += "<body>";

    if (html != undefined) {
        responseData += html;
    }

    responseData += "</body></html>";

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "text/html",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Method": "OPTIONS,GET,POST,PUT,DELTE",
            "Access-Control-Allow-Credentials": true
        },
        body: responseData
    };
};

'use strict';

// common js import
const logger = require('../../../common/logging/common-logging');
const jnResponse = require('../../../common/response/response');

// custom js import
const dataInfo = require("./data/data-info");

module.exports.getSample = (event) => {


    let data;
    try {
        data = dataInfo.getInfo();
    } catch (e) {
        return jnResponse.failed("관리자에게 문의 바랍니다.", "필수값이 존재하지 않습니다.", "1000001");
    }

    logger.info(event, "data 로그 적재", "sample-api_data", data);

    logger.info(event, "정상 조회 완료.");

    return jnResponse.success(data);
};


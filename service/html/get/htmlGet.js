'use strict';

// common js import
const logger = require('../../../common/logging/common-logging');
const commonResponse = require('../../../common/response/response');


module.exports.main = (event) => {
    let html = "<script>alert('test');</script>";
    html += "<div><strong>테스트 중입니다.</strong></div>";

    return commonResponse.html(html);
};


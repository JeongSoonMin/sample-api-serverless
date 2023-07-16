'use strict';

// lib import
const Redis = require('ioredis');

// common js import
const logger = require('../../../common/logging/common-logging.js');
const commonResponse = require('../../../common/response/response.js');

// redis 접속 정보 설정
const client = new Redis(process.env.REDIS_PORT, process.env.REDIS_HOST);

module.exports.main = async (event) => {
  let prefixKey = "serverless:sample:"
  let key = prefixKey + event.pathParameters['key'];

  let sampleData = await client.get(key).then(function(result) {
    logger.info(event, result);
    return result;
  });

  return commonResponse.success(sampleData);
};

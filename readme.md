샘플 API-Gateway(rest) 를 통한 샘플 api 서버 구축
======================================
## 기본 필요사항
   * AWS IAM 권한 확인
   * AWS Credential 셋팅
   * node, npm 설치
   * serverless 설치

## 개발 필요사항
   * 공통 모듈에서 사용 할 package.json 모듈 설치
   * serverless.yml 에 사용할 기능 정의 및 배포
   * 로컬 테스트 방법

## 개발 공통사항
   * 공통 로깅 처리(firehose 사용)
   * 공통 response 처리(서비스별로 처리하는 스펙이 달라 서비스별로 확인 필요)

### 기본 필요사항 - AWS IAM 권한 확인
* serverless 배포시에 개발자 계정에 iam 권한이 필요하다.
* serverless 배포시 aws cloudformation 에 stack이 추가되면서 자동적으로 연관된 리소스가 배포 된다.
  이때 필요한 권한으로 cloudformation:createApplication 권한 필요
* cloudformation 에서 api-gateway 연결, lambda 생성, 호출 권한(Role) 생성 등이 이루어지기 때문에 아래 추가 권한 필요
    * lambdaFullAccess
    * 그 밖의 권한은 확인 필요
### 기본 필요사항 - AWS Credentials 셋팅
* credentials 셋팅
    * $ vi ~/.aws/credentials
      <pre><code>
      [default]
      aws_access_key_id=XXXXXXXXX
      aws_secret_access_key=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
      </code></pre>
    * $ vi ~/.aws/config
      <pre><code>
      [default]
      region=ap-northeast-2
      output=json
      </code></pre>
### 기본 필요사항 - node, npm 설치
* node, npm 설치
    1. homebrew 가 설치 되어 있어야 한다. 미설치시 명령어 실행. 설치 되어 있을 경우 pass
       <pre><code>
       $ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
       </code></pre>
    2. node, npm 설치
       <pre><code>
       $ brew install node
       </code></pre>
    3. 설치 완료시 아래 명령어로 버전 확인
       <pre><code>
       $ node -v
       $ npm -v
       </code></pre>
    4. yarn을 사용 하고 싶을 경우 아래 명령어로 설치(optional)
       <pre><code>
       $ brew install yarn --ignore-dependencies
       $ yarn -v
       </code></pre>
### 기본 필요사항 - serverless framework 모듈 설치
* serverless framework 모듈 및 plugin 설치
* 설치시 serverless 제외한 plugin은 원래 package.json 에 추가 설치 하는데,
  lambda 기본 패키지 구조 설정 및 layer 업로드시 plugin library가 추가되기 때문에 global로 설치하여 제외 시킴
   <pre><code>
   $ npm install -g serverless
   $ npm i -g serverless-import-apigateway
   $ npm i -g serverless-plugin-log-subscription
   $ npm i -g serverless-offline
   </code></pre>


### 개발 필요사항 - 공통 모듈에서 사용 할 package.json 모듈 설치
* 각 lambda function에서 사용할 공통 라이브러리의 경우 layer를 사용하여 공통으로 사용 가능하기 때문에,
  package.json 에 필요한 라이브러리 추가 후 모듈 install 진행.
* Ex) JWToken 파싱을 위한 공통 라이브러리가 필요한 경우. jsonwebtoken
<pre><code>
$ npm i jsonwebtoken
</code></pre>
* 공통 모듈이 필요 없을 경우 package.json 이 필요 없으며, serverless.yml 에서 공통 layer 항목이 필요 없다.
* 로컬에서 띄워서 테스트 할 경우에는 layer에서 포함된 라이브러리가 포함되어 있어야 하기 때문에, 최상위 경로에서 npm i 를 한번 더 실행 해준다.

### 개발 필요사항 - serverless.yml 에 사용할 기능 정의 및 배포
* serverless.yml 파일에 기본적으로 필요사항과 설명 참조.
* serverless 배포 방법
<pre><code>
프로젝트 최상위 경로에서 명령어 실행
$ serveless deploy
단축어로 sls deploy 도 사용 가능
stage가 기본값 dev로 되어 있어 stage 환경 배포시에는
$ sls deploy -s stage
로 실행 가능
</code></pre>

### 개발 필요사항 - 로컬에서 테스트 방법
<pre><code>
프로젝트 최상위 경로에서 명령어 실행
$ sls invoke local -f getSample
</code></pre>

* 유의사항으로 해당 펑션에서 authorizer가 지정되어 있는 경우 gateway에 설정된 공유된 authorizer를 사용하므로 로컬에서 실행시 오류가 뜨게 된다.
* 로컬에서 실행히사에는 authorizer 주석 및 펑션내에서 event.requestContext.authorizer 객체 사용하는 것을 주석 처리해야 동작이 가능하다.

### 개발 필요사항 - 배포 후 테스트 방법
* postman이나 curl 사용하여 요청
<pre><code>
$ curl -X GET https://edge-{stage}.joongna.com/api/sample/sample/getSample -H "Content-Type: application/json" -H "Authorization: Bearer jwtoken"
</code></pre>

### 개발 공통사항 - 로깅 처리
* 소스에서 로깅처리는 console.log() 대신 공통 로깅 스펙으로 적재 한다.
* 적재한 정해진 스펙의 로깅만 cloudwatch에서 firehose로 전달되어 es에 로깅 된다.
<pre><code>
// 공통 로깅 처리 스크립트 import
const logger = require('../../common/logging/common-logging.js');

// 로그 적재
logger.info(event, "테스트");

// 부가 json 데이터 추가 필요시 ( event, 메시지내용, json데이터 key, json데이터 )
logger.info(event, "요청 로그 적재", "reqeustInfo", { "requestUri": "aaa", "requestMethod": "get" });

// 기타 debug, warn, error 로깅
logger.debug(event, "디버그 로그");
logger.warn(event, "경고 로그");
logger.error(event, "에러 로그");
</code></pre>

### 개발 공통사항 - response 처리
* response 응답 내용을 공통 처리하여 호출하여 리턴한다.
<pre><code>
// 공통 response 처리 스크립트 import
const jnResponse = require('../../common/response/response.js');

// 성공 response ( 리턴할 데이터 json )
return jnResponse.success({ "count": 1234, "list": [ {"id": 1, "title": "테스트"}, {...} ] });
// 내려줄 데이터 없을 경우
return jnResponse.success();

// 실패 response ( 오류메시지, 에러내용, 에러코드 )
return jnResponse.failed("오류가 발생하였습니다.");
return jnResponse.failed("오류가 발생하였습니다.", "필수값이 존재하지 않습니다.", "9999999");

// html 로 페이지 표시 해 줄 경우 response
return jnResponse.html("&lt;div&gt;&lt;strong&gt;테스트 중입니다.&lt;/strong&gt;&lt;/div&gt;");
</code></pre>

### 개발 테스트 - 로컬 환경 테스트 유의사항
* 로컬에서는 authorizer 동작이 연계되지 않아, authorizer 에서 넘겨주는 데이터는 임시 주석 처리 하고 로직 테스트 필요
* 유의사항으로 node 버전이 14.17.1 에서만 post 메소드로 된 endpoint 정상 동작함. 15.5 ~ 16.4 get 메소드로 된 endpoint만 호출 가능.(버그 아직 픽스되지 않음.)


### 개발 테스트 - 로컬 환경 테스트 방법
* 풀 명령어

$ sls offline start -s local --noAuth

* shell 명령어로 시작

$ ./localStart.sh 
* http://localhost:3000/local 로 실행 되므로, http://localhost:3000/local/{서비스경로} 로 호출한다.


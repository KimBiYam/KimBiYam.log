---
title: 'React CRA & Typescript & craco & Cypress & Jest 테스트 환경 세팅'
date: '2022-04-16'
tag: 'react'
ogImagePath: '/images/posts/react/cra-craco-cypress-setting_1.png'
---

![Untitled](/images/posts/react/cra-craco-cypress-setting_1.png)

## Cypress 란?

[cypress](https://www.cypress.io/)란 프론트엔드를 위한 `E2E(End-to-End)` 테스팅 프레임워크 입니다.

사내에서 진행 중인 프로젝트에 cypress를 도입하였는데, `CRA(Create React App)`의 기본 테스트
프레임워크인 `Jest` 로 유닛 테스트를 작성하고 있던 상태에서 두 테스트 프레임워크를 병행해서 사용하기 위한 설정 방법을 공유하고자 합니다.

단순히 CRA로 생성한 프로젝트에 설정하는 포스팅은 많기도 하고, 저는 eject 없이 webpack 설정을 커스터마이징 하기 위한 라이브러리인 [craco](https://github.com/gsoft-inc/craco)도 함께 설정되어 있던 상태였어서 해당 부분에 맞춰서 세팅을 진행하였습니다.

> 해당 포스트에서는 cypress와 jest의 자세한 테스트 작성에 관한 내용은 다루지 않습니다.
> 

## 프로젝트 생성 및 craco 설정

우선 위에서 설명한 프로젝트와 동일한 환경을 구축하기 위해 `CRA`로 프로젝트를 새로 생성합니다.

```bash
$ npx create-react-app react-cypress-jest-setting --template typescript
```

그 후 `craco` 설치 후 설정을 적용합니다.

`패키지 설치`

```bash
$ npm install @craco/craco
```

`package.json`

```bash
{
	...
	"scripts": {
	    "start": "craco start",
	    "build": "craco build",
	    "test": "craco test",
	    "eject": "react-scripts eject"
	},
	...
}
```

`craco.config.js`

```bash
module.exports = {};
```

설정이 잘 적용되었는지 프로젝트를 한번 실행해보면
자주 보던 리액트 로고를 확인할 수 있습니다.

```bash
$ npm run start
```

![Untitled](/images/posts/react/cra-craco-cypress-setting_2.png)

CRA로 프로젝트 생성 시 Jest 기반으로 작성된 에제 테스트 코드가 같이 생성됩니다.

`App.test.tsx`

```tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
```

해당 테스트를 실행하면 아래와 같이 테스트가 잘 실행됩니다.

```bash
$ npm run test

PASS  src/App.test.tsx
  ✓ renders learn react link (6 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.108 s, estimated 1 s
Ran all test suites.

Watch Usage: Press w to show more.
```

## Cypress 설치

### Cypress 패키지 설치 및 설정

이제 cypress 관련 패키지를 설치하고 설정을 진행합니다.

**패키지 설치**

```bash
$ npm install -D cypress eslint-plugin-cypress
```

- `cypress` : cypress 패키지
- `eslint-plugin-cypress` : cypress eslint 플러그인

그 후 루트 디렉토리에 `cypress.json` 파일을 생성하여 설정하고 `.eslintrc` 파일도 생성하여 설정합니다.
그리고 `package.json`에 cypress 실행 스크립트를 추가합니다.

`cypress.json`

```json
{
  "baseUrl": "http://localhost:3000", // 웹앱 실행 시의 baseUrl을 지정
}
```

`.eslintrc`

```bash
{
  "extends": ["plugin:cypress/recommended"]
}
```

`package.json`

```json
{
	...
	"scripts": {
		...
    "cypress:open": "cypress open",
    "cypress:run": "cypress run"
  },
	...
}
```

cypress 실행 스크립트로 실행이 잘 되는지 확인해 봅니다.

```bash
$ npm run cypress:open
```

![Untitled](/images/posts/react/cra-craco-cypress-setting_3.png)

처음 실행하면 cypress 디렉토리에 세팅 파일과 샘플 테스트 파일들이 생성되는데,
`fixtures` 디렉토리와 `integration` 디렉토리의 모든 파일을 삭제합니다.

그 후 샘플용 테스트를 작성합니다.

`cypress/integration/App.spec.tsx`

```tsx
describe("App", () => {
  it("React 공식 문서 링크 존재", () => {
    cy.visit("/");

    cy.contains("Learn React").should("exist");
  });
});
```

작성 후 실행해 보면 작성한 테스트가 문제없이 잘 통과합니다.

```json
$ npm run start // cypress 실행 전 dev server를 실행해줘야 함
$ npm run cypress:open
```

![Untitled](/images/posts/react/cra-craco-cypress-setting_4.png)

하지만 IDE 상에서는 `타입 스크립트 컴파일 에러`와`isolatedModules` 에러가 발생합니다.

![Untitled](/images/posts/react/cra-craco-cypress-setting_5.png)

![Untitled](/images/posts/react/cra-craco-cypress-setting_6.png)

이를 해결하기 위해서는 `tsconfig.json` 에 cypress 관련 설정을 추가해 줘야 합니다.

하지만 루트 디렉토리에 있는 `tsconfig.json` 파일에 설정을 추가하면
jest에서 충돌이 나는 경우가 발생하여서 저는 따로 cypress 설정용 파일을 생성하여서 작성하였습니다.

`cypress/tsconfig.json`

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "noEmit": true,
    "isolatedModules": false, 
    "types": ["cypress"]
  },
  "include": ["./**/*.ts", "./**/*.tsx"]
}
```

발생하던 에러가 해결된 것을 볼 수 있습니다.

![Untitled](/images/posts/react/cra-craco-cypress-setting_7.png)

### dev-server & Cypress 동시 실행 설정

어느 정도 세팅이 완료는 되었지만 현재는 dev server 구동 후 cypress를 실행해야 하는 번거로움이 있습니다.
[start-server-and-test](https://github.com/bahmutov/start-server-and-test) 패키지를 이용하면 따로 구동하지 않고 한 번에 실행이 가능합니다.

dev server 구동 후 브라우저를 실행하지 않게 하기 위해 [cross-env](https://github.com/kentcdodds/cross-env) 패키지도 함께 설치합니다.

`패키지 설치`

```json
$ npm install -D start-server-and-test cross-env
```

`package.json`

```json
{
	...
	"scripts": {
	...
	"cypress:start:app": "cross-env BROWSER=none craco start",
	"cypress:start:wait": "start-server-and-test cypress:start:app http://localhost:3000",
	"cypress:open": "npm run cypress:start:wait -- \"cypress open\"",
	"cypress:run": "npm run cypress:start:wait -- \"cypress run\"",
	}
	...
}

```

cypress를 실행해 보면 dev server가 실행된 후 cypress가 실행되는 것을 확인할 수 있습니다.

```json
$ npm run cypress:open
```

![Untitled](/images/posts/react/cra-craco-cypress-setting_8.png)

---

## 기타 설정

기본적인 세팅은 모두 완료되었고 필요하다면 아래의 세팅들도 추가가 가능합니다.

### 웹앱과 cypress 간의 env 파일 공유

진행하던 프로젝트에서 api 서버 주소를 `env 파일`로 주입하고 있는 상황이어서 cypress 내부에서 http 요청 시 `환경 변수 상의 주소`를 `stubbing` 하기 위해서 웹앱의 환경 변수와 cypress의 `환경 변수 통일`이 필요한 상황이었습니다. 이를 해결하기 위해서 [dot-env](https://github.com/motdotla/dotenv) 패키지를 이용해서 설정을 추가하였습니다.

`패키지 설치`

```json
$ npm install -D dotenv dotenv-cli
```

`package.json`

```json
{
	...
	"scripts": {
			...	  
			// .env.test 파일을 환경 변수 파일로 사용하면서 dev server 실행
	    "cypress:start:app": "dotenv -e .env.test cross-env BROWSER=none craco start",
	  },
}
```

그리고 test용 env 파일을 생성합니다.

`.env.test`

```json
REACT_APP_API_URL=https://test.api.com
```

dev server 쪽은 설정이 완료되었고 이제 cypress에서 해당 파일을 불러오게끔 설정이 필요합니다.

이를 수정하기 위해선 처음 cypress 실행 시 자동적으로 생성되는 `plugins/index.js` 파일에서 해당 환경
변수를 받아오도록 수정해야 합니다.

`cypress/plugins/index.js`

```jsx
const path = require("path");
const dotenv = require("dotenv");

module.exports = (on, config) => {
  const configWithDotenv = dotenv.config({
    // .env.test 파일의 환경 변수 load
    path: path.resolve(process.cwd(), ".env.test"),
  });

  // cypress.json 파일에서 주입 가능한 환경 변수와 .env.test 파일의 환경 변수를 합침
  const env = { ...config.env, ...configWithDotenv.parsed };
  const result = { ...config, env };

  return result;
};
```

 

그 후 웹앱과 cypress에서 환경 변수가 잘 불러와졌는지 테스트를 진행합니다.

`cypress/integration/App.spec.tsx`

```tsx
it("환경 변수 테스트", () => {
    cy.log(Cypress.env("REACT_APP_API_URL"));
});
```

`src/App.tsx`

```tsx
function App() {
  console.log(process.env.REACT_APP_API_URL);

  return (
	...
}

export default App;
```

**cypress 로그**

![Untitled](/images/posts/react/cra-craco-cypress-setting_9.png)

**크롬 개발자 도구 콘솔**

![Untitled](/images/posts/react/cra-craco-cypress-setting_10.png)

위 스크린샷 처럼 테스트 용 dev server와 cypress의 환경 변수가
.env.test 파일에서 정상적으로 읽어지는 것을 확인할 수 있습니다.

### 코드 커버리지

jest는 기본적으로 커버리지를 지원하지만 cypress는 따로 설정을 추가하지 않으면 코드 커버리지를 확인할 수 없습니다. 그리고 jest와 cypress의 커버리지를 같이 사용하려면 추가 설정이 필요합니다.

우선 jest 커버리지 실행 스크립트와 설정을 추가해 줍니다.

`package.json`

```json
{
	...
	"scripts": {
		...
    "test:cov": "craco test --coverage --watchAll=false",
  },
}
```

`craco.config.js`

```json
module.exports = {
  jest: {
    configure: {
      collectCoverageFrom: ["src/**/*.{ts,tsx}"],
      coverageDirectory: "jest-coverage",
    },
  },
};
```

테스트를 실행해 보면 `jest-coverage` 디렉토리에 커버리지 output이 잘 나오는 것을 확인할 수 있습니다.

```bash
$ npm run test:cov # 커버리지와 함께 테스트 실행

# 실행 결과
  console.log
    https://test.api.com

      at App (src/App.tsx:6:11)

 PASS  src/App.test.tsx
  ✓ renders learn react link (29 ms)

--------------------|---------|----------|---------|---------|-------------------
| File                 | % Stmts   | % Branch   | % Funcs   | % Lines   | Uncovered Line #s   |
| -------------------- | --------- | ---------- | --------- | --------- | ------------------- |
| All files            | 15.38     | 0          | 33.33     | 15.38     |
| App.tsx              | 100       | 100        | 100       | 100       |
| index.tsx            | 0         | 100        | 100       | 0         | 7-19                |
| react-app-env.d.ts   | 0         | 0          | 0         | 0         |
| reportWebVitals.ts   | 0         | 0          | 0         | 0         | 3-10                |
| -------------------- | --------- | ---------- | --------- | --------- | ------------------- |
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.807 s, estimated 1 s
Ran all test suites.
```

```bash

$ ll jest-coverage
total 24
-rw-r--r--   1 hot9998  staff   2.0K  4 15 22:56 clover.xml
-rw-r--r--   1 hot9998  staff   2.9K  4 15 22:56 coverage-final.json
drwxr-xr-x  14 hot9998  staff   448B  4 15 22:51 lcov-report
-rw-r--r--   1 hot9998  staff   538B  4 15 22:56 lcov.info
```

그 후 cypress 쪽도 커버리지 관련 패키지와 설정을 추가합니다.

`패키지 설치`

```bash
$ npm install -D @cypress/code-coverage
```

`cypress/plugin/index.js`

```jsx
const codeCoveragePlugin = require("@cypress/code-coverage/task");

module.exports = (on, config) => {
  codeCoveragePlugin(on, config);

	...

  return result;
};
```

`cypress/support/index.js`

```json
import "@cypress/code-coverage/support";
import "./commands";
```

`@cypress/code-coverage` 패키지 내부적으로 [IstanbulJS](https://github.com/istanbuljs/istanbuljs) / [nyc](https://github.com/istanbuljs/istanbuljs) 모듈을 사용하므로 해당 모듈 관련 설정을 추가해줍니다.

`.nycrc`

```bash
{
  "report-dir": "cypress-coverage"
}
```

그리고 babel 설정에 `istanbul` 플러그인을 추가해야 하는데, jest 환경에서는 실행 시 오류가 발생하거나
테스트가 제대로 작동하지 않는 경우가 발생하여서 cypress 환경에서만 플러그인을 추가합니다.

`package.json`

```json
{
	...
	"scripts": {
		...
    "cypress:start:app": "NODE_ENV=e2e dotenv -e .env.test cross-env BROWSER=none craco start",
  },
}
```

`craco.config.js`

```json
module.exports = ({ env }) => {
  const isEnvE2e = env === "e2e";

  return {
    ...(isEnvE2e && {
      babel: {
        plugins: ["istanbul"],
      },
    }),
    jest: {
      configure: {
        collectCoverageFrom: ["src/**/*.{ts,tsx}"],
        coverageDirectory: "jest-coverage",
      },
    },
  };
};
```

cypress를 실행해 보면 `cypress-coverage` 디렉토리에 커버리지 output이 잘 나오는 것을 확인할 수
있습니다.

```bash
$ npm run cypress:run # cypress 실행

# 실행 결과
====================================================================================================

  (Run Starting)

  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Cypress:        9.5.4                                                                          │
  │ Browser:        Electron 94 (headless)                                                         │
  │ Node Version:   v14.17.1 (/Users/hot9998/.nvm/versions/node/v14.17.1/bin/node)                 │
  │ Specs:          1 found (App.spec.tsx)                                                         │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘

────────────────────────────────────────────────────────────────────────────────────────────────────
                                                                                                    
  Running:  App.spec.tsx                                                                    (1 of 1)
Browserslist: caniuse-lite is outdated. Please run:
npx browserslist@latest --update-db

Why you should do it regularly:
https://github.com/browserslist/browserslist#browsers-data-updating

  App
    ✓ React 공식 문서 링크 존재 (5620ms)
    ✓ 환경 변수 테스트 (50ms)

  2 passing (6s)

  (Results)

  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Tests:        2                                                                                │
  │ Passing:      2                                                                                │
  │ Failing:      0                                                                                │
  │ Pending:      0                                                                                │
  │ Skipped:      0                                                                                │
  │ Screenshots:  0                                                                                │
  │ Video:        true                                                                             │
  │ Duration:     6 seconds                                                                        │
  │ Spec Ran:     App.spec.tsx                                                                     │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘

  (Video)

  -  Started processing:  Compressing to 32 CRF                                                     
  -  Finished processing: /Users/hot9998/dev/hot9998/react/react-cypress-jest-setting     (1 second)
                          /cypress/videos/App.spec.tsx.mp4                                          

====================================================================================================

  (Run Finished)

       Spec                                              Tests  Passing  Failing  Pending  Skipped  
  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ ✔  App.spec.tsx                             00:06        2        2        -        -        - │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘
    ✔  All specs passed!                        00:06        2        2        -        -        -

```

```bash
$ ll cypress-coverage 
total 32
-rw-r--r--   1 hot9998  staff   1.7K  4 15 23:30 clover.xml
-rw-r--r--   1 hot9998  staff   2.9K  4 15 23:30 coverage-final.json
-rw-r--r--   1 hot9998  staff   1.2K  4 15 23:30 coverage-summary.json
drwxr-xr-x  13 hot9998  staff   416B  4 15 23:28 lcov-report
-rw-r--r--   1 hot9998  staff   460B  4 15 23:30 lcov.info
```

### Jest & Cypress 코드 커버리지 병합하기

위와 같이 커버리지를 세팅하면 jest와 cypress의 코드 커버리지 결과가 따로 나오게 되는데 이를 병합하려면
아래와 같이 스크립트를 설정하면 됩니다.

`package.json`

```json
{
  ...
	"scripts": {
    ...
    "jest": "craco test",
    "jest:cov": "craco test --coverage --watchAll=false",
    "test:cov": "npm run jest:cov && npm run cypress:run",
    "test:combined-cov": "npm run test:cov && npm run combine:test-coverage",
    "copy:reports": "(mkdir coverage-reports || true) && cp cypress-coverage/coverage-final.json coverage-reports/from-cypress.json && cp jest-coverage/coverage-final.json coverage-reports/from-jest.json",
    "combine:reports": "npx nyc merge coverage-reports && mv coverage.json .nyc_output/out.json",
    "combine:test-coverage": "npm run copy:reports && npm run combine:reports && npx nyc report --reporter lcov --report-dir combined-coverage"
	}
}
```

- `combine:test-coverage` : jest와 cypress 커버리지 파일을 merge하여 결과 파일을 `combined-coverage` 디렉토리로 추출합니다.
- `test:combined-cov` : jest와 cypress 테스트를 진행 후 커버리지 merge까지 진행합니다.

해당 스크립트를 실행해 보면 `combined-coverage` 디렉토리에 merge된 커버리지 파일이 생성되는 것을
확인할 수 있습니다.

```bash
$ npm run test:combined-cov

$ ll combined-coverage/lcov-report/
total 168
-rw-r--r--@ 1 hot9998  staff   6.2K  4 15 23:52 App.tsx.html
-rw-r--r--  1 hot9998  staff   5.3K  4 15 23:52 base.css
-rw-r--r--  1 hot9998  staff   2.6K  4 15 23:52 block-navigation.js
-rw-r--r--  1 hot9998  staff   540B  4 15 23:52 favicon.png
-rw-r--r--@ 1 hot9998  staff   5.6K  4 15 23:52 index.html
-rw-r--r--  1 hot9998  staff   5.2K  4 15 23:52 index.tsx.html
-rw-r--r--  1 hot9998  staff   676B  4 15 23:52 prettify.css
-rw-r--r--  1 hot9998  staff    17K  4 15 23:52 prettify.js
-rw-r--r--  1 hot9998  staff   5.3K  4 15 23:52 reportWebVitals.ts.html
-rw-r--r--  1 hot9998  staff   209B  4 15 23:52 sort-arrow-sprite.png
-rw-r--r--  1 hot9998  staff   6.0K  4 15 23:52 sorter.js
```

**[예제 레포지토리](https://github.com/KimBiYam/react-cypress-jest-setting)**

### 레퍼런스

[react-testing-tutorial-kr/ch10.md at master · adhrinae/react-testing-tutorial-kr](https://github.com/adhrinae/react-testing-tutorial-kr/blob/master/translations/ch10.md)

[Cypress 환경구축 (React, Typescript)](https://velog.io/@averycode/Cypress-%ED%99%98%EA%B2%BD%EA%B5%AC%EC%B6%95-React-Typescript)

[Cypress를 활용한 React 테스팅](https://tecoble.techcourse.co.kr/post/2021-07-28-react-cypress-testing/)

[Combined Unit & E2E Code Coverage: case study on a real life system using Angular, Jest, Cypress & GitLab / CircleCi](https://dev.to/muratkeremozcan/combined-unit-e2e-code-coverage-case-study-on-a-real-life-system-using-angular-jest-cypress-gitlab-35nk)
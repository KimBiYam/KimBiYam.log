---
title: 'NestJS Heroku를 이용하여 무료로 배포하기'
date: '2021-10-25'
tag: 'nest-js'
ogImagePath: '/images/posts/nest-js/deploy-heroku-nest-js_1.png'
description: 'NestJS 앱을 GitHub 연동으로 Heroku에 무료 배포한 과정입니다. 앱 생성과 자동 배포 설정, 배포 후 생긴 Application error를 PORT와 Procfile 설정으로 해결했습니다.'
---

![Heroku 로고](/images/posts/nest-js/deploy-heroku-nest-js_1.png)

### Heroku를 사용하게 된 계기

Nest JS로 만든 토이 프로젝트를 (돈을 아끼고자..) AWS EC2 프리티어를 이용해서 배포하려 하였는데,
프리티어에서 제공하는 EC2 인스턴스인 t2 micro에서
Nest JS + mariaDB + nginx를 docker compose를 이용해서 여러 컨테이너로 한번에 띄우려고 하니
메모리가 부족하여서 NestJS 빌드가 되지 않는 상태가 되었습니다.. 😥

Nest JS만 production 모드로 실행 하였을때는 빌드가 되어서 DB만 따로
AWS RDS를 이용해서 띄우고 EC2에는 Nest JS 애플리케이션만 띄워두는 식으로 진행해도
무방해 보이긴 하였는데, 이 참에 사용 해보지 않은 서비스도 써볼 겸 찾아보다
무료로 배포할 수 있는 Heroku를 이용하기로 하였습니다

## Heroku 란?

어플리케이션을 배포하면 바로 온 사이트로 서비스를 해주는 PaaS 서비스입니다.
Node JS 외에도 다양한 언어, 프레임워크를 지원합니다

### Nest JS 프로젝트 생성

우선 배포를 위해서 nest js 프로젝트를 하나 생성합니다

```bash
$ npm i -g @nestjs/cli
$ nest new nest-js-heroku-test
```

nest js cli를 통해 프로젝트를 생성하면 샘플 코드와 함께 프로젝트가 생성이 되는데
서버의`/` url 로 get 요청 시 `Hello World!` 라는 값을 응답하게 되어있습니다

`app.controller.ts`

```bash
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

`app.service.ts`

```bash
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```

로컬 환경에서 실행 시 잘 동작하는 것을 확인할 수 있습니다

```bash
$ npm run start
```

![브라우저에 Hello World! 가 출력된 NestJS 기본 앱 화면](/images/posts/nest-js/deploy-heroku-nest-js_2.png)

### Heroku 애플리케이션 생성

![Heroku 대시보드의 Create new app 메뉴](/images/posts/nest-js/deploy-heroku-nest-js_3.png)

이제 해당 애플리케이션을 배포하기 위해 [Heroku](https://www.heroku.com/)로 접속합니다
Heroku 사이트 가입 완료 후 로그인을 하면 위와 같은 메뉴가 나타나게 되는데

여기서 Create new app 버튼으로 배포하고자하는 새로운 어플리케이션을 생성하면 됩니다.

![Heroku 앱 이름과 리전을 입력하는 앱 생성 화면](/images/posts/nest-js/deploy-heroku-nest-js_4.png)

그러면 아래와 같은 화면이 나타나는데요, Heroku CLI를 이용하는 방식도 있지만
저는 github를 이용해서 배포를 진행해보겠습니다

![Heroku 앱의 Deploy 탭에서 배포 방식을 선택하는 화면](/images/posts/nest-js/deploy-heroku-nest-js_5.png)

### 레포지토리 생성 및 푸시

![GitHub 새 레포지토리 생성 화면](/images/posts/nest-js/deploy-heroku-nest-js_6.png)

![GitHub 레포지토리 생성 후 표시되는 푸시 가이드](/images/posts/nest-js/deploy-heroku-nest-js_7.png)

레포지토리 생성 후 나오는 가이드를 참고하여 코드를 푸시합니다

- Github 레포지토리에 푸시

```bash
$ git add .
$ git commit -m "Initilize project"
$ git remote add origin <github repo url>
$ git push -u origin master
```

### Heroku에서 GIthub 연동

그 후 heroku 프로젝트에서 해당 레포지토리를 연결합니다

![Heroku Deploy 탭에서 GitHub 레포지토리를 검색해 연결하는 화면](/images/posts/nest-js/deploy-heroku-nest-js_8.png)

아래처럼 연결이 된 모습을 확인할 수 있습니다

![GitHub 연결 후 Automatic deploys와 Manual deploy 설정 화면](/images/posts/nest-js/deploy-heroku-nest-js_9.png)

Automatic deploys를 이용해서 master 브랜치에 push되면 자동으로 배포하게끔 설정해보겠습니다

Choose a branch to deploy 항목에서 원하는 브랜치를 설정 후
Enable Automatic Deploys 버튼을 클릭하면 활성화가 됩니다

![master 브랜치 자동 배포가 활성화된 화면](/images/posts/nest-js/deploy-heroku-nest-js_10.png)

해당 옵션은 master 브랜치에 새로운 커밋이 push되어야 배포를 진행하므로
처음 코드 그대로 배포를 진행하기위해 우선 Manual deploy를 한번 실행합니다

그 후 상단의 Activity 메뉴에서 배포 진행상황을 확인할 수 있습니다

![Manual deploy에서 Deploy Branch 버튼으로 수동 배포하는 화면](/images/posts/nest-js/deploy-heroku-nest-js_11.png)

![Heroku Activity 탭에서 빌드 성공과 배포 이력을 확인하는 화면](/images/posts/nest-js/deploy-heroku-nest-js_12.png)

잘 배포 되었는지 확인하기 위해 build log를 확인해봅니다

![deployed to Heroku 문구가 표시된 Heroku 빌드 로그](/images/posts/nest-js/deploy-heroku-nest-js_13.png)

제일 하단에 `https://nest-js-heroku-test.herokuapp.com/ deployed to Heroku` 라는 문구와 함께

성공적으로 배포가 되었다고 나타납니다.

### 배포 오류...

하지만 해당 주소로 접속해보면 아래와 같이 오류가 나오네요

![배포된 주소 접속 시 나타나는 Heroku Application error 페이지](/images/posts/nest-js/deploy-heroku-nest-js_14.png)

왜 그런지 로그를 확인해보기 위해 [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)를 이용해서 로그를 확인할 수 있습니다

`install Heroku CLI in mac`

```bash
$ brew tap heroku/brew && brew install heroku
```

특정 애플리케이션의 로그 확인

```bash
$ heroku logs --tail -a <application_name>
```

해당 명령어를 입력하면 웹으로 로그인 할 수 있는 페이지가 나타나게 됩니다

![Heroku CLI 웹 로그인 페이지](/images/posts/nest-js/deploy-heroku-nest-js_15.png)

로그인을 완료하면 저희가 원하는 로그 확인이 가능합니다

로그를 확인해보면 아래와 같이 에러가 나타나는 것을 볼 수있습니다

```bash
2021-10-25T12:06:46.376688+00:00 app[api]: Release v1 created by user hot9998@naver.com
2021-10-25T12:06:46.376688+00:00 app[api]: Initial release by user hot9998@naver.com
2021-10-25T12:06:46.529963+00:00 app[api]: Release v2 created by user hot9998@naver.com
2021-10-25T12:06:46.529963+00:00 app[api]: Enable Logplex by user hot9998@naver.com
2021-10-25T12:32:51.000000+00:00 app[api]: Build started by user hot9998@naver.com
2021-10-25T12:34:10.825286+00:00 app[api]: Deploy 385e5950 by user hot9998@naver.com
2021-10-25T12:34:10.825286+00:00 app[api]: Release v3 created by user hot9998@naver.com
2021-10-25T12:34:10.856823+00:00 app[api]: Scaled to web@1:Free by user hot9998@naver.com
2021-10-25T12:34:13.461685+00:00 heroku[web.1]: Starting process with command `npm start`
2021-10-25T12:34:14.561575+00:00 app[web.1]:
2021-10-25T12:34:14.561587+00:00 app[web.1]: > nest-js-heroku-test@0.0.1 start /app
2021-10-25T12:34:14.561588+00:00 app[web.1]: > nest start
2021-10-25T12:34:14.561588+00:00 app[web.1]:
2021-10-25T12:34:14.567663+00:00 app[web.1]: sh: 1: nest: not found
2021-10-25T12:34:14.572156+00:00 app[web.1]: npm ERR! code ELIFECYCLE
2021-10-25T12:34:14.572313+00:00 app[web.1]: npm ERR! syscall spawn
2021-10-25T12:34:14.572376+00:00 app[web.1]: npm ERR! file sh
2021-10-25T12:34:14.572445+00:00 app[web.1]: npm ERR! errno ENOENT
2021-10-25T12:34:14.576793+00:00 app[web.1]: npm ERR! nest-js-heroku-test@0.0.1 start: `nest start`
2021-10-25T12:34:14.576874+00:00 app[web.1]: npm ERR! spawn ENOENT
2021-10-25T12:34:14.576955+00:00 app[web.1]: npm ERR!
2021-10-25T12:34:14.577031+00:00 app[web.1]: npm ERR! Failed at the nest-js-heroku-test@0.0.1 start script.
2021-10-25T12:34:14.577108+00:00 app[web.1]: npm ERR! This is probably not a problem with npm. There is likely additional logging output above.
2021-10-25T12:34:14.583038+00:00 app[web.1]:
2021-10-25T12:34:14.583119+00:00 app[web.1]: npm ERR! A complete log of this run can be found in:
2021-10-25T12:34:14.583167+00:00 app[web.1]: npm ERR!     /app/.npm/_logs/2021-10-25T12_34_14_577Z-debug.log
2021-10-25T12:34:14.715327+00:00 heroku[web.1]: Process exited with status 1
2021-10-25T12:34:14.756411+00:00 heroku[web.1]: State changed from starting to crashed
2021-10-25T12:34:14.760305+00:00 heroku[web.1]: State changed from crashed to starting
2021-10-25T12:34:16.860336+00:00 heroku[web.1]: Starting process with command `npm start`
2021-10-25T12:34:17.789430+00:00 app[web.1]:
2021-10-25T12:34:17.789439+00:00 app[web.1]: > nest-js-heroku-test@0.0.1 start /app
2021-10-25T12:34:17.789449+00:00 app[web.1]: > nest start
2021-10-25T12:34:17.789449+00:00 app[web.1]:
2021-10-25T12:34:17.794867+00:00 app[web.1]: sh: 1: nest: not found
2021-10-25T12:34:17.800543+00:00 app[web.1]: npm ERR! code ELIFECYCLE
2021-10-25T12:34:17.800702+00:00 app[web.1]: npm ERR! syscall spawn
2021-10-25T12:34:17.800764+00:00 app[web.1]: npm ERR! file sh
2021-10-25T12:34:17.800849+00:00 app[web.1]: npm ERR! errno ENOENT
2021-10-25T12:34:17.803707+00:00 app[web.1]: npm ERR! nest-js-heroku-test@0.0.1 start: `nest start`
2021-10-25T12:34:17.803751+00:00 app[web.1]: npm ERR! spawn ENOENT
2021-10-25T12:34:17.803814+00:00 app[web.1]: npm ERR!
2021-10-25T12:34:17.803822+00:00 app[web.1]: npm ERR! Failed at the nest-js-heroku-test@0.0.1 start script.
2021-10-25T12:34:17.803858+00:00 app[web.1]: npm ERR! This is probably not a problem with npm. There is likely additional logging output above.
2021-10-25T12:34:17.806172+00:00 app[web.1]:
2021-10-25T12:34:17.806234+00:00 app[web.1]: npm ERR! A complete log of this run can be found in:
2021-10-25T12:34:17.806266+00:00 app[web.1]: npm ERR!     /app/.npm/_logs/2021-10-25T12_34_17_804Z-debug.log
2021-10-25T12:34:17.927541+00:00 heroku[web.1]: Process exited with status 1
2021-10-25T12:34:18.055715+00:00 heroku[web.1]: State changed from starting to crashed
```

### 오류 해결하기

해당 문제는 Nest JS를 heroku에 배포 했을때 나타나는 현상이며
해결하기 위해서는 몇가지 세팅이 더 필요합니다

기본적으로 `main.ts` 파일에서 포트가 3000번으로 지정되어 있는데,
heroku에서는 동적으로 포트를 할당하여서 해당 포트를 이용하는 세팅을 추가해야합니다

`main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
```

그리고 기본 실행 스크립트를 변경하기 위해 `Procfile` 파일을 생성하여서 작성해줍니다

`Procfile`

```bash
web: npm run start:prod
```

해당 수정 사항들을 레포지토리에 푸시합니다

```bash
$ git add .
$ git cm -m "Fix settings for heroku deploy"
$ git push
```

master 브랜치에 푸시되면 자동으로 배포가 진행되게끔 세팅해두어서 새롭게 배포가 진행됩니다

아까와 마찬가지로 로그에서 나오는 배포 주소로 접속하면
이전과는 다르게 제대로 배포가 된 것을 확인할 수 있습니다

![브라우저에 Hello World! 가 출력된 NestJS 기본 앱 화면](/images/posts/nest-js/deploy-heroku-nest-js_2.png)

### 무료 배포 시 문제점 및 해결법

Heroku는 무료 배포 시에 일정 시간이 요청이 없으면 서버가 sleep 모드가 되는데요
서버가 sleep 모드가 된 후 처음 접속 요청 시 로딩이 오래 걸리게 됩니다

이를 해결하기 위해 [Kaffeine Herokue](https://kaffeine.herokuapp.com/) 라는 사이트에 서버 주소를 등록해두면
자동으로 일정시간마다 요청을 날려줘서 sleep 모드를 방지할 수 있습니다

### 참고 자료

- **[Setup NestJs Server on Heroku](https://medium.com/@terence410/setup-nestjs-server-on-heroku-1475c5cdb1d1)**
- **[예제 레포지토리](https://github.com/KimBiYam/nest-js-heroku-test)**
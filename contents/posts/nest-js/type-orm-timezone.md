---
title: 'NestJS / TypeORM - Timezone 적용하기'
date: '2021-07-04'
tag: 'nest-js'
---

![](/images/posts/nest-js/type-orm-timezone_1.png)


NestJS와 TypeORM 을 사용하여 사이드 프로젝트 진행 중
서울 시간대로 Timezone 세팅이 필요하여 진행해봤습니다

### NestJS

기본 세팅으로 new Date() 함수 등을 실행하면 UTC 기준으로 date가 적용됩니다.
많은 세팅 없이 환경 변수에 타임존을 설정 해주면 됩니다.
가장 간단한 방법은 서버 실행 스크립트에서 타임존을 입력하는 방법이 있겠죠?

```json
"scripts": {
		...
    "start": "TZ=Asia/Seoul nest start",
    "dev": "TZ=Asia/Seoul nest start --watch",
    "start:debug": "TZ=Asia/Seoul nest start --debug --watch",
    "start:prod": "TZ=Asia/Seoul node dist/main",
		...
  },
```

다른 방법으로는 .env 파일을 이용해서 설정하면 됩니다

```basic
TZ=Asia/Seoul
```

그 후 서버를 실행하면 제대로 타임존이 적용됩니다.

### TypeORM

사이드 프로젝트에서 도커를 이용해서 MariaDB 컨테이너를 띄워서 사용했었는데요
해당 MariaDB 컨테이너에 타임존을 적용 후 컨테이너 내부에 접속해서
타임존이 잘 설정 되어 있는 걸 확인 하였는데도,
TypeORM에서도 타임존 세팅을 해주지 않으면 원하는 시간대로 데이터가 가져와지지 않습니다.
TypeORM Config 에도 마찬가지로 타임존을 설정 해주면 됩니다.

저는 별도의 파일로 orm config를 설정했으므로 해당 부분에 추가해주었는데
app.module.ts 파일에 직접적으로 설정하여도 마찬가지입니다.

```tsx
export const typeormConfig: TypeOrmModuleOptions = {
	...
  timezone: 'Asia/Seoul',
	...
};
```

```tsx
@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
		...
``` 
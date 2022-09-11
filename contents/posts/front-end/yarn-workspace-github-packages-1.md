---
title: 'Yarn berry workspaces 패키지 Github Packages에 배포해보기 - 1'
date: '2022-09-11'
tag: 'front-end'
ogImagePath: '/images/posts/front-end/yarn-workspace-github-packages-1_1.png'
---

![Untitled](/images/posts/front-end/yarn-workspace-github-packages-1_1.png)

## 개요

Node.js 기반의 프로젝트 개발을 진행하다 보면 많은 패키지를 `npm`을 이용해서 설치하고 사용하게 되는데요.
npm을 통해 설치하여 사용하는 모듈은 기본적으로 `npm public registry`에 배포되기 때문에 누구나 설치 가능한 패키지가 됩니다.

하지만 패키지를 만들어서 사내, 조직에서만 `private`하게 사용하고 싶으면 `private npm registry`를 구축해야 합니다. 이를 위한 솔루션으로 [Verdaccio](https://verdaccio.org/), [nexus repository](https://www.sonatype.com/products/nexus-repository) 등으로 직접 구축해야 합니다.

직접 구축하지 않고 사용하려면 npm에서 제공하는 Pro, Teams 등의 요금제를 결제하는 등의 방법이 있는데요,
이번에는 Github에서 제공하고 무료로 일정 용량까지 사용 가능한 [Github Packages](https://github.com/features/packages)를 사용하여 `Yarn Berry Workspaces` 기반의 모노레포 패키지를 `private package`로 배포하고 사용해 본 경험을 정리해 보고자 합니다.

## Yarn berry workspaces

여러 프로젝트에서 eslint 등의 설정 공유나 공통 모듈을 공유하는 등의 작업을 위해 모노레포를 구성할 수 있는데요, 모노레포 도구는 많지만 이번에는 그중에서 `Yarn`에서 제공하는 `Workspaces`를 이용해서 모노레포를 구성해 봤습니다. 

도구마다 여러 가지 장단점이 있지만 `Yarn`에서 자체적으로 제공하는 만큼 러닝 커브가 낮고 설정이 간단하다고 생각하여서 선택하였습니다.

기존의 Yarn v1은 classic으로 변경되고 여러 가지 기능이 추가된 v2 이후로는 `Yarn Berry`라는 이름으로 불리게 됩니다. 해당 포스트에서 `Yarn Berry`에 대해서 자세히는 다루지 않고 잘 정리된 아티클이 있어서 링크를 첨부합니다.

[toss tech - node_modules로부터 우리를 구원해 줄 Yarn Berry](https://toss.tech/article/node-modules-and-yarn-berry)

## 프로젝트 설정 시작

> 프로젝트 설정에 있어서 Radix UI의 레포지토리를 많이 참고하였습니다. - [레포지토리 링크](https://github.com/radix-ui/primitives)
> 

### 사용할 기술 스택

- Yarn Workspaces
- Yarn berry
- Typescript
- Parcel
- Github Packages

[예제 레포지토리](https://github.com/KimBiYam/github-packages-example)

프로젝트 디렉토리를 생성하여 프로젝트 설정을 시작합니다.

우선 Yarn이 설치되지 않았다면 Yarn을 설치하고 package.json 파일을 생성 후 Yarn 버전을 berry로 지정합니다.

### 프로젝트 설정 시작

```bash
$ npm i -g yarn
$ yarn init -y # 해당 명령어로 package.json 생성
$ yarn set version berry
```

### 공용 패키지 및 설정 추가

```bash
$ yarn add -D typescript prettier eslint
```

Yarn Berry 사용 시 IDE에서 모듈을 제대로 인식하지 못하는 경우가 생기는데 [관련 문서](https://yarnpkg.com/getting-started/editor-sdks)를 참조하여 IDE 별로 설정을 진행합니다.

typescript, prettier, eslint의 설정은 프로젝트 별로 상이하여 관련 내용은 제외합니다.

Yarn Berry의 Zero Install을 활용하기 위해 `.gitignore` 파일을 아래와 같이 설정합니다.

```bash
.vscode
node_modules

# Yarn berry zero install
.yarn/*
!.yarn/cache
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions
```

### Yarn Berry plugin 설치

Yarn Berry 에서는 [유용한 plugin](https://yarnpkg.com/features/plugins) 들을 지원하는데요 그중에 현재 프로젝트에 필요한 플러그인을 설치합니다.

```bash
$ yarn plugin import typescript
$ yarn plugin import workspace-tools
```

- [plugin-typescript](https://github.com/yarnpkg/berry/tree/master/packages/plugin-typescript) : 패키지 설치 시 `@types` 패키지도 같이 설치해야 하는 경우 자동으로 설치해줍니다.
- [plugin-workspace-tools](https://github.com/yarnpkg/berry/tree/master/packages/plugin-workspace-tools) : 워크스페이스 관련 커맨드를 사용할 수 있습니다. 예를들면 `yarn workspaces foreach` 명령어로 모든 워크스페이스를 순회하며 명령어를 실행할 수 있습니다.

## Workspaces 사용

`package.json` 파일에 workspaces 디렉토리를 추가합니다.

```json
{
	...
  "workspaces": [
    "packages/**"
  ],
	...
}
```

이렇게 지정하면 packages 디렉토리의 모든 하위 디렉토리들을 workspace로 지정하게 됩니다.

### 패키지 추가

worksapce를 사용해 보기 위해 샘플로 모듈과 유틸 패키지를 만들어 보겠습니다.

해당 예시에서는 패키지 번들러로 [Parcel](https://ko.parceljs.org/)을 사용하므로 이에 맞게끔 package.json 파일 설정을 진행합니다. 

`packages/util/sample-util/package.json`

```json
{
	// github packages 사용을 위해서 이름 앞부분을 @organization 명 혹은 @userId로 지정해야 합니다.
  "name": "@kimbiyam/sample-util",
  "version": "0.0.0",
  "description": "",
  "source": "src/index.ts",
  "main": "dist/index.js",
  "module": "dist/index.module.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist"
  ],
  "sideEffects": false,
  "keywords": [],
  "author": "KimBiYam",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/KimBiYam/github-packages-example"
	},
	// github packages registry에 배포하기 위한 설정
  "publishConfig": {
    "registry": "https://npm.pkg.github.com/"
  }
}
```

`packages/module/sample-module/package.json`

```json
{
	// github packages 사용을 위해서 이름 앞부분을 @organization 명 혹은 @userId로 지정해야 합니다.
  "name": "@kimbiyam/sample-module",
  "version": "0.0.0",
  "description": "",
  "source": "src/index.ts",
  "main": "dist/index.js",
  "module": "dist/index.module.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist"
  ],
  "sideEffects": false,
  "keywords": [],
  "author": "KimBiYam",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/KimBiYam/github-packages-example"
  },
	// github packages registry에 배포하기 위한 설정
  "publishConfig": {
    "registry": "https://npm.pkg.github.com/"
  }
}
```

샘플 유틸 함수를 추가합니다.

`packages/util/sample-util/src/index.ts`

```tsx
export const hello = (value: string) => `hello ${value}`;
```

해당 유틸 함수를 참조하는 샘플 모듈 함수를 작성합니다.

타입 스크립트에서 해당 패키지의 경로를 찾으려면 `tsconfig.json` 파일에 path 설정이 필요합니다.

`프로젝트 루트의 tsconfig.json`

```json
{
  "compilerOptions": {
		...
    "paths": {
      "@kimbiyam/sample-util": ["./packages/util/sample-util/src"],
      "@kimbiyam/sample-module": ["./packages/module/sample-module/src"]
    }
  }
}
```

모듈에서 위에서 작성한 유틸을 사용하기 위해 프로젝트 루트에서 아래와 같은 명령어를 입력합니다.

```bash
$ yarn workspace @kimbiyam/sample-module add @kimbiyam/sample-util@0.0.0
```

그 후 유틸을 사용하는 함수를 하나 작성해봅니다.

`packages/module/sample-module/src/index.ts`

```tsx
import { hello } from '@kimbiyam/sample-util';

export const bye = (value: string) => {
  const helloValue = hello(value);
  return `${helloValue} bye ${value}`;
};
```

만약 프로젝트에 eslint, preitter 설정을 추가하여 잘 적용되었다면 모든 워크스페이스에서 루트에 적용된 eslint, prettier 설정을 공유하여 잘 적용이 되는 걸 확인할 수 있습니다.

### Parcel을 이용한 패키지 빌드

위에서 언급한 것처럼 번들러로 Parcel을 이용하여 워크스페이스에 있는 모든 패키지를 빌드 하기 위한 설정을 추가합니다.

우선 프로젝트에 Parcel 의존성을 추가합니다. 

```bash
$ yarn add -D parcel
```

빌드 결과물, Parcel 캐시 디렉토리를 gitignore 파일에 추가합니다.

`.gitignore`

```bash
dist
.parcel-cache
```

그리고 `package.json`에 빌드 스크립트를 추가합니다.

`프로젝트 루트의 package.json`

```json
{
	...
	"scripts": {
	...
	// 워크스페이스 패키지 모두 빌드하는 스크립트
	"build": "parcel build 'packages/*/*' --no-cahe"	
}
```

빌드가 잘 되는지 테스트 해봅니다. Parcel은 빌드를 진행하며 필요한 패키지를 알아서 설치해줍니다.

```bash
$ yarn build
```

빌드가 잘 됐다면 각 패키지 디렉토리 아래에 빌드 결과물이 나타납니다.

![Untitled](/images/posts/front-end/yarn-workspace-github-packages-1_2.png)


다음 포스트에서는 해당 빌드 결과물을 통해서 Github Packages에 배포하는 과정을 알아보도록 하겠습니다.
---
title: 'Yarn berry + Yarn workspaces 패키지 Github Packages에 배포해보기 - 2'
date: '2022-09-12'
tag: 'front-end'
ogImagePath: '/images/posts/front-end/yarn-workspace-github-packages-2_1.png'
---

![yarn-workspace-github-packages-2_1.png](/images/posts/front-end/yarn-workspace-github-packages-2_1.png)

[지난 포스트](https://kimbiyam.me/posts/front-end/yarn-workspace-github-packages-1)에 이어서 이번에는 `Github Packages`에 npm 패키지를 배포해 보도록 하겠습니다.

## Github Packages 배포

### 배포를 위한 준비

우선 지난 포스트 내용처럼 설정을 진행했다면 배포를 위한 준비는 마친 상태입니다.
한 번 더 해당 설정을 살펴보겠습니다.

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
  // 레포지토리 주소를 제대로 지정해야 github 레포지토리에서 배포된 패키지를 바로 볼 수 있습니다.
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

Github Packges 배포를 위해서 주석에 남겨둔 세 부분이 잘 설정되어 있는지 확인합니다.

### 로컬 PC에서 배포해 보기

배포할 준비가 되었다면 npm의 기본 public registry url인 `https://registry.npmjs.org/`가 아닌 Github Packages registry url인 `https://npm.pkg.github.com/`로 배포하기 위해 해당 registry로 로그인이 필요합니다.

npm registry에 로그인하기 위해서는 `Token`이 필요한데 Github Package registry는 Github에서 제공하는 `Access Token`을 발급받으면 됩니다.

`Github 설정 -> Developer Settings -> Personal access tokens` 페이지로 가서 `Access Token`을 발급 받습니다. 토큰 스코프에서 `repo, write:packages, delete:packages`를 선택 후 발급 받아야 합니다.

그 후 해당 토큰을 이용해서 배포를 하기 위해 `.yarnrc.yml` 파일에 설정을 추가합니다.

`.yarnrc.yml`

```yaml
...
npmRegistries:
  "https://npm.pkg.github.com/":
    npmAlwaysAuth: true
    # 빈 문자열을 fallback 값으로 설정
    npmAuthToken: ${GITHUB_NPM_AUTH_TOKEN-''}
```

`GITHUB_NPM_AUTH_TOKEN` 이라는 환경 변수로 토큰 값을 받아오도록 설정했는데요 이를 사용하기 위해 사용 중인 쉘에 환경 변수로 토큰 값을 넣어줍니다. 예시에서는 `Z shell`을 사용하고 있으므로 `.zshrc` 파일에 넣어주도록 하겠습니다.

```bash
$ vim ~/.zshrc

# .zshrc 파일
export GITHUB_NPM_AUTH_TOKEN=<발급받은 토큰> # 해당 라인을 추가
...

$ source ~/.zshrc
```

빌드 후 패키지 배포를 진행해 봅니다.

```bash
# 프로젝트 루트에서 실행
$ yarn build
$ yarn workspaces foreach npm publish --tolerate-republish
```

패키지 배포가 제대로 되었다면 Github 레포지토리에서 확인이 가능합니다.

![Untitled](/images/posts/front-end/yarn-workspace-github-packages-2_2.png)

### Yarn Berry version plugin

새로운 버전의 npm 패키지를 배포하기 위해서는 `package.json` 파일에서 버전을 수정하거나 명령어로 patch, major 버전 업그레이드 등의 명령 수행을 진행 후에 배포를 진행해야 합니다.

하지만 워크스페이스 간에 서로 의존하고 있는 패키지가 있다면 버전 관리가 굉장히 귀찮아지는데요, 이를 도와주는 [Yarn Berry version pluigin](https://yarnpkg.com/cli/version)을 이용하면 편하게 관리가 가능합니다.

> 해당 Release Workflow에 관해서는 [문서](https://yarnpkg.com/features/release-workflow)에 자세하게 설명되어 있습니다.  
> ⚠️  참고로 현재(2022.09.12) 기준으로 `Experimental` 기능입니다.

우선 해당 플러그인을 설치합니다.

```bash
$ yarn plugin import version
```

패키지들을 수정한 뒤 `deferred` 명령어와 함께 patch 버전 업데이트를 실행합니다.

```bash
# 유틸 패키지 업데이트
$ cd packages/util/sample-util
$ yarn version patch -d

# 모듈 패키지 업데이트
$ cd packages/module/sample-module
$ yarn version patch -d
```

명령어를 수행하면 패키지의 `package.json` 파일의 버전이 변경되는 것이 아니라 `.yarn/versions` 디렉토리에 파일이 생기면서 아래와 같은 내용이 나타나게 됩니다.

`.yarn/versions/***.yml`

```bash
releases:
  "@kimbiyam/sample-module": patch
  "@kimbiyam/sample-util": patch

undecided:
  - github-packages-example
```

해당 내용은 다음 릴리즈에 해당 패키지들의 patch 버전 업데이트를 한 번에 수행하겠다는 의미입니다.
버전 변경사항을 반영하는 스크립트와 배포를 위한 스크립트를 `package.json`에 추가합니다.

`프로젝트 루트의 package.json`

```bash
{
	"name": "github-packages-example",
	"scripts": {
    ...
    # exclude로 프로젝트 루트의 이름을 적어주어야 foreach 실행 시 루트를 제외함
    "publish": "yarn bump && yarn build && yarn workspaces foreach -pv --exclude github-packages-example npm publish --tolerate-republish",
    "bump": "yarn version apply --all"
    },
  ...
}
```

배포 스크립트를 실행하면 자동으로 `.yarn/versions` 디렉토리의 버전 변경 사항을 반영하여 버전 업데이트를 수행하고 배포를 진행하게 됩니다.

```bash
$ yarn publish
```

`packages/module/sample-module/package.json`

```bash
{
  "name": "@kimbiyam/sample-module",
  "version": "0.0.1", # patch 버전 반영
	...
  "dependencies": {
    "@kimbiyam/sample-util": "0.0.1" # 다른 패키지의 patch 버전 반영
  },
	...
}
```

**Github Packages에 배포된 모습**

![Untitled](/images/posts/front-end/yarn-workspace-github-packages-2_3.png)

### Github Actions를 이용한 CI/CD 설정

매번 변경사항이 생길 때마다 수동으로 배포를 진행할 수도 있지만 너무 번거로운 작업이므로 Github에서 제공하는 CI/CD 서비스인 `Github Actions`를 통해서 배포를 자동화해보도록 하겠습니다.

`.github/workflows/publish.yml`

```yaml
name: Publish Release

on:
  push:
    branches:
      - master

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        # 전체 커밋 기록을 가져오기 위함
        # https://yarnpkg.com/features/release-workflow#commit-history
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v3
        with:
          node-version: 16
          registry-url: https://registry.npmjs.org

      - name: Install dependencies and publish
        run: yarn publish
        env:
          # Github Actions에서 제공해주는 토큰을 사용
          GITHUB_NPM_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          
      - name: Commit release
        uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: Publish release
```

위와 같이 스크립트를 작성하면 master 브랜치에 푸시 된 경우 버전 변경사항을 반영하며 배포 후 버전 변경사항을 커밋 하여 푸시까지 진행해 줍니다.

해당 스크립트 작성 후 push를 진행하면 아래와 같이 배포에서 403 에러가 나타날 수 있는데요, 이때는 `Github Actions`에 해당 패키지를 배포할 수 있는 권한을 부여해야 합니다.

```bash
➤ YN0000: [@kimbiyam/sample-module]: Process started
➤ YN0000: [@kimbiyam/sample-module]: ➤ YN0035: The remote server failed to provide the requested resource
➤ YN0000: [@kimbiyam/sample-module]: ➤ YN0035:   Response Code: 403 (Forbidden)
➤ YN0000: [@kimbiyam/sample-module]: ➤ YN0035:   Request Method: GET
➤ YN0000: [@kimbiyam/sample-module]: ➤ YN0035:   Request URL: https://npm.pkg.github.com/@kimbiyam%2fsample-module
➤ YN0000: [@kimbiyam/sample-module]: ➤ YN0000: Failed with errors in 0s 510ms
➤ YN0000: [@kimbiyam/sample-module]: Process exited (exit code 1), completed in 0s 680ms
```

배포된 패키지 페이지로 가서 `Package settings` 버튼을 클릭합니다.
그 후 `Manage Actions access` 항목에 레포지토리를 추가하여 `Write` 역할을 부여합니다.

![Untitled](/images/posts/front-end/yarn-workspace-github-packages-2_4.png)

그 후 actions를 다시 실행하면 정상적으로 배포가 완료됩니다.

![Untitled](/images/posts/front-end/yarn-workspace-github-packages-2_5.png)

## 배포된 패키지 설치하기

Github Packages에 배포한 npm 패키지를 설치하려면 아래와 같은 방법으로 설치하면 됩니다.

해당 조직/아이디 명으로 시작하는 패키지는 Github Packages registry를 이용하도록 설정하고, 배포와 마찬가지로 `Github Access Token`값이 필요합니다.

이를 설정하기 위해서 프로젝트 루트에 `.npmrc` 파일을 생성하여 설정을 진행합니다.

`.npmrc`

```bash
# @kimbiyam으로 시작하는 패키지의 registry url을 변경
@kimbiyam:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${GITHUB_NPM_AUTH_TOKEN}
```

배포했던 패키지 설치를 진행합니다.

```bash
# with npm
$ npm install @kimbiyam/sample-module@0.0.0

# with yarn
$ yarn add @kimbiyam/sample-module@0.0.0
```

그 후 테스트를 해보면 정상적으로 사용이 가능한 것을 확인할 수 있습니다.

![Untitled](/images/posts/front-end/yarn-workspace-github-packages-2_6.png)

## 참고사항

참고로 예시와 다르게 사내에서 구축할 때는 `React`용 라이브러리를 위해서 모노레포를 구성했는데 `Yarn Berry`의 `Zero Install` 환경에서는 프로젝트 루트에 공용으로 사용하기 위해 `React` 패키지를 추가하고 라이브러리 패키지 `peerDependencies`에 `React` 패키지를 추가하는 경우에, IDE에서 루트의 `React` 패키지를 찾지 못하는 문제가 생겨서 결국 `Zero Install` 환경 없이 `node_modules`를 이용하는 형태로 변경해서 사용하고 있습니다.

많이 참고했었던 [radix-ui의 레포지토리](https://github.com/radix-ui/primitives)에서도 마찬가지로 `Zero Install` 환경을 사용하지 않는 것을 보아서 아직까지 `Zero Install` 환경에서는 해당 이슈가 문제가 되어서 그렇게 사용하는 게 아닌가 싶습니다.

## 마치며

`Yarn Workspaces` 기반의 모노레포 세팅 및 `Github Packages registry`에 npm 패키지 배포 및 CI/CD까지 구축해 보았는데요, 처음으로 모노레포 환경을 구축해 본 입장에서 `Yarn Workspaces`의 러닝 커브가 그렇게 높지 않다고 생각이 들었습니다. 모노레포를 구축하기 위한 도구에는 [Turborepo](https://turborepo.org/), [Nx](https://nx.dev/), [Lerna](https://lerna.js.org/) 등 다양한 도구가 있는데, 많은 기능이 필요한 게 아니라면 `Yarn Workspaces`로 충분하다는 생각이 됩니다.

### 관련 링크 및 레퍼런스

- [예제 레포지토리](https://github.com/KimBiYam/github-packages-example)
- [radix-ui 레포지토리](https://github.com/radix-ui/primitives)
- [yarnrc 설정](https://yarnpkg.com/configuration/yarnrc)
- [Yarn Berry Releaes Workflow](https://yarnpkg.com/features/release-workflow)
- [Naver D2 - 모던 프론트엔드 프로젝트 구성 기법 - 모노레포 도구 편](https://d2.naver.com/helloworld/7553804)
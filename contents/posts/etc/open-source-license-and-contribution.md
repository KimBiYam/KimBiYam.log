---
title: '오픈소스 저작권과 컨트리뷰션'
date: '2022-06-14'
tag: 'etc'
---

## 오픈소스란?

오픈소스란 `오픈소스 소프트웨어(Open Source Software, OSS)`를 뜻하는 용어이다.
요즘 우리가 일반적으로 소프트웨어 개발에 사용하는 프레임워크, 라이브러리 등은 대부분 오픈소스로 이루어진 경우가 많다.

## 오픈소스와 저작권

오픈소스는 공개되어 있기 때문에 쉽게 사용할 수 있지만 그만큼 놓치기 쉬운 부분이 저작권 침해와 관련된 오픈소스 라이선스이다.

- 오픈소스에서는 보통 저작권자가 해당 오픈소스 코드의 사용 범위와 사용자의 의무 사항을 라이선스에 명시한다. 반드시 이를 확인하고 의무 조항을 준수해야 한다.
- 오픈소스 프로젝트 중에는 예외로 유료로 사용할 수 있게 하는 듀얼 라이선스를 적용하거나 무료 라이선스 버전에는 기능을 제한하는 등의 방법으로 과금하는 프로젝트도 있다.
- 오픈소스를 사용할 때는 오픈소스의 출처와 저작권, 라이선스 정보를 남겨 두어야 한다.

## 오픈소스 라이선스

오픈소스 라이선스는 오픈소스로 배포된 소스 코드를 사용할 때 지켜야 하는 규약 등을 명시한 것이다. 라이선스에서 명시한 사용 조건을 이행하지 않거나 라이선스 표기가 되어 있지 않은 소스 코드를 임의로 사용하면 저작권 침해에 해당될 수 있다.

### 주요 오픈소스 라이선스 특징 비교

- [OLIS 라이선스 비교표](https://olis.or.kr/license/compareGuide.do)

![출처 : [NAVER 오픈소스 가이드](https://naver.github.io/OpenSourceGuide/book/UsingOss/the-legal-side-of-opensource.html#licensedef)](/images/posts/etc/open-source-license-and-contribution_1.png)

*출처 : [NAVER 오픈소스 가이드](https://naver.github.io/OpenSourceGuide/book/UsingOss/the-legal-side-of-opensource.html#licensedef)*

### 오픈소스 라이선스 확인

오픈소스의 라이선스는 보통 Github 등의 소스 코드 저장소의 최상위 디렉터리에 있는 LICENSE 문서나 README 문서에서 볼 수 있다. 그 외에 해당 오픈소스 프로젝트의 홈페이지가 있는 경우에는 홈페이지에서도
확인할 수 있다.

## 의무 사항 준수

저작권과 라이선스 정보 표기 등의 의무 사항은 다음 예와 같은 형식으로 준수할 수 있다.

### 애플리케이션으로 배포하는 경우

오픈소스를 사용한 프로젝트를 애플리케이션으로 배포할 때는 애플리케이션의 설정 메뉴 등에 오픈소스 라이선스 메뉴를 두어 저작권과 라이선스 정보를 표기할 수 있다.

![iOS 네이버 지도 앱의 라이선스 표기](/images/posts/etc/open-source-license-and-contribution_2.png)

*iOS 네이버 지도 앱의 라이선스 표기*

![iOS 카카오톡 앱의 라이선스 표기](/images/posts/etc/open-source-license-and-contribution_3.png)

*iOS 카카오톡 앱의 라이선스 표기*

![iOS 토스 앱의 라이선스 표기](/images/posts/etc/open-source-license-and-contribution_4.png)

*iOS 토스 앱의 라이선스 표기*

### ****오픈소스로 재배포하는 경우****

오픈소스를 사용한 프로젝트를 오픈소스로 다시 배포할 때는 새로운 프로젝트의 NOTICE 문서나 서드파티 관련 메뉴에서 저작권과 라이선스 정보를 표기할 수 있다.

![[LINE의 오픈소스인 armeria의 NOTICE 파일](https://github.com/line/armeria/blob/master/NOTICE.txt)](/images/posts/etc/open-source-license-and-contribution_5.png)

[LINE의 오픈소스인 armeria의 NOTICE 파일](https://github.com/line/armeria/blob/master/NOTICE.txt)

## 오픈소스 컨트리뷰션(Contribution)

컨트리뷰션은 오픈소스 프로젝트에 참여하고 기여하는 모든 활동을 의미한다.

### 컨트리뷰션의 유형

- 오타 수정
- 번역
- 문서화
- 새로운 기능 등의 의견 제시
- 코드 수정

### 컨트리뷰션을 하는 이유

- 사용하던 오픈소스에 불편한 점이나 버그 등이 있어 개선하고자 했을 때, 비슷한 문제를 겪고 있는 이들에게 도움을 줄 수 있다.
- 오픈소스에 참여하는 개발자에게 리뷰를 통하여 일종의 멘토링을 받는 효과를 누릴 수 있다.
- 오픈소스 활동은 일반적으로 공개되므로 본인의 역량을 노출시킬 수 있고, 이를 이력에 활용이 가능하다.
- 보통 영어로 소통하므로 영어 실력 향상에도 도움이 될 수도 있지 않을까..?

### 오픈소스에서의 역할 구분

오픈소스와 관련된 사람들을 일반적으로 아래와 같은 역할로 구분할 수 있다.

- **메인테이너(Maintainer)** : 해당 오픈소스 프로젝트의 관리자
- **커미터(Committer)** : 다른 개발자의 컨트리뷰션 내용을 리뷰하고 프로젝트에 반영할 권한을 가진 자
- **컨트리뷰터(Contributor)** : 해당 오픈소스 프로젝트에 기여한 자
- **사용자(User)** : 해당 오픈소스 프로젝트를 사용하는 유저

## 컨트리뷰션 해보기

오픈소스 기여를 장려하는 프로젝트의 경우 일반적으로 컨트리뷰션 가이드라인 문서가 잘 작성되어 있다.
해당 가이드라인 문서에 잘 따라서 컨트리뷰션을 진행하면 된다.

### 오픈소스 컨트리뷰션 가이드라인 예시

- [React 컨트리뷰션 가이드라인](https://ko.reactjs.org/docs/how-to-contribute.html)
- [Flutter 컨트리뷰션 가이드라인](https://github.com/flutter/flutter/blob/master/CONTRIBUTING.md)
- [NestJs 컨트리뷰션 가이드라인](https://github.com/nestjs/nest/blob/master/CONTRIBUTING.md)

### 처음 PR로 기여해 볼 만한 이슈 찾기

규모가 있는 오픈소스 프로젝트의 경우 초심자도 쉽게 기여할 수 있는 이슈들을 `good first issue` 등의 라벨을 달아놓는 경우가 많다.

- React 레포지토리의 `good first issue` 라벨

![Untitled](/images/posts/etc/open-source-license-and-contribution_6.png)

- Flutter 레포지토리의 `good first contribution` 라벨

![Untitled](/images/posts/etc/open-source-license-and-contribution_7.png)

## 오픈소스 컨트리뷰션 사례 공유

사내 프로젝트 진행 중에 사용하는 오픈소스 UI 라이브러리인 [MUI](https://github.com/mui/material-ui)를 사용 중에 Safari 관련 애니메이션 버그가 발생하여 처음으로 간단한 이슈와 PR을 남긴 경험을 공유하고자 한다. [(관련 포스트)](https://kimbiyam.me/posts/front-end/safari-css-transition-problem)

> ❗️컨트리뷰션 방법이 오픈소스 프로젝트 별로 상이할 수 있습니다.
> 

### 컨트리뷰션 가이드라인 문서 확인

앞서 설명한 것처럼 오픈소스 기여를 장려하는 프로젝트의 경우 컨트리뷰션 가이드라인 문서가 잘 작성되어 있기 때문에 우선 [해당 문서](https://github.com/mui/material-ui/blob/master/CONTRIBUTING.md)에 따라 컨트리뷰션을 진행했다.

### 이슈 열기

문서에 작성된 PR 작성 문단에 PR을 보내기 전에 이슈를 열어 메인테이너와 논의하라는 안내가 나와 있어서 그에 따라 동일한 이슈를 찾아보고 해당 이슈가 없어서 이슈를 먼저 열었다.

해당 프로젝트의 경우 아래의 스크린샷 처럼 이슈 템플릿도 잘 만들어져 있어서 템플릿에 따라 이슈 내용을 작성하였다.

[https://github.com/mui/material-ui/issues/31766](https://github.com/mui/material-ui/issues/31766)

![Untitled](/images/posts/etc/open-source-license-and-contribution_8.png)

![Untitled](/images/posts/etc/open-source-license-and-contribution_9.png)

![Untitled](/images/posts/etc/open-source-license-and-contribution_10.png)

### PR 제출

그 후 메인테이너, 해당 프로젝트 사용자들과 논의하고 PR도 제출하였는데(여기까지 상당 기간이 소요되었다),
컨트리뷰트 가이드라인에 프로젝트 Fork 방법, 수정 후 제출 방법 등이 자세하게 나와있어서 해당 안내에 따라 수정 후 PR을 제출하였다.

[https://github.com/mui/material-ui/pull/31912](https://github.com/mui/material-ui/pull/31912)

일반적으로 Github에 공개된 오픈소스 프로젝트는 해당 프로젝트를 fork 후에 자신의 레포지토리에서 작업 후에 기존 프로젝트 레포지토리로 PR을 보내는 형태로 진행한다.

![Untitled](/images/posts/etc/open-source-license-and-contribution_11.png)

상단의 Fork 버튼으로 해당 프로젝트를 자신의 레포지토리에 Fork한다.

![Fork된 레포지토리](/images/posts/etc/open-source-license-and-contribution_12.png)
*Fork된 레포지토리*


그 후 브랜치를 생성하여 코드 수정 등을 진행하고 PR을 보내면 된다.
현재는 작업한 브랜치가 있지 않아서 보이지 않지만 아래와 같은 브랜치 선택 화면에 자신이 Fork 하여 작업한 브랜치를 선택할 수 있게 된다.

![Untitled](/images/posts/etc/open-source-license-and-contribution_13.png)

![Untitled](/images/posts/etc/open-source-license-and-contribution_14.png)

보이는 것처럼 아쉽지만 내가 제출한 PR이 merge 되지 않고 다른 해결법을 제시한 PR이 merge 되었다.

웬만한 오픈소스 프로젝트의 이슈나 PR에 관한 컨트리뷰션은 위와 같은 프로세스와 크게 다르지 않다.

## 결론

큰 IT 기업(예를 들어 LINE)에서는 오픈소스 매니저라는 직무가 따로 있기도 하던데 그만큼 오픈소스 라이선스 관련해서 고려할 점이 많다는 걸 나타내는 것 같다.

컨트리뷰트 관련해서는 짧은 영어 실력에 컨트리뷰트 자체도 처음 경험해 보았지만, 간단한 컨트리뷰트 정도는 무리가 없다는 점에서 시도 해보는 것을 크게 겁먹지 않아도 될 것 같다는 생각이 들었다.

오픈소스에 기여할 기회가 있다면 참여해 보는 것이 자기 개발에도 도움이 많이 될 것 같다.

### 레퍼런스

- [NAVER 오픈소스 가이드](https://naver.github.io/OpenSourceGuide/book/)
- [오픈소스에 기여하는 방법](https://opensource.guide/ko/how-to-contribute/)
- [차근차근 오픈소스에 기여해보기](https://www.rinae.dev/posts/how-to-contribute-oss)
- [공개SW 개요 - 공개SW 포털](https://www.oss.kr/oss_intro)
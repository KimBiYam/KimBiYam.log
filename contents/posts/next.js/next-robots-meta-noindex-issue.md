---
title: 'Next.js App Router 사용 시 robots meta 태그 noindex 관련 이슈 해결'
date: '2024-01-08'
tag: 'next.js'
---

## 개요

> ⚠️ 해당 이슈는 작성하는 현재 날짜(2024.01.08) 기준의 이슈로, Next.js 버전이 업데이트 되면서 내용이 변경될 수도 있습니다.
> 

블로그 환경을 Next.js의 새로운 기능인 `App Router`로 전환한 뒤 얼마 지나지 않아서 구글 서치 콘솔에서 다음과 같은 이메일을 받게 되었습니다.

![Untitled](/images/posts/next.js/next-robots-meta-noindex-issue_1.png)

페이지의 robots meta 태그에 `noindex` 값이 있어, 색인을 생성하지 않았다는 리포트가 오게 되었습니다.
해당 프로젝트에서는 robots 관련 내용은 `robots.txt`로만 관리하고 meta 태그에는 따로 작성하지 않았는데, 해당 리포트가 발생하는 이유에 의문이 들어서 원인을 찾아보기로 했습니다.

## 원인 분석

### 실제 코드 구현과 결과물 확인

우선 기존에 작성했던 meta 태그 관련 코드를 다시 체크해보고 실제로 번들 된 HTML 파일 내에 robots meta 태그가 존재하는지를 확인해 보았습니다.

기존에 기본적인 메타 태그는 `Root Layout 파일(layout.tsx)`에 작성을 해둔 상태였는데, 아래와 같이 robots meta 태그와 관련된 내용은 전혀 작성하지 않았습니다.

`src/app/layout.tsx`

```tsx
export const metadata: Metadata = {
  title: {
    template: `%s${PAGE_TITLE_SUFFIX}`,
    default: `KimBiYam.log`,
  },
  description: 'KimBiYam의 개발 블로그 입니다.',
  // robots 관련 내용은 존재하지 않음
  ...
}
```

개발 환경에서 확인해도 robots meta 태그가 존재하지 않았지만, 그렇지만 로컬에서 production 환경으로 빌드를 했을 때나 실제로 배포된 결과물이나 robots meta 태그가 존재하고, `noindex`로 값이 들어간 것을 확인하였습니다.

```html
<!-- 실제로 robots meta 태그가 존재하며 content에 "noindex" 값이 들어있었음 -->
<meta name="robots" content="noindex"/>
<title>KimBiYam.log</title>
<meta name="description" content="KimBiYam의 개발 블로그 입니다."/>
```

### 관련 이슈 발견 및 해결 방법 모색

`Pages Router`에서 `App Router`로 전환을 하긴 했지만, SEO 관련 세팅은 대부분 기존 설정을 유지하도록 마이그레이션 하였는데, 기존에 없던 meta 태그가 추가된 게 이상한 것 같아서 Next.js 레포에서 관련 이슈를 검색해보았습니다.

검색하다보니 App Router에서 새로 추가된 `[useSearchParams`를 사용하면 production 빌드 시 robots meta 태그에 noindex 값이 추가된다는 이슈](https://github.com/vercel/next.js/issues/58615)를 발견하였습니다.

해당 이슈에서 나와있는 해결책으로는 해당 이슈가 해결될 때까지 Web API인 `URLSearchParams`를 사용하거나 Route 설정의 `dynamic` 값을 `force-dynamic`으로 설정하라는 등의 방법을 제시하고 있는 상태입니다.

그리고 Next.js 공식 문서에 나와있는 설명으로는 Route 설정의 `dynamic` 값을 `force-dynamic`으로 설정하면 해당 페이지는 무조건 `getServerSideProps`를 부르는 것과 동일하게 `SSR` 환경으로 동작하게 하는 설정이라, `SSG`로 충분한 페이지에서 불필요한 리소스 낭비가 되는 문제가 있을 것으로 보였습니다.

이외에도 meta 태그에 직접 robots 설정을 추가하라는 내용도 있지만, 설정을 추가해도 `noindex` 값의 robots meta 태그가 중복으로 들어가서 동일한 이슈가 있습니다.

## 이슈 해결

### 결국 찾은 임시 방편..?

위에서 찾은 이슈에서 임시로 `URLSearchParams`를 사용하는 방법도 있었지만 현재 블로그에서 사용하던 곳의 구현 상 선택한 태그와 `searchParams`가 매번 동일한 값을 유지해야 하는데, `URLSearchParams`만으로는 구현할 수 없고 `useSearchParams`를 사용해야 하는 상황이었습니다.

그러다 `[useSearchParams`의 문서의 `Static Rendering` 섹션](https://nextjs.org/docs/app/api-reference/functions/use-search-params#static-rendering)에 나와있는 `Suspense` 관련 내용이 눈에 띄었습니다.

> If a route is [statically rendered](https://nextjs.org/docs/app/building-your-application/rendering/server-components#static-rendering-default), calling `useSearchParams` will cause the Client Component tree up to the closest `[Suspense` boundary](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#example) to be client-side rendered.
> 
> 
> This allows a part of the route to be statically rendered while the dynamic part that uses `useSearchParams` is client-side rendered.
> 
> We recommend wrapping the Client Component that uses `useSearchParams` in a `<Suspense/>` boundary. This will allow any Client Components above it to be statically rendered and sent as part of initial HTML. [Example](https://nextjs.org/docs/app/api-reference/functions/use-search-params#static-rendering).
> 

내용을 100% 이해하지는 못했지만 대략 dynamic 하게 경로를 생성하지 않는 경우(SSR로 dynamic하게 route를 만들지 않는 경우로 이해했음..) `useSearchParams`를 호출할 때는 `Suspense`를 감싸서 클라이언트 사이드에서 렌더링하도록 권장한다는 내용이었습니다.

태그 값을 사용하는 곳이 태그를 선택하는 컴포넌트와 포스트 리스트를 렌더링하는 컴포넌트 두 가지가 있었는데, 구조를 개선해서 태그를 선택하는 컴포넌트에만 `useSearchParms`를 사용하고 리스트를 렌더링하는 컴포넌트는 사용하지 않는 구조로 변경한 뒤에, `useSearchParams`를 사용하는 컴포넌트를 `Suspense`로 감싸도록 변경하였습니다.

자세한 변경사항은 [해당 PR](https://github.com/KimBiYam/KimBiYam.log/pull/230/files)의 변경점을 보면 대략 아실 수 있을 것 같습니다.

변경 후에는 당연하게도 태그 선택 컴포넌트는 최초로 내려주는 HTML 파일에 포함되지 않지만, 그 대신 문제가 되었던 robots meta 태그는 사라지게 되었습니다.

```html
<!-- robots meta 태그가 제거됨 -->
<title>KimBiYam.log</title>
<meta name="description" content="KimBiYam의 개발 블로그 입니다."/>
```

선택한 태그에 따라 렌더링하는 리스트가 달라서 `force-dynamic` 설정으로 변경해야 하나 고민도 했지만, 어차피 마크다운 파일로 SSG로 빌드하는 게 이 프로젝트의 목적에 부합하기 때문에 굳이 SSR을 지원하는 형태로 바꿀만큼의 필요성을 느끼지는 못해서 이걸로 충분하다는 생각이 들었습니다.

## 후기

결국 해결했던 방법은 임시 방편에 불과한 것 같다는 생각이 듭니다. [해당 이슈를 해결한 PR](https://github.com/vercel/next.js/pull/59531)도 현재 날짜 기준(2024.01.08)으로 canary 브랜치에 merge가 되어있는 것 같은데, 실제로 언제 릴리즈가 될지는 모르겠지만 릴리즈가 되고 기존 구조로도 문제가 없다면 다시 변경할 예정입니다.

Vercel에서는 `App Router`가 stable한 기능이라고 발표를 했었지만, 여전히 회사의 production에 사용한다면 조금 꺼려지는 부분이 많다는 생각이 들었습니다.

![Untitled](/images/posts/next.js/next-robots-meta-noindex-issue_2.png)
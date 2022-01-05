---
title: 'Next.js SEO 관련 정리'
date: '2022-01-05'
tag: 'next.js'
---

이번에 블로그를 직접 개발하면서 SEO 작업을 진행하였는데 해당 부분을 정리해 보려 한다.
일반적으로 프론트엔드에서 통용되는 내용과 NEXT.js에서의 내용을 같이 정리할 예정이다.

### SEO 란?

`Search engine optimization` 의 약자로 검색엔진 봇이 웹사이트를 크롤링 하여 검색엔진에 노출시켜
검색 결과의 상위에 노출할 수 있게끔 최적화하는 작업이다.

### robots.txt

`robots.txt` 는 로봇 배제 표준(robots exclusion protocol)으로 알려진 규약으로 검색엔진 봇에게 사이트 및 웹 페이지를 수집할 수 있도록 허용하거나 제한하는 규약이다. `robots.txt` 파일은 항상 사이트의 루트 디렉토리에 위치해야 한다.

- [robots.txt 소개 및 가이드](https://developers.google.com/search/docs/advanced/robots/intro?hl=ko)

해당 가이드를 참고하여 작성하여서 페이지의 루트 디렉토리에 위치시키면 된다.
`NEXT.js` 같은 경우는 프로젝트 루트 디렉토리의 `public` 디렉토리에 파일을 위치하면
사이트의 루트 디렉토리로 접근이 가능하다.

해당 블로그처럼 보안 상으로 검색엔진에 노출시키면 안 되는 페이지가 없는 경우에는
모든 크롤링 접근을 허용하게끔 작성하면 된다.

`robots.txt 작성 예시`

```
User-agent: *
Allow: /
```

### sitemap.xml

`sitemap.xml` 파일은 검색엔진 봇에게 웹 사이트에서 크롤링 해야 할 URL을 전달한다.
해당 파일은 반드시 `루트 디렉토리에 위치할 필요는 없다.`
`sitemap`을 작성하여 `Google Search Console` 등에 제출하거나, `robots.txt` 파일에
`sitemap.xml` 파일의 `위치를 명시`하면 된다.

`sitemap.xml 작성 예시` 

```jsx
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
	<url>
		<loc>[URL 주소]</loc>
		<changefreq>daily</changefreq>
		<priority>0.7</priority>
		<lastmod>2021-12-25T11:49:14.936Z</lastmod>
	</url>
</urlset>
```

- `urlset` : 해당 태그는 전체 URL을 캡슐화하고 현재 프로토콜 표준을 명시한다.
- `url` : 명시하고자 하는 각 페이지의 상위 태그
- `loc` : 해당 페이지의 URL을 나타내는 태그
- `changefreq` : 페이지가 변경되는 빈도와 관련된 태그. 검색 엔진에서 페이지를 크롤링 하는
빈도와는 관련이 없을 수도 있다고 한다. `구글`에서는 `해당 값을 무시`한다고 한다.
아래와 같은 값을 지정할 수 있다.
    - always
    - hourly
    - daily
    - weekly
    - monthly
    - yearly
    - never
- `priority` : 해당 사이트 내부에서 페이지 별 우선순위를 지정하는 태그로 `0.0 부터 1.0 사이의 값`을 지정하면 된다. 우선순위는 크롤링 봇에 `영향을 주지 않는다`고 한다. `changefreq` 태그와 마찬가지로 `구글` 에서는 `해당 값을 무시`한다고 한다.
- `lastmod` : 파일을 마지막으로 수정한 날짜를 명시하는 태그

- [사이트맵 제작 및 제출하기](https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap?hl=ko)
- [Google에 사이트맵 제출](https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap?hl=ko#addsitemap)

`NEXT.js` 에서 사용할 때는 `robots.txt` 파일과 마찬가지로 사이트맵을 생성한 후 루트의 `public` 디렉토리에 위치시켜서 `robots.txt` 에 `sitemap.xml` 파일 위치를 명시하면 된다.

`robots.txt`

```
...
Sitemap: [도메인]/sitemap.xml
```

### `NEXT.js`에서 동적으로 `sitemap.xml` 생성하기

위와 같이 `sitemap.xml` 에 크롤링 해야 할 URL을 작성하면 끝이지만, 새로운 페이지가 생길 때마다 매번 사이트맵을 작성하는 것은 굉장히 비효율 적인 작업일 것이다. 직접 [스크립트를 작성](https://medium.com/volla-live/next-js%EB%A5%BC-%EC%9C%84%ED%95%9C-sitemap-generator-%EB%A7%8C%EB%93%A4%EA%B8%B0-10fc917d307e)하는 방법도 있지만 사이트맵을 생성해주는 패키지도 존재하여서 해당 패키지를 사용해보았다.

### next-sitemap package

[npm 패키지](https://www.npmjs.com/package/next-sitemap)

가이드에 따라서 패키지 설치를 진행한다

```bash
$ npm i next-sitemap
```

그 후 루트 디렉토리에 설정이 담긴 `next-sitemap.js` 파일을 생성한다.
`generateRobotsTxt` 옵션을 `true` 로 설정하면 `robots.txt` 까지 자동으로 생성해 준다.

`next-sitemap.js`

```bash
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://example.com',
  generateRobotsTxt: true,
  // ...other options
}
```

그 후 `package.json` 에 `postbuild` 스크립트를 추가한다.

`package.json`

```json
{
  "build": "next build",
  "postbuild": "next-sitemap"
}
```

`postbuild` 스크립트를 실행해 보면 `sitemap.xml` 파일과 `robots.txt` 파일이 동적으로 생성되는 것을 확인할 수 있다.

빌드 시에는 자동적으로 `postbuild` 스크립트가 실행되어서 마찬가지로 파일이 생성된다.

`자동적으로 생성된 robots.txt`

```
# *
User-agent: *
Allow: /

# Host
Host: https://kimbiyam.me

# Sitemaps
Sitemap: https://kimbiyam.me/sitemap.xml
```

`자동적으로 생성된 sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
<url><loc>https://kimbiyam.me</loc><changefreq>daily</changefreq><priority>0.7</priority><lastmod>2022-01-04T17:01:04.053Z</lastmod></url>
<url><loc>https://kimbiyam.me/introduce</loc><changefreq>daily</changefreq><priority>0.7</priority><lastmod>2022-01-04T17:01:04.053Z</lastmod></url>
<url><loc>https://kimbiyam.me/posts/dart/enum-value-to-string</loc><changefreq>daily</changefreq><priority>0.7</priority><lastmod>2022-01-04T17:01:04.053Z</lastmod></url>
<url><loc>https://kimbiyam.me/posts/flutter/bloc-equatable-example</loc><changefreq>daily</changefreq><priority>0.7</priority><lastmod>2022-01-04T17:01:04.053Z</lastmod></url>
<url><loc>https://kimbiyam.me/posts/flutter/bloc-infinite-scroll</loc><changefreq>daily</changefreq><priority>0.7</priority><lastmod>2022-01-04T17:01:04.053Z</lastmod></url>
<url><loc>https://kimbiyam.me/posts/flutter/bloc-package-classes</loc><changefreq>daily</changefreq><priority>0.7</priority><lastmod>2022-01-04T17:01:04.053Z</lastmod></url>
<url><loc>https://kimbiyam.me/posts/flutter/bloc-package-widget-classes</loc><changefreq>daily</changefreq><priority>0.7</priority><lastmod>2022-01-04T17:01:04.053Z</lastmod></url>
<url><loc>https://kimbiyam.me/posts/flutter/bloc-pattern-overview</loc><changefreq>daily</changefreq><priority>0.7</priority><lastmod>2022-01-04T17:01:04.053Z</lastmod></url>
<url><loc>https://kimbiyam.me/posts/flutter/bloc-rxdart</loc><changefreq>daily</changefreq><priority>0.7</priority><lastmod>2022-01-04T17:01:04.053Z</lastmod></url>
<url><loc>https://kimbiyam.me/posts/flutter/cocoa-pods-error</loc><changefreq>daily</changefreq><priority>0.7</priority><lastmod>2022-01-04T17:01:04.053Z</lastmod></url>
<url><loc>https://kimbiyam.me/posts/flutter/enum-to-string</loc><changefreq>daily</changefreq><priority>0.7</priority><lastmod>2022-01-04T17:01:04.053Z</lastmod></url>
<url><loc>https://kimbiyam.me/posts/flutter/equatable-package</loc><changefreq>daily</changefreq><priority>0.7</priority><lastmod>2022-01-04T17:01:04.053Z</lastmod></url>
<url><loc>https://kimbiyam.me/posts/flutter/flutter2.0-migration</loc><changefreq>daily</changefreq><priority>0.7</priority><lastmod>2022-01-04T17:01:04.053Z</lastmod></url>
<url><loc>https://kimbiyam.me/posts/flutter/get-context-in-init-state</loc><changefreq>daily</changefreq><priority>0.7</priority><lastmod>2022-01-04T17:01:04.053Z</lastmod></url>
<url><loc>https://kimbiyam.me/posts/flutter/ignore-device-font-size</loc><changefreq>daily</changefreq><priority>0.7</priority><lastmod>2022-01-04T17:01:04.053Z</lastmod></url>
<url><loc>https://kimbiyam.me/posts/flutter/provider</loc><changefreq>daily</changefreq><priority>0.7</priority><lastmod>2022-01-04T17:01:04.053Z</lastmod></url>
<url><loc>https://kimbiyam.me/posts/flutter/pull-to-refresh-by-platform</loc><changefreq>daily</changefreq><priority>0.7</priority><lastmod>2022-01-04T17:01:04.053Z</lastmod></url>
<url><loc>https://kimbiyam.me/posts/flutter/test-coverage</loc><changefreq>daily</changefreq><priority>0.7</priority><lastmod>2022-01-04T17:01:04.053Z</lastmod></url>
<url><loc>https://kimbiyam.me/posts/flutter/usage-fvm</loc><changefreq>daily</changefreq><priority>0.7</priority><lastmod>2022-01-04T17:01:04.053Z</lastmod></url>
<url><loc>https://kimbiyam.me/posts/flutter/usage-github-action</loc><changefreq>daily</changefreq><priority>0.7</priority><lastmod>2022-01-04T17:01:04.053Z</lastmod></url>
<url><loc>https://kimbiyam.me/posts/front-end/babel</loc><changefreq>daily</changefreq><priority>0.7</priority><lastmod>2022-01-04T17:01:04.053Z</lastmod></url>
<url><loc>https://kimbiyam.me/posts/front-end/webpack</loc><changefreq>daily</changefreq><priority>0.7</priority><lastmod>2022-01-04T17:01:04.053Z</lastmod></url>
<url><loc>https://kimbiyam.me/posts/heroku/deploy-heroku-nest-js</loc><changefreq>daily</changefreq><priority>0.7</priority><lastmod>2022-01-04T17:01:04.053Z</lastmod></url>
<url><loc>https://kimbiyam.me/posts/javascript/console-log-speed</loc><changefreq>daily</changefreq><priority>0.7</priority><lastmod>2022-01-04T17:01:04.053Z</lastmod></url>
<url><loc>https://kimbiyam.me/posts/nest-js/type-orm-timezone</loc><changefreq>daily</changefreq><priority>0.7</priority><lastmod>2022-01-04T17:01:04.053Z</lastmod></url>
<url><loc>https://kimbiyam.me/posts/react/employing-storybook-on-react</loc><changefreq>daily</changefreq><priority>0.7</priority><lastmod>2022-01-04T17:01:04.053Z</lastmod></url>
<url><loc>https://kimbiyam.me/posts/react/styled-components-modal</loc><changefreq>daily</changefreq><priority>0.7</priority><lastmod>2022-01-04T17:01:04.053Z</lastmod></url>
<url><loc>https://kimbiyam.me/posts/react/usage-react-query</loc><changefreq>daily</changefreq><priority>0.7</priority><lastmod>2022-01-04T17:01:04.053Z</lastmod></url>
</urlset>
```
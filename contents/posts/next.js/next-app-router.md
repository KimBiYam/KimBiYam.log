---
title: 'Next.js 13 App Router 적용기'
date: '2023-10-02'
tag: 'next.js'
---

## 개요

Next.js 13 버전이 릴리즈 되고 가장 큰 변화인 App Router 기능이 출시가 되었는데요. 현재 보고 계신 블로그에 적용을 해보며 Server Components 등의 변경점 등을 정리해 보았습니다.

> 파일 명 및 코드 베이스는 TypeScript 기반으로 작성하였으며, tsx 파일은 전부 js, jsx, ts 파일로도 대체 가능합니다.
> 

## Server Components vs Client Components

app 디렉토리 적용 이후에는 서버 컴포넌트와 클라이언트 컴포넌트는 필수로 알아야 하는 개념인 것 같아 간단하게 정리해 보고자 합니다.

### Server Components

[Next.js 공식 문서의 서버 컴포넌트 문서](https://nextjs.org/docs/app/building-your-application/rendering/server-components#benefits-of-server-rendering)를 보면 서버 컴포넌트의 장점에 대해서 정리가 되어있습니다.

app 디렉토리에서는 모든 페이지, 컴포넌트는 기본이 서버 컴포넌트로 동작하며 최초 페이지 로딩의 퍼포먼스, 번들 사이즈 최적화 등의 이유로 가능하면 서버 컴포넌트 사용을 권장하는 것 같습니다.

클라이언트 컴포넌트와의 차이를 보자면 `브라우저 API`를 사용할 수 없으며 `interactive`한 기능들도 사용할 수 없습니다. 여기서의 `interactive`한 기능들이란 `이벤트 리스너, React hook` 등을 포함합니다.

하지만 새로운 `data fetching`이나 SEO를 위한 `metadata` 등의 기능은 서버 컴포넌트에서만 사용이 가능합니다.

```tsx
export default function SomeServerComponent() {
  return (
    <button
      onClick={() => {
        console.log('clicked!!');
      }}
    >
      Click me
    </button>
  );
}
```

![Untitled](/images/posts/next.js/next-app-router_1.png)

- 서버 컴포넌트에서 `onClick` 같은 이벤트 리스너를 사용한다면 아래처럼 에러가 발생합니다.

### Client Components

클라이언트 컴포넌트는 클라이언트 내에서 동작하기 때문에 서버 컴포넌트와 다르게 `이벤트 리스너, React hook` 등의 `interactive`한 기능들을 사용할 수 있습니다.

클라이언트 컴포넌트의 사용 방법은 컴포넌트 파일 최상단에 `'use client'`를 선언하여 클라이언트 컴포넌트를 명시하는 것으로 사용합니다.

```tsx
'use client'; // 클라이언트 컴포넌트임을 명시

import { useState } from 'react';

export default function SomeClientComponent() {
  const [count, setCount] = useState(0); // hook의 사용이 가능합니다.

  return (
    <>
      <div>count: {count}</div>
      <button
        // 이벤트 리스너의 사용이 가능합니다.
        onClick={() => {
          setCount((prev) => prev + 1);
        }}
      >
        +
      </button>
    </>
  );
}
```

- 위처럼 `'use client'`를 선언하면 `interactive`한 기능을 사용할 수 있는 클라이언트 컴포넌트가 됩니다.
- 기존의 Next.js에서 브라우저 API 등을 사용 시 Client Side 인지 구분을 위해 `useEffect`내에서 접근하거나 `window` 객체가 있는지 체크를 하는 작업이 필수였는데, 클라이언트 컴포넌트에서는 해당 부분이 필요 없지 않을까 싶었지만 이는 기존과 동일하게 체크가 필요합니다.
---
## Pages 디렉토리에서 App 디렉토리로 옮겨가기

### Root Layout 파일

App Router라는 이름에 맞게 해당 기능을 사용하려면 기존의 `/pages` 디렉토리가 아닌, `/app` 디렉토리를 생성해야 합니다.

이는 기존의 Pages Router와 마찬가지로 `/src/pages` 대신 `/src/app` 디렉토리를 생성해도 무방합니다.

App Router에서는 아래와 같은 root layout 파일이 필수입니다.

`/app/layout.tsx`

```tsx
export default function RootLayout({
  children,
}: {
	children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- root layout은 children prop을 포함해야 합니다.
- root layout은 html 및 body 태그를 포함해야 합니다. (Next.js에서 자동으로 만들어주지 않음)
- 해당 파일에 적용한 스타일, 스크립트 등이 application 전체에 적용이 됩니다. (Pages Router의 `_document.js, _app.js` 등을 대체하는 역할)

### Page 파일

app 디렉토리에서는 기존의 페이지 디렉토리 대신 `page.tsx` 파일로 대체되었습니다.

기존처럼 디렉토리 기반의 라우팅은 유지가 되지만 디렉토리 내의 `index.tsx` 파일 혹은 `blog/[slug].tsx` 같은 파일을 생성하는 것이 아니라 app 디렉토리 내에 위치하는 것으로 변경되었습니다.

`/app/page.tsx` → `/`

```tsx
export default function MainPage() {
	return <div>Main Page</div>
}
```

`/app/blog/[slug]/page.tsx` → `/blog/post-1`

```tsx
export default function BlogPostPage() {
	return <div>Blog Post</div>
}
```

- 기존의 `getServerSideProps, getStaticProps, getInitialProps` 등의 함수는 새로운 data fetching 방식으로 변경되었습니다.
- app 디렉토리의 페이지는 기본적으로 Server Components입니다.

### getServerSideProps 변경

pages 디렉토리에서 서버 사이드 렌더링을 위해 사용하던 `getServerSideProps` 대신 Server Components에서는 컴포넌트 내에서 `async/await`를 사용할 수 있게 변경되어서 바로 데이터를 불러올 수 있습니다.

이때 cache 옵션을 `no-store`로 주게되면 캐싱을 하지 않으므로 기존의 `getServerSideProps`와 유사하게 구현이 가능합니다.

```tsx
async function getSomeData() {
  const res = await fetch(`https://...`, { cache: 'no-store' }); // no-store 옵션
  const data = await res.json();
 
  return data;
}

// 컴포넌트 자체를 async function으로 만들 수 있습니다.
export default async function SomePage() {
  const data = await getSomeData(); // data fetching
 
  return (
    <ul>
      {data.map((datum) => (
        <li key={datum.id}>{datum.name}</li>
      ))}
    </ul>
  )
}
```

### getStaticProps 변경

pages 디렉토리에서 SSG를 위해 사용하던 `getStaticProps`도 `getServerSideProps`의 변경과 동일한 형태로 데이터를 가져오면 됩니다.

이떄 cache 옵션을 주지 않으면 fetch의 기본 캐싱 정책이 `force-cache` 이므로 항상 요청 데이터를 캐싱 하게 되어서 `getStaticProps`와 유사하게 구현이 가능합니다.

```tsx
async function getSomeData() {
  const res = await fetch(`https://...`);
  const data = await res.json();
 
  return data;
}
 
// 컴포넌트 자체를 async function으로 만들 수 있습니다.
export default async function SomePage() {
  const data = await getSomeData(); // data fetching
 
  return (
    <ul>
      {data.map((datum) => (
        <li key={datum.id}>{datum.name}</li>
      ))}
    </ul>
  )
}
```

### getStaticPaths 변경

pages 디렉토리에서 `getStaticProps`와 함께 dynamic routes를 사용하기 위해서 `getStaticPaths`를 사용하였는데, app 디렉토리에서는 유사한 기능을 제공하는 `generateStaticParams`를 사용하도록 변경되었습니다.

`/app/blog/[slug]/page.js`

```tsx
// generateStaticParams 함수를 정의합니다.
// 해당 함수는 params에 해당하는 Array를 반환하도록 작성합니다.
export async function generateStaticParams() {
  const posts: Array<{ slug: string }> = await fetch('https://.../posts').then(
    (res) => res.json(),
  );

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  // ...
}
```

- 페이지 파일에 `generateStaticParams` 함수를 작성하고, params에 해당하는 Array를 반환하도록 작성하면 됩니다.
- path에 포함된 params는 전부 반환하도록 구성해야 합니다.
    - 예시로 `/posts/[category]/[id]` 라는 path를 구성한다면 `Array<{ category: string, id: string }>` 형태로 반환을해야 합니다.

---
## SEO 관련

기존 Next.js에서 SEO 관련한 기능으로 `next/head`가 지원됐지만, app 디렉토리에서는 `metadata` 객체를 만드는 형태로 변경되었고 이외에도 `robots.txt, sitemap` 같은 파일을 생성하는 기능도 추가되었습니다.

### Metadata

기존의 `next/head` 대신 `metadata` 객체를 만들어서 export 하는 형태로 변경이 되었고, 각 페이지에서 이를 작성 후 export하면 됩니다.

지원되는 `metadata` 필드는 [공식 문서](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadata-fields)에 정리되어 있으며, 기존의 `next/head`와 사용법만 다를 뿐 크게 차이는 없는 것 같습니다.

`/app/page.js`

```tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title',
	description: 'description'
}
 
export default function Page() {
  return '...'
}
```

### generateMetadata

마찬가지로 동일한 metadata 객체를 만들지만, 동적인 데이터가 필요한 경우 사용합니다. (예를 들어 어떤 상세 페이지에서 각 페이지의 들어갈 정보가 필요한 경우)

해당 블로그에서는 아래와 같은 방식으로 작성하였습니다.

`/src/app/posts/[subdirectory]/[id]/page.tsx`

```tsx
import { Metadata } from 'next';

interface PostPath {
  id: string;
  subdirectory: string;
}

export function generateStaticParams() {
  const paths: Array<{ params: PostPath }> = getAllPostPaths();
  return paths;
}

export async function generateMetadata({
  params, // generateStaticParams에서 반환한 params를 받아옵니다.
}: {
  params: PostPath;
}): Promise<Metadata> {
  const subdirectory = params?.subdirectory;
  const id = String(params?.id);

  // post의 상세 정보를 불러옵니다.
  const postDetail = await getPostDetail(
    `${POST_DIRECTORY}/${subdirectory}`,
    id,
  );

  const { title, description, ogImagePath } = postDetail;

  // 상세 정보를 기반으로 Metadata 객체를 만들어 반환합니다.
  return {
    title: generateTitle(title),
    description,
    openGraph: generateOpenGraphMetaData({
      title: generateTitle(title),
      description,
      ogImagePath,
      path: `/posts/${subdirectory}/${id}`,
    }),
  };
}
```

### ****robots.txt****

SEO를 위한 정적인 `robots.txt` 파일을 넣을 수 있게 지원하며, 동적으로 `robots.txt`를 만드는 기능도 지원합니다.

`/app/robots.txt`

```bash
User-Agent: *
Allow: /
Disallow: /private/

Sitemap: https://www.kimbiyam.me/sitemap.xml
```

`/app/robots.ts`

```tsx
import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    // 환경 변수 등의 값을 이용해서 동적으로 변경 가능합니다.
    sitemap: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/sitemap.xml`, 
  }
}
```

### ****sitemap.xml****

robots.txt와 마찬가지로 SEO를 위한 정적인 `sitemap.xml` 파일을 넣을 수 있게 지원하며, 동적으로 `sitempa.xml`을 만드는 기능도 지원합니다.

`/app/sitemap.xml`

```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.kimbiyam.me</loc>
    <lastmod>2023-10-02T15:00:00.000Z</lastmod>
    <changefreq>yearly</changefreq>
    <priority>1</priority>
  </url>
</urlset>
```

`/app/sitemap.ts`

```tsx
import { MetadataRoute } from 'next';

import { DOMAIN_URL } from '../constants';
import { getAllPostPaths } from '../lib/posts/postList';

export default function sitemap(): MetadataRoute.Sitemap {
  const postPaths = getAllPostPaths();

  return [
    {
      url: DOMAIN_URL,
      lastModified: new Date(),
    },
    ...postPaths.map(({ params: { id, subdirectory } }) => ({
      url: `${DOMAIN_URL}/posts/${subdirectory}/${id}`,
      lastModified: new Date(),
    })),
  ];
}
```
---
## 기타 예약 파일 변경

### **404.js 변경**

기존에 페이지를 찾지 못하는 경우 `/pages/404.js`로 커스텀한 페이지를 구성할 수 있었는데, 이는 `not-found.js`로 대체되었습니다.

`/app/not-found.js`

```jsx
export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
    </div>
  )
}
```

- not-found 페이지도 기본적으로 Server Components에 해당되기 때문에, 다른 페이지 파일처럼 컴포넌트 내부에서 data fetching이 가능합니다.

---
## Troubleshooting

### metadata title template 적용

Next.js 공식 문서에는 metadata 사용 시 [Template object](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#template)를 지원한다고 가이드가 되어있는데요. 각 페이지 타이틀에 suffix를 붙여주기 위해서 사용하려 했으나, 저의 경우에는 root page에 제대로 적용되지 않는 이슈가 있었습니다.

문서를 보니 적용한 경로의 하위 경로에만 적용이 되는 방식이라, 예시로 root layout 파일에 적용한다면 root page에는 title을 명시하지 않은 채로 사용해야 하고 이는 metadata 내의 openGraph 필드도 마찬가지입니다.

`/app/layout.tsx`

```tsx
export const metadata: Metadata = {
  title: {
    template: '%s | suffix', // title | suffix 같은 형태로 포맷팅됩니다.
    default: '기본 페이지 명' // metadata title이 없는 페이지는 해당 이름을 사용합니다.
  },
  openGraph: {
    title: {
      template: '%s | suffix',
      default: '기본 페이지 명'
    },
  },
};
```

`/app/page.tsx`

```tsx
// 해당 페이지 파일에서는 metadata 내의 title을 적용을 하지 않습니다.
// 같은 레벨에 있는 페이지라 root layout에 적용한 title template object가 무시됩니다.

// export const metadata: Metadata = {
//   title: 'Home',
// };

export default function HomePage() {
  ...
}
```

`/app/posts/page.tsx`

```tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'posts' // root layout의 template이 적용되어 `posts | suffix`로 포맷팅됩니다.
}

export default function PostsPage() {
	...
}
```

### 사용이 불가능한 라이브러리 존재

해당 블로그에서는 마크다운 파싱 및 코드 하이라이팅을 위해서 remark와 [remark-prism](https://github.com/sergioramos/remark-prism)을 사용하고 있었는데요. app 디렉토리로 변경 후에는 모듈을 가져올 수 없는 에러가 발생하여서 이를 해결하기 위해 여러가지 시도를 해보았지만 결국 해결이 되지 않았고 비교적 메인테이닝이 잘 되고있는 [rehype-prism](https://github.com/Val-istar-Guo/rehype-prism)을 사용하는 것으로 변경하였습니다.

import 관련 이슈라 yarn berry 환경에서의 이슈인가 했지만 다른 환경으로 변경하여도 마찬가지로 발생하였고, 해당 레포에도 [동일한 이슈](https://github.com/sergioramos/remark-prism/issues/457)가 있는 것으로 보아서 app 디렉토리에서는 해당 라이브러리 사용이 힘든 것 같습니다.

이외에도 사용이 불가능한 라이브러리가 있을 것으로 보이고, 마이그레이션을 한다면 이를 해결하는 비용도 고려를 해야 할 것 같습니다.

---
## 소감

Next.js 13의 App Router로 적용하면서 변경점 등을 간단하게 정리해보았는데요.
저는 간단한 블로그 프로젝트라 수월하게 마이그레이션을 하였지만, breaking change가 꽤나 많기 때문에 큰 프로젝트 들에서는 적용이 쉽진 않을 것이라는 생각이 들었습니다.

초반에는 서버 컴포넌트, 클라이언트 컴포넌트 관련 에러를 무수히 많이 만났고… 이를 해결하다 보니 대충 개념은 잡혔지만 추후에는 좀 더 깊은 이해가 있으면 좋을 것 같다는 생각입니다.

적용된 전체 코드는 [해당 블로그 레포](https://github.com/KimBiYam/KimBiYam.log)에 있으니 궁금하시면 참고하셔도 좋을 것 같습니다.
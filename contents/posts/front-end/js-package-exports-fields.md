---
title: 'JavaScript 패키지에서 각 환경에 맞는 파일 제공하기'
date: '2024-06-16'
tag: 'front-end'
---

## 문제인식

기존에 브라우저와 Node.js 각각의 환경에 맞게 다른 코드 베이스를 빌드하고, `package.json`의 `module`, `main`, `browser` 필드를 활용해서 제공한 패키지가 있었습니다.

```jsx
// package.json 예시
{
  "module": "./build/browser/index.mjs",
  "main": "./build/node/index.js", // CommonJS 방식이며 entry 파일이 다름
  "browser": "./build/browser/index.js",
}
```

Next.js 환경에서도 이를 사용할 수 있도록 지원했으나, Next.js v14.0.2 이후 App Router 환경에서 패키지를 제대로 불러오지 못하는 현상이 발견되었습니다.

문제의 원인은 SSR 환경(Node.js)에서 `main` 필드가 아닌 브라우저용 패키지를 가져오는 현상이었고, 이는 해당 버전 이후 CommonJS(CJS) 방식이 아닌 ES Module(ESM) 방식으로 패키지를 불러오기 때문으로 추정되었습니다.

> 원인이 된 것으로 보이는 Next.js v14.0.2에 포함된 변경사항:
[**Fix nested esm package default import resolving mismatch**](https://github.com/vercel/next.js/pull/57784)
> 

## 문제 해결

원인을 파악한 후, Node.js와 Webpack 문서를 참고하여 `exports` 필드를 사용한 conditional exports 설정으로 문제를 해결할 수 있음을 알게 되었습니다. 이를 통해 동일한 패키지 내에서 CJS, ESM 방식에 따라 또는 Node.js 환경에서만 다른 entry point를 제공할 수 있습니다.

```jsx
// package.json
{
  "exports": {
	  ".": {
	    "node": "./feature-node.js", // node.js 환경에서는 해당 파일을 불러옴
	    "default": "./feature.js" // 나머지 환경에서는 해당 파일을 불러옴
    }
  }
}
```

해당 설정 추가 후 테스트한 결과, 각 환경에 맞는 entry 파일을 가져오도록 정상적으로 동작하는 것을 확인했습니다. 최종적으로 아래와 같은 설정으로 변경하여 패키지를 배포했고, 이슈가 해결되었습니다.

```jsx
// 최종적으로 변경된 package.json 예시
{
	"exports": {
		".": {
			"node": {
				"types": "./build/node/index.d.ts",
				"require": "./build/node/index.js",
				"import": "./build/node/index.mjs",
				"default": "./build/node/index.js"
			},
			"default": {
				"types": "./build/browser/index.d.ts",
				"require": "./build/browser/index.js",
				"import": "./build/browser/index.mjs",
				"default": "./build/browser/index.js",
			}
		}
	}
}
```

## 마무리

이번 이슈를 해결하며 `exports` 필드에 대해서 알게 되었고, 패키지를 라이브러리화하는 초기 세팅 단계에서 `exports` 필드를 필수로 설정하여 각 환경에 맞는 파일을 제대로 제공해 주어야 할 필요성을 느꼈습니다.

## 관련 링크

- [Node.js documentation](https://nodejs.org/api/packages.html)
- [toss tech - CommonJS와 ESM에 모두 대응하는 라이브러리 개발하기: exports field](https://toss.tech/article/commonjs-esm-exports-field)
---
title: 'Babel'
date: '2021-10-25'
tag: 'front-end'
ogImagePath: '/images/posts/front-end/babel_1.png'
---

![Untitled](/images/posts/front-end/babel_1.png)

## Babel이란?

- `Babel is a JavaScript compiler`
- Babel은 JavaScript 컴파일러
- 정확하게 말하면 Babel은 JavaScript로 결과물을 만들어주는 컴파일러이다

## JavaScript로 변환 과정이 필요한 이유

- 자바스크립트에 새로운 문법, 여러가지 기술들이 생기면서 호환성의 문제를 갖게 됨
- 오래된 브라우저는 이러한 새로운 문법, 새로운 기술들을 적용하기 위해서 변환화는 과정, 즉 Babel이 필요함

## Babel 설정

- 필요한 패키지들

```bash
$ npm i -D @babel/core @babel/plugin-proposal-optional-chaining @babel/preset-env @babel/preset-react @babel/preset-typescript babel-loader
```

- @babel/preset
    - Babel은 그 자체로는 사실상 하는 일이 없고 plugin에 의해서 실행이 됨
    - 이를 위해 수많은 plugin들이 존재하는데 preset으로 plugin들을 묶어서 사용할 수 있음
    - `@babel/preset-env`
        - ECMAScript2015+를 변환할 때 사용
        - 바벨 7 이전 버전에는 연도별로 각 프리셋을 제공했지만, 지금은 env 하나로 합쳐짐
    - `@babel/preset-react, @babel/preset-typescript`
        - react, typescript 문법을 javascript로 바꾸기 위한 plugin 들이 묶여있음
        
- `babel.config.js`

```jsx
module.exports = (api) => {
	api.cache(true);

	const presets = [
		[
			'@babel/preset-env',
			{
				targets: '> 0.25%, not dead',
				useBuiltIns: 'usage',
				corejs: 3,
				shippedProposals: true,
				modules: false,
			},
		],
		'@babel/preset-typescript',
		'@babel/preset-react',
	];

	const plugins = ['@babel/plugin-proposal-optional-chaining'];
	
	return {
		presets,
		plugins,
	};
};
```

- targets: 프로젝트를 지원 / 대상으로 하는 환경을 설정(브라우저)
- useBuiltIns: poly-fill을 처리하는 방법을 결정
- corejs: @babel/polyfill이 deprecated 되면서 대체로 corejs 옵션을 사용
- shippedProposals: 브라우저에 제공된 기능 제안에 대한 지원을 활성화
- modules: ES 모듈 구문을 다른 모듈 유형으로 변환
    - [https://babeljs.io/docs/en/babel-preset-env](https://babeljs.io/docs/en/babel-preset-env)
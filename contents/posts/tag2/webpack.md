---
title: 'Webpack'
date: '2021-10-25'
---

![Untitled](/postImages/tag2/webpack_1.png)

## Webpack

- 많은 파일들을 필요한 형태의 하나 또는 여러개의 번들 파일로 만들어줌

## Webpack을 사용하는 이유

### 1. 네트워크 병목현상 해결

- 너무 많은 자바스크립트 파일을 로드하게되면, 네트워크 병목현상에 빠질 수 있음
- 이때의 해결방법으로 하나의 자바크스립트 파일만을 사용할 수 있지만 가독성 및 유저보수 효율성이 떨어지는 문제가 발생
- 해결방법으로 Webpack과 같은 모듈 번들러를 사용하게 되면 종속성이 있는 파일들을 묶어주기 때문에 가독성과 유지보수 효율성을 높이고 네트워크 병목현상을 최소화 할 수 있음

### 2. 모듈 단위로 개발이 가능

1. 스코프에 신경 쓰지 않고 개발이 가능

```jsx
// test1.js
let value = 'a';
console.log(value);

// test2.js
let value = 'b';
console.log(value);
```

- test1, test2 파일에서 변수가 같은 스코프에 선언되어 충돌이 발생
- 이때 모듈 번들러를 사용하게 되면 모듈 번들러는 모듈을 IIFE(즉시실행함수)로 변경해주기 때문에, 스코프에 신경쓰지 않고 개발을 할 수 있다
1. 라이브러리 종속 순서를 신경 쓰지 않아도 된다

```jsx
<script src="util-jquery.js" />
<script src="jquery.js" />
```

- `util.jquery.js` 는 jquery를 사용하기 때문에, 로드 순서상 `jquery.js` 가 나중에 호출되면 에러가 발생
- 모듈 번들러를 사용한다면 위와 같은 로드 순서를 신경쓰지 않아도 됨

### 3. 코드를 압축/최적화 할 수 있음

- 종속성이 있는 파일들을 묶어주기 때문에 Webpack의 Config 또는 플로그인에 따라 코드를 압축/최적화 할 수 있다

### 4. ES6 버전 이상의 스크립트를 사용할 수 있음

- 오래된 버전의 브라우저에서는 ES6이상의 자바스크립트 문법 사용이 불가능
- 하지만 Webpack의 Babel-loader를 사용한다면 ES6 이상의 자바스크립트 문법을 ES5 버전의
    
    문법으로 변경시켜주기 때문에 사용이 가능
    

## Webpack을 이해해보자

### 1. Entry

```jsx
module.export = {
	entry: './src/index.js'
	// 여러개의 entry 선언 방법
	/*
	entry: {
		index: './src/index.js',
		file: './srcfile.js',
	}
	*/
}
```

- 종속성 그래프의 시작점을 Entry 라고 칭함
- 쉽게 말하여 모듈번들의 기준이 되는 자바스크립트 파일
- Config 파일에 Entry 설정이 되어 있지 않다면 기본값은 `./src/index.js` 이다

### 2. Output

```jsx
const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'webpack-bundle.js',
	}
};
```

- Output 설정은 번들된 파일의 이름과 저장할 위치를 지정할 수 있음
- output 설정이 되어있지 않다면 기본값은 `./dist/main.js` 이다

### 3. Loader

```jsx
const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname 'dist'),
		filename: 'webpack-bundle.js',
	},
	module: {
		rules:[
			{
				test: /\.(ts|tsx)$/,
				use: 'babel-loader',
				exclude: /node_modules/,
			},
		]
	}
};
```

- Webpack은 자바스크립트 파일만 읽어 올 수 있기 때문에, Loader를 통해 스타일시트나 타입스크립트 등의 파일을 Webpack이 읽을 수 있는 모듈로 변경해주는 과정이 필요
- `test` : 변환 할 파일을 지정(확장자)
- `use` : 변환 할 파일에 지정할 로더를 설정

### 4. Plugins

```jsx
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'webpack-bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				use: 'babel-loader',
				exclude: /node_modules/,
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({ template: './src/index.html' }),
	]
};
```

- Loader는 모듈을 처리하지만, Plugin은 번들된 파일을 처리함
- Plugin은 번들된 파일을 난독화 하거나, 압축하는데 사용

### 5. Mode

```jsx
module.exports = {
	mode: 'production' || 'development' || 'none'
}
```

- mode는 production, development, none 3가지의 옵션이 존재
- mode의 기본값은 production
- 3가지 각각 내장된 옵션을 가지고 있음

1. development

```jsx
module.exports = {
	devtool: 'eval',
	plugins: [
		new webpack.NamedModulesPlugin(),
		new webpack.NamedChunksPlugin(),
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify("development")
		}),
	]
};
```

2. production

```jsx
module.exports = {
  plugins: [
    new UglifyJsPlugin(/* ... */),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production") 
    }),
  ]
};
```

3. none

```jsx
module.exports = {
  plugins:[]
}
```
---
title: 'React 18 변경점'
date: '2022-02-01'
tag: 'react'
---

# React 18

현재 날짜(2022년 2월 1일) 기준으로 React 18 버전이 [RC 단계](https://github.com/reactwg/react-18/discussions/9)이다.
2~4주가량 RC 단계를 거치고 Stable로 변경될 예정이라고 한다.

React 18에서의 변경사항들을 정리하자면 다음과 같다.

# ReactDOM의 render 함수 변경

React 18 버전부터 `react-dom` 의 `render` 함수는 deprecated 되고,
아래에 나열된 React 18의 기능들을 적용하려면 새로 생긴 `createRoot` 함수를 이용해야 한다.

### 기존

```jsx
const rootElement = document.getElementById("root");

ReactDOM.render(<App />, rootElement);
```

### 변경 후

```jsx
const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(<App />);
```

---

# Automatic Batching

## 개요

> 리액트에서의 배치(Batching)는 더 나은 성능을 위해 **여러 개의 상태 업데이트**를
**한 번의 리렌더링**으로 묶는 작업을 의미한다.
> 

아래 예시의 경우 `handleClick` 이벤트 핸들러에서 상태 업데이트를 2번 실행한다.
상태 업데이트를 2번 실행함으로 렌더링도 2번 실행한다고 생각할 수 있지만,
기본적으로 리액트는 배치를 수행해서 한 번의 리렌더링으로 처리한다.

```jsx
const Batching = () => {
	const [count, setCount] = useState(0);
	const [flag, setFlag] = useState(false);

	const handleClick = () => {
		setCount((prevCount) => prevCount + 1); // 리렌더링 되지않음
		setFlag((prevFlag) => !prevFlag); // 리렌더링 되지않음
		// 함수가 종료될 때 리렌더링
	}

	return (
		<div>
			<p>Count : {count}</p>
			<p>Flag : {flag.toString()}</p>
			<button type="button" onClick={handleClick}>
				Increment
			</button>
		</div>
	);
};

export default Batching;
```

하지만 React 18 이전까지는 React의 이벤트 핸들러에만 배치가 적용되고,
Promise 내부에서의 업데이트, setTimeout, 네이티브 이벤트 핸들러 등에서는 배치가 적용되지 않았다.

`React 18 이전`

```jsx
// Promise 내부에서의 업데이트
fetch(/*..someting..*/).then(() => {
	setCount((prevCount) => prevCount + 1); // 리렌더링
	setFlag((prevFlag) => !prevFlag); // 리렌더링
});

// setTimeout 
setTimeout(() =>{
	setCount((prevCount) => prevCount + 1); // 리렌더링
	setFlag((prevFlag) => !prevFlag); // 리렌더링
}, 1000);

// 네이티브 이벤트 핸들러
elm.addEventListener('click', () => {
	setCount((prevCount) => prevCount + 1); // 리렌더링
	setFlag((prevFlag) => !prevFlag); // 리렌더링
}
```

## Automatic batching 이란?

`createRoot` 가 적용된 React 18부터는 상태 업데이트 호출 위치와 상관없이
**모든 업데이트가 배치가 수행하도록 변경**되었다.

리액트 팀에서는 이에 따라서 렌더링 작업이 줄어들고 앱의 성능이 향상이 기대된다고 한다.

`React 18 이후`

```jsx
// Promise 내부에서의 업데이트
fetch(/*..someting..*/).then(() => {
	setCount((prevCount) => prevCount + 1); // 리렌더링 되지않음
	setFlag((prevFlag) => !prevFlag); // 리렌더링 되지않음
	// 함수가 종료될 때 리렌더링
});

// setTimeout 
setTimeout(() =>{
	setCount((prevCount) => prevCount + 1); // 리렌더링 되지않음
	setFlag((prevFlag) => !prevFlag); // 리렌더링 되지않음
	// 함수가 종료될 때 리렌더링
}, 1000);

// 기본 이벤트 핸들러
elm.addEventListener('click', () => {
	setCount((prevCount) => prevCount + 1); // 리렌더링 되지않음
	setFlag((prevFlag) => !prevFlag); // 리렌더링 되지않음
	// 함수가 종료될 때 리렌더링
}
```

권장되지는 않지만, 만약 배치를 사용하지 않고 강제로 리렌더링을 수행하고 싶다면
`ReactDOM.flushSync` 함수를 사용하면 된다.

```jsx
import { flushSync } from 'react-dom';

const handleClick = () => {
	flushSync(() => {
		setCounter((prevCount) => prevCount + 1);
	});
	// 리렌더링
	flushSync(() => {
		setFlag((prevFlag) => !prevFlag);
	});
	// 리렌더링
}
```

아래의 예시에서 버튼 클릭 시 콘솔 로그로 렌더링을 비교해 볼 수 있다.

### React 18 이전

<iframe src="https://codesandbox.io/embed/react-18-before-batching-k33eq?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="react-18-before-batching"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

### React 18

<iframe src="https://codesandbox.io/embed/react-18-automatic-batching-5ucwm?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="react-18-automatic-batching"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

---

# startTransition

## 개요

일반적으로 상태가 업데이트될 때 화면이 즉각적으로 렌더링 되는 게 일반적이지만, **화면의 변화를 지연시키고 싶은 경우도 있다.** 예를 들면 사용자가 인풋에 입력한 값에 따라 렌더링이 많이 일어나는 경우가 있다.

![Untitled](/images/posts/react/react-18-changes_1.png)

위와 같은 검색창에서 인풋은 사용자가 입력한 값에 따라서 즉각적으로 새로 렌더링 되어야 하는데 **지연이 발생하면 응답이 제대로 되지 않는 것**처럼 느낄 수 있다. 하지만 검색 결과 리스트의 렌더링은 비교적 렌더링 우선순위가 낮은 부분이라고 할 수 있다.

리액트 팀에서는 이 2가지의 상태 업데이트를 나누어서
인풋의 렌더링처럼 **상호작용과 연관되어 즉시 렌더링** 되어야 하는 업데이트는 **`Urgent updates`**,
****리스트 렌더링처럼 **즉각적으로 일어나지 않아도 되는** 업데이트는 **`Transition updates`** 라고 정의하였다.

React 18 이전까지는 모든 업데이트가 `**Urgent updates`** 방식이였기 때문에, 렌더링에 우선순위를 지정하는 방법이 존재하지 않았다. 그래서 위와 같은 상황에서 개발자가 임의로 **Throttle** 혹은 **Debounce** 등을 이용해서 처리를 하는 경우가 많았다.

[Throttle 와 Debounce 개념 정리하기](https://pks2974.medium.com/throttle-%EC%99%80-debounce-%EA%B0%9C%EB%85%90-%EC%A0%95%EB%A6%AC%ED%95%98%EA%B8%B0-2335a9c426ff)

## Throttle & Debounce 의 문제점

> Throttle 혹은 Debounce로 위와 같은 문제를 해결하였다고 하더라도 문제점이 존재한다.
> 

**`Debounce`**는 사용자의 마지막 입력이 끝난 후 무거운 작업을 수행하게 된다.
예를 들어 debounce time을 0.5초로 지정한 경우 어떠한 경우에도 마지막 입력이 끝난 후 0.5초 뒤에
작업을 수행하게 되어있다. 그래서 기기 성능이 좋던 나쁘던 무조건 `일정 시간`을 기다려야 하는 단점이 생긴다.
그리고 입력 중에는 무거운 작업을 아예 처리하지 않는다는 점도 문제점이다.

`**Throttle`** 의 경우 입력 중에 주기적으로 무거운 작업을 수행하는 방법이기 때문에,
입력 중 무거운 작업을 처리하지 않는 **Debounce** 의 단점은 개선할 수 있다.
하지만 Throttle도 결국에 입력 발생 시 `일정 시간` 동안 1번만 한 번만 작업이 수행하게 하는 방식이여서
기기 성능 간의 차이를 완벽하게 컨트롤할 수는 없다.

## startTransition 이란?

이를 해결하기 위해서 React 18 에서는 `**Urgent updates`** 와 `**Transition updates`** 를
구분할 수 있는`**startTransition`** API가 추가되었다.

사용하기 위해선 `react` 패키지에서 바로 `**startTransition`** 함수를 가져오거나,
혹은 `react` 패키지의 `**useTransition`** hook을 사용하여 `**startTransition`** 함수를 가져온 후,
`**Transition updates`** 를 원하는 상태 업데이트를 `**startTransition`** 함수의 콜백 함수에서 사용하면 된다.

일반적으론 두 방식의 차이가 크게 없지만, `**useTransition`** hook 을 사용하면 트랜지션이 완료될 때까지 얼마 동안 기다릴지를 지정하는 `timeoutMs` 프로퍼티를 사용할 수 있고, 해당 트랜지션이 pending 상태인지 아닌지를 나타내는 상태인 `isPending` state를 제공한다.

pending 상태가 `timeoutMs` 프로퍼티에 지정한 시간이 넘어가는 경우 더 이상 업데이트를 기다리지 않고,
다시 업데이트 이전 상태를 보여주게 된다.

`startTransition 사용`

```jsx
import { startTransition } from 'react';

// Urgent updates: 해당 state 변경 후 바로 렌더링
setInputValue(input);

// 해당 함수 내부의 상태 업데이트를 모두 Transition updates로 변경
startTransition(() => {
  // Transition updates: 우선순위가 낮은 transition updates 적용
  setSearchQuery(input);
});
```

`useTransition hook 사용`

```jsx
import { useTransition } from "react";

// timeoutMs 프로퍼티와 isPending 상태를 제공
const [isPending, startTransition] = useTransition({ timeoutMs: 3000 });

// Urgent updates: 해당 state 변경 후 바로 렌더링
setInputValue(input);

// 해당 함수 내부의 상태 업데이트를 모두 Transition updates로 변경
startTransition(() => {
  // Transition updates: 우선순위가 낮은 transition updates 적용
  setSearchQuery(input);
});
```

## startTransition 사용해 보기

현실적으로 잘 일어나지 않는 경우겠지만 차이를 확실하게 느낄 수 있게 인풋에 입력이 되면 5000개의 리스트를 임의의 값으로 새로 업데이트하는 예시를 만들어보았다.

완전히 같은 코드에서 `startTransition` 적용 여부에 따라 차이가 얼마나 나는지 비교가 가능하다.
양쪽 다 연속적으로 인풋에 값을 입력해 보면 확실히 차이를 느낄 수 있다.

**startTransition 을 적용하지 않은 쪽**은 매번 리스트 업데이트가 일어나게 되어서
인풋의 값이 업데이트가 느려져서 인풋 렌더링이 되지 않는 경우가 계속해서 발생한다.

**startTransition 을 적용한 쪽**은 ****인풋의 값 업데이트가 우선적으로 실행되어서
인풋 렌더링이 되지 않는 경우가 현저히 줄어들고, 리스트 업데이트가 뒤늦게 실행되는 것을 확인할 수 있다.
예시처럼 `useTransition` hook의 `isPending` 상태로 업데이트 진행 상태에 대한 로딩처리 또한 가능하다.

### 예시

<iframe src="https://codesandbox.io/embed/react-18-start-transition-630ms?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="react-18-start-transition"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

---

# New Suspense SSR Architecture

## 개요

React 18에서는 **server-side rendering(이하 SSR)** 성능 개선을 위해 아키텍처가 개선되었다.
React 16.6부터 data fetching 을 위한 [Suspense](https://ko.reactjs.org/docs/concurrent-mode-suspense.html) 를 실험적으로 추가하였는데,
기존에는 SSR에 적용이 불가능 한 기능이였지만 React 18부터는 SSR 시에도 사용이 가능하다고 한다.
더불어 코드 스플리팅을 위한 [React.lazy](https://ko.reactjs.org/docs/code-splitting.html) 또한 SSR 시 사용 가능하다고 한다.

## Server Side Rendering 이란?

![Untitled](/images/posts/react/react-18-changes_2.png)

기본적으로 리액트는 **client-side rendering(이하 CSR)** 방식을 사용하는데 CSR에서의 여러 가지 단점을 해결하기 위해 SSR을 사용한다.

### CSR의 단점

- 유저가 접속 시 자바스크립트가 모두 로드되고 실행이 되어야 화면에 컨텐츠가 출력됨(최초 로딩이 느림)
- 검색 엔진 최적화(Search Engine Optimzation)

## React에서의 SSR

![Untitled](/images/posts/react/react-18-changes_3.png)

React에서 SSR 을 적용하면 제일 처음 페이지를 열었을 때 위와 같은 상태가 된다.
회색 배경은 무언가 요소를 불러는 왔지만 JavaScript가 모두 로드 되지 않아서 상호작용은 불가능한 부분이다.

React와 애플리케이션 코드가 모두 불러와졌을 때가 되어서야 **컴포넌트를 렌더링하고 이벤트 핸들러를 붙여주는데** 이를 **`하이드레이션(hydration)`** 이라고 한다.

![Untitled](/images/posts/react/react-18-changes_4.png)

하이드레이션이 끝나면, 위처럼 모든 요소들이 상호작용이 가능하게 변경이 된다.

## 기존 SSR의 문제점

### 화면을 불러오려면 모든 데이터를 가져와야 한다

만약 SSR을 통해서 서버에서 데이터와 함께 넘겨주는 컴포넌트가 있다면 해당 컴포넌트의 데이터가 준비가 될 때까지 HTML을 전송할 수 없다. 해당 데이터가 DB나 API 등에서 가져오는 데 오래 걸린다면 페이지 로딩 자체가 지연이 된다.

### 하이드레이션 단계로 넘어가려면 모두 로딩이 되어야 한다

모든 자바스크립트 코드를 로딩하기 전에는 하이드레이션 단계로 넘어갈 수 없다.

### 상호작용을 하려면 모든 컴포넌트가 하이드레이션 되어야 한다

컴포넌트를 상호작용하기 위해서는 모든 컴포넌트가 하이드레이션 되어야 가능하다.
만약 어떤 한 컴포넌트가 렌더링에 시간이 오래 걸리는 경우 해당 컴포넌트의 렌더링 로직이 전부 실행되고 하이드레이션 되어야 나머지 컴포넌트들도 상호작용이 가능하다.

## React 18에서의 변화

React 18에서는 `Suspense` ****와 연계하여 사용할 수 있는 두 가지 SSR 기능이 추가된다.

- **HTML 스트리밍** : 서버에서 기존의 `renderToString` API 대신 `pipeToNodeWritable` API를 사용하여 HTML을 스트리밍 할 수 있다.
- **선택적 하이드레이션** : 앱에서 렌더링 비용이 많이 드는 서브 컴포넌트 트리를 `Suspense` 로 감싸서, 전체 앱의 하이드레이션을 방해하지 않고 별도의 하이드레이션을 진행할 수 있다.

해당 두 기능을 적용하면 개선된 SSR을 적용할 수 있다.

### **HTML 스트리밍**

```jsx
<Layout>
  <NavBar />
  <Sidebar />
  <RightPane>
    <Post />
    <Suspense fallback={<Spinner />}>
      <Comments />
    </Suspense>
  </RightPane>
</Layout>
```

해당 예시에서 `Comments` 컴포넌트는 data fetching이 필요한 컴포넌트이다.
해당 컴포넌트를`Suspense` 로 감싸면 data fetching이 완료되지 않아도 즉시 HTML이 스트리밍 되면서 렌더링 된다.

![Untitled](/images/posts/react/react-18-changes_5.png)

최초 접속 시에는 브라우저에서 아래와 같은 HTML을 받게 된다.

```html
<main>
  <nav>
    <!--NavBar -->
    <a href="/">Home</a>
   </nav>
  <aside>
    <!-- Sidebar -->
    <a href="/profile">Profile</a>
  </aside>
  <article>
    <!-- Post -->
    <p>Hello world</p>
  </article>
  <section id="comments-spinner">
    <!-- Spinner -->
    <img width=400 src="spinner.gif" alt="Loading..." />
  </section>
</main>
```

data fetching이 완료되지 않을 때까지는 `Suspense` 의 props인 `fallback` 에 넣어둔 컴포넌트가 렌더링 되다가 data fetching이 완료되면 정상적으로 컴포넌트가 렌더링 된다.

![Untitled](/images/posts/react/react-18-changes_6.png)

### **선택적 하이드레이션**

`HTML 스트리밍` 으로 초기 HTML을 더 일찍 보낼 수는 있지만 여전히 문제가 있다. `Comments` 컴포넌트에 대한 JavaScript 코드가 로드될 때까지 클라이언트에서 `하이드레이션` 을 시작할 수 없다. 코드 사이즈가 크다면 해당 부분도 지연이 생길 수 있는 작업이다.

큰 번들 사이즈를 피하기 위해서 주로 `**코드 스플리팅(Code Splitting)`** 이 사용된다. 특정 코드 부분이 동기적으로 로드될 필요가 없다고 명시하면 번들러가 별도의 `script` 태그로 분리해 준다.

`React.lazy` 를 사용하여 `Comments` 컴포넌트를 메인 번들에서 분리할 수 있다.

```jsx
import { lazy } from 'react';

const Comments = lazy(() => import('./Comments.js'));

// ...

<Suspense fallback={<Spinner />}>
  <Comments />
</Suspense>
```

기존에는 해당 방법은 SSR에서 작동하지 않았는데, React 18에서는 해당 부분이 변경되어
`Suspense` 가 댓글 위젯이 불러와지기 전에 애플리케이션을 하이드레이션 할 수 있게 해준다.

유저의 관점에서 보면 최초에 HTML로 스트리밍 된 상호작용이 불가능한 컨텐츠를 보게 된다.

![Untitled](/images/posts/react/react-18-changes_7.png)

![Untitled](/images/posts/react/react-18-changes_8.png)

그리고 React에 하이드레이션을 지시한다. `Comments` 컴포넌트의 **코드가 전부 불러와지지 않았지만 수행 가능**하다.

![Untitled](/images/posts/react/react-18-changes_9.png)

이것이 **`선택적 하이드레이션(Seletive Hydration)`**의 예제이다. `Comments` 컴포넌트를 `Suspense` 로 묶음으로써 React에게 페이지의 나머지 부분이 스트리밍 되는 것을 막으면 안 된다고 알린 것이다. 그래서 React가 하이드레이션을 시작하기 위해서 모든 코드가 불러와지는 것을 기다릴 필요가 없어진다.

React는 `Commets` 컴포넌트 코드가 모두 불러와진 뒤에 그 부분만 하이드레이션을 시작한다.

![Untitled](/images/posts/react/react-18-changes_10.png)

### 모든 컴포넌트가 하이드레이션 되기 전의 상호작용

아래에 2개 이상의 `lazy 컴포넌트`를 `Suspense` 로 감싼 예시가 있다.

```jsx
<Layout>
  <NavBar />
  <Suspense fallback={<Spinner />}>
    <Sidebar />
  </Suspense>
  <RightPane>
    <Post />
    <Suspense fallback={<Spinner />}>
      <Comments />
    </Suspense>
  </RightPane>
</Layout>
```

그럼 최초에는 두 컴포넌트를 제외한 HTML이 렌더링 된다.

![Untitled](/images/posts/react/react-18-changes_11.png)

그리고 React는 트리에서 가장 먼저 찾은 `Suspense` 영역부터 하이드레이션을 시작한다.
해당 예시에서는 `Sidebar` 컴포넌트를 먼저 하이드레이션 한다.

![Untitled](/images/posts/react/react-18-changes_12.png)

이때 사용자가 `Commets` 영역을 클릭하면 하이드레이션 우선순위에 변화가 생긴다.

![Untitled](/images/posts/react/react-18-changes_13.png)

React는 해당 클릭을 기록하고 클릭한 `Commets` 영역의 하이드레이션 우선순위를 높인다.
사용자가 이 컴포넌트와 상호작용을 하고자 해서 하이드레이션이 더 긴급한 컴포넌트로 판단하기 때문이다.

기존에 진행하던 `Sidebar` 컴포넌트의 하이드레이션을 중단하고 `Commmets` 컴포넌트의 하이드레이션을 먼저 진행하게 된다.

![Untitled](/images/posts/react/react-18-changes_14.png)

이와 같이 하이드레이션이 진행 중일 때 다른 컴포넌트에 상호작용이 발생하면 그에 따라 하이드레이션 우선순위를 변경한다. 위의 경우 `Commets` 컴포넌트의 하이드레이션이 완료되면 하이드레이션 우선순위가 높은 컴포넌트가 없어지므로 나머지 부분인 `Sidebar` 컴포넌트의 하이드레이션을 진행한다.

### 예시

<iframe src="https://codesandbox.io/embed/kind-sammet-j56ro?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="kind-sammet-j56ro"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

---

# 결론

현재는 React 18이 `RC Stage` 이지만 곧 정식 출시가 되면 프로덕션에도 실제로 적용이 가능할 것 같다.
**`Automatic Batching`** 이나 `**startTransition`** 같은 API들은 바로 적용해서 어플리케이션 성능에 이점을 가져올 수 있을 것 같다.

SSR과 관련된 부분은 직접 SSR 환경을 세팅해서 쓰는 경우가 아니면 직접적으로 적용할 수 있는 내용은 아닌 것 같다. 보통 [Next.js](https://nextjs.org/) 등의 SSR 프레임워크를 사용하는 경우가 일반적이니 프레임워크들에 어떻게 적용이 되는가가 중요한 부분일 것 같다.

# Next steps

- Next.js 에서는 SSR 개선이 어떻게 적용 될 것인가?
- React 18 마이너 버젼에서 업데이트 될 [서버 컴포넌트](https://ui.toast.com/weekly-pick/ko_20210119)

### 예시 코드 레포지토리

[https://github.com/KimBiYam/use-react-18](https://github.com/KimBiYam/use-react-18)

### 레퍼런스

[Replacing render with createRoot](https://github.com/reactwg/react-18/discussions/5)

[Automatic batching for fewer renders in React 18](https://github.com/reactwg/react-18/discussions/21)

[New feature: startTransition](https://github.com/reactwg/react-18/discussions/41)

[컨커런트 UI 패턴 (실험)](https://ko.reactjs.org/docs/concurrent-mode-patterns.html)

[Real world example: adding startTransition for slow renders](https://github.com/reactwg/react-18/discussions/65)

[New Suspense SSR Architecture in React 18](https://github.com/reactwg/react-18/discussions/37)
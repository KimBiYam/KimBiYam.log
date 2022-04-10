---
title: 'Safari CSS transition 관련 문제'
date: '2022-03-09'
tag: 'front-end'
---

### 발생

Safari에서(~~이 놈의 사파리...~~) `css transition` 사용 시 발생하는 문제

사내에서 진행하고 있는 프로젝트에 [MUI](https://mui.com/)를 사용하는데,
[MUI의 Input 컴포넌트](https://mui.com/components/text-fields/#inputs)에서 사용하는 CSS 애니메이션에서 해당 문제를 발견하였다.

**해당 애니메이션을 재현한 CSS**

```css
.box:hover::after {
      transform: scaleX(1);
}

.box::after {
      border-bottom: 2px solid black;
      bottom: -10px;
      left: 0px;
      content: "";
      position: absolute;
      right: 0px;
      transform: scaleX(0);
      transition-duration: 200ms;
      transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
      transition-delay: 0ms;
      transition-property: transform;
      pointer-events: none;
}
```

위의 CSS처럼 `box` 클래스에 가상 선택자로 border가 그려지게끔 하고
`transform` 값을 `scaleX(0)` 로 주어서 해당 요소가 보여지지 않게 스타일을 주고
`box` 클래스가 `hover` 시 `transform` 값을 `scaleX(1)` 로 변경하여서 border가 요소 중앙 부분부터
`transition`과 함께 나타나게끔 스타일을 준 상황이다.

`Chrome`에서는 발생하지 않았지만 `Safari`에서는 border가 깨지는 현상이 발생하였다.

### Chrome

![animation_chrome.gif](/images/posts/front-end/safari-css-transition-problem_1.gif)

### Safari

![animation_chrome2.gif](/images/posts/front-end/safari-css-transition-problem_2.gif)

---

### 해결책

`safari transition bug` 혹은 `safari transition flicker` 등으로 검색하였을 때
여러 가지 해결 방법들이 있었다.

- `-webkit-backface-visibility` 속성을 `hidden` 으로 설정하기
- `-webkit-transform` 속성을 `translate3d(0, 0, 0)` 으로 설정하기(강제로 하드웨어 가속을 사용하게 변경한다고 한다)
- `will-change` 속성을 지정해 주기

![animation_solutions.gif](/images/posts/front-end/safari-css-transition-problem_3.gif)

[예제 레포지토리](https://github.com/KimBiYam/safari-scale-transition-problem)

### 레퍼런스

[Safari CSS transition on scale with border radius](https://stackoverflow.com/questions/68298782/safari-css-transition-on-scale-with-border-radius)

[Prevent flicker on webkit-transition of webkit-transform](https://stackoverflow.com/questions/3461441/prevent-flicker-on-webkit-transition-of-webkit-transform)

[Webkit border-radius and overflow bug when using any animation/transition](https://stackoverflow.com/questions/14383632/webkit-border-radius-and-overflow-bug-when-using-any-animation-transition)

---

### 추가 내용 (2022-04-11)

해당 내용 관련하여서 MUI 레포지토리에 [이슈](https://github.com/mui/material-ui/issues/31766)와 [PR](https://github.com/mui/material-ui/pull/31912)을 남겼는데, 다른 개발자 분이 이슈에 달아주신 댓글의 [MDN 문서](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)에도 나와있듯 `will-change` 속성은 최대한 사용을 지양하는게 좋을 것 같다.

해당 개발자 분이 남겨주신 솔루션으로 transform 속성에 `translateX(0)` 를 추가하는 것으로도 해당 문제가 해결이 되었다.

![animation_solutions2.gif](/images/posts/front-end/safari-css-transition-problem_4.gif)
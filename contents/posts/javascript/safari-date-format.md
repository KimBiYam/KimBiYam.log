---
title: 'Safari Date 포맷 관련'
date: '2022-02-27'
tag: 'javascript'
description: 'Chrome에서는 되는 new Date("yyyy-mm-dd hh:mm:ss")가 Safari에서는 Invalid Date가 되는 문제와, yyyy/mm/dd 형식으로 바꿔 파싱하는 해결 방법을 정리했습니다.'
---

### 발생

Chrome 에서는 정상이지만 Safari 에서는 아래와 같은 Date 객체 생성 시 Invalid Date로 생성된다

```jsx
new Date('2020-01-01 00:00:00');
```

### Chrome Devtools Console

![Chrome 콘솔에서 yyyy-mm-dd 형식 문자열로 Date가 정상 생성된 결과](/images/posts/javascript/safari-date-format_1.png)

### Safari Devtools Console

![Safari 콘솔에서 yyyy-mm-dd 형식 문자열이 Invalid Date로 파싱된 결과](/images/posts/javascript/safari-date-format_2.png)

원인은 Safari 에서는 Date를 파싱할 때 `yyyy-mm-dd` 형태의 format을 지원하지 않아서 발생하는 문제이다.

---

### 해결책

근본적인 해결책은 사용하는 Date 포맷을 `yyyy/mm/dd` 형태로 변환해서 사용하는 것이다.
만약 외부에서 받아오는 값이여서 변경이 힘들다면 받아온 데이터를 정규식으로 포맷을 변경하는 방법이 있다.

```jsx
const dateString = '2020-01-01 00:00:00';
new Date(dateString.replace(/-/g, "/"));
```

### Chrome Devtools Console

![Chrome 콘솔에서 하이픈을 슬래시로 바꾼 날짜가 정상 파싱된 결과](/images/posts/javascript/safari-date-format_3.png)

### Safari Devtools Console

![Safari 콘솔에서 하이픈을 슬래시로 바꾼 날짜가 정상 파싱된 결과](/images/posts/javascript/safari-date-format_4.png)
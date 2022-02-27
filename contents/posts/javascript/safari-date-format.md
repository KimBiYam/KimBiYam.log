---
title: 'Safari Date 포맷 관련'
date: '2022-02-27'
tag: 'javascript'
---

### 발생

Chrome 에서는 정상이지만 Safari 에서는 아래와 같은 Date 객체 생성 시 Invalid Date로 생성된다

```jsx
new Date('2020-01-01 00:00:00');
```

### Chrome Devtools Console

![](/images/posts/javascript/safari-date-format_1.png)

### Safari Devtools Console

![](/images/posts/javascript/safari-date-format_2.png)

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

![](/images/posts/javascript/safari-date-format_3.png)

### Safari Devtools Console

![](/images/posts/javascript/safari-date-format_4.png)
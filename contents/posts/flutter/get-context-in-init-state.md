---
title: 'initState에서 context 가져 오는 법'
date: '2020-12-22'
tag: 'flutter'
---

일반적으로 initState 라이프 사이클이 종료 되어야 context를 이용할 수 있는데

Future.delayed 함수로 비동기 처리를 하면 initState에서 사용이 가능하다.

```jsx
@override
    void initState() {
      super.initState();
      RatioHelper ratioHelper = RatioHelper();
      // Use Future for get context in initState
      Future.delayed(Duration.zero, () => ratioHelper.setup(context));
      checkToken();
    }
```
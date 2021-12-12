---
title: 'Flutter enum 값을 string으로 변환하기'
date: '2021-03-02'
tag: 'flutter'
---


```
enum Test{
  test1,
  test2
}
```

예시로 해당 enum 클래스가 있는 경우 toString 함수를 사용하면
클래스의 이름까지 포함되게 됩니다.

```
Test test = Test.test1;
print(test);
```

```
flutter : Test.test1
```

describeEnum 함수를 사용하면 값만 string 형태로 가져와줍니다.

```
Test test = Test.test1;
print(describeEnum(test));
```

```
flutter : test1
```
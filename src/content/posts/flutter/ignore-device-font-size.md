---
title: 'Flutter Text Widget 기기의 font size 무시하기'
date: '2021-03-17'
tag: 'flutter'
---


Text 위젯에 바로 적용할 수 있는 방법으로는
Text 위젯의 textScaleFactor 옵션을 이용하면 됩니다.

```dart
Text(
  '텍스트!',
  textScaleFactor: 1.0,
),
```

앱 전체에 적용을 원한다면
MaterialApp의 builder parameter를 이용해서
MediaQuery 위젯의 textScaleFactor 설정을
바꿔서 리턴해주면 됩니다.


```dart
MaterialApp(
	builder: (context, child) => MediaQuery(
            data: MediaQuery.of(context).copyWith(
              textScaleFactor: 1.0,
            ),
            child: child!,
          ),
          title:
          ...
```


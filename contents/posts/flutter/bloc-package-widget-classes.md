---
title: 'Flutter BLoC 패키지의 위젯 클래스들'
date: '2021-03-05'
tag: 'flutter'
---

### BlocBuilder

새로운 State를 전달 받았을 때 builder를 호출하여 widget을 변경합니다.
StreamBuilder, FutureBuild와 유사한 역할입니다.

```dart
BlocBuilder<BlocA, BlocAState>(
  builder: (context, state) {
    // return widget here based on BlocA's state
  }
)
```

buildWhen 속성을 이용하여 이전 BLoC의 State와 현재 BLoC의 State를 가져올 수 있고 bool 값을 리턴하여 buildWhen이 false를 리턴하면 builder를 호출하지 않습니다.

```dart
BlocBuilder<BlocA, BlocAState>(
  buildWhen: (previous, current) {
    // return true/false to determine whether or not
    // to rebuild the widget with state
  },
  builder: (context, state) {
    // return widget here based on BlocA's state
  }
)
```

### BlocProvider

하위 위젯에 Cubit을 제공하는 위젯입니다.

단일 인스턴스로 하위 여러 위젯에 제공하기 위해 사용합니다.

```dart
BlocProvider(
  create: (BuildContext context) => BlocA(),
  child: ChildA(),
);
```

하위 위젯에서 사용하려면 아래와 같이 사용 가능합니다.

```dart
context.read<BlocA>();
```

Provider 외부의 위젯에서는 아래와 같이 사용 가능합니다.

```dart
BlocProvider.of<BlocA>(context);
```

### MultiBlocProvider

여러 BlocProvider 위젯을 하나로 병합하는 위젯 하위 위젯에 여러 BLoC를 동시에 제공하고자 할 때 사용합니다.

RxDart로 구현한 경우 한 위젯에서 여러개의 BLoC를 사용할 때
StreamBuilder 안에 중첩으로 StreamBuilder를 쓰거나(권장되지 않는다 함)
RxDart의 CombineLatestStream 클래스로 Stream을 병합하여 사용 하는 등
번거로운 작업이 필요한데 해당 라이브러리의 MultiBlocProvider 클래스 등을 이용하면 간단하게 하위 위젯에서 여러개의 BLoC을 사용이 가능합니다.

```dart
MultiBlocProvider(
  providers: [
    BlocProvider<BlocA>(
      create: (BuildContext context) => BlocA(),
    ),
    BlocProvider<BlocB>(
      create: (BuildContext context) => BlocB(),
    ),
    BlocProvider<BlocC>(
      create: (BuildContext context) => BlocC(),
    ),
  ],
  child: ChildA(),
)
```

### BlocListener

해당 BLoC의 State가 변경 되었을 때 호출되는 위젯입니다.
BlocBuilder 위젯과 마찬가지로 listenWhen 속성으로 제어가 가능합니다.

BlocBuilder 위젯과의 차이점은 BLoC의 State가 변경 되었을때 한번만 발생해야
하는 기능을 경우를 위해 존재합니다.(다른 페이지로의 라우팅, 알림 등)

```dart
BlocListener<BlocA, BlocAState>(
  listenWhen: (previous, current) {
    // return true/false to determine whether or not
    // to call listener with state
  },
  listener: (context, state) {
    // do stuff here based on BlocA's state
  }
  child: Container(),
)
```

### MultiBlocListener

여러 BlocListener 위젯을 하나로 병합하는 위젯입니다.

```dart
MultiBlocListener(
  listeners: [
    BlocListener<BlocA, BlocAState>(
      listener: (context, state) {},
    ),
    BlocListener<BlocB, BlocBState>(
      listener: (context, state) {},
    ),
    BlocListener<BlocC, BlocCState>(
      listener: (context, state) {},
    ),
  ],
  child: ChildA(),
)
```

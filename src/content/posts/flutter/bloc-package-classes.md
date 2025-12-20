---
title: 'Flutter BLoC 패키지의 BLoC 관련 클래스들'
date: '2021-03-05'
tag: 'flutter'
---


## Flutter BLoC 패키지

BLoC Pattern을 구현하는 데 도움이 되는 패키지입니다.

BLoC 의 이벤트 정의, 상태 변화를 관찰하는 클래스 등 BLoC Pattern으로 구성할때 사용 가능한 기능들을 미리 구현해 두었습니다.

관련 문서

- [패키지 주소](https://pub.dev/packages/flutter_bloc)

- [공식 문서](https://bloclibrary.dev/#/)

![](/images/posts/flutter/bloc-package-classes_1.png)

![](/images/posts/flutter/bloc-package-classes_2.png)

## Cubit Class

해당 라이브러리의 Bloc 클래스의 베이스인 Cubit 클래스입니다.

Stream을 이용한 Bloc 클래스를 간단하게 만들 수 있게 구현해놓은 클래스입니다.

emit 함수를 사용하여 상태 변경이 가능합니다.

### Cubit Class 사용 예시

[예시 코드](https://github.com/KimBiYam/first_bloc_app/tree/feature/counter_cubit)

int 형태의 상태를 가진 CounterCubit 클래스

```dart
class CounterCubit extends Cubit<int> {
  CounterCubit() : super(0);

  void increment() => emit(state + 1);
  void decrement() => emit(state - 1);
  void reset() => emit(0);
}
```

BlocObserver로 모든 Cubit의 상태를 관찰이 가능합니다.

```dart
class CounterObserver extends BlocObserver {
  @override
  void onCreate(Cubit cubit) {
    super.onCreate(cubit);
    print('onCreate -- cubit: ${cubit.runtimeType}');
  }

  @override
  void onChange(Cubit cubit, Change change) {
    super.onChange(cubit, change);
    print('onChange -- cubit: ${cubit.runtimeType}, change: $change');
  }

  @override
  void onError(Cubit cubit, Object error, StackTrace stackTrace) {
    print('onError -- cubit: ${cubit.runtimeType}, error: $error');
    super.onError(cubit, error, stackTrace);
  }

  @override
  void onClose(Cubit cubit) {
    super.onClose(cubit);
    print('onClose -- cubit: ${cubit.runtimeType}');
  }
}
```

BlocObserver를 사용하려면 해당 클래스를 메인에서 지정해주어야 합니다.

```dart
void main() {
  Bloc.observer = CounterObserver();
}
```

혹은 해당 Cubit의 상태만 관찰하고 싶다면 Cubit 클래스 내부에서 사용하면 됩니다.

```dart
@override
  void onError(Object error, StackTrace stackTrace) {
    print("onError $error");
    super.onError(error, stackTrace);
  }

  @override
  void onChange(Change<int> change) {
    print("onChange $change");
    super.onChange(change);
  }
```

해당 Cubit 사용을 원하는 위젯에서 BlocProvider 위젯으로 감싸주면됩니다.

예시로 모든 위젯에서 해당 Cubit을 사용하기 위해 MaterialApp을 BlocProvider 로 감싸줍니다.

```dart
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => CounterCubit(),
      child: MaterialApp(
        title: 'Flutter Demo',
        theme: ThemeData(
          primarySwatch: Colors.blue,
          visualDensity: VisualDensity.adaptivePlatformDensity,
        ),
        home: CounterPage(),
      ),
    );
  }
}
```

BlocBuilder 로 해당 Cubit의 State 를 가져와 텍스트를 그려줍니다.

```dart
class CounterView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Center(
      child: BlocBuilder<CounterCubit, int>(
        builder: (context, state) => Text(
          "$state",
          style: textTheme.headline2,
        ),
      ),
    );
  }
}
```

BlocProvider로 위젯을 감싼 경우 context.read 함수를 이용해 Cubit 인스턴스를 가져와서 상태 변경 함수를 사용하면 됩니다.

BlocProvider 하위의 다른 위젯에서 상태 변경 및 상태 구독이 잘 되는지 테스트 하기 위해 따로 위젯을 생성

```dart
class CounterButtons extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        children: [
          RaisedButton(
              onPressed: () => context.read<CounterCubit>().increment(),
              child: Icon(Icons.add)),
          RaisedButton(
              onPressed: () => context.read<CounterCubit>().decrement(),
              child: Icon(Icons.remove)),
          RaisedButton(
              onPressed: () => context.read<CounterCubit>().reset(),
              child: Icon(Icons.refresh)),
          RaisedButton(
            onPressed: () => Navigator.of(context).push(MaterialPageRoute(
              builder: (context) => SecondPage(),
            )),
            child: Icon(Icons.send),
          )
        ],
      ),
    );
  }
}
```

```dart
class SecondPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return BlocBuilder<CounterBloc, int>(
      builder: (context, state) {
        return Scaffold(
          appBar: AppBar(title: Text("Second Page")),
          body: Center(
            child: Text(
              "$state",
              style: textTheme.headline2,
            ),
          ),
        );
      },
    );
  }
}
```

![](/images/posts/flutter/bloc-package-classes_3.png)

버튼 클릭 시 상태가 변하는 것을 볼 수 있습니다.

BlocObserver 클래스로 상태 변화가 감지됩니다.

State 의 이전 값과 현재 값이 확인이 가능합니다.

```dart
flutter: onChange -- cubit: CounterCubit, change: Change { currentState: 0, nextState: 1 }
flutter: onChange -- cubit: CounterCubit, change: Change { currentState: 1, nextState: 2 }
```

해당 Cubit을 구독중인 다른 위젯으로 이동해도 값이 제대로 출력되는 것을 볼 수 있습니다.

![](/images/posts/flutter/bloc-package-classes_4.png)

## Bloc Class

![](/images/posts/flutter/bloc-package-classes_5.png)
![](/images/posts/flutter/bloc-package-classes_6.png)

Bloc 클래스는 Cubit 클래스를 상속받고 있으며 기본적으로는 같은 역할이지만
상태 변경을 함수를 정의해서 호출하는 방식이 아닌 이벤트를 직접 정의 해두고
이벤트로 핸들링 할 수 있는점이 가장 큰 차이점입니다. (Redux의 Action 정의와 비슷한 개념)

Event 처리 흐름

- onEvent - 이벤트가 발생 시 호출 됩니다.

- transformEvents - 들어오는 이벤트를 변경할때 사용

- mapEventToState - trasnformEvents로 이벤트를 변환 했다면 변환된 이벤트와 함께 호출되고 들어온 이벤트에 대한 응답으로 State를 생성합니다.

- transformTransitions - 나가는 State 를 변경할때 사용

- onTransition - 상태가 업데이트 되기 직전에 호출되며 현재 상태, 이벤트 및 다음 상태를 볼 수 있습니다.

- 일반적인 경우는 mapEventToState를 이용하여 이벤트에 따라 State 를 변경하고 반환하는 식으로만 사용 하면 될 듯 합니다.

### Bloc Class 사용 예시

[예시 코드](https://github.com/KimBiYam/first_bloc_app/tree/feature/counter)

예시는 event를 enum으로 정의 합니다.

CounterEvent 와 int 형태의 State 값을 가진 Bloc 클래스

mapEventToState 함수는 generator 함수이기 때문에 Future 와 달리 async - return 이 아닌 async\* - yield 로 사용합니다.

yield로 state 값을 반환하여도 return과 달리 함수가 종료되지 않습니다.

```dart
// 이벤트 정의
enum CounterEvent { increment, decrement, reset }

class CounterBloc extends Bloc<CounterEvent, int> {
  // 초기값 설정
  CounterBloc() : super(0);

  @override
  Stream<int> mapEventToState(CounterEvent event) async* {
    // 이벤트에 따라 상태 변화를 시켜준 뒤 리턴해준다
    switch (event) {
      case CounterEvent.increment:
        yield state + 1;
        break;
      case CounterEvent.decrement:
        yield state - 1;
        break;
      case CounterEvent.reset:
        yield 0;
        break;
    }
  }
}
```

Bloc 클래스는 Cubit 클래스를 상속하기 때문에 Cubit 클래스와 마찬가지로 BlocObserver로 상태를 관찰이 가능합니다.

```dart
class CounterObserver extends BlocObserver {
  @override
  void onCreate(Cubit cubit) {
    super.onCreate(cubit);
    print('onCreate -- cubit: ${cubit.runtimeType}');
  }

  @override
  void onChange(Cubit cubit, Change change) {
    super.onChange(cubit, change);
    print('onChange -- cubit: ${cubit.runtimeType}, change: $change');
  }

  @override
  void onError(Cubit cubit, Object error, StackTrace stackTrace) {
    print('onError -- cubit: ${cubit.runtimeType}, error: $error');
    super.onError(cubit, error, stackTrace);
  }

  @override
  void onClose(Cubit cubit) {
    super.onClose(cubit);
    print('onClose -- cubit: ${cubit.runtimeType}');
  }
}
```

BlocObserver를 사용하려면 해당 클래스를 메인에서 지정해주어야 합니다.

```dart
void main() {
  Bloc.observer = CounterObserver();
}
```

혹은 해당 Bloc의 상태 변화만 관찰하고 싶다면 Bloc 클래스 내부에서도 지정이 가능합니다.

```dart
@override
  void onEvent(CounterEvent event) {
    // TODO: implement onEvent
    super.onEvent(event);
  }

  @override
  void onTransition(Transition<CounterEvent, int> transition) {
    // TODO: implement onTransition
    super.onTransition(transition);
  }

  @override
  void onChange(Change<int> change) {
    // TODO: implement onChange
    super.onChange(change);
  }

  @override
  void onError(Object error, StackTrace stackTrace) {
    // TODO: implement onError
    super.onError(error, stackTrace);
  }
```

해당 Bloc 사용을 원하는 위젯에서 BlocProvider 위젯으로 감싸주면됩니다.

예시로는 모든 위젯에서 해당 Cubit을 사용하기 위해 MaterialApp을 BlocProvider 로 감싸줍니다.

```dart
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => CounterBloc(),
      child: MaterialApp(
        title: 'Flutter Demo',
        theme: ThemeData(
          primarySwatch: Colors.blue,
          visualDensity: VisualDensity.adaptivePlatformDensity,
        ),
        home: CounterPage(),
      ),
    );
  }
}
```

BlocBuilder 로 해당 Bloc의 State 를 가져와 텍스트를 그려줍니다.

```dart
class CounterView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Center(
      child: BlocBuilder<CounterBloc, int>(
        builder: (context, state) => Text(
          "$state",
          style: textTheme.headline2,
        ),
      ),
    );
  }
}
```

- BlocProvider로 위젯을 감싼 경우의 상태 변환 이벤트 사용 예시

- 해당 Bloc을 가져와서 add 함수로 정의해둔 이벤트를 호출 하면 됩니다.

```dart
class CounterButtons extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        children: [
          RaisedButton(
              onPressed: () =>
                  context.read<CounterBloc>().add(CounterEvent.increment),
              child: Icon(Icons.add)),
          RaisedButton(
              onPressed: () =>
                  context.read<CounterBloc>().add(CounterEvent.decrement),
              child: Icon(Icons.remove)),
          RaisedButton(
              onPressed: () =>
                  context.read<CounterBloc>().add(CounterEvent.reset),
              child: Icon(Icons.refresh)),
          RaisedButton(
            onPressed: () => Navigator.of(context).push(MaterialPageRoute(
              builder: (context) => SecondPage(),
            )),
            child: Icon(Icons.send),
          )
        ],
      ),
    );
  }
}
```

Cubit 과 마찬가지로 로그에서 상태 변화 확인이 가능합니다.

```dart
flutter: onChange -- cubit: CounterBloc, change: Change { currentState: 0, nextState: 1 }
flutter: onChange -- cubit: CounterBloc, change: Change { currentState: 1, nextState: 2 }
```

---
title: 'RxDart 패키지를 이용한 BLoC Pattern 예시'
date: '2021-03-05'
tag: 'flutter'
---

## RxDart

[ReactiveX](http://reactivex.io/) API를 Dart에서 사용할 수 있게 구현한 패키지

Stream을 사용하기 용이하게 확장합니다.

## RxDart를 이용한 BLoC Pattern 예시

[예시코드](https://github.com/KimBiYam/first_bloc_app/tree/feature/counter_with_rxdart)

int 형태의 count를 state로 가지는 CounterBloc 클래스

초깃값과 해당 Bloc의 상태를 변화하는 함수 등을 정의합니다.

BehaviorSubject 클래스를 통해 데이터 등을 Listener에게 보내줍니다.

```dart
class CounterBloc {
  int count = 0;
  BehaviorSubject<int> _subjectCounter;

  CounterBloc({this.count}) {
    _subjectCounter = BehaviorSubject<int>.seeded(this.count);
  }

  Stream<int> get stream => _subjectCounter.stream;

  void increment() {
    count++;
    _subjectCounter.sink.add(count);
  }

  void decrement() {
    count--;
    _subjectCounter.sink.add(count);
  }

  void reset() {
    count = 0;
    _subjectCounter.sink.add(count);
  }

  void dispose() {
    _subjectCounter.close();
  }
}
```

위젯에서의 사용

- StreamBuilder로 해당 Bloc의 State를 가져오는 위젯을 생성합니다.

- CounterBloc 객체를 생성하여 Stream과 함수를 가져옵니다.

- FutureBuilder 와 마찬가지로 snapshot을 이용해서 데이터를 받아올 수 있습니다.

- 버튼 클릭 시 상태를 변화하는 함수를 호출하며 State 값이 바뀌게 됩니다.

- 위젯에서는 해당 비즈니스 로직에 대한 구현을 신경 쓰지 않고 해당 Bloc의 State를 보여주는 부분만 신경 쓰면 된다는 점을 알 수 있습니다.

```dart
class CounterScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    CounterBloc _counterBloc = new CounterBloc(count: 0);

    return Scaffold(
      appBar: AppBar(title: Text("Counter with RxDart")),
      body: Center(
        child: StreamBuilder(
          stream: _counterBloc.stream,
          builder: (context, snapshot) {
            return Text('${snapshot.data}',
                style: Theme.of(context).textTheme.headline2);
          },
        ),
      ),
      floatingActionButton: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          FloatingActionButton(
              onPressed: () => _counterBloc.increment(),
              tooltip: "Increment",
              child: Icon(Icons.add)),
          FloatingActionButton(
              onPressed: () => _counterBloc.decrement(),
              tooltip: "Decrement",
              child: Icon(Icons.remove)),
          FloatingActionButton(
              onPressed: () => _counterBloc.reset(),
              tooltip: "Reset",
              child: Icon(Icons.refresh)),
        ],
      ),
    );
  }
}
```

![](/images/posts/flutter/bloc-rxdart_1.gif)

---
title: 'Flutter BLoC Pattern 개요'
date: '2021-03-05'
tag: 'flutter'
---

![](/images/posts/flutter/bloc-pattern-overview_1.png)

## BLoC Pattern 이란
BLoC(Business Logic Component)는 Presetation Layer와 Busuiness Logic을 분리하여 코드를 작성할 수 있도록 해줍니다.

BLoC Pattern은 Stream을 이용해서 구현 가능합니다.

위젯은 Sinks (입구)를 통하여 BLoC에 이벤트를 보냄 BLoC 객체는 위젯으로부터 이벤트를 전달받으면 필요한 Repository 등으로부터 데이터를 전달받아 Business Logic을 처리함 Business Logic 을 처리한 후, BLoC 객체를 구독 중인 UI 객체들에게 상태를 전달합니다.

해당 BLoC 객체의 Stream을 구독 중인 위젯은 Stream을 통해 결과를 전달받고 해당 BLoC의 상태가 변경되면 그 상태에 따라 UI를 변경합니다.

### Redux와의 비교
상태 관리를 Global 하게 할 수 있다는 점은 비슷합니다.

큰 차이는 BLoC는 UI와 Business Logic을 완전히 분리하는 데에 초점이 맞춰져있습니다.

UI가 BLoC를 구독한다는 점이 가장 큰 차이점입니다.

Redux에서는 Dispatch 라는 진입점이 있고, Action과 Reducer를 통해 새로운 상태를 만들어서 View에 전달합니다.

BLoC에서는 Sink라는 진입점이 있고, Business Logic 을 처리하고 새로운 상태를 만들어 Stream을 구독하고 있는 UI에게 전달합니다.

비슷해 보이지만 BLoC는 UI에서 진입점이 없더라도, BLoC에서 상태가 변경되면 이를 구독하고 있는 UI는 최신 상태로 변경하게 된다 UI는 로직에는 신경 쓰지 않고, 상태를 화면에 구현하는 것만에 집중하게 됩니다.

### BLoC Pattern의 장점
Flutter에서는 위젯에서 상태를 이용하려면 기본적으로 StatefulWidget을 생성해야 하는데 클래스를 2개 생성해야 하기 때문에 StatelessWidget에 비해 코드가 길어집니다.
BLoC Pattern을 이용하면 필요에 따라 StatelessWidget으로도 상태를 이용한 위젯 생성이 가능해지는 장점이 있습니다.

테스트 시에도 UI와 비즈니스 로직을 구분하여 테스트도 용이합니다.

## Stream 이란

한쪽에서만 삽입이 가능한 파이프와 비슷한 개념
한쪽에 무언가를 삽입하면 파이프를 따라 흐르다가 다른 끝에서 나옵니다.

이 파이프를 Flutter의 Stream에 대입해보면

- 이 파이프 자체는 Stream이라 부릅니다.

- Stream을 Control 하기 위해서 주로 StreamController가 사용됩니다. (주로 사용되는 것이지 다른 방법도 존재합니다)

- 무언가를 Stream에 삽입하기 위해, StreamController가 sink property로 접근 가능한 StreamSink라는 "entrance"를 사용합니다.

- Stream의 결과(출력)는 StreamController의 stream property로 접근 가능합니다.

### 전달 가능한 데이터

value, event, object, collection, map, error, 다른 Stream 등 어떠한 형태의 데이터든 Stream에 전달이 가능합니다.


### Stream으로부터 데이터를 전달받는 방법

무언가가 Stream을 통해서 전달 되었다는 것을 알려면, StreamController의 stream property로 구독 해야합니다.

Listener를 정의하면, StreamSubscription object를 받게 됩니다.
이 StreamSubscription object로 Steram에서 일어나는 일들에 대해 알림을 받을 수 있게 됩니다.

최소 한 개 이상의 listener가 활성화되어 있으면, 아래의 상황들이 일어날 때마다 Stream은 events를 생성해서 활성화된 StreamSubscription object에 알려줍니다.

- Stream 밖으로 data가 나갈 때

- Stream에 에러가 들어왔을 때

- Stream이 닫혔을 때

### StreamSubscription은 다음의 행동들이 가능합니다

- listening 멈추기

- pause

- resume

### Stream은 단순히 파이프 역할만 하는가?

Stream은 데이터가 들어왔을 때 수정 혹은 변경 후에 나갈 수 있게도 해줍니다.
Stream 안의 data를 처리하기 위해서 StreamTransformer를 사용합니다.

### StreamTransformer

Stream에 흐르는 데이터를 "capture"하는 함수입니다.

데이터에 변형을 가합니다.

이 변형된 결과물도 Stream입니다.

여러 개의 StreamTransformers를 순차적으로 사용할 수도 있습니다.

### StreamTransformer가 할 수 있는 processing의 종류

- filtering : 특정 조건으로 데이터를 필터링

- regrouping : 데이터 재그룹화

- modification : 데이터 수정

- 다른 Stream에 데이터 삽입

- 버퍼링

- 프로세싱 : 데이터에 기반해 어떠한 행동하기

### Stream의 종류

2 종류의 Stream이 있습니다.

1. Single-subscription Streams
- Stream의 lifetime(생명주기) 동안 한 개의 Listener만 허용합니다.

- 해당 Stream에서는 첫 번째 Subscription object에서 구독이 취소되어도 재 구독이 불가능합니다.

2. Broadcast Streams
- 여러개의 Listener를 허용합니다.

- 어느 시점이던 Boradcast Stream에 Listener를 추가할 수 있습니다. 새로운 Listener는 listening을 시작하는 순간부터 events들을 받게 됩니다.

### 사용 예시

Single-subscription Stream에 대한 예시입니다. 이 Stream은 단순히 input을 출력합니다. 예시를 보면 알 수 있듯이 어떠한 타입이 와도 상관이 없습니다.

```dart
import 'dart:async';

void main() {
  //
  // Initialize a "Single-Subscription" Stream controller
  //
  final StreamController ctrl = StreamController();

  //
  // Initialize a single listener which simply prints the data
  // as soon as it receives it
  //
  final StreamSubscription subscription = ctrl.stream.listen((data) => print('$data'));

  //
  // We here add the data that will flow inside the stream
  //
  ctrl.sink.add('my name');
  ctrl.sink.add(1234);
  ctrl.sink.add({'a': 'element A', 'b': 'element B'});
  ctrl.sink.add(123.45);

  //
  // We release the StreamController
  //
  ctrl.close();
}
```

### StreamTransformer

두 번째 예시는 Broadcast Stream을 보여줍니다. integer 값들만 전달하고 그중에서도 짝수만 출력합니다. 이러한 결과물을 내오기 위해서는 StreamTransformer를 사용해서 값들을 필터링하여 짝수만 전달될 수 있게 합니다.

```dart
import 'dart:async';

void main() {
  //
  // Initialize a "Broadcast" Stream controller of integers
  //
  final StreamController<int> ctrl = StreamController<int>.broadcast();

  //
  // Initialize a single listener which filters out the odd numbers and
  // only prints the even numbers
  //
  final StreamSubscription subscription = ctrl.stream
					      .where((value) => (value % 2 == 0))
					      .listen((value) => print('$value'));

  //
  // We here add the data that will flow inside the stream
  //
  for(int i=1; i<11; i++){
  	ctrl.sink.add(i);
  }

  //
  // We release the StreamController
  //
  ctrl.close();
  }
}
```

원문 : https://medium.com/flutter-community/reactive-programming-streams-bloc-6f0d2bd2d248




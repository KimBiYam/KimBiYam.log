---
title: 'Equatable 패키지'
date: '2021-03-05'
tag: 'flutter'
---

## Equatable 패키지

객체 간 비교를 간편하게 해주는 flutter 패키지

BLoC 에서 새로운 데이터를 받아 올 때 객체를 생성하면 새로운 인스턴스를 생성하여 이전값과 동일한 객체인지 비교가 불가능하여 State가 바뀌고 BlocBuilder에서 builder가 호출 되기때문에 이전값과의 변화가 없을 시 builder 호출을 방지하고자 해당 패키지를 사용합니다.

Dart에서클래스 객체를 직접 비교 할 경우 == 연산자와 hashCode등을 재정의 해야합니다.
해당 방식은 번거로운 반면 라이브러리 사용 시 바로 비교가 가능하게끔 도와줍니다.

### 라이브러리 없이 구현할때의 예시

예시로 만든 Person Class

```dart
class Person {
  final String name;

  const Person(this.name);
}
```

객체를 생성하고 비교하면 다른 인스턴스이기 때문에 false가 나오게 됩니다.

```dart
void main() {
  final Person bob = Person("Bob");
}
```

```dart
print(bob == Person("Bob")); // false
```

만약 직접 == 연산자를 재 정의하면 아래와 같이 원하는 true 값을 받아올 수 있습니다.

```dart
class Person {
  final String name;

  const Person(this.name);

  @override
  bool operator ==(Object other) =>
    identical(this, other) ||
    other is Person &&
    runtimeType == other.runtimeType &&
    name == other.name;

  @override
  int get hashCode => name.hashCode;
}
```

```dart
print(bob == Person("Bob")); // true
```

### 라이브러리 사용 예시

Equatable 클래스를 상속 받고 props 함수를 구현하면 됩니다.

```dart
class Person extends Equatable {
  final String name;

  Person(this.name);

  @override
  List<Object> get props => [name];
}
```

Flutter Bloc 라이브러리를 사용할 때 State를 Equatable 을 상속받은 클래스로 지정하면 자동적으로 이전 State 와 값이 변경 되었을때만 해당 Bloc의 State 를 바꿔주고 BlocBuilder 의 builder를 호출하게 됩니다.
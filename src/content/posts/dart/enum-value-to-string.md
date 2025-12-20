---
title: 'Dart enum value String 으로 변환하기'
date: '2021-06-04'
tag: 'dart'
---

### Typescript 에서의 enum

저는 타입스크립트에서 enum을 사용할 때 아래와 같이
enum value에 다른 값을 매핑하여 자주 사용하였는데요

```tsx
enum Hello {
	a = "나는 A",
	b = "나는 B"
}
```

```tsx
console.log(Hello.a) // 나는 A
console.log(Hello.a === "나는 A") // true
```

### dart 에서의 enum

다트에서는 이와 같은 문법을 지원하지 않습니다.

```dart
// 컴파일 에러
enum Hello {
  a = "나는 A",
  b = "나는 B"
}
```

타입스크립트의 예제처럼 사용하고 싶을 때는 따로 enum value에 따라
값을 변환해 주는 함수를 만들어서 사용했었습니다.

```dart
enum Hello { a, b }

String convertHelloToKorText(Hello hello) {
  switch (hello) {
    case Hello.a:
      return "나는 A";
    case Hello.b:
      return "나는 B";
    default:
      return "";
  }
}
```

```dart
print(convertHelloToKorText(Hello.a)); // 나는 A
print(convertHelloToKorText(Hello.a) == "나는 A"); // true
```

해당 방식으로 똑같이 사용은 가능하지만 해당 함수를 가지고 있는 클래스를 만들거나 해야 하고,
매번 함수를 불러서 사용해야 하는 부분에서 사용성이 떨어집니다.

하지만 extension method를 이용하면 타입스크립트처럼 값을 매핑하여 사용할 수 있는 건 아니지만,
위와 같은 함수 없이 사용할 수 있습니다.

### Extension methods

[extension methods](https://dart.dev/guides/language/extension-methods)를 이용하면 원시 타입(Primitive Type), 클래스 등을 확장하여
새로운 메소드 등을 추가할 수 있습니다.

```dart
extension NumberParsing on String {
  int parseInt() {
    return int.parse(this);
  }
}
```

```dart
print("42".parseInt().runtimeType); // int
```

### enum 에 extension 적용해보기

enum에도 마찬가지로 적용이 가능하며 일반 함수뿐만 아니라 getter 함수 등도 정의가 가능하기 때문에
마치 클래스의 멤버 변수를 가져오듯이 구현이 가능합니다.

```dart
enum Hello { a, b }

extension HelloExtension on Hello {
  String get convertedKorText {
    switch (this) {
      case Hello.a:
        return "나는 A";
      case Hello.b:
        return "나는 B";
      default:
        return "";
    }
  }
}
```

```dart
print(Hello.a.convertedKorText); // 나는 A
print(Hello.a.convertedKorText == "나는 A"); // true
```

이러한 방식으로 사용하여도 타입스크립트처럼 값을 바로 매핑하여 사용할 수 있는 건 아니지만,
함수를 사용하는 방식보다는 편하게 사용이 가능합니다.

---

## 추가 내용 (2022-06-05)

Flutter 3.0이 릴리즈 되면서 Dart 2.17이 적용 되었습니다. Dart 2.17의 `새로운 enum 문법`이 생겨, extension 없이도 enum 내부에 클래스처럼 메소드와 필드를 구현해서 사용할 수 있습니다.

[Dart 2.17 업데이트 내용](https://medium.com/dartlang/dart-2-17-b216bfc80c5d)

### 위 예시를 새로운 문법으로 변환한 예시

```dart
enum Hello {
  a("나는 A"),
  b("나는 B");
  
  final String text;
  const Hello(this.text);
  
  
  @override
  String toString() => text;
}

void main() {
  print(Hello.a); // 나는 A
  print(Hello.a.toString() == "나는 A"); // true
}
```

![Untitled](/images/posts/flutter/enum-value-to-string_1.png)
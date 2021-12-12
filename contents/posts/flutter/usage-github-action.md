---
title: 'Flutter Github Action 사용해보기'
date: '2021-05-16'
tag: 'flutter'
---

## Github Action

[Github Action](https://github.com/features/actions)은 Github Repositry를 기반으로 Workflow를 자동화 할 수 있는 도구입니다.

간단하게 말해서 Github에서 직접 제공하는 CI/CD 도구라고 할 수 있습니다.

## Github Action 설정

이번에는 Flutter 프로젝트에 적용하기 위해

Github Action에서 지원하는 다양한 기능 중에 Flutter 프로젝트를 위한 [Flutter Action](https://github.com/marketplace/actions/flutter-action)을 사용해 보았습니다.

### [예제 리포지토리](https://github.com/KimBiYam/first_flutter_provider)

우선 Github Action을 사용하기 위해서는 git이 관리하는 프로젝트에

workflow를 위한 yml 설정 파일을 생성해야합니다.

예시로 프로젝트가 master 브랜치에 pull request 되었을 때, 유닛 테스트를 진행하는 workflow를 작성합니다.

Github Action과 관련된 파일은 .github/workflows 디렉토리에 위치해야 합니다.

### test.yml

```yaml
name: Tests
on:
  push:
    branches:
      - master
  pull_request:

jobs:
  unit-test:
    name: Unit tests on ${{ matrix.os }}
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-18.04, windows-2019, macos-10.15]
    steps:
      # Set up Flutter.
      - name: Clone Flutter repository with master channel
        uses: subosito/flutter-action@v1.5.0
        with:
          channel: stable
      - run: flutter doctor -v

      - name: Get pub packages
        uses: actions/checkout@v2
      - run: flutter pub get

      - run: flutter analyze
      - name: Ensure the Dart code is formatted correctly
        run: flutter format --set-exit-if-changed --dry-run .
      - name: Run Flutter unit tests
        run: flutter test
```

해당 파일의 설정한 내용은 master 브랜치에 푸시가 되거나, Pull Request 요청을 했을 경우

우분투, 윈도우, 맥에서 유닛 테스트를 자동으로 진행 해줍니다.

해당 Repository 설정에서 해당 Workflow가 성공하지 못하면

master 브랜치에 Merge 할 수 없도록 설정이 가능합니다.

- 브랜치 설정

![](/images/posts/flutter/usage-github-action_1.png)

- 해당 옵션으로 Workflow가 성공 했을때만 Merge 가능하게 설정합니다.

![](/images/posts/flutter/usage-github-action_2.png)


## Pull Request 테스트

Pull Request를 위해서 브랜치를 새로 만든 후,

간단하게 CounterProvider 를 만들어서 유닛 테스트를 작성 했습니다.

### counter_provider.dart

```dart
import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';

class CounterProvider with ChangeNotifier, DiagnosticableTreeMixin {
  int _count = 0;

  int get count => _count;

  void increment() {
    _count++;
    notifyListeners();
  }

  void decrement() {
    _count--;
    notifyListeners();
  }

  void reset() {
    _count = 0;
    notifyListeners();
  }

  @override
  void debugFillProperties(DiagnosticPropertiesBuilder properties) {
    super.debugFillProperties(properties);
    properties.add(IntProperty('count', count));
  }
}
```

### counter_provider_test.dart

```dart
import 'package:first_flutter_provider/providers/counter_provider.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  late CounterProvider counterProvider;

  setUp(() {
    counterProvider = CounterProvider();
  });

  test('should increment count', () {
    counterProvider.increment();

    expect(counterProvider.count, 1);
  });

  test('should decrement count', () {
    counterProvider.decrement();

    expect(counterProvider.count, -1);
  });

  test('should reset count', () {
    counterProvider.increment();
    counterProvider.reset();

    expect(counterProvider.count, 0);
  });
}
```

그 후 테스트를 실행합니다.

![](/images/posts/flutter/usage-github-action_3.png)

해당 브랜치를 master 브랜치에 Merge 하게끔 Pull Request를 요청합니다.

요청한 Pull Request를 보면 아래와 같이 테스트를 자동으로 진행합니다.

그리고 Merge버튼이 비활성화 되어 있는 것을 볼 수 있습니다.

![](/images/posts/flutter/usage-github-action_4.png)

Deatils 버튼을 눌려 해당 테스트의 진행상황을 볼 수 있습니다.

![](/images/posts/flutter/usage-github-action_5.png)

그 후 모든 테스트가 성공적으로 완료되면 Merge 버튼이 활성화 되어 Merge가 가능합니다.

![](/images/posts/flutter/usage-github-action_6.png)

단순히 테스트 뿐만 아니라 Github Action을 이용해서 배포 등의 기능도 수행이 가능합니다.

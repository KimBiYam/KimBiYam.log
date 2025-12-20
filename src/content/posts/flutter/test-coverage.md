---
title: 'Flutter Test Coverage'
date: '2021-05-16'
tag: 'flutter'
---

### Flutter Test Coverage

플러터 프로젝트의 test coverage를 체크하기 위해서는 우선 해당 명령어로 커버리지 파일을 생성해야 합니다.


```bash
$ flutter test --coverage
```

유닛 테스트를 진행하고 해당 테스트를 토대로 lcov.info 파일이 생성됩니다.

```bash
$ ls coverage
lcov.info
```

### genhtml

해당 파일에서도 커버리지 정보를 확인할 수 있지만,
genhtml을 이용하면 한눈에 알아보기 쉬운 html 파일을 생성해 줍니다.

우선 사용하기 위해서 genhtml을 설치합니다.

```bash
# linux
$ sudo apt get install genhtml

# mac
$ sudo brew install genhtml
```

아래의 명령어로 커버리지 파일을 웹에서 확인 가능한 html 파일로 생성합니다.

```bash
$ genhtml -o coverage coverage/lcov.info
$ open coverage/index.html
```

그 후 테스트의 coverage 정보를 index.html 웹에서 확인할 수 있습니다.

전체 coverage 정보뿐만 아니라 파일 별 coverage 와
해당 파일의 어느 라인이 테스트가 되어있지 않은지 등등을 체크할 수 있습니다.

![](/images/posts/flutter/test-coverage_1.png)

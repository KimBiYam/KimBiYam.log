---
title: 'Flutter ios 빌드 시 CocoaPods 미설치 에러 해결법'
date: '2020-12-29'
tag: 'flutter'
---

Cocoapods 언인스톨

```bash
$ sudo gem uninstall cocoapods
```

Cocoapods 1.7.5 버전 인스톨

```bash
$ sudo gem install cocoapods -v 1.7.5
```

Cocoapods 초기화

```bash
$ pod setup
```

Cocoapods 업데이트

```bash
$ sudo gem install cocoapods
```

혹은

![CocoaPods%20%E1%84%86%E1%85%B5%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5%20%E1%84%8B%E1%85%A6%E1%84%85%E1%85%A5%20%E1%84%92%E1%85%A2%E1%84%80%E1%85%A7%E1%86%AF%E1%84%87%E1%85%A5%E1%86%B8%20fb4a0cd7740748f095ee9e2bb0f73829/Untitled.png](/postImages/flutter/cocoa-pods-error_1.png)

해당 옵션으로 안드로이드 스튜디오 캐시 제거 후 실행
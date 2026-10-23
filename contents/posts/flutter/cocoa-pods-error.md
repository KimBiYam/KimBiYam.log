---
title: 'Flutter ios 빌드 시 CocoaPods 미설치 에러 해결법'
date: '2020-12-29'
tag: 'flutter'
description: 'Flutter iOS 빌드 시 CocoaPods가 설치되지 않았다는 에러의 해결 방법입니다. CocoaPods 재설치·pod setup·업데이트 명령어와 Android Studio 캐시 초기화를 정리했습니다.'
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

![Android Studio File 메뉴의 Invalidate Caches / Restart 항목](/images/posts/flutter/cocoa-pods-error_1.png)

해당 옵션으로 안드로이드 스튜디오 캐시 제거 후 실행
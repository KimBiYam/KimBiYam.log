---
title: 'Flutter 2.0 기존 프로젝트 null safety 로 마이그레이션 하기'
date: '2021-03-07'
tag: 'flutter'
---

# Flutter migrate to null safety 

> *Flutter 2.0이 릴리즈 되면서 dart 2.12 버전이 적용되어 dart에 null safety가 적용되었습니다.
null safety에 관한 내용은 [공식 문서](https://dart.dev/null-safety/tour)를 참고하시고,
이 포스트에서는 마이그레이션 방법만 다루겠습니다.
마이그레이션 가이드 [공식문서](https://dart.dev/null-safety/migration-guide)와 [영상](https://youtu.be/bvq7wbn4VAA)을 참조하였습니다.*

> ⚠️ *마이그레이션 중 문제가 생길 수 있으니 백업 혹은 커밋 후 진행을 권장합니다.*

## Flutter SDK Upgrade

우선 Flutter SDK를 업그레이드하지 않았다면 Flutter SDK 버전부터 업그레이드합니다.
Flutter SDK의 channel이 stable 인지 체크합니다.

```
> flutter channel
Flutter channels:
  master
  dev
  beta
* stable
```

만약 stable이 아닌 경우 channel을 stable로 바꿔주면 됩니다.

```
> flutter channel stable
```

그 후 Flutter SDK upgrade를 진행합니다

```
> flutter upgrade
```

Flutter SDK upgrade가 제대로 진행되었는지 체크합니다.

```
> flutter doctor
Doctor summary (to see all details, run flutter doctor -v):
[✓] Flutter (Channel stable, 2.0.1, on Linux, locale en_US.UTF-8)
[✓] Android toolchain - develop for Android devices (Android SDK version 30.0.2)
[✓] Chrome - develop for the web
[✓] Android Studio (version 4.0)
[✓] IntelliJ IDEA Community Edition (version 2020.2)
[✓] VS Code (version 1.54.1)
[✓] Connected device (2 available)

• No issues found!
```

dart SDK 버전이 2.12.0 이상인지 체크합니다.

```
> dart --version
Dart SDK version: 2.12.0 (stable) (Thu Feb 25 19:50:53 2021 +0100) on "linux_x64"
```

---

## Migration 진행

SDK 버전이 성공적으로 업그레이드 되었으면 원하는 프로젝트에서 migration을 진행하면 됩니다.

저는 예시로 Provider Pattern을 적용한 프로젝트를 사용했습니다.

[소스코드](https://github.com/KimBiYam/first_flutter_provider)

우선 첫번째로 사용하고 있는 패키지 중에서 null safety가 적용 안 된 패키지가 있는지 체크해야 합니다.

프로젝트의 pubspec.yaml 파일이 있는 경로에서 커맨드를 입력합니다.

```
> dart pub outdated --mode=null-safety
```

사용 중인 패키지들이 null safety가 적용되었는지, 업그레이드 가능한지 등의 상태가 나오게 됩니다.

```
Showing dependencies that are currently not opted in to null-safety.
[✗] indicates versions without null safety support.
[✓] indicates versions opting in to null safety.

Package Name     Current  Upgradable  Resolvable  Latest  

direct dependencies:
cupertino_icons  ✗1.0.0   ✓1.0.2      ✓1.0.2      ✓1.0.2  
provider         ✗4.3.3   ✗4.3.3      ✓5.0.0      ✓5.0.0  

1 upgradable dependency is locked (in pubspec.lock) to an older version.
To update it, use `dart pub upgrade`.

1 dependency is constrained to a version that is older than a resolvable version.
To update it, edit pubspec.yaml, or run `dart pub upgrade --null-safety`.
```

아래의 안내에 따라 패키지들을 업그레이드하면 됩니다.

```
> dart pub upgrade --null-safety
```

제대로 업그레이드가 되었는지 체크합니다.

```
> dart pub outdated --mode=null-safety
```

```
Showing dependencies that are currently not opted in to null-safety.
[✗] indicates versions without null safety support.
[✓] indicates versions opting in to null safety.

All your dependencies declare support for null-safety.
```

아까와 다르게 All your dependencies declare support for null-safety. 라는 문구가 나오는 걸 확인할 수 있습니다.

이제 프로젝트 migration을 진행하면 됩니다.

아래의 명령어로 migration을 진행합니다.

```
> dart migrate
```

그러면 마이그레이션이 시작되면서 웹 서버가 하나 띄워지게 됩니다.

```
 dart migrate 
Migrating /home/hot9998/dev/hot9998/flutter/first_flutter_provider

See https://dart.dev/go/null-safety-migration for a migration guide.

Analyzing project...
[---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------]No analysis issues found.

Generating migration suggestions...
[---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------]

Compiling instrumentation information...
[---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------]

View the migration suggestions by visiting:

  http://127.0.0.1:....

Use this interactive web view to review, improve, or apply the results.
When finished with the preview, hit ctrl-c to terminate this process.

If you make edits outside of the web view (in your IDE), use the 'Rerun from
sources' action.
```

View the migration suggestions by visiting 문구 아래의 주소로 들어가면
코드 미리 보기가 가능합니다.

![](/images/posts/flutter/flutter2.0-migration_1.png)

파일별로 마이그레이션 적용이 가능하고 미리 보기도 가능합니다.

![](/images/posts/flutter/flutter2.0-migration_2.png)

공식 영상에 따르면 마이그레이션이 완벽하진 않기 때문에 미리 보기를 보면서
직접 코드를 수정하거나 마이그레이션 도구를 이용해서 수정할 수 있다고 합니다.

![](/images/posts/flutter/flutter2.0-migration_3.png)

마이그레이션 시 변경사항이 생기면 파일 옆에 변경사항의 개수가 나타나고
파일 클릭 시 오른쪽에 디테일한 변경 내용 등이 나타나게 됩니다.

코드를 파악 후 아래의 힌트 버튼으로
해당 부분이 nullable 타입으로 변환할 건지, 아닌지 힌트 주석을 달아
마이그레이션시 그 형태로 변환되게 설정이 가능합니다.

![](/images/posts/flutter/flutter2.0-migration_4.png)

저는 따로 수정 없이 바로 migration을 진행했습니다.
오른쪽 상단의 APPLY MIGRATION 버튼을 눌려 진행하면 됩니다.

그 후 열어둔 터미널에서 확인하면 migration 진행이 되는 것을 볼 수 있습니다.

```
Applying migration suggestions to disk...
Migrated 7 files:
    test/widget_test.dart
    lib/screens/second_screen.dart
    lib/screens/first_screen.dart
    lib/providers/counter_provider.dart
    lib/main.dart
    pubspec.yaml
    .dart_tool/package_config.json
```

현재 프로젝트 같은 경우 마이그레이션 후 아무 에러 없이 빌드가 잘 되지만
수정 사항이 많아 에러가 나거나 하는 경우 나머지 부분은 직접 수정해야 합니다.

---

### Material Button

Migration 후 RaisedButton, FlatButton, OutlineButton 위젯의 경우
deprecated 상태가 되며 그에 관한 내용은 [Material 버튼 migration 가이드](https://docs.google.com/document/d/1yohSuYrvyya5V1hB6j9pJskavCdVq9sVeTqSoEPsWH0/edit#)에 있습니다.

![](/images/posts/flutter/flutter2.0-migration_5.png)

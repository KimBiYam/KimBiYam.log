---
title: 'Flutter fvm(Flutter Version Management) 사용하기'
date: '2021-05-06'
tag: 'flutter'
---

## 개요

[fvm](https://github.com/leoafarias/fvm)은 Flutter Version Management의 약자로 Flutter SDK 버전을

프로젝트 별로 다르게 적용할 수 있게끔 도와주는 라이브러리입니다.

[공식 레포지토리](https://github.com/leoafarias/fvm)

## 설치

Flutter SDK 설치가 완료되어야 합니다.

fvm은 dart의 pub 패키지 관리를 이용해 사용하므로 우선 dart와 pub-cache 를

커맨드에서 사용할 수 있게 shell 파일을 설정해야 합니다.

```bash
# 해당 3라인을 추가
export PATH="$PATH":"$HOME/development/flutter/bin"
export PATH="$PATH":"$HOME/bin/cache/dart-sdk/bin"
export PATH="$PATH":"$HOME/.pub-cache/bin"
```

그 후 터미널에서 해당 명령어를 실행하면 fvm 사용이 가능합니다.

```bash
$ pub global activate fvm
```

```bash
$ fvm
Flutter Version Management: A cli to manage Flutter SDK versions.

Usage: fvm <command> [arguments]

Global options:
-h, --help       Print this usage information.
    --verbose    Print verbose output.
    --version    current version

Available commands:
  config     Set configuration for FVM
  dart       Proxies Dart Commands
  doctor     Shows information about environment, and project configuration.
  flavor     Switches between different project flavors
  flutter    Proxies Flutter Commands
  global     Sets Flutter SDK Version as a global
  install    Installs Flutter SDK Version
  list       Lists installed Flutter SDK Versions
  releases   View all Flutter SDK releases available for install.
  remove     Removes Flutter SDK Version
  spawn      Spawns a command on a Flutter version
  use        Sets Flutter SDK Version you would like to use in a project

Run "fvm help <command>" for more information about a command.
```

## 사용법

releases 명령어로 여태까지 릴리즈 됐던 Flutter SDK의 모든 버전을 볼 수 있습니다.

```bash
$ fvm releases
Feb 26 18  │ v0.1.6           
Mar 12 18  │ v0.2.1           
Mar 13 18  │ v0.1.8
Mar 13 18  │ v0.1.9
...
```

install 명령어로 원하는 버전을 설치하면 됩니다.

```bash
$ fvm install 1.22.6
Flutter "1.22.6" is not installed.

Installing version: 1.22.6...
```

위와 같은 커맨드가 나오면서 설치가 진행됩니다.

list 명령어로 설치된 SDK 버전 리스트를 볼 수 있습니다.

```bash
$ fvm list

stable
2.0.5
1.22.6
```

use 명령어를 이용해서 해당 프로젝트에서 사용하고자 하는 SDK 버전을 지정합니다.

```bash
$ fvm use 2.0.5
Project now uses Flutter [2.0.5]
```

다시 list 명령어로 확인해보면 사용하고 있는 버전 정보를 알 수 있습니다.

```bash
$ fvm list

stable
2.0.5 (active)
1.22.6
```

실제 sdk 가 설치된 폴더를 참조하여 해당 프로젝트 폴더의 .fvm/flutter_sdk 라는 symlink 폴더가 생기게 된다.

안드로이드 스튜디오에서도 버전 세팅을 해주기 위해 해당 경로를 설정해 주어야 합니다.

```bash
$ cd ./fvm/flutter_sdk
$ pwd
.../.fvm/flutter_sdk
```

안드로이드 스튜디오 Preferences에서 Flutter SDK path를 해당 경로로 지정해주면 됩니다.

![](/images/posts/flutter/usage-fvm_1.png)

그 후 상단의 Get dependencies를 실행하면 정상적으로 패키지가 가져와지는걸 확인할 수 있습니다.

![](/images/posts/flutter/usage-fvm_2.png)

그리고 fvm의 폴더에 flutter_sdk symlink 폴더를 gitignore에 적용해 git에서 제외하도록 합니다.

```bash
.fvm/flutter_sdk
```

기존의 flutter 로 사용하던 커맨드 명령어들은 앞에 fvm을 붙혀주고 사용하면 됩니다.

```bash
$ fvm flutter pub get
$ fvm flutter clean
```
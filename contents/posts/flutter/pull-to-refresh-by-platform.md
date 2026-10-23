---
title: 'Flutter 플랫폼 별 pull to refresh List 위젯 만들기'
date: '2021-03-17'
tag: 'flutter'
description: 'iOS에서는 Cupertino, 안드로이드에서는 Material 인디케이터가 나오도록 ListView와 CustomScrollView로 플랫폼별 pull to refresh 리스트 위젯을 만든 예시입니다.'
---

### RefreshSwitcher

기본적인 리스트 위젯인 ListView 위젯과 CustomScroolView 를 이용하여
iOS와 안드로이드 플랫폼 별로 로딩 인디케이터를 구별해주는 위젯을 만들어봤습니다.

```dart
import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class RefreshSwitcher extends StatelessWidget {
  RefreshSwitcher({
    required this.itemCount,
    required this.onRefresh,
    required this.builder,
  });
  
  final int itemCount;
  final Future<void> Function() onRefresh;
  final Widget Function(BuildContext context, int index) builder;

  @override
  Widget build(BuildContext context) {
    if (Platform.isIOS) {
      return CustomScrollView(
        physics: AlwaysScrollableScrollPhysics(
          parent: BouncingScrollPhysics(),
        ),
        slivers: [
          CupertinoSliverRefreshControl(
            refreshTriggerPullDistance: 100.0,
            refreshIndicatorExtent: 3.0,
            onRefresh: onRefresh,
          ),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              builder,
              childCount: itemCount,
            ),
          ),
        ],
      );
    } else {
      return RefreshIndicator(
        onRefresh: onRefresh,
        child: ListView.builder(
          itemCount: itemCount,
          physics: AlwaysScrollableScrollPhysics(
            parent: BouncingScrollPhysics(),
          ),
          itemBuilder: builder,
        ),
      );
    }
  }
}
```

사용시에는 itemCount, onRefresh, builder parameter 값을 주고 사용 가능합니다.

```dart
RefreshSwitcher(
	itemCount: textList.length,
   	onRefresh: () async => print('refresh!'),
   	builder: (context, index) => Text(textList[index])
)
```

pull to refresh 액션을 해보면 iOS에서는 Cupertino 디자인의 인디케이터가 나오고
안드로이드에서는 Material 디자인의 인디케이터가 나옵니다.
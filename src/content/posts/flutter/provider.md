---
title: 'Flutter Provider'
date: '2021-05-06'
tag: 'flutter'
---

## Provider

전역 상태 관리를 위한 패턴의 하나로

관심사의 분리(비즈니스 로직과 UI 부분의 분리) 및 상태 데이터를 전역적으로 관리가 가능하고,

Flutter 에서 권장되는 또 다른 패턴인 BLoC Pattern에 비해서 적은 코드로 간단하게 구현이 가능합니다.

[Provider Package](https://pub.dev/packages/provider)를 이용해서 사용 가능합니다.

### ChangeNotifier

리스너에게 변경 알림을 제공하는 클래스 Observable과 비슷한 개념

전역으로 State를 사용하고자 하는 경우 해당 클래스를 상속받으면 됩니다.

클래스 내부에 state로 원하는 변수를 지정해두고

원하는 함수를 작성하여 state 변경 후 notifyListeners() 함수를 호출하면

리스너(UI)에 변경사항을 알려줍니다

ex ) User를 전역 상태로 사용하는 예제

```dart
class UserProvider extends ChangeNotifier {
  User _user;

  User get user => _user;

  Future<void> login() async {
    try {
      ApiHelper apiHelper = ApiHelper();
      User user = await apiHelper.getUserProfile();
      _user = user;
      notifyListeners();
    } catch (e) {
      this.logout();
      print(e);
    }
  }

  Future<void> logout() async {
    AuthHelper authHelper = AuthHelper();
    await authHelper.removeToken();
    _user = null;
    notifyListeners();
  }

  @override
  void dispose() {
    super.dispose();
  }
}
```

### ChangeNotifierProvider

ChangeNotifier를 상속받아 생성한 클래스의 상태를 받아오기 위한 위젯입니다.

해당 위젯안에 포함된 위젯은 전역 상태를 받아올 수 있습니다.

```dart
ChangeNotifierProvider(
  create: (_) => UserProvider(),
  child: MaterialApp(
    title: 'App',
		...
  ),
),
```

여러 클래스를 동시에 가져오려면 MultiProvider 위젯을 이용하면 됩니다.

```dart
MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => UserProvider(),
        ),
      ],
      builder: (context, child) => return Widget
```

### Consumer

전역 상태를 UI에서 가져오기 위하여 사용하는 위젯입니다.

상태가 변경되면 하위 위젯이 모두 새로 그려지므로 최대한 트리의 최하위에서 사용해야 합니다.

```dart
Consumer<UserProvider>(
  builder: (context, value, child) {
    switch (value.userLoginStatus) {
      case UserLoginStatus.loggedIn:
        return Column(
          children: [
            Text(
              value.user.userName,
            ),
            Text(
              value.user.email,
            ),
            Text(
              value.user.id,
            ),
          ],
        );
      default:
        return Container();
    }
  },
),
```

### Selector

Selector 위젯은 Consumer와 동일한 역할을 하는 위젯이지만

Consumer 위젯은 기본적으로 Notifier 클래스의 상태가 변경되면

무조건 새로 빌드하게 되어있어 원하는 상황에 새로 빌드하게 하는 것이 불가능한데,

Selector 위젯의 selector parameter를 통해 원하는 경우에만 새로 빌드하게끔 조건을 걸 수 있습니다.

제네릭으로 가져오고자 하는 Notifier 클래스, selector로 조건을 걸고 리턴 타입을 지정할 수 있습니다.

```dart
Selector<UserProvider, User>(
  builder: (context, user, child) {
    if (user != null) {
      return Column(
        children: [
          Text(
            user.userName,
          ),
          Text(
            user.email,
          ),
          Text(
            user.id,
          ),
        ],
      );
    } else {
      return Container();
    }
  },
  selector: (_, userProvider) => userProvider.user,
),
```

### UI를 제외하고 엑세스

UI변경이 필요하지 않지만 데이터에 엑세스 하고 싶을때(예를들면 함수 등에서)는

Provider.of 함수 혹은 context.read() 함수를 사용하면 됩니다.

```dart
await Provider.of<UserProvider>(context, listen: false).login();`
```

```dart
await context.read<UserProvider>().login();
```

---
title: 'Flutter BLoC 및 Equatable 패키지를 적용한 BLoC Pattern 예시'
date: '2021-03-05'
tag: 'flutter'
---


### BLoC의 State로 사용한 클래스

CredentialState와 Credential은 모두 Equatable 을 상속받는 클래스

```dart
class CredentialState extends Equatable {
  final List<Credential> credentials;

  CredentialState({this.credentials});

  @override
  List<Object> get props => [credentials];
}
```

```dart
class Credential extends Equatable {
  Credential(
    ...
```

### 위젯

이벤트를 호출하는 함수

```dart
  getCredentials() {
    context.read<CredentialBloc>().add(CredentialEvent.getCredentials);
  }
```

버튼 클릭 시 해당 함수를 호출

```dart
child: FlatButton(
  ...
  onPressed: () => getCredentials(),
```

### Bloc 클래스

CredentialBloc 클래스의 mapEventToState 함수에서 getCredentials 이벤트가 들어오면 서버에서 새로운 데이터를 가져옵니다.

```dart
@override
  Stream<CredentialState> mapEventToState(CredentialEvent event) async* {
    switch (event) {
      case CredentialEvent.getCredentials:
        NetworkHelper networkHelper = NetworkHelper();
        List<Credential> credentials = await networkHelper.getCredentials();
        CredentialState credentialState = CredentialState(credentials: credentials);
        yield credentialState;
        break;
    }
  }
```

### 로그

상태 변화를 감지하기 위해 Bloc 클래스에서 변화를 감시하는 함수들을 오버라이드 하여 사용합니다.

```dart
  @override
  void onChange(Change<CredentialState> change) {
    print("CredentialBloc onChange : $change");
    super.onChange(change);
  }

  @override
  void onTransition(Transition<CredentialEvent, CredentialState> transition) {
    print("CredentialBloc onTransition : $transition");
    super.onTransition(transition);
  }
```

BlocBuilder에서도 새로 builder가 호출되는지 체크하기 위해 출력 코드 작성

```dart
body: BlocBuilder<CredentialBloc, CredentialState>(
        builder: (context, state) {
          print("CredentialsScreen Builder");
```

가져온 데이터가 변경이 되었을때만 상태가 변경되어 BlocBuilder의 builder가 호출되며 화면이 새로 그려지게 됩니다.


```dart
flutter: CredentialBloc onTransition : Transition { currentState: CredentialState, event: CredentialEvent.getCredentials, nextState: CredentialState }
flutter: CredentialBloc onChange : Change { currentState: CredentialState, nextState: CredentialState }
flutter: CredentialsScreen Builder
```

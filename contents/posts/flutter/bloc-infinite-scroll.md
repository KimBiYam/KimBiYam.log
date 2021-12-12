---
title: 'Flutter BLoC 패키지를 이용한 무한 스크롤 리스트 예시'
date: '2021-03-05'
tag: 'flutter'
---


### [예시 코드](https://github.com/KimBiYam/bloc-infinite-list)

### 설정

필요한 패키지들을 pubspec.yaml에 추가합니다.

```yaml
dependencies:
  flutter:
    sdk: flutter

  cupertino_icons: ^1.0.0
  flutter_bloc: ^6.1.1
  equatable: ^1.2.5
  http: ^0.12.2
  rxdart: ^0.25.0
```

### REST API

더미 데이터를 제공해 주는 [jsonplaceholder](http://jsonplaceholder.typicode.com/)를 이용해서 데이터를 받아옵니다.

posts api에서 start 값과 limit 값으로 post 데이터의 개수가 지정이 가능하며, 최대 100개까지의 데이터만 넘겨줍니다.

post 데이터를 주는 API URL https://jsonplaceholder.typicode.com/posts?_start=0&_limit=2

```json
[
  {
    "userId": 1,
    "id": 1,
    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
  },
  {
    "userId": 1,
    "id": 2,
    "title": "qui est esse",
    "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
  }
]
```

### Data Model

해당 형식에 맞춰 Post 모델 클래스를 생성합니다.

Bloc에서 객체를 비교하기 위해서 Equatable 클래스를 상속받습니다.

```dart
class Post extends Equatable {
  final int id;
  final String title;
  final String body;

  Post({this.title, this.body, this.id})
      : assert(title != null && body != null && id != null);

  @override
  List<Object> get props => [id, title, body];

  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      id: json['id'] as int,
      title: json['title'] as String,
      body: json['body'] as String,
    );
  }
}
```

### Post Events

PostBloc 만들기 위해 우선 해당 Bloc의 상태를 변경하기 위한 이벤트를 정의합니다.

Post 데이터를 가져오는 이벤트만 있으면 되기 때문에 getPosts 이벤트만 추가했습니다.

```dart
enum PostEvent { getPosts }
```

### Post States

Post 객체를 List로 가지고 있고 상태를 Status 값으로 가지고 있는 State 클래스를 생성합니다.

사용하는 API에서 최대 100개까지의 데이터만 넘겨주므로 마지막 불러온 Post 데이터의 id 값이 100인 경우 새로 첫 번째 데이터부터 받아오기 위해서 lastPostId 값을 추가했습니다.

```dart
enum PostStatus { initial, success, failure }

class PostState extends Equatable {
  final PostStatus status;
  final List<Post> posts;
  final int lastPostId;

  PostState(
      {this.status = PostStatus.initial, this.posts, this.lastPostId = 0});

  PostState copyWith({
    PostStatus status,
    List<Post> posts,
    int lastPostId,
  }) {
    return PostState(
      status: status ?? this.status,
      posts: posts ?? this.posts,
      lastPostId: lastPostId ?? this.lastPostId,
    );
  }

  @override
  List<Object> get props => [status, posts, lastPostId];
}
```

### Post Bloc

Bloc 클래스를 생성하기 전에 http 통신을 위한 ApiHelper 클래스를 따로 생성했습니다.

```dart
class ApiHelper {
  final String url;

  ApiHelper({this.url});

  Future getData() async {
    try {
      http.Response response = await http.get(this.url);
      if (response.statusCode != 200)
        throw HttpException('${response.statusCode}');
      String data = response.body;
      var decodedData = jsonDecode(data);
      return decodedData;
    } catch (e) {
      throw e;
    }
  }
}
```

Event와 State 정의가 끝났으니 PostBloc 클래스를 생성합니다.

```dart
class PostBloc extends Bloc<PostEvent, PostState> {
  PostBloc() : super(PostState(posts: []));

  final int _postLimit = 20;

  @override
  Stream<Transition<PostEvent, PostState>> transformEvents(
      Stream<PostEvent> events, transitionFn) {
    return super.transformEvents(
        events.debounceTime(const Duration(milliseconds: 500)), transitionFn);
  }

  @override
  Stream<PostState> mapEventToState(PostEvent event) async* {
    switch (event) {
      case PostEvent.getPosts:
        try {
          if (state.lastPostId != 100) {
            final posts = await _fetchPosts(state.lastPostId, _postLimit);
            yield state.copyWith(
              status: PostStatus.success,
              posts: List.of(state.posts)..addAll(posts),
              lastPostId: posts.last.id,
            );
            break;
          } else {
            final posts = await _fetchPosts(0, _postLimit);
            yield state.copyWith(
                status: PostStatus.success,
                posts: List.of(state.posts)..addAll(posts),
                lastPostId: _postLimit);
          }
        } catch (e) {
          yield state.copyWith(status: PostStatus.failure);
        }
    }
  }

  Future<List<Post>> _fetchPosts(int startIndex, int limit) async {
    ApiHelper apiHelper =
        ApiHelper(url: '$postUrl?_start=$startIndex&_limit=$limit');

    final response = await apiHelper.getData();
    List<Post> _posts = List();
    response.forEach((postRaw) {
      _posts.add(Post.fromJson(postRaw));
    });
    return _posts;
  }
}

```

mapEventToState 함수로 이벤트가 들어왔을 때 State 값을 변경해 줍니다.

transformEvents 함수로 이벤트가 들어오면 rxdart 패키지의 debounceTime 함수를 이용해서 일정 시간 동안 API를 불필요하게 호출하지 못하게 Event를 debounce 합니다.
ListView에서 스크롤을 해서 화면 아랫부분에 오면 새로 데이터를 불러오는데 State가 변경되기 전까지 계속해서 이벤트를 호출하게 되므로 debounceTime 함수로 처리합니다.

State의 lastPhotoId 값이 100이 아닌 경우는 lastPhotoId를 API의 start 값으로, postLimit 값을 limit 값으로 주고 lastPhotoId 값이 100인 경우 더 이상 받을 데이터가 없으므로 처음 데이터 받아오기 위해 초기화를 진행해 줬습니다.

### Presentation Layer

해당 PostBloc을 위젯에서 사용하기 위해 MaterialApp을 BlocProvider로 감싸줍니다.

```dart
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => PostBloc(),
      child: MaterialApp(
        title: 'Flutter Demo',
        theme: ThemeData(
          primarySwatch: Colors.blue,
          visualDensity: VisualDensity.adaptivePlatformDensity,
        ),
        home: PostScreen(),
      ),
    );
  }
}
```

PostBloc 클래스에서 데이터를 보여주기 위한 화면 위젯들을 생성합니다.

- 리스트안에 들어갈 PostItem 위젯

```dart
class PostItem extends StatelessWidget {
  final Post post;

  PostItem({this.post}) : assert(post != null);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Text(
        '${post.id}',
        style: TextStyle(fontSize: 10.0),
      ),
      title: Text(post.title),
      isThreeLine: true,
      subtitle: Text(post.body),
      dense: true,
    );
  }
}
```

- 스크롤 가장 아랫부분에서 Loading Indicator를 보여주기 위한 BottomLoader 위젯

```dart
class BottomLoader extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      alignment: Alignment.center,
      child: Center(
        child: SizedBox(
          width: 33,
          height: 33,
          child: CircularProgressIndicator(
            strokeWidth: 1.5,
          ),
        ),
      ),
    );
  }
}
```

- 메인 화면인 PostScreen 위젯

```dart
class PostScreen extends StatefulWidget {
  @override
  _PostScreenState createState() => _PostScreenState();
}

class _PostScreenState extends State<PostScreen> {
  final _scrollController = ScrollController();
  PostBloc _postBloc;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    _postBloc = BlocProvider.of<PostBloc>(context);
    _postBloc.add(PostEvent.getPosts);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text("Post Screen"),
        ),
        body: BlocBuilder<PostBloc, PostState>(
          builder: (context, state) {
            switch (state.status) {
              case PostStatus.initial:
                return Center(
                  child: CircularProgressIndicator(),
                );
              case PostStatus.failure:
                return Center(
                  child: Text('failed to fetch posts'),
                );
              default:
                if (state.posts.isEmpty) {
                  return Center(
                    child: Text('no posts'),
                  );
                } else
                  return ListView.builder(
                    itemBuilder: (context, index) {
                      return index >= state.posts.length
                          ? BottomLoader()
                          : PostItem(post: state.posts[index]);
                    },
                    itemCount: state.posts.length + 1,
                    controller: _scrollController,
                  );
            }
          },
        ));
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_isBottom) {
      _postBloc.add(PostEvent.getPosts);
    }
  }

  bool get _isBottom {
    if (!_scrollController.hasClients) return false;
    final maxScroll = _scrollController.position.maxScrollExtent;
    final currentScroll = _scrollController.position.pixels;
    return currentScroll >= (maxScroll * 0.9);
  }
}
```

ScrollController의 dispose 및 initState 함수 등을 위해 StatefulWidget으로 생성했습니다.

BlocBuilder를 이용해서 PostState의 Status 값에 따라 다른 화면을 그려줍니다.

onScroll 과 isBottom 함수를 이용해 리스트 뷰의 스크롤이 가장 아래까지 내려가면 PostBloc의 getPosts 이벤트를 호출하게 되어있습니다.

- 화면을 아래로 스크롤 시 새로운 데이터가 잘 받아 와집니다.

![](/images/posts/flutter/bloc-infinite-scroll_1.gif)

- 100개의 Post가 다 불러와지면 다시 첫번째 데이터부터 받아옵니다

![](/images/posts/flutter/bloc-infinite-scroll_2.gif)


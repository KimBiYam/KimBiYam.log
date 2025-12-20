---
title: 'React Query 사용해보기'
date: '2021-05-04'
tag: 'react'
ogImagePath: '/images/posts/react/usage-react-query_1.png'
---

![](/images/posts/react/usage-react-query_1.png)

## 개요

React에서 비동기를 쉽게 다루게 해주는 라이브러리입니다.

글로벌 상태관리 라이브러리(Redux, MobX 등) 없이 서버에서 데이터를 가져오고

그 데이터를 모든 컴포넌트에서 사용 가능하게 캐싱하거나, 그 이외에도 주기적으로 데이터 패칭,

[Optimistic Updates](https://react-query.tanstack.com/guides/optimistic-updates)(데이터 변경을 요청 후 실제로 요청이 성공하기 전 미리 UI만 변경한 뒤, 서버의

응답에 따라 다시 롤백하거나 업데이트 된 상태로 UI를 놔두는 것) 등을 지원합니다.

## 설치

React Query 패키지와 http 통신을 위한 axios 패키지를 설치합니다.

```bash
$ npm i -D react-query
$ npm i axios
```

## 사용법

React Query를 사용 하기 위해선 우선 사용하고자 하는 컴포넌트를

QueryClientProvider 컴포넌트로 감싸주고 QueryClient 값을 Props로 넣어줘야 합니다.

앱 전체에서 사용하고자하면 최상위 컴포넌트에 감싸주면됩니다.

```tsx
import React from 'react';
import './App.css';
import { QueryClientProvider, QueryClient } from 'react-query';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App"></div>
    </QueryClientProvider>
  );
};

export default App;
```

react-query 를 이용해서 데이터 패칭을 할때는 [useQuery](https://react-query.tanstack.com/reference/useQuery) hooks를 사용하면 됩니다.

useQuery 의 첫번째 인자에는 문자열 혹은 배열값인 queryKey 값을 받게 되어있는데,

해당 queryKey값으로 데이터를 캐싱하게 됩니다.

```tsx
// 다른 키로 취급합니다. 
useQuery(['post', 1], ...)
useQuery(['[pst', 2], ...)
```

```tsx
// 객체 필드의 값이 달라도 다른 키로 취급합니다
useQuery(['post', { new: true }], ...)
useQuery(['post', { new: false }], ...)
```

두번째 인자인 queryFn은 데이터를 패칭할 함수를 값으로 받는데

Promise를 리턴하는 함수를 지정하면 됩니다.

그리고 세번째 인자의 옵션 값으로는 다양한 옵션이 지정 가능합니다.

옵션은 [공식문서](https://react-query.tanstack.com/reference/useQuery)에 자세히 나와있습니다.

## 예제

더미데이터를 받아오는 api를 사용할 수 있는 [JSONPlaceholder](https://jsonplaceholder.typicode.com/)의

post 데이터들을 react-query를 이용해서 가져오는 예제입니다.

[예제코드](https://github.com/KimBiYam/first-react-query)

최상위 컴포넌트인 App.tsx 에서 postId를 state에 저장하고
해당 값으로 포스트를 조회하는 방식으로 구성되어있습니다.

```tsx
import React, { useState } from 'react';
import './App.css';
import { QueryClientProvider, QueryClient } from 'react-query';
import Posts from './components/Posts';
import Post from './components/Post';

const queryClient = new QueryClient();

const App = () => {
  const [postId, setPostId] = useState(-1);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        {postId > -1 ? (
          <Post postId={postId} setPostId={setPostId} />
        ) : (
          <Posts setPostId={setPostId} />
        )}
      </div>  
    </QueryClientProvider>
  );
};

export default App;
```

우선 PostId로 하나의 post를 가져오는 API와 Post전체를 가져오는 API를 useQuery를 이용해서

커스텀 훅으로 생성합니다.

```tsx
export interface Post {
  id: number;
  title: string;
  body: string;
}
```

```tsx
import axios from 'axios';
import { useQuery } from 'react-query';
import { Post } from '../types/Post';

const getPostById = async (id: number): Promise<Post> => {
  const { data } = await axios.get(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
  );
  return data;
};

export const usePost = (postId: number) => {
  return useQuery(['post', postId], () => getPostById(postId), {
    enabled: !!postId,
  });
};
```

```tsx
import axios from 'axios';
import { useQuery } from 'react-query';
import { Post } from '../types/Post';

const getPosts = async (): Promise<Array<Post>> => {
  const { data } = await axios.get(
    'https://jsonplaceholder.typicode.com/posts',
  );
  return data;
};

export const usePosts = () => {
  return useQuery('posts', getPosts);
};
```

usePosts hooks의 useQuery의 queryKey는 posts로 지정 되어있고,

usePost hooks의 useQuery는 ['post', postId]로 지정되어있습니다.

usePost의 배열의 키 값에따라 데이터가 캐싱이 되므로, postId 별로 가져온 데이터를 따로 캐싱할 수 있습니다.

그 후 우선 Post 리스트를 받아와 그려주는 컴포넌트를 작성합니다.

```tsx
import React, { useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { usePosts } from '../hooks/usePosts';

interface Props {
  setPostId: React.Dispatch<React.SetStateAction<number>>;
}

const Posts = ({ setPostId }: Props) => {
  const queryClient = useQueryClient();
  const { status, data, error } = usePosts();

  const renderByStatus = useCallback(() => {
    switch (status) {
      case 'loading':
        return <div>Loading...</div>;
      case 'error':
        if (error instanceof Error) {
          return <span>Error: {error.message}</span>;
        }
        break;
      default:
        return (
          <div>
            {data?.map((post) => (
              <p key={post.id}>
                <a
                  onClick={() => setPostId(post.id)}
                  href="#"
                  style={
                    queryClient.getQueryData(['post', post.id])
                      ? {
                          fontWeight: 'bold',
                          color: 'green',
                        }
                      : {}
                  }
                >
                  {post.title}
                </a>
              </p>
            ))}
          </div>
        );
    }
  }, [status]);

  return (
    <div>
      <h1>Posts</h1>
      {renderByStatus()}
    </div>
  );
};

export default Posts;
```

usePosts의 리턴값으로 useQuery 객체가 리턴되므로, useQuery의 리턴값들을 사용하였는데

그 중 status 값은 데이터 패칭 상태를 불러올 수 있고, data는 해당 데이터 패칭함수 리턴하는 데이터, 

error는 에러 발생 시 에러 값을 리턴받을 수 있습니다.

그리고 데이터 패칭에 성공하면 해당 data를 이용해 map 함수로 리스트를 그려주는데

중간의 style 부분을 보면 queryClient에서 값을 받아오는 부분이 보입니다.

해당되는 데이터가 이미 캐싱되어있다면 폰트와 색상을 다르게 지정합니다.

App.tsx의 postId state가 -1 이상이면 postId로 post 데이터를 요청해서 그려주는

Post 컴포넌트를 렌더링 하게 되어있으므로 해당 컴포넌트도 작성합니다.

```tsx
import React, { useCallback } from 'react';
import { usePost } from '../hooks/usePost';

interface Props {
  postId: number;
  setPostId: React.Dispatch<React.SetStateAction<number>>;
}
const Post = ({ postId, setPostId }: Props) => {
  const { status, data, error, isFetching } = usePost(postId);

  const renderByStatus = useCallback(() => {
    switch (status) {
      case 'loading':
        return <div>Loading...</div>;
      case 'error':
        if (error instanceof Error) {
          return <span>Error: {error.message}</span>;
        }
        break;
      default:
        return (
          <>
            <h1>{data?.title}</h1>
            <div>
              <p>{data?.body}</p>
            </div>
            {isFetching && <div>Background Updating...</div>}
          </>
        );
    }
  }, [status, isFetching]);

  return (
    <div>
      <a onClick={() => setPostId(-1)} href="#">
        Back
      </a>
      {renderByStatus()}
    </div>
  );
};

export default Post;
```

그 후 정상적으로 포스트 리스트가 받아와지는 걸 확인할 수 있습니다.

![](/images/posts/react/usage-react-query_2.png)

해당 페이지에서 아무 포스트나 클릭하면 postId state가 바뀌면서 Post 컴포넌트를 렌더링 하게됩니다.

처음 해당 페이지로 들어가면 로딩 시 로딩 글자가 나오게끔 처리해서 로딩중 텍스트가 나오고

데이터 패칭이 성공하면 정상적으로 렌더링 되는 것을 볼 수 있습니다.

![](/images/posts/react/usage-react-query_3.gif)

그 후 상단의 back 버튼으로 원래 페이지로 돌아오게되면

해당 postId는 캐싱된 데이터가 있으므로, 위에서 적용한 style이 입혀지게됩니다.

![](/images/posts/react/usage-react-query_4.png)

그리고 다시 해당 페이지로 들어가면 이미 해당 postId에 해당하는 데이터가 캐싱되어있어

로딩 페이지 없이 이미 캐싱된 데이터를 그대로 보여주게 됩니다.

![](/images/posts/react/usage-react-query_5.gif)
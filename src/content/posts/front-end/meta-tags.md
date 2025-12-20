---
title: 'meta tag 정리'
date: '2022-01-16'
tag: 'front-end'
---

### 메타태그(meta tag) 란?

HTML 문서에 대한 정보인 `메타데이터(metadata)`를 정의할 때 사용한다. 작성자, 키워드 목록과 같은 `HTML 문서의 속성`을 설명하거나 하는 등의 역할을 한다. 기본적으로 메타 태그는 `문서의 실제 모양에 영향을 미치지 않는다`. 따라서, 메타 태그가 작성되지 않는다고 하더라도 문서에는 아무런 지장이 없다.

그럼에도 사용하는 이유는 검색 엔진 최적화 혹은 해당 문서의 컨텐츠 설명 등을 잘 나타내기 위해서이다.

### 메타태그 사용방법

HTML 문서의 `<head>` 태그 내부에 위치하면 된다.

`예시`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="페이지 설명입니다." />
    <title>Document</title>
  </head>
  <body></body>
</html>
```

### 대표적인 메타태그들

- `charset` : HTML 문서의 문자 인코딩 방식을 명시함. 유니코드 지원을 위해서 UTF-8이 가장 많이 사용됨.
- `http-equiv` : 컨텐츠 속성의 정보 / 값에 대한 HTTP 헤더를 제공.
- `viewport` : 브라우저가 웹 페이지를 렌더링 할 때 동작하는 방법을 알려주고 뷰포트의 크기를 정의할 수 있다. 모바일 기기 화면에서의 최적화를 위해 사용
- `description` : HTML 문서의 설명을 나타냄. `<head>` 태그 내부의 `<title>` 태그와 같이 검색 엔진에서 검색 시 해당 내용이 나타나게 된다.

![](/images/posts/front-end/meta-tags_1.png)

이외에도 다양한 메타태그들이 존재하며 필요에 따라 지정해 주면 된다.

---

## OG (Open Graph) 태그

오픈그래프는 기존의 메타태그와 달리 SNS 등에 게시할 때 최적화된 데이터 내용을 정의하는 데 사용하는 태그이다. 일반적으로 카카오톡, 페이스북 등의 SNS로 웹 사이트 URL을 공유할 때 미리 보기로 나오는 내용을 볼 수 있는데 해당 부분에 대한 내용을 정의를 하는데 사용한다.

### OG 태그 작성 예시

```html
<meta property="og:type" content="website">
<meta property="og:url" content="{웹 사이트 URL}">
<meta property="og:title" content="{타이틀}">
<meta property="og:image" content="{미리보기에서 보여질 이미지 URL}">
<meta property="og:description" content="{해당 페이지의 설명}">
<meta property="og:site_name" content="{사이트 명}">
<meta property="og:locale" content="{지역}">
<!-- 이미지 크기이며 지정하지 않아도 무방 -->
<!-- 최적의 이미지 크기는 1,200x630 이상이라고 한다. -->
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
```

### Twitter Cards

트위터는 og 태그와 유사한 twitter 태그를 사용한다.

```html
<meta name="twitter:title" content="{타이틀}">
<meta name="twitter:description" content="{해당 페이지의 설명}">
<meta name="twitter:image" content="{미리보기에서 보여질 이미지 URL}">
<meta name="twitter:card" content="{트위터 카드 타입}">
<!-- 트위터 카드 타입은 summary_large_image, summary, photo 셋 중 하나를 지정해야 한다. -->
```

사실상 `twitter:card` 값 외에는 og 태그와 동일한 내용이 중복되는데,
트위터에서는 og 태그도 허용되어서 og 태그를 작성 후 `twitter:card` 값만 지정해 주어도 무방하다고 한다.

### 페이지 공유 테스트

아래의 링크에서 공유 미리보기를 테스트 해볼 수 있다.

- [페이스북](https://developers.facebook.com/tools/debug/)

![](/images/posts/front-end/meta-tags_2.png)

- 트위터는 [Card validator 페이지](https://cards-dev.twitter.com/validator)에서 테스트를 해볼 수 있었지만, 최근에 삭제 되었다고 한다.
    
    관련 링크 - [Card Validator - preview removal](https://twittercommunity.com/t/card-validator-preview-removal/175006)

- 카카오톡은 [OG 기반 스크랩 api](https://developers.kakao.com/docs/latest/ko/kakaostory/rest-api#scrape-page)를 제공하는데 JSON 형식으로 데이터만 주는 식이라 그냥 직접 톡을 보내보았다.

![](/images/posts/front-end/meta-tags_3.png)
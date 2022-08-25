---
title: '[모던 JS Deep Dive] DOM - 요소 노드 취득'
date: '2022-08-25'
tag: 'javascript'
---

HTML의 구조나 내용 또는 스타일 등을 동적으로 조작하려면 먼저 요소 노드를 취득해야 한다. 텍스트 노드는 요소 노드의 자식 노드이고, 어트리뷰트 노드는 요소 노드와 연결되어 있기 때문에 텍스트 노드나 어트리뷰트 노드를 조작하고자 할 때도 마찬가지다.

예를 들어, HTML 문서 내의 h1 요소의 텍스트를 변경하고 싶은 경우에는 먼저 DOM 트리 내에 존재하는 h1 요소 노드를 취득할 필요가 있다. 그리고 취득한 요소 노드의 자식 노드인 텍스트 노드를 변경하면 해당 h1 요소의 텍스트가 변경된다.

이처럼 요소 노드의 취득은 HTML 요소를 조작하는 시작점이다. 이를 위해 DOM은 요소 노드를 취득할 수 있는 다양한 메서드를 제공한다.

### id를 이용한 요소 노드 취득

`Document.prototype.getElementById` 메서드는 인수로 전달한 id 값을 갖는 하나의 요소 노드를 탐색하여 반환한다. `getElementById` 메서드는 `Document.prototype`의 프로퍼티이기 때문에, `document`를 통해 호출해야 한다.

```jsx
const $elem = document.getElementById('banana');
```

id 값은 HTML 문서 내에서 유일한 값이어야 하며, class 어트리뷰트와는 달리 공백 문자로 구분하여 여러 개의 값을 가질 수 없다. 단, HTML 문서 내에 중복된 id 값을 갖는 HTML 요소가 여러 개 존재하더라도 어떠한 에러도 발생하지 않는다.

이러한 경우 인수로 전달된 id 값을 갖는 첫 번째 요소 노드만 반환한다.

### 태그 이름을 이용한 요소 노드 취득

`Document.prototype/Element.prototype.getElementsByTagName` 메서드는 인수로 전달한 태그 이름을 갖는 모드 요소 노드들을 탐색하여 반환한다. `getElementsByTagName` 메서드는 여러 개의 요소 노드 객체를 갖는 DOM 컬렉션 객체인 `HTMLCollection` 객체를 반환한다.

```jsx
const $elems = document.getElementsByTagName('li');
```

`HTMLCollection` 객체는 유사 배열 객체이면서 이터러블이다.

HTML 문서의 모든 요소 노드를 취득하려면 `getElementsByTagName` 메서드의 인수로 `*`를 전달한다.

```jsx
// 모든 요소 노드를 탐색하여 반환한다.
const $all = document.getElementsByTagName('*');
```

`Document.prototype.getElementsByTagName` 메서드는 DOM 전체에서 요소 노드를 탐색하여 반환한다.
하지만 `Element.prototype.getElementsByTagName` 메서드는 특정 요소 노드의 자손 노드 중에서 요소 노드를 탐색하여 반환한다.

만약 인수로 전달된 태그 이름을 갖는 요소가 존재하지 않는 경우 빈 `HTMLCollection` 객체를 반환한다.

### class를 이용한 요소 노드 취득

`Document.prototype/Element.prototype.getElementsByClassName` 메서드는 인수로 전달한 class 어트리뷰트 값을 갖는 모든 요소 노드들을 탐색하여 반환한다. 인수로 전달한 class 값은 공백으로 구분하여 여러 개의 class를 지정할 수 있다. `getElementsByTagName` 메서드와 마찬가지로 여러 개의 요소 노드 객체를 갖는 DOM 컬렉션 객체인 `HTMLCollection` 객체를 반환한다.

```jsx
const $elems = document.getElementsByClassName('fruit');
// 여러개의 class를 지정
const $apples = document.getElementsByClsssName('fruit apple');
```

`getElementsByTagName` 메서드와 마찬가지로 `Document.prototype.getElementsByClassName` 메서드는 DOM 전체에서 요소 노드를 탐색하여 반환하고 `Element.prototype.getElementsByClassName` 메서드는 특정 요소 노드의 자손 노드 중에서 요소 노드를 탐색하여 반환한다.

만약 인수로 전달된 class 값을 갖는 요소가 존재하지 않는 경우 빈 `HTMLCollection` 객체를 반환한다.

### CSS 선택자를 이용한 요소 노드 취득

CSS 선택자는 스타일을 적용하고자 하는 HTML 요소를 특정할 때 사용하는 문법이다.

`Document.prototype/Element.prototype.querySelector` 메서드는 인수로 전달한 CSS 선택자를 만족시키는 하나의 요소 노드를 탐색하여 반환한다.

- 인수로 전달한 CSS 선택자를 만족시키는 요소 노드가 여러 개인 경우 `첫 번째 요소 노드`만 반환한다.
- 인수로 전달한 CSS 선택자를 만족시키는 요소 노드가 존재하지 않는 경우 `null`을 반환한다.
- 인수로 전달한 CSS 선택자가 문법에 맞지 않는 경우 `DOMException` 에러가 발생한다.

```jsx
// class 어트리뷰트 값이 'banana'인 첫 번째 요소 노드를 탐색하여 반환한다.
const $elem = document.querySelector('.banana');
```

`Document.prototype/Element.prototype.querySelectorAll` 메서드는 인수로 전달한 CSS 선택자를 만족시키는 모든 요소 노드를 탐색하여 반환한다. `querySelectorAll` 메서드는 여러 개의 요소 노드 객체를 갖는 DOM 컬렉션 객체인 `NodeList` 객체를 반환한다. `NodeList` 객체는 유사 배열 객체이면서 이터러블이다.

- 인수로 전달된 CSS 선택자를 만족시키는 요소가 존재하지 않는 경우 빈 `NodeLIst` 객체를 반환한다.
- 인수로 전달한 CSS 선택자가 문법에 맞지 않는 경우 `DOMException` 에러가 발생한다.

```jsx
// ul 요소의 자식 요소인 li 요소를 모두 탐색하여 반환한다.
const $elems = document.querySelectorAll('ul > li');
console.log($elems); // NodeList(...
```

`getElementsByTagName, getElementsByClassName` 메서드와 마찬가지로 `Document.prototype`에 정의된 메서드는 DOM 전체에서 요소 노드를 탐색하여 반환한다. `Element.prototype`에 정의된 메서드는 특정 요소 노드의 자손 노드 중에서 요소 노드를 탐색하여 반환한다.

CSS 선택자 문법을 사용하는 `querySelector, querySelectorAll` 메서드는 `getElement***` 메서드보다 다소 느린 것으로 알려져 있다. 하지만 CSS 선택자 문법을 사용하여 좀 더 구체적인 조건으로 요소 노드를 취득할 수 있고 일관된 방식으로 요소 노드를 취득할 수 있다는 장점이 있다.

따라서 id 어트리뷰트가 있는 요소 노드를 취득하는 경우에는 `getElementById` 메서드를 사용하고 그 이외의 경우에는 `querySelector, querySelectorAll` 메서드를 사용하는 것을 권장한다.

### 특정 요소 노드를 취득할 수 있는지 확인

`Element.prototype.match` 메서드는 인수로 전달한 CSS 선택자를 통해 특정 요소 노드를 취득할 수 있는지 확인한다.

```jsx
const $apple = document.querySelector('.apple');

// $apple 노드를 해당 CSS 선택자로 취득할 수 있으면 true를 반환
console.log($apple.matches('#fruits > li.apple'));

// $apple 노드를 해당 CSS 선택자로 취득할 수 없으면 false를 반환
console.log($apple.matches('#fruits > li.banana'));
```

`Element.prototype.matches` 메서드는 이벤트 위임을 사용할 때 유용하다.

---

## HTMLCollection과 NodeList

DOM 컬렉션 객체인 `HTMLCollection`과 `NodeList`는 DOM API가 여러 개의 결과값을 반환하기 위한 DOM 컬렉션 객체다. 둘 다 유사 배열 객체이면서 이터러블이기 때문에, `for … of` 문으로 순회할 수 있으며 `스프레드 문법`을 사용하여 배열로 변환할 수 있다.

`HTMLCollection`과 `NodeList`의 중요한 특징은 노드 객체의 상태 변화를 실시간으로 반영하는 `살아 있는(live) 객체`라는 것이다. `HTMLCollection`은 언제나 `live 객체`로 동작한다. `NodeLIst`는 대부분의 경우 `non-live 객체`로 동작하지만 경우에 따라 `live 객체`로 동작할 때가 있다.

### HTMLCollection

`getElementsByTagName, getElementsByClassName` 메서드가 반환하는 `HTMLCollection` 객체는 노드 객체의 상태 변화를 실시간으로 반영하는 `살아 있는(live) DOM 컬렉션 객체`다.

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      .red {
        color: red;
      }
      .blue {
        color: blue;
      }
    </style>
  </head>
  <body>
    <ul id="fruits">
      <li class="red">Apple</li>
      <li class="red">Banana</li>
      <li class="red">Orange</li>
    </ul>
  </body>
  <script>
    // class 값이 'red'인 요소 노드를 모두 탐색하여 HTMLCollection 객체아 담아 반환한다.
    const $elems = document.getElementsByClassName("red");
    // 이 시점에 HTMLCollection 객체에는 3개의 요소 노드가 담겨 있다.
    console.log($elems); // HTMLCollection(3) [li.red, li.red, li.red]

    // HTMLCollection 객체의 모든 요소의 class 값을 'blue'로 변경한다.
    for (let i = 0; i < $elems.length; i++) {
      $elems[i].className = "blue";
    }

    // HTMLCollection 객체의 요소가 3개에서 1개로 변경되었다.
    console.log($elems); // HTMLCollection(1) [li.red]
  </script>
</html>
```

위 예제는 `getElementsByClassName` 메서드로 class 값이 `red`인 요소 노드를 모두 취득하고, for 문으로 순회하며 모든 요소의 class 값을 `red`에서 `blue`로 변경한다.

위 예제가 실행되면 모든 li 요소의 class 값이 `blue`로 변경되어 모든 li 요소는 CSS에 의해 파란색으로 렌더링될 것이다. 하지만 위 예제를 실행해 보면 다음 그림처럼 두 번째 li 요소만 class 값이 변경되지 않는다.

![Untitled](/images/posts/javascript/dom-get-element-node_1.png)

위 예제가 예상대로 동작하지 않은 이유는 아래와 같다.

1. `첫 번째 반복(i === 0)`
    
    첫 번째 eli 요소인 `$elems[0]`의 class 값이 `red`에서 `blue`로 변경된다. `HTMLCollection` 객체는 live DOM 컬렉션 객치이기 때문에, `$elems`에서 해당 요소가 실시간으로 제거된다.
    
2. `두 번째 반복(i === 1)`
    
    첫 번째 반복에서 `$elems`의 첫 번째 li가 제거되었다. 따라서 `$elems[1]`은 세 번째 li 요소다. 이 세 번째 li 요소의 class 값도 `blue`로 변경되고 `$elems`에서 실시간으로 제거된다.
    
3. `세 번째 반복(i === 2)`
    
    첫 번째, 두 번째 반복에서 첫 번째, 세 번째 li 요소가 `$elems`에서 제거되었다. 따라서 `$elems`에는 `두 번째 li 요소 노드`만 남았다. 이때 `$elems.length`는 1이므로 for 문 조건식에 의해서 반복이 종료된다. 따라서 `$elems`에 남아 있는 두 번째 li 요소의 class 값은 변경되지 않는다.
    

이처럼 `HTMLCollection` 객체는 실시간으로 노드 객체의 상태 변경을 반영하여 요소를 제거할 수 있기 때문에 for 문으로 순회하면서 노드 객체의 상태를 변경해야 할 때 주의해야 한다.

이 문제는 for 문을 역방향으로 순회하는 방법으로 회피할 수 있다.

```jsx
// for 문을 역방향으로 순회
for (let i = $elems.length -1; i >= 0; i--) {
	$elems[i].className = 'blue';
}
```

또는 while 문을 사용하여 `HTMLCollection` 객체에 노드 객체가 남아 있지 않을 떄까지 무한 반복하는 방법도 있다.

```jsx
// while 문으로 HTMLCollection에 요소가 남아 있지 않을 때까지 무한 반복
let i = 0;
while ($elems.length > i) {
	$elems[i].className = 'blue';
}
```

더 간단한 해결책은 부작용을 발생시키는 원인인 `HTMLCollection` 객체를 사용하지 않고, 배열로 변환하여 사용하는 것이다.

```jsx
// 유사 배열 객체이면서 이터러블인 HTMLCollection을 배열로 변환하여 순회
[...$elems].forEach(elem => elem.className = 'blue');
```

### NodeList

`HTMLCollection` 객체의 부작용을 해결하기 위해 `getElementsByTagName, getElementsByClassName` 메서드 대신 `querySelectorAll` 메서드를 사용하는 방법도 있다. `querySelectorAll` 메서드는 DOM 컬렉션 객체인 `NodeList` 객체를 반환한다. 이때 `NodeList` 객체는 실시간으로 노드 객체의 상태 변경을 반영하지 않는 `non-live` 객체다.

```jsx
// querySelectorAll은 DOM 컬렉션 객체인 NodeList를 반환한다.
const $elems = document.querySelectorAll('red');

// NodeList 객체는 NodeList.prototype.forEach 메서드를 상속받아 사용할 수 있다.
$elems.forEach(elem => elem.className = 'blue');
```

`NodeList` 객체는 대부분의 경우 노드 객체의 상태 변경을 실시간으로 반영하지 않는 `non-live` 객체로 동작한다. 하지만 `childNodes` 프로퍼티가 반환하는 `NodeList` 객체는 `HTMLCollection` 객체와 같이 live 객체로 동작하므로 주의가 필요하다.

```jsx
<!DOCTYPE html>
<html>
  <body>
    <ul id="fruits">
      <li class="red">Apple</li>
      <li class="red">Banana</li>
    </ul>
  </body>
  <script>
    const $fruits = document.getElementById("fruits");

    // childNodes 프로퍼티는 NodeList 객체(live)를 반환한다.
    const { childNodes } = $fruits;

    // $fruits 요소의 자식 노드는 공백 텍스트 노드를 포함해 모두 5개다.
    console.log(childNodes); // NodeList(5) [text, li, text, li, text]

    for (let i = 0; i < childNodes.length; i++) {
      // removeChild 메서드는 $fruits 요소의 자식 노드를 DOM에서 삭제한다.
      // removeChild 메서드가 호출될 때마다 NodeList 객체인 childNodes가 실시간으로 변경된다.
      // 따라서 첫 번째, 세 번째, 다섯 번째 요소만 삭제된다.
      $fruits.removeChild(childNodes[i]);
    }

    // 예상과 다르게 $fruits 요ㅕ소의 모든 자식 노드가 삭제되지 않는다.
    console.log(childNodes); // NodeList(2) [li, li]
  </script>
</html>
```

이처럼 `HTMLCollection`이나 `NodeList` 객체는 예상과 다르게 동작할 때가 있다. 따라서 노드 객체의 상태 변경과 상관 없이 안전하게 DOM 컬렉션을 사용하려면 `HTMLCollection`이나 `NodeList` 객체를 배열로 변환하여 사용하는 것이 권장된다.

```html
<!DOCTYPE html>
<html>
  <body>
    <ul id="fruits">
      <li class="red">Apple</li>
      <li class="red">Banana</li>
    </ul>
  </body>
  <script>
    const $fruits = document.getElementById("fruits");

    // childNodes 프로퍼티는 NodeList 객체(live)를 반환한다.
    const { childNodes } = $fruits;

    // 스프레드 문법을 사용하여 NodeList 객체를 배열로 변환한다.
    [...childNodes].forEach((childNode) => {
      $fruits.removeChild(childNode);
    });

    // $fruits 요소의 모든 자식 노드가 삭제되었다.
    console.log(childNodes); // NodeList []
  </script>
</html>
```
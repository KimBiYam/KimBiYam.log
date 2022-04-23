---
title: '[모던 JS Deep Dive] 자바스크립트의 변수 키워드 및 스코프와 호이스팅'
date: '2022-04-20'
tag: 'javascript'
---

## var 키워드


ES6 이전의 유일한 변수 선언 키워드인 `var` 키워드로 선언한 변수는 아래의 예시처럼 몇 가지 문제점을
가지고 있다.

### 변수 중복 선언 허용

`var` 키워드로 선언한 변수는 중복 선언이 가능하다.

```jsx
var x = 1;
var y = 1;

// var 키워드로 선언된 변수는 같은 스코프 내에서 중복 선언을 허용한다.
var x = 100;
// 초기화문이 있는 변수 선언문은 자바스크립트 엔진에 의해 var 키워드가 없는 것처럼 동작한다.
var y;

console.log(x); // 100
console.log(y); // 1
```

### 함수 레벨 스코프

C나 자바 등 대부분의 프로그래밍 언어는 `모든 코드 블록(if, for, while, try/catch 등)`이 지역 스코프를 만든다. 이러한 특성을 `블록 레벨 스코프(block level scope)`라고 한다.

하지만 자바스크립트에서 `var` 키워드로 선언된 변수는 **오로지 함수의 코드 블록만을 지역 스코프로 인정한다.**
이러한 특성을`함수 레벨 스코프(function level scope)`라고 한다.

```jsx
var x = 1;

if (true) {
 var x = 10;
}

// 전역 변수 x의 값인 1이 출력되지 않는다.
console.log(x); // 10
```

```jsx
var i = 10;

// 이미 선언된 전역 변수 i를 덮어쓰게 된다.
for (var i = 0; i < 5; i++) {
	console.log(i); // 0 1 2 3 4
}

// for 문에 의해 변수의 값이 변경되었다.
console.log(i); //5
```

`블록 레벨 스코프`를 지원하는 언어에서는 for 문에서 반복을 위해 선언된 변수인 `i`는 for 문의 코드 블록
내에서만 유효한 지역 번수다. 하지만 자바스크립트의 `var` 키워드로 선언된 변수는 `함수 레벨 스코프`만
적용되기 때문에 for 문의 `i` 변수는 전역 변수가 된다.

### 변수 호이스팅

`var` 키워드로 변수를 선언하면 `변수 호이스팅`에 의해 변수 선언문이 스코프의 최상단으로 끌어 올려진 것처럼 동작한다. 즉, 변수 호이스팅에 의해 `var` 키워드로 선언한 변수는 `변수 선언문 이전에 참조`할 수 있다. 단, 할당문 이전에 변수를 참조하면 언제나 `undefined`를 반환한다.

```jsx
// 이 시점에는 변수 호이스팅에 의해 이미 foo 변수가 선언되었다(1. 선언 단계)
// 변수 foo는 undefined로 초기화된다(2. 초기화 단계)
console.log(foo); // undefined

// 변수에 값을 할당(3. 할당 단계)
foo = 123;

console.log(foo); // 123

// 변수 선언은 런타임 이전에 자바스크립트 엔진에 의해 암묵적으로 실행된다.
var foo;
```

변수 호이스팅에 의해서 변수 선언문 이전에 변수를 참조하는 것이 에러를 발생시키지는 않지만,
가독성을 떨어트리고 오류를 발생시킬 확률이 높아지게 된다.

이러한 문제점들을 해결하기 위해서 `ES6`에서 `let, const` 키워드가 추가되었다.

## let 키워드

위와 같은 `var` 키워드의 단점을 보완하기 위해 `ES6`에서 새로 추가된 변수 선언 키워드이다.
`var` 키워드와 비교하면 아래와 같다.

### 변수 중복 선언 금지

`var` 키워드와 달리 `let` 키워드에서는 변수 중복 선언 시 `문법 에러(SyntaxError)`가 발생한다.

```jsx
var foo = 123;
// var 키워드로 선언된 변수는 같은 스코프 내에서 중복 선언을 허용한다.
var foo = 456;

let bar = 123;
// let이나 const 키워드로 선언된 변수는 같은 스코프 내에서 중복 선언을 허용하지 않는다.
let bar = 456; // Uncaught SyntaxError: Identifier 'bar' has already been declared

```

### 블록 레벨 스코프

`var` 키워드는 위에서 살펴봤듯이 `함수 레벨 스코프`를 따르지만, `let` 키워드로 선언한 변수는 `모든 코드 블록(함수, if 문, for 문, while 문, try/catch 문 등)`을 지역스코프로 인정하는 `블록 레벨 스코프`를 따른다.

```jsx
let foo = 1; // 전역 변수

{
	let foo = 2; // 지역 변수
	let bar = 3; // 지역 변수
}

console.log(foo); // 1
console.log(bar); // Uncaught ReferenceError: bar is not defined
```

### 변수 호이스팅

`var` 키워드로 선언한 변수와 달리 `let` 키워드로 선언한 변수는 변수 호이스팅이 발생하지 않는 것처럼
동작한다.

```jsx
console.log(foo); // ReferenceError: foo is not defined
let foo;
```

`var` 키워드로 변수를 선언하면 런타임 이전에 자바스크립트 엔진에 의해 암묵적으로 **선언 단계**와 **초기화 단계**가 `한 번에 진행`된다.
`let` 키워드로 변수를 선언하면 **선언 단계**와 **초기화 단계**가 분리되어 진행된다. 즉, 런타임 이전에 자바스크립트 엔진에 의해 암묵적으로 선언 단계가 먼저 실행되지만 초기화 단계는 변수 선언문에 도달했을 때 실행된다.

`let` 키워드에서 스코프의 시작 지점부터 초기화 시작 지점까지 변수를 참조할 수 없는 구간을 `일시적 사각지대 (Temporal Dead Zone: TDZ)`라고 부른다.

```jsx
// 초기화 이전의 일시적 사각지대에서는 변수를 참조할 수 없다.
console.log(foo); // ReferenceError: foo is not defined

let foo; // 변수 선언문에서 초기화 단계가 실행된다.
console.log(foo); // undefined

foo = 1;
console.log(foo);
```

![Untitled](%E1%84%8C%E1%85%A1%E1%84%87%E1%85%A1%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%B8%E1%84%90%E1%85%B3%E1%84%8B%E1%85%B4%20%E1%84%87%E1%85%A7%E1%86%AB%E1%84%89%E1%85%AE%20%E1%84%8F%E1%85%B5%E1%84%8B%E1%85%AF%E1%84%83%E1%85%B3%20%E1%84%86%E1%85%B5%E1%86%BE%20%E1%84%89%E1%85%B3%E1%84%8F%E1%85%A9%E1%84%91%E1%85%B3%E1%84%8B%E1%85%AA%20%E1%84%92%E1%85%A9%E1%84%8B%E1%85%B5%E1%84%89%E1%85%B3%E1%84%90%E1%85%B5%205fc1161d03f444ebb474fca4e5f21579/Untitled.png)

`let` 키워드로 선언한 변수는 `변수 호이스팅`이 발생하지 않는 것처럼 보인다. 하지만 그렇지 않다.

```jsx
let foo = 1; // 전역 변수

{
	console.log(foo); // ReferenceError: Cannot access 'foo' before initialization
	let foo = 2; // 지역변수
}
```

위의 예시에서 `변수 호이스팅`이 발생하지 않는다면 위 예제는 전역 변수 `foo`의 값을 출력해야 한다.
하지만 `let` 키워드로 선언한 변수도 `변수 호이스팅`이 발생하기 때문에 `참조 에러(ReferenceError)`가
발생한다.

### 전역 객체와 let

`var` 키워드로 선언한 변수와 함수는 `전역 객체(window)`의 프로퍼티가 된다.
하지만 `let` 키워드로 선언한 전역 변수는 전역 개체의 프로퍼티가 아니다.

```jsx
// Node.js가 아닌 브라우저 환경에서 실행해야 한다.

// 전역 변수
var x = 1;
// 암묵적 전역
y = 2;
// 전역 함수
function foo() {}

// var 키워드로 선언한 전역 변수는 전역 객체 window의 프로퍼티다.
console.log(window.x); // 1
// 전역 객체 window의 프로퍼티는 전역 변수처럼 사용할 수 있다.
console.log(x); // 1

// 암묵적 전역은 전역 객체 window의 프로퍼티다.
console.log(window.y); // 2
console.log(y); // 2

// 함수 선언문으로 정의한 전역 함수는 전역 객체 window의 프로퍼티다.
console.log(window.foo); // ƒ foo() {}
// 전역 객체 window의 프로퍼티는 전역 변수처럼 사용할 수 있다.
console.log(foo); // ƒ foo() {}
```

```jsx
// Node.js가 아닌 브라우저 환경에서 실행해야 한다.
let x = 1;

// let, const 키워드로 선언한 전역 변수는 전역 객체 window의 프로퍼티가 아니다.
console.log(window.x); // undefined
console.log(x); // 1
```

## const 키워드

`const` 키워드는 상수를 선언하기 위해 사용한다. `const` 키워드의 특징은 `let` 키워드와 대부분 동일하며,
아래의 차이점들이 존재한다.

### 선언과 초기화

`const` 키워드로 선언한 변수는 반드시 선언과 동시에 초기화해야 한다.

```jsx
const foo = 1;
const bar; // SyntaxError: Missing initializer in const declaration
```

`const` 키워드로 선언한 변수는 `let` 키워드로 선언한 변수와 마찬가지로 `블록 레벨 스코프`를 가지며, 변수
호이스팅이 발생하지 않는 것처럼 동작한다.

```jsx
{
	// 변수 호이스팅이 발생하지 않는 것처럼 동작한다
	console.log(foo); // ReferenceError: Cannot access 'foo' before initialization
	const foo = 1;
	console.log(foo); // 1
}

// 블록 레벨 스코프를 갖는다.
console.log(foo); // ReferenceError: foo is not defined
```

### 재할당 금지

`var` 또는 `let` 키워드와 달리 `const` 키워드로 선언한 변수는 재할당이 금지된다.

```jsx
const foo = 1;
foo = 2; // TypeError: Assignment to constant variable.
```

### 상수

`const` 키워드로 선언한 변수에 원시 값을 할당한 경우 변수 값은 `변경이 불가능한 값(immutable value)`이기 떄문에  이 특성을 이용해서 상수로 사용할 수 있다.

**상수 미사용**

```jsx
// 세전 가격
let preTaxPrice = 100;

// 세후 가격
// 0.1의 이미를 명확히 알기 어렵기 때문에 가독성이 좋지 않다.
let afterTaxPrice = preTaxPrice + (preTaxPrice * 0.1);

console.log(afterTaxPrice); // 110
```

**상수 사용**

```jsx
// 세율을 의미하는 0.1은 변경할 수 없는 상수로서 사용된다.
const TAX_RATE = 0.1;

// 세전 가격
let preTaxPrice = 100;

// 세후 가격
let afterTaxPrice = preTaxPrice + (preTaxPrice * TAX_RATE);

console.log(afterTaxPrice); // 110
```

### const 키워드와 객체

`const` 키워드로 선언된 변수에 `원시 값`을 할당한 경우에는 `값을 변경할 수 없지만`, `객체`를 할당한 경우 `값을 변경할 수 있다.`

```jsx
const person = {
	name: 'Lee'
};

// 객체는 벽경 가능한 값이다.
person.name = 'Kim';

console.log(person); // {name: 'Kim'}
```

## 함수의 생성시점과 호이스팅

함수 선언 방식에는 `함수 표현식`과 `함수 선언문`이 있다. 

`함수 표현식`에서는 위에서 살펴본 변수와 동일하게 호이스팅이 발생한다. 하지만 아래의 예시에서 볼 수 있는
것처럼 `함수 선언문`으로 정의한 함수는 다르게 동작한다.

```jsx
// 함수 참조
console.dir(add); // ƒ add(x, y)
console.dir(sub); // undefined

// 함수 호출
console.log(add(2,5)); // 7
console.log(sub(2,5)); // TypeError: sub is not a function

// 함수 선언문
function add(x, y) {
	return x + y;
}

// 함수 표현식
var sub = function (x, y) {
	return x - y;
};
```

`함수 표현식`으로 선언한 함수는 변수와 마찬가지로 `호이스팅`이 일어나지만 함수에 함수 객체가 할당되기 이전에 `undefined`로 초기화 되어서 호출할 수 없는 상태가 된다.

`함수 선언문`으로 선언한 함수는 이와 다르게 자바스크립트 엔진에 의해서 `런타임 이전`에 함수 객체가 먼저 생성된다. 이러한 차이 때문에 선언문 이전에 함수 호출이 가능하다.

`let 키워드`로 선언 시에는 변수와 마찬가지로 `일시적 사각지대`가 존재하기 때문에 함수에 함수 객체가 할당되기 이전에 해당 함수룰 참조할 수 없다.

```jsx
console.dir(foo); // ReferenceError: foo is not defined

let foo = (x, y) => x - y;
```

 

## 렉시컬 스코프

```jsx
var x = 1;

function foo() {
	var x = 10;
	bar();
}

function bar() {
	console.log(x);
}

foo(); // ?
bar(); // ?
```

위 예제의 실행 결과는 bar 함수의 상위 스코프가 무엇인지에 따라 결정된다.

1. **함수를 어디서 호출**했는지에 따라 함수의 상위 스코프를 결정한다.
2. **함수를 어디서 정의**했는지에 따라 함수의 상위 스코프를 결정한다.

첫 번쨰 방식으로 상위 스코프를 결정하면 bar 함수의 상위 스코프는 `foo 함수의 지역 스코프와 전역 스코프`이고, 두 번째 방식으로 상위 스코프를 결정하면 bar 함수의 상위 스코프는 `전역 스코프`일 것이다.

프로그래밍 언어는 일반적으로 이 두 가지 방식 중 한 가지 방식으로 함수의 상위 스코프를 결정한다.

첫 번째 방식을 `동적 스코프(dynamic scope)`라 하고, 두 번째 방식을 `렉시컬 스코프(lexical scope)` 또는 `정적 스코프(static scope)`라 한다.

자바스크립트는 `렉시컬 스코프`를 따르므로 함수를 어디서 호출했는지가 아니라 `함수를 어디서 정의했는지`에 따라 상위 스코프를 결정한다.

따라서 위 예제는 전역 변수 x의 값 1을 두 번 출력한다.
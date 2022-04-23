---
title: '[모던 JS Deep Dive] JavaScript에서의 this'
date: '2022-04-24'
tag: 'javascript'
---

## 개요

`this`는 자신이 속한 객체 또는 자신이 생성할 인스턴스를 가리키는 `자기 참조 변수(self-referencing variable)`이다. `this`를 통해 자신이 속한 객체 또는 자신이 생성할 인스턴스의 프로퍼티나 메서드를 참조할 수 있다.

this는 자바스크립트 엔진에 의해 암묵적으로 생성되며, 코드 어디서든 참조할 수 있다. 함수를 호출하면 `arguments` 객체와 `this`가 암묵적으로 함수 내부에 전달된다.

## this 바인딩

자바나 C++ 같은 클래스 기반 언어에서 this는 언제나 클래스가 생성하는 인스턴스를 가리킨다.
하지만 자바스크립트에서의 `this`는 `함수가 호출되는 방식에 따라` this 바인딩이 `동적으로` 결정된다.

**객체 리터럴**

```jsx
const circle = {
	radius: 5,
	getDimeter() {
		// this는 메서드를 호출한 객체를 가리킨다.
		return 2 * this.radius;
	}
};

console.log(circle.getDiameter()); // 10
```

객체 리터럴의 메서드 내부에서의 `this`는 메서드를 호출한 객체, 즉 `circle`을 가리킨다.

**생성자 함수**

```jsx
function Circle(radius) {
	// this는 생성자 함수가 생성할 인스턴스를 가리킨다.
	this.radius = radius;
}

Circle.prototype.getDiameter = function () {
	// this는 생성자 함수가 생성할 인스턴스를 가리킨다.
	return 2 * this.radius;
}

// 인스턴스 생성
const circle = new Circle(5);
console.log(circle.getDiamter()); //10
```

생성자 함수 내부의 `this`는 생성자 함수가 생성할 인스턴스를 가리킨다.

이처럼 자바스크립트에서의 this는 `상황에 따라 가리키는 대상이 다르다.`

또한 this는 코드 어디에서든 참조가 가능하다.

```jsx
// 전역에서 this는 전역 객체 window를 가리킨다.
console.log(this); // window

function square(number) {
	// 일반 함수 내부에서 this는 전역 객체 window를 가리킨다.
	console.log(this); // window
	return number * number;
}
square(2);

const person = {
	name: 'Lee',
	getName() {
		// 메서드 내부에서 this는 메서드를 호출한 객체를 가리킨다.
		console.log(this); // {name: 'Lee', getName: ƒ}
		return this.name;
	}
};
console.log(person.getName()); // Lee

function Person(name) {
	this.name = name;
	// 생성자 함수 내부에서 this는 생성자 함수가 생성할 인스턴스를 가리킨다.
	console.log(this); // Person {name: 'Lee'}
}

const me = new Person('Lee');
```

## 함수 호출 방식과 this 바인딩

this 바인딩(this에 바인딩될 값)은 함수 호출 방식, 즉 함 수가 어떻게 호출되었는지에 따라 동적으로 결정된다.

```jsx
// this 바인딩은 함수 호출 방식에 따라 동적으로 결정된다.
const foo = function () {
	console.dir(this);
};

// 동일한 함수도 다양한 방식으로 호출할 수 있다.

// 1. 일반 함수 호출
// foo 함수를 일반적인 방식으로 호출
// foo 함수 내부의 this는 전역 객체 window를 가리킨다.
foo(); // window

// 2. 메서드 호출
// foo 함수를 프로퍼티 값으로 할당하여 호출
// foo 함수 내부의 this는 메서드를 호출한 객체 obj를 가리킨다.
const obj = { foo };
obj.foo(); // obj

// 3. 생성자 함수 호출 
// foo 함수를 new 연산자와 함께 생성자 함수로 호출
// foo 함수 내부의 this는 생성자 함수가 생성한 인스턴스를 가리킨다.
new foo(); // foo {}

// 4. Function.prototype.apply/call/bind 메서드에 의한 간접 호출
// foo 함수 내부의 this는 인수에 의해 결정된다.
const bar = { name: 'bar' };

foo.call(bar); // bar
foo.apply(bar); // bar
foo.bind(bar)(); // bar
```

### 1) 일반 함수 호출

기본적으로 this에는 전역 객쳬(global object)가 바인딩된다.

```jsx
function foo() {
	console.log("foo's this: ", this); // window
	function bar() {
		console.log("bar's this: ", this); // window
	}
	bar();
}
foo();
```

위 예제처럼 전역 함수나 중첩 함수 모두 `일반 함수로 호출`하면 함수 내부의 `this`에는 `전역 객체가 바인딩`된다.
다만 `this`는 객체의 프로퍼티나 메서드를 참조하기 위한 `자기 참조 변수`이므로 객체를 생성하지 않는 `일반 함수에서 this는 의미가 없다.` 따라서 다음 예제처럼 `strict mode`가 적용된 일반 함수 내부의 `this`에는 `undefined`가 바인딩된다.

```jsx
function foo() {
	'use strict';
	
	console.log("foo's this: ", this); // undefined
	function bar() {
		console.log("bar's this: ", this); // undefined
	}
	bar();
}
foo();
```

메서드 내에서 정의한 중첩 함수도 일반 함수로 호출되면 중첩 함수 내부의 this에는 전역 객체가 바인딩된다.

```jsx
// var 키워드로 선언한 전역 변수 value는 전역 객체의 프로퍼티다.
var value = 1;
// const 키워드로 선언한 전역 변수 value는 전역 객체의 프로퍼티가 아니다.
// const value = 1;

const obj = {
	value: 100,
	foo() {
		console.log("foo's this: ", this); // {value:100, foo: ƒ}
		console.log("foo's this.value: ", this.value); // 100

		// 메서드 내에서 정의한 중첩 함수
		function bar() {
			console.log("bar's this: ", this); // window
			console.log("bar this.value: ", this.value); // 1
		}
	
		// 메서드 내에서 정의한 중첩 함수도 일반 함수로 호출되면 중첩 함수 내부의 this에는
		// 전역 객체가 바인딩된다.
		bar();
	}
};

obj.foo();
```

콜백 함수가 일반 함수로 호출된다면 콜백 함수 내부의 thisdㅔ도 전역 객체가 바인딩된다. 어떤한 함수라도 일반 함수로 호출되면 this에 전역 객체가 바인딩된다.

```jsx
var value = 1;

const obj = {
	value: 100,
	foo() {
		console.log("foo's this: ", this); // {value:100, foo: ƒ}
		// 콜백 함수 내부의 this에는 전역 객체가 바인딩된다.
		setTimeout(function () {
			console.log("callback's this: ", this); // window
			console.log("callback's this.value: ", this.value); // 1
		}, 100);
	}
};

obj.foo();
```

**이처럼 일반 함수로 호출된 모든 함수(중첩 함수, 콜백 함수 포함) 내부의 this에는 전역 객체가 바인딩된다.**

중첩 함수 또는 콜백 함수는 외부 함수를 돕는 헬퍼 함수의 역할을 하므로 외부 함수의 일부 로직을 대신하는 경우가 대부분이다. 하지만 외부 함수인 메서드와 중첩 함수 또는 콜백 함수의 this가 일치하지 않는다는 것은 중첩 함수 또는 콜백 함수를 헬퍼 함수로 동작하기 어렵게 만든다.

메서드 내부의 중첩 함수나 콜백 함수의 this 바인딩을
메서드의 this 바인딩과 일치시키기 위한 방법은 다음과 같다.

```jsx
var value = 1;

const obj = {
	value = 100,
	foo() {
		// this 바인딩(obj)을 변수 that에 할당한다.
		const that = this;
		
		// 콜백 함수 내부에서 this 대신 that을 참조한다.
		setTimeout(function () {
			console.log(that.value); // 100
		}, 100);
	}
};

obj.foo();
```

위 방법 이외에도 자바크스립트는 this를 명시적으로 바인딩할 수 있는 `Function.prototype.apply`, `Function.prototype.call`, `Function.prototype.bind` 메서드를 제공한다.

```jsx
var value = 1;

const obj = {
	value: 100,
	foo() {
		// 콜백 함수에 명시적으로 this를 바인딩한다.
		setTimeout(function () {
			console.log(this.value); // 100
		}.bind(this), 100);
	}
};
```

또는 화살표 함수를 사용해서 this 바인딩을 일치시킬 수도 있다.

```jsx
var value = 1;

const obj = {
	value: 100,
	foo() {
		// 화살표 함수 내부의 this는 상위 스코프의 this를 가리킨다.
		setTimeout(() => console.log(this.value), 100); // 100
	}
};
```

### 2) 메서드 호출

메서드 내부의 this에는 메서드를 호출한 객체가 바인딩 된다.
주의할 것은 메서드 내부의 this는 메서드를 소유한 객체가 아닌 메서드를 호출한 객체에 바인됭된다는 것이다.

```jsx
const person = {
	name: 'Lee',
	getName() {
		// 메서드 내부의 this는 메서드를 호출한 객체에 바인딩된다.
		retrun this.name;
	}
};

// 메서드 getName을 호출한 객체는 person이다.
console.log(person.getName()); // Lee
```

위 예제의 getName 메서드는 person 객체의 메서드로 정의되었다. 메서드는 프로퍼티에 바인딩된 함수다.
즉, person 객체의 getName 프로퍼티가 가리키는 함수 객체는 person 객체에 포함된 것이 아니라 독립적으로
존재하는 별도의 객체다. getName 프로퍼티가 함수 객체를 가리키고 있을 뿐이다.

따라서 getName 메서드는 다른 객체의 프로퍼티에 할당하는 것으로 다른 객체의 메서드가 될 수도 있고
일반 변수에 할당하여 일반 함수로 호출될 수도 있다.

```jsx
const anotherPerson = {
	name: 'Kim'
};
// getName 메서드를 anotherPerson 객체의 메서드로 할당
anotherPerson.getName = person.getName;

// getName 메서드를 호출한 객체는 anotherPerson이다.
console.log(anotherPerson.getName()); // Kim

// getName 메서드를 변수에 할당
const getName = person.getName;

// getName 메서드를 일반 함수로 호출
// 일반 함수로 호출된 getName 함수 내부의 this.name은 브라우저 환경에서 window.name과 같다.
// 브라우저 환경에서 window.name은 브라우저 창의 이름을 나타내는 빌트인 프로퍼티이며 기본값은 ''이다.
// Node.js 환경에서 this.name은 undefined다.
console.log(getName()); // ''
```

따라서 메서드 내부의 this는 프로퍼티로 메서드를 가리키고 있는 객체와는 관계가 없고 메서드르 호출한 객체에 바인딩 된다.

프로토타입 메서드 내부에서 사용된 this도 일반 메서드처럼 해당 메서드를 호출한 객체에 바인딩 된다.

```jsx
function Person(name) {
	this.name = name;
};

Person.prototype.getName = function () {
	return this.name;
}

const me = new Person('Lee');

// getName 메서드를 호출한 객체는 me다.
console.log(me.getName()); // 1) Lee

Person.prototype,bane = 'Kim';

//getName 메서드를 호출한 객체는 Person.prototype이다.
console.log(Person.prototype.getName()); // 2) Kim
```

1) 의 경우 `getName` 메서드를 호출한 객체가 `me` 이기 때문에, `getName` 메서드 내부의 `this`는 `me`를 가리키며 this.name은 `Lee` 이다.

2) 의 경우 `getName` 메서드를 호출한 객체가 `Person.prototype` 이기 때문에, `getName` 메서드 내부의 this는 `Person.prototype` 을 가리키며 this.name은 `Kim` 이다.

### 3) 생성자 함수 호출

생성자 함수 내부의 this에는 생성자 함수가 (미래에) 생성할 인스턴스가 바인딩된다.

```jsx
// 생성자 함수
function Circle(radius) {
	// 생성자 함수 내부의 this는 생성자 함수가 생성할 인스턴스를 가리킨다.
	this.radius = radius;
	this.getDiameter = function () {
		return 2 * this.radius;
	};
}

// 반지름이 5인 Circle 객체를 생성
const circle1 = new Circle(5);
// 반지름이 10인 Circle 객체를 생성
const circle2 = new Circle(10);

console.log(circle1.getDiameter()); // 10
console.log(circle2.getDiameter()); // 20

// new 연산자와 함께 호출하지 않으면 생성자 함수로 동작하지 않는다.
const circle3 = Circle(15);

// 일반 함수로 호출된 circle에는 반환문이 없으므로 암묵적으로 undefined를 반환한다.
console.log(circle3); //undefined

// 일반 함수로 호출된 Circle 내부의 this는 전역 객체를 가리킨다.
console.log(radius); // 15
```

### 4) Function.prototype.apply/call/bind 메서드에 읳판 간접 호출

`apply, call, bind` 메서드는 `Function.prototype`의 메서드다. 즉, 모든 함수가 이 메서드들을
사용할 수 있다.

`Function.prototype.apply, Function.prototype.call` 메서드는 this로 사용할 객체와 인수 리스트를 인수로 전달받아 함수를 호출한다.

```jsx
function getThisBinding() {
	return this;
}

// this로 사용할 객체
const thisArg = { a: 1 };

console.log(getThisBinding()); // window

// getThisBinding 함수를 호출하면서 인수로 전달한 객체를 getThisBinding 함수의 this에 바인딩
console.log(getThisBinding.apply(thisArg)); // {a: 1}
console.log(getThisBinding.call(thisArg)); // {a: 1}
```

**`apply`와 `call` 메서드의 본질적인 기능은 함수를 호출하는 것이다.**
`apply`와 `call` 메서드는 함수를 호출할 때 `첫 번째 인수`로 `바인딩 할 객체`를 전달한다.

`apply`와 `call` 메서드는 호출할 함수에 `인수를 전달하는 방식만 다를 뿐 동일하게 동작한다.`
위 예제는 getThisBinding 함수에 `인수를 전달하지 않는다.` 인수를 전달하려면 아래와 같이 사용하면 된다.

```jsx
function getThisBinding() {
	console.log(arguments);
	return this;
}

// this로 사용할 객체
const thisArg = { a: 1 };

// getThisBinding 함수를 호출하면서 인수로 전달한 객체를 getThisBinding 함수의 this에 바인딩한다.
// apply 메서드는 호출한 함수의 인수를 배열로 묶어 전달한다.
console.log(getThisBinding.apply(thisArg, [1, 2, 3]));
// Arguments(3) [1, 2, 3, callee: ƒ, Symbol(Symbol.iterator): ƒ]
// {a: 1}

// call 메서드는 호출한 함수의 인수를 쉼표로 구분한 리스트 형식으로 전달한다.
console.log(getThisBinding.call(thisArg, 1, 2, 3));
// Arguments(3) [1, 2, 3, callee: ƒ, Symbol(Symbol.iterator): ƒ]
// {a: 1}
```

`apply`와 `call` 메서드의 대표적인 용도는 `arguments` 객체와 같은 유사 배열 객체에 배열 메서드를
사용하는 경우다. `arguments` 객체는 배열이 아니기 떄문에 `Array.prototype.slice` 같은 배열의 메서드를 사용할 수 없으나 apply와 call 메서드를 이용하면 가능하다.

```jsx
function convertArgsToArray() {
	console.log(arguments);

	// arguments 객체를 배열로 변환
	// Array.prototype.slice를 인수 없이 호출하면 배열의 복사본을 생성한다.
	const arr = Array.prototype.slice.call(arguments);
	// const arr = Array.prototype.slice.apply(arguments);
	console.log(arr);

	return arr;
}

convertArgsToArray(1, 2, 3); // [1, 2, 3]
```

`Function.prototype.bind` 메서드는 *apply*와 *call* 메서드와 달리 함수를 호출하지 않는다.
다만 첫 번쨰 인수로 전달한 값으로 this 바인딩이 교체된 함수를 새롭게 생성헤 반환한다.

```jsx
function getThisBinding() {
	return this;
}

// this로 사용할 객체
const thisArg = { a: 1 };

// bind 메서드는 첫 번째 인수로 전달한 thisArg로 this 바인딩이 교체된
// getThisBinding 함수를 새롭게 생성해 반환한다.
console.log(getThisBinding.bind(thisArg)); // getThiBinding
// bind 메서드는 함수를 호출하지는 않으므로 명시적으로 호출해야 한다.
console.log(getThisBinding.bind(thisArg)()); // {a: 1}
```

`bind` 메서드는 메서드의 `this`와 메서드 내부의 중첩 함수 또는 콜백 함수의 `this`가 불일치하는 문제를
해결하기 위해 유용하게 사용된다.

```jsx
const person = {
	name: 'Lee',
	foo(callback) {
		// 1)
		setTimeout(callback, 100);
	}
};

person.foo(function () {
	console.log(`Hi! my name is ${this.name}.`); // 2) Hi! my name is .
	// 일반 함수로 호출된 getName 함수 내부의 this.name은 브라우저 환경에서 window.name과 같다.
	// 브라우저 환경에서 window.name은 브라우저 창의 이름을 나타내는 빌트인 프로퍼티이며 기본값은 ''이다.
	// Node.js 환경에서 this.name은 undefined다.
}
```

`person.foo`의  콜백 함수가 호출되기 이전인 `1)`의 시점에서 this는 foo 메서드를 호출한 person 객체를
가리킨다. 그러나 `person.foo`의 콜백 함수가 호출된 `2)`의 this는 전역 객체 `window`를 가리킨다.

이때 위 예제에서 person.foo의 콜백 함수는 외부 함수 person.foo를 돕는 헬퍼 함수 역할을 하는데,
person.foo 내부의 this와 콜백 함수 내부의 this가 상이하면 문맥상 문제가 발생한다.

따라서 콜백 함수 내부의 this와 외부 함수 내부의 this와 일치시켜야 하는데, 이때 `bind` 메서드를 사용하여 this를 일치시킬 수 있다.

```jsx
const person = {
	name: 'Lee',
	foo(callback) {
		// bind 메서드로 callback 함수 내부의 this 바인딩을 전달
		setTimeout(callback.bind(this), 100);
	}
};

person.foo(function () {
	console.log(`Hi! my name is ${this.name}.`); // Hi! my name is Lee.
});
```

| 함수 호출 방식                              | this 바인딩                                 |
| ------------------------------------------- | ------------------------------------------- |
| 일반 함수 호출                              | 전역 객체                                   |
| 메서드 호출                                 | 메서드를 호출한 객체                        |
| 생성자 함수 호출                            | 생성자 함수가 (미래에) 생성할 인스턴스      |
| Function.prototype.apply/call/bind 메서드에 |
| 의한 간접 호출                              | Function.prototype.apply/call/bind 메서드에 |
| 첫 번째 인수로 전달한 객체                  |
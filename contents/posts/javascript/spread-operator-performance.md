---
title: 'JavaScript의 Spread 연산자(spread operator)와 성능'
date: '2024-06-22'
tag: 'javascript'
---

## 개요

최근 [자바스크립트 성능 최적화에 관련된 아티클](https://romgrk.com/posts/optimizing-javascript)을 읽다가 spread 연산자가 매번 새로운 객체를 메모리에 생성하기 때문에 성능상 불리할 수 있다는 내용을 접했습니다.

최근 들어서는 불변성이 중요한 원칙으로 자리 잡았기 때문에 객체나 배열을 복사하는 spread 연산자를 많이 사용하게 되는데요, 그래서 실제로 성능 차이가 얼마나 나는지 궁금해져 알아보기로 했습니다.

> **About the { ...spread } operator**
It’s very convenient, but every time you use it you create a new object in memory. More memory I/O, slower caches!
> 

## Spread 연산자의 구조

성능에 대한 부분을 알아보기 전에 우선 배열 및 객체에서의 spread 연산자가 어떤 형태로 구현되어 있는지 알아보았습니다.

### 배열에서의 Spread 연산자

[v8 엔진 블로그](https://v8.dev/blog/spread-elements)에 따르면 배열에서 spread 연산자를 사용할 때는 이터러블 객체를 기반으로 순회하며 새로운 배열을 생성하는 형태로 구현되어 있습니다.

Babel을 통해 transpile해보면 `Array.prototype.concat()`으로 변환됩니다.

```jsx
// spread 연산자 사용
const arr1 = [1];
const arr2 = [2];

const result = [...arr1, ...arr2, 3];
```

```jsx
// Babel에 의해 transpile된 결과
var arr1 = [1];
var arr2 = [2];
var result = [].concat(arr1, arr2, [3]);
```

### 객체에서의 Spread 연산자

[ES6에 포함된 propsal 내용](https://github.com/tc39/proposal-object-rest-spread/blob/main/Spread.md)에 따르면 `Object.assign()`과 유사하게 구현되어 있습니다. 

`object.assign()`은 파라미터로 넘어온 객체들을 순회하며 새로운 객체를 얕은 복사(shallow copy)를 하는 형태로 구현됩니다.

Babel을 통해 transpile해보면 `Object.assign()` 함수를 사용하거나, 해당 함수가 없는 환경에서는 해당 함수를 구현하는 모습을 볼 수 있습니다.

```jsx
// spread 연산자 사용
const obj1 = { a: 1 };
const obj2 = { b: 2 };

const result = { ...obj1, ...obj2, c: 3};
```

```jsx
// Babel에 의해 transplie된 결과
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var obj1 = {
  a: 1
};
var obj2 = {
  b: 2
};

var result = _extends({}, obj1, obj2, {
  c: 3
});
```

---

## 실제 성능 비교해 보기

spread 연산자가 실제로 어떤 식으로 구현되었고 동작하는지 대략적으로 알아보았으니, 이번에는 실제로 for 루프 등 다른 방식과 성능 차이를 확인해보겠습니다.

> 여기서의 결과는 환경마다 다를 수 있으니 대략적인 흐름만 참고하시기 바랍니다.
> 

### 배열에서의 Spread 연산자 성능 비교

배열 두 개를 합치는 작업을 각기 다른 방식으로 수행해 보았습니다.

- **for loop 를 사용** (평균 1 ~ 2ms)

```jsx
const arr1 = Array.from({ length: 100000 }, (_, i) => i);
const arr2 = Array.from({ length: 100000 }, (_, i) => i);

const result = [];

const t0 = performance.now();

for (let i = 0; i < arr1.length; i++) {
  result.push(arr1[i]);
}

for (let i = 0; i < arr2.length; i++) {
  result.push(arr2[i]);
}

const t1 = performance.now();

console.debug(`for loop: ${t1 - t0}milliseconds`); // 평균 1 ~ 2 milliseconds
```

- **for...of 를 사용** (평균 2 ~ 3ms)

```jsx
const arr1 = Array.from({ length: 100000 }, (_, i) => i);
const arr2 = Array.from({ length: 100000 }, (_, i) => i);

const result = [];

const t0 = performance.now();

for (const item of arr1) {
  result.push(item);
}

for (const item of arr2) {
  result.push(item);
}

const t1 = performance.now();

console.debug(`for...of: ${t1 - t0}milliseconds`); // 평균 2 ~ 3 milliseconds
```

- **forEach 를 사용** (평균 2 ~ 3ms)

```jsx
const arr1 = Array.from({ length: 100000 }, (_, i) => i);
const arr2 = Array.from({ length: 100000 }, (_, i) => i);

const result = [];

const t0 = performance.now();

arr1.forEach((it) => result.push(it));
arr1.forEach((it) => result.push(it));

const t1 = performance.now();

console.debug(`forEach: ${t1 - t0}milliseconds`); // 평균 2 ~ 3 milliseconds
```

- **spread 연산자를 사용** (평균 3 ~ 4ms)

```jsx
const arr1 = Array.from({ length: 100000 }, (_, i) => i);
const arr2 = Array.from({ length: 100000 }, (_, i) => i);

const t0 = performance.now();

const result = [...arr1, ...arr2];

const t1 = performance.now();

console.debug(`spread operator: ${t1 - t0}milliseconds`); // 평균 3 ~ 4 milliseconds
```

결과를 보면 조금씩 차이가 나기는 하지만, spread 연산자를 쓰지 않아야 할 만큼 유의미한 차이가 난다고 보기는 어렵습니다.

### 객체에서의 Spread 연산자 성능 비교

배열과 비슷한 방식으로 객체 두 개를 합치는 작업을 수행해 보았습니다.

- **for…in 을 사용** (평균 7 ~ 10ms)

```jsx
// 샘플용 데이터를 만드는 코드로 크게 중요하지 않습니다.
function createSampleObjectFromArray(arr) {
  const obj = {};
  for (let i = 0; i < arr.length; i++) {
    obj[arr[i]] = arr[i];
  }
  return obj;
}

const arr1 = Array.from({ length: 100000 }, (_, i) => i + 1);
const arr2 = Array.from({ length: 100000 }, (_, i) => i + 100000);
const obj1 = createSampleObjectFromArray(arr1);
const obj2 = createSampleObjectFromArray(arr2);

const merged = {};

const t0 = performance.now();

for (const key in obj1) {
  merged[key] = obj1[key];
}

for (const key in obj2) {
  merged[key] = obj2[key];
}

const t1 = performance.now();

console.debug(`for...in: ${t1 - t0}milliseconds`); // 평균 7 ~ 10 milliseconds
```

- **Object.keys와 forEach를 사용** (평균 9 ~ 13ms)

```jsx
const arr1 = Array.from({ length: 100000 }, (_, i) => i + 1);
const arr2 = Array.from({ length: 100000 }, (_, i) => i + 100000);
const obj1 = createSampleObjectFromArray(arr1);
const obj2 = createSampleObjectFromArray(arr2);

const merged = {};

const t0 = performance.now();

Object.keys(obj1).forEach((key) => {
  merged[key] = obj1[key];
});

Object.keys(obj2).forEach(([key, value]) => {
  merged[key] = obj2[key];
});

const t1 = performance.now();

console.debug(`Object.keys and forEach: ${t1 - t0}milliseconds`); // 평균 9 ~ 13 milliseconds
```

- **Object.entries와 for…of를 사용** (평균 17 ~ 19ms)

```jsx
  const arr1 = Array.from({ length: 100000 }, (_, i) => i + 1);
  const arr2 = Array.from({ length: 100000 }, (_, i) => i + 100000);
  const obj1 = createSampleObjectFromArray(arr1);
  const obj2 = createSampleObjectFromArray(arr2);

  const merged = {};

  const t0 = performance.now();
  for (const [key, value] of Object.entries(obj1)) {
    merged[key] = value;
  }

  for (const [key, value] of Object.entries(obj2)) {
    merged[key] = value;
  }
  const t1 = performance.now();

  console.debug(`Object.entries and for...of: ${t1 - t0}milliseconds`); // 평균 17 ~ 19 milliseconds
```

- **spread 연산자를 사용** (평균 9 ~ 10ms)

```jsx
const arr1 = Array.from({ length: 100000 }, (_, i) => i + 1);
const arr2 = Array.from({ length: 100000 }, (_, i) => i + 100000);
const obj1 = createSampleObjectFromArray(arr1);
const obj2 = createSampleObjectFromArray(arr2);

const t0 = performance.now();

const merged = { ...obj1, ...obj2 };

const t1 = performance.now();

console.debug(`spread operator: ${t1 - t0}milliseconds`); // 평균 9 ~ 10 milliseconds
```

결과적으로 spread 연산자의 편리함을 포기할 만큼 유의미한 성능 차이가 있지는 않습니다.

오히려 `Object.entries + for...of` 방식보다 빠른 결과를 보여주기도 합니다. (당연하게도 해당 방식은 루프를 두 번 돌기 때문에..)

## 하지만 reduce에서는 주의를…

일반적인 경우에는 spread 연산자를 사용하는 것이 크게 문제가 되지 않지만, `Array.prototype.reduce`를 사용하는 경우에는 성능 문제가 발생할 수 있습니다.

예시로 배열을 객체로 변경하는 작업을 위해 reduce 함수를 사용한다고 가정해 보겠습니다.

```jsx
const arr = [{ id: 1 }, { id: 2 }, { id: 3 }];

const result = arr.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {});
console.log(result); // { 1: { id: 1 }, 2: { id: 2 }, 3: { id: 3 } }
```

reduce를 사용하는 경우에도 불변성을 지키기 위해 spread 연산자로 새로운 객체를 리턴하는 형태를 고수했습니다.

테스트 해보기 위해 위와 같은 로직으로 많은 데이터를 다루게 된다면 어떻게 될까요?

```jsx
const arr = Array.from({ length: 1000 }, (_, i) => ({ id: i }));

const t0 = performance.now();
const result = arr.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {});
const t1 = performance.now();
console.debug(`${t1 - t0}milliseconds`); // 평균 0.5 ~ 1milliseconds
```

1,000개의 데이터 기준으로 평균 0.5 ~ 1ms 정도로 크게 문제는 없어보입니다.

```jsx
const arr = Array.from({ length: 10000 }, (_, i) => ({ id: i }));

const t0 = performance.now();
const result = arr.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {});
const t1 = performance.now();
console.debug(`${t1 - t0}milliseconds`); // 평균 13 ~ 16milliseconds
```

만약 10,000개의 데이터라면 10배정도인 5 ~ 10ms 정도의 결과가 나와야 맞아보이는데요, 하지만 실제로는 10배보다 조금 더 큰 결과값이 나오게 됩니다.

```jsx
const arr = Array.from({ length: 100000 }, (_, i) => ({ id: i }));

const t0 = performance.now();
const result = arr.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {});
const t1 = performance.now();
console.debug(`${t1 - t0}milliseconds`); // 평균 2300 ~ 2400milliseconds
```

그럼 100,000개의 데이터라면 어떻게 될까요??

10,000개의 10배인 130 ~ 160ms 정도의 결과가 나와야겠지만 실제로는 2300 ~ 2400ms 정도의 결과가 나오게 됩니다.

이쯤되면 결과가 무언가 이상하다는 생각이 듭니다.

### **해당 코드에는 어떠한 문제가 있을까?**

앞서 살펴본 바와 같이 spread 연산자는 매번 각 객체나 배열을 순회하며 새로운 객체나 배열을 만드는 구조로 되어 있습니다

코드를 다시 살펴보면 reduce 자체가 배열 갯수만큼 순회하고 있는데, spread 연산자로 또 순회를 하는 구조를 볼 수 있습니다. 단순히 배열 한 번만 순회하면 되는데, 비효율적으로 `O(n²)`의 시간복잡도를 가지게 되는 것입니다.

이 사실을 알고 위의 코드를 보면, 성능 저하의 원인을 이해할 수 있습니다.

### 어떻게 해결하면 좋을까?

가장 간단한 해결 방법은 reduce 내에서는 spread 연산자를 사용하지 않는 것입니다.

```jsx
const arr = Array.from({ length: 100000 }, (_, i) => ({ id: i }));

const t0 = performance.now();
const result = arr.reduce((acc, cur) => {
  acc[cur.id] = cur;
  return acc;
}, {});
const t1 = performance.now();
console.debug(`${t1 - t0}milliseconds`); // 평균 1 ~ 2 milliseconds
```

reduce 내에서 spread 연산자를 사용하지 않는 것만으로 결과에 큰 차이가 있는 것을 볼 수 있습니다.

이 방식은 불변성을 깨게 되는 방식이지만, 개인적으로는 새로운 객체, 배열로 reduce를 사용하게 되는 경우는 크게 문제가 되지 않는다고 생각합니다.

만약 불변성을 유지하는 것이 꼭 필요하다면, Immer나 Immutable.js 같은 라이브러리를 사용할 수도 있습니다하지만 이러한 라이브러리를 사용하면 관리할 부분이 많아지고, 번들 사이즈도 커지기 때문에, 이런 점들도 함께 고려해야 합니다.

## References

- [Optimizing Javascript for fun and for profit](https://romgrk.com/posts/optimizing-javascript)
- [Speeding up spread elements - v8](https://v8.dev/blog/spread-elements)
- [tc39 - proposal-object-rest-spread](https://github.com/tc39/proposal-object-rest-spread/blob/main/Spread.md)
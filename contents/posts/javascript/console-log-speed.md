---
title: '[Javascript] console.log() 속도 관련'
date: '2021-11-25'
tag: 'nest-js'
---

https://www.acmicpc.net/problem/10828

해당 문제를 푸는데, 구현에 이상이 없는데 시간 초과로 오답이 나타나는 현상이 있었다.
원인은 반복문에서 매 입력시 마다 `console.log()`를 사용하였는데,
`console.log()` 는 디버깅용으로 쓰이는 함수라 속도 저하가 발생할 수 있다고 한다.

해당 문제에서 출력할 데이터를 하나의 변수로 담아놓고
`console.log()` 함수를 한번만 호출하게 변경 하였을때 통과가 되었다.
반복을 돌며 매번 출력을 하는 방법을 사용하지 않는 것이 좋을 것 같다.


### 해당 문제 시간 초과 코드
```javascript
const readline = require("readline");

class Stack {
  list = [];
  size = 0;
  top;

  push(value) {
    this.list[this.list.length] = value;
    this.top = value;
    this.size += 1;
  }

  pop() {
    if (!this.top) {
      return -1;
    }

    const previousTop = this.top;
    this.list.splice([this.list.length - 1], 1);

    const newTop = this.list[this.list.length - 1];
    this.top = newTop;
    this.size -= 1;

    return previousTop;
  }

  getSize() {
    return this.size;
  }

  getTop() {
    return this.top ?? -1;
  }

  isEmpty() {
    return this.size === 0 ? 1 : 0;
  }
}

const INPUTS = {
  PUSH: "push",
  POP: "pop",
  SIZE: "size",
  EMPTY: "empty",
  TOP: "top",
};

const solution = (input) => {
  const inputCount = Number(input[0]);
  const stack = new Stack();

  for (let i = 1; i <= inputCount; i++) {
    const command = input[i];

    if (command.includes(INPUTS.PUSH)) {
      const value = Number(command.split(" ")[1]);
      stack.push(value);
    } else if (command === INPUTS.POP) {
      console.log(stack.pop());
    } else if (command === INPUTS.TOP) {
      console.log(stack.getTop());
    } else if (command === INPUTS.SIZE) {
      console.log(stack.getSize());
    } else if (command === INPUTS.EMPTY) {
      console.log(stack.isEmpty());
    }
  }
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const input = [];
rl.on("line", (line) => {
  input.push(line);
}).on("close", () => {
  solution(input);

  process.exit();
});
```

### 해당 문제 통과 코드
```javascript
const readline = require("readline");

class Stack {
  list = [];
  size = 0;
  top;

  push(value) {
    this.list[this.list.length] = value;
    this.top = value;
    this.size += 1;
  }

  pop() {
    if (!this.top) {
      return -1;
    }

    const previousTop = this.top;
    this.list.splice([this.list.length - 1], 1);

    const newTop = this.list[this.list.length - 1];
    this.top = newTop;
    this.size -= 1;

    return previousTop;
  }

  getSize() {
    return this.size;
  }

  getTop() {
    return this.top ?? -1;
  }

  isEmpty() {
    return this.size === 0 ? 1 : 0;
  }
}

const INPUTS = {
  PUSH: "push",
  POP: "pop",
  SIZE: "size",
  EMPTY: "empty",
  TOP: "top",
};

const solution = (input) => {
  const inputCount = Number(input[0]);
  const stack = new Stack();

  const result = [];

  for (let i = 1; i <= inputCount; i++) {
    const command = input[i];

    if (command.includes(INPUTS.PUSH)) {
      const value = Number(command.split(" ")[1]);
      stack.push(value);
    } else if (command === INPUTS.POP) {
      result.push(stack.pop());
    } else if (command === INPUTS.TOP) {
      result.push(stack.getTop());
    } else if (command === INPUTS.SIZE) {
      result.push(stack.getSize());
    } else if (command === INPUTS.EMPTY) {
      result.push(stack.isEmpty());
    }
  }

  console.log(result.join("\n"));
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const input = [];
rl.on("line", (line) => {
  input.push(line);
}).on("close", () => {
  solution(input);

  process.exit();
});
```
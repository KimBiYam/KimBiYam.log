---
title: 'React에 Storybook 도입하기'
date: '2021-06-22'
tag: 'react'
---

![](/images/posts/nest-js/type-orm-timezone_1.png)

## Storybook이란?

Storybook은 컴포넌트 단위의 UI 개발 환경을 지원하는 도구입니다.

Storybook을 사용하면 실제 웹 어플리케이션의 환경과 별개로 컴포넌트 단위의 UI 개발 진행이 가능합니다.

그 외에도 컴포넌트의 문서화 도구로도 사용이 가능합니다.

다양한 프론트엔드 웹 프레임워크(React, Vue, Angular 등등)을 지원합니다.

## React에 적용하기

[공식문서](https://storybook.js.org/tutorials/intro-to-storybook/react/ko/get-started/)를 참조하여 리액트 프로젝트에 적용해보았습니다.

### CRA를 이용한 React 프로젝트에 적용하기

우선 웹팩 환경을 구성하지 않고 [CRA](https://github.com/facebook/create-react-app)를 이용하여 Storybook을 적용하는 방법입니다.

타입스크립트 기반의 프로젝트를 생성하기 위해서 아래와 같은 명령어로 프로젝트를 생성합니다.

```bash
$ npx create-react-app storybook-app --template typescript
```

프로젝트가 제대로 생성 되었는지 확인 해봅니다

```bash
$ npm run start
```


![](/images/posts/react/employing-storybook-on-react_2.png)
그 후 아래의 명령어로 스토리북을 설치합니다.

```bash
$ npx -p @storybook/cli sb init 
```

### Webpack5 로 구성된 프로젝트에 적용하기

Webpack5 을 이용하여 리액트, 타입스크립트 프로젝트를 구성했을때의 적용 방법입니다.

아래의 명령어로 스토리북을 설치합니다.

```bash
$ npx sb init --builder webpack5
```

만약 dotenv-webpack 이 설치되어 있지 않다면 해당 패키지도 같이 설치합니다.

```bash
$ npm install dotenv-webpack --save-dev
```

### 실행

제대로 설치가 되었다면 stories 폴더에 샘플 코드가 생기고

package.json 에 스토리북 실행을 위한 스크립트가 추가됩니다.

```json
"scripts": {
    "storybook": "start-storybook -p 6006 -s public",
    "build-storybook": "build-storybook -s public"
  },
```

제대로 실행이 되는지 확인해보기 위해 해당 스크립트를 실행합니다.

스토리북은 기존의 어플리케이션과 따로 구동되어서 어플리케이션을 실행하지 않아도 따로 실행이 가능합니다.

```bash
$ npm run storybook
```

제대로 실행이 되면 아래와 같은 대시보드 형태의 웹 페이지가 나타나게 됩니다.

![](/images/posts/react/employing-storybook-on-react_3.png)

## 스토리북 기능 둘러보기

샘플 코드로 만들어진 스토리들을 둘러보며 간단하게 스토리북을 어떻게 활용할 수 있는지 알 수 있습니다.

스토리북은 stories 파일들을 파싱하여 스토리북에 해당 컴포넌트들을 생성해줍니다.

샘플로생성된 Button 컴포넌트를 살펴보겠습니다.

![](/images/posts/react/employing-storybook-on-react_4.png)

**src/stories/Button.tsx** 파일은 아래와 같은 Props를 가진 버튼 컴포넌트입니다.

```tsx
export interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Button contents
   */
  label: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}
```

### 문서화

스토리의 Docs탭에서는 해당 컴포넌트 자체 혹은 Props 에 어떤 기능을 수행하는지 등의 설명을 확인할 수 있습니다.

![](/images/posts/react/employing-storybook-on-react_5.png)
### Props 변경해보기

해당 파일을 기반으로 **Button.stories.tsx** 파일이 생성되어 있습니다.

스토리북에서 해당 컴포넌트의 Props를 볼 수 있고 직접 값의 변경이 가능하여,

Props가 바뀔때 UI의 변경과 동작을 확인할 수 있습니다.

![](/images/posts/react/employing-storybook-on-react_6.gif)

## 스토리 작성해보기

### 스토리 작성

컴포넌트의 스토리를 작성할 때는 [Component Story Format(CSF)](https://storybook.js.org/docs/react/api/csf) 라는 문법을 사용합니다.

우선 테스트를 위해 간단한 컴포넌트를 하나 생성해보겠습니다.

**Title.tsx**

```tsx
import React from "react";

export interface TitleProps {
  text?: string;
}

function Title({ text }: TitleProps) {
  return <div>{text}</div>;
}

export default Title;
```

텍스트 props로 받아와서 그려주는 컴포넌트를 생성하였습니다.

해당 컴포넌트의 스토리를 작성해보겠습니다.

**Title.stories.tsx**

```tsx
import React from "react";

import { Meta, Story } from "@storybook/react";
import Title, { TitleProps } from "./Title";

export default {
  title: "Components/Title",
  component: Title,
} as Meta;

const Template: Story<TitleProps> = (args) => <Title {...args} />;

export const Basic = Template.bind({});
```

Meta 타입으로 컴포넌트의 정보를 작성하고 default export를 해주면

스토리북에서 해당 정보를 파싱하여 컴포넌트를 생성해줍니다.

Title은 스토리북에서 보여질 이름이고 component에 어떤 컴포넌트를 사용할지 명시하면 됩니다.

Template 은 해당 컴포넌트의 템플릿을 세팅하는 부분입니다.

스토리북에서 확인하면 새로운 컴포넌트 스토리가 생긴걸 확인할 수 있습니다.

![](/images/posts/react/employing-storybook-on-react_7.png)

샘플 코드와 마찬가지로 text props를 변경하면 UI가 변경됩니다.

![](/images/posts/react/employing-storybook-on-react_8.gif)

템플릿의 Props 값을 지정할 수도 있습니다.

**Title.stories.tsx**

```tsx
export const Basic = Template.bind({});
Basic.args = { text: "Title!" };
```

다시 스토리북을 확인해보면 Props 기본값이 직접 지정한 값으로 변경되어 있습니다.

![](/images/posts/react/employing-storybook-on-react_9.png)

### 문서 작성

만약 Docs 탭에서 컴포넌트에 대한 설명을 보여주고 싶다면 해당 컴포넌트에 주석을 달아주면 됩니다.

// 와 같은 형태가 아닌 /** */ 형태의 주석을 작성해야합니다.

**Title.tsx**

```tsx
import React from "react";

export interface TitleProps {
  /**
   * 보여주고 싶은 텍스트입니다
   */
  text?: string;
}

/**
 * 타이틀 컴포넌트
 *
 * - 타이틀 컴포넌트입니다
 */
function Title({ text }: TitleProps) {
  return <div>{text}</div>;
}

export default Title;
```

Docs 탭에서 작성했던 주석이 설명으로 나오는 것을 확인할 수 있습니다.

![](/images/posts/react/employing-storybook-on-react_10.png)

이와 같이 컴포넌트의 문서화도 간편하게 작성이 가능합니다.

간단한 문서화가 아닌 경우에는 [MDX Format](https://storybook.js.org/docs/riot/api/mdx) 으로 직접 마크다운을 작성할 수도 있습니다.
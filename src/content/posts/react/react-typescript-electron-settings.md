---
title: 'React Typescript 기반 Electron 개발 환경 구축'
date: '2022-05-02'
tag: 'react'
ogImagePath: '/images/posts/react/react-typescript-electron-settings_1.png'
---

![Electron-logo](/images/posts/react/react-typescript-electron-settings_1.png)

### 프로젝트 시작

우선 CRA 라이브러리를 통해 typescript 기본 프로젝트를 생성

```bash
$ npx create-react-app [project-name] --template typescript
```

### Electron 모듈 설치

```bash
$ npm i -D concurrently cross-env electron electron-builder wait-on
$ npm i electron-is-dev
```

### package.json 수정

```json
...
"main": "./public/electron.js",
"homepage": "./",
...
"scripts": {
	"react-start": "react-scripts start",
	"react-build": "react-scripts build",
	"react-test": "react-scripts test",
	"react-eject": "react-scripts eject",
	"start-renderer": "cross-env BROWSER=none npm run react-start",
	"start-main": "electron .",
	"compile-main": "tsc ./public/electron.ts",
	"start-main-after-renderer": "wait-on http://localhost:3000 && npm run start-main",
	"dev": "npm run compile-main && concurrently -n renderer, main 'npm:start-renderer' 'npm:start-main-after-renderer'",
	"pack": "npm run compile-main && npm run react-build && electron-builder --dir",
	"build": "npm run compile-main && npm run react-build && electron-builder build",
	"build:osx": "npm run build -- --mac",
	"build:linux": "npm run build -- --linux",
	"build:win": "npm run build -- --win",
	"predist": "npm run compile-main"
}
...
```

### public/elctron.ts 작성

```tsx
import * as path from 'path';
import { app, BrowserWindow } from 'electron';
import * as isDev from 'electron-is-dev';

const BASE_URL = 'http://localhost:3000';

let mainWindow: BrowserWindow | null;

function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1920,

    height: 1080,

    webPreferences: {
      contextIsolation: true,

      nodeIntegration: true,
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if (isDev) {
    mainWindow.loadURL(BASE_URL);

    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  }

  mainWindow.on('closed', (): void => {
    mainWindow = null;
  });
}

app.on('ready', (): void => {
  createMainWindow();
});

app.on('window-all-closed', (): void => {
  app.quit();
});

app.on('activate', (): void => {
  if (mainWindow === null) {
    createMainWindow();
  }
});
```

### Run

```bash
$ npm run dev
```

자동으로 elctron.ts 파일을 elctron.js로 컴파일 하여 실행됨

### Build

package.json에 build 관련 내용 추가

```json
...
	"build": {
    "productName": {프로젝트 명},
    "appId": {App ID},
    "asar": true,
    "protocols": { // 딥링크 시 사용 됨
      "name": {프로젝트 명},
      "schemes": [
        {App name}
      ]
    },
    "mac": {
      "target": [
        "default"
      ]
    },
    "dmg": {
      "title": "tournant"
    },
    "win": {
      "target": [
        "zip",
        "nsis"
      ]
    },
    "linux": {
      "target": [
        "AppImage",
        "deb",
        "rpm",
        "zip",
        "tar.gz"
      ]
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": false,
      "installerLanguages": [
        "en_US",
        "ko_KR"
      ],
      "language": "1042"
    },
    "directories": {
      "output": "dist/",
      "app": "."
    }
  }
```

빌드 파일만 생성

```bash
$ npm run pack
```

빌드 후 패킹까지 진행

```bash
$ npm run build
```

OS 별 빌드 스크립트

```bash

$ npm run build:osx

$ npm run build:linux

$ npm run build:win
```

dist 폴더에 빌드 파일이 생성됨
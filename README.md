# 打砖块 · Brick Breaker

OpenChamber 侧栏里的打砖块小游戏。22 关，含两关千砖大关；三球发球，分裂指数增殖。

<p align="center">
  <img width="92%" alt="打砖块" src="docs/screenshot.png" />
</p>

## 安装

在 OpenChamber 的 **Settings → Extensions** 里添加：

```text
https://github.com/Insulindian/openchamber-brick-breaker
```

构建产物 `panel/main.js` 已提交，安装不需要构建工具。已安装的话用扩展更新器更新。

## 操作

- 指针 / ← → / A D：移动反弹板
- 空格 / 点击画面：发球
- P / Esc / 右键：暂停
- R：重开本关
- M：静音

## 内容

- 22 关；最后两关各约 1000 块砖
- 底部钢墙/硬砖墙只留 2～3 个缺口，缺口上方是易碎砖
- 每关 1～3 个 CORE，击碎后自动清场
- 每次发球 3 颗；SPLIT 让每颗球变 3 颗，最高 81 颗
- COMBO、选关、SAVE/RESUME、BEST
- Canvas 绘制，WebAudio 音效

## 开发

```sh
npm install
npm run build
```

调试参数：`?play=1`、`?level=N`、`?auto=1`、`?god=1`、`?sim=N`、`?steps=N`、`?drop=all`、`?dbg=1`。

画面全部由 Canvas 程序化绘制。字体 Chakra Petch + ZCOOL QingKe HuangYou（SIL OFL，`panel/fonts/` 内附授权）。

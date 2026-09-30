# 好困好累好想你 · Code PV

一支「全部由代码画出来」的歌曲 PV：没有素材图、没有剪辑软件，每一帧都是浏览器 Canvas 根据时间 `t` 实时计算出来的。
从主角视角唱出「好困好累好想你」——终端、报错、监控面板、电子游戏、电池充电……所有画面都是程序员熟悉的东西。

> 画面设计与迭代：我 + Claude（Anthropic 的 AI）。代码由 Claude 编写，创意方向与每一轮修改意见来自我。

## 预览

```bash
# 把歌曲放到 audio/song.m4a（仓库不含音频），然后在项目目录起一个本地服务器：
npx serve .        # 或 python3 -m http.server
# 浏览器打开 http://localhost:3000 ，点击画面开始播放，空格暂停
```

* 没有音频也能看，会按系统时间播放画面。
* 查看某一时刻的静帧：`index.html?t=60.2`

## 渲染成视频

需要 Node.js 18+、ffmpeg。

```bash
npm install
npx playwright install chromium
node tools/render.js audio/song.m4a out.mp4 30
```

用无头 Chromium 逐帧截图（PNG 无损），通过管道交给 ffmpeg 编码（H.264 CRF 14 + AAC 320k），1080p / 30fps。
抽几帧检查：`node tools/snapshot.js 9.5 60.2 118`

## 代码结构

全部逻辑在 `index.html` 一个文件里：

|部分|说明|
|-|-|
|`LINES`|每句歌词的开始时间、场景函数名、段落、终端里显示的伪代码|
|`TH` / `SECTH`|各段落的配色主题（副歌、主歌、桥段、街机段、深夜段、结尾）|
|`SC.xxx`|45 个场景函数，每句一个，输入当前时间，自己画整屏|
|`drawChar` / `persona`|字幕逐字绘制和「字幕人格化」（困冒 zzZ、累挂 \|\|\|、痛发抖……）|
|`kao` / `handPose`|颜文字和它的双手 `(")(")` 的各种动作|
|`drawMosaic`|用代码字符拼出大号 emoji（👻、💔）|
|`renderFrame` / `renderAt`|每帧的总流程，含换句光标擦除转场|
|`drawCRT`|结尾的老电视关机效果|

整个渲染是纯函数式的：`renderAt(t)` 只依赖时间 `t`，所以可以任意跳转、逐帧导出。

## 致谢与许可

* 歌曲《好困好累好想你》：词曲 ZzZ。歌词与音频版权归原作者所有，本仓库仅用于展示 PV 的实现方式。
* 字体（均附带原许可证，见 `fonts/licenses/`）：

  * [Cubic 11 俐方體11號](https://github.com/ACh-K/Cubic-11)（OFL）
  * [精品点阵体 9×9 BoutiqueBitmap9x9](https://github.com/scott0107000/BoutiqueBitmap9x9)（OFL）
  * [Ma Shan Zheng 马善政](https://github.com/googlefonts/mashanzheng)（OFL，via Fontsource）
  * [DSEG7](https://github.com/keshikan/DSEG)（OFL）
* 代码：MIT License（仅限代码部分）。


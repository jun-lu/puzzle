在网页中构建数字拼图游戏

# Installation

```shell
npm install web-game-puzzle
```

# use

```html
<div style="width:300px;height:300px;" id="puzzle"></div>
```

```javascript
import Puzzle from "web-game-puzzle";
const game = new Puzzle(
  document.getElementById("puzzle"),
  3,
  "https://img.alicdn.com/imgextra/i4/O1CN01eC3Z3t1DR8nRi2guC_!!6000000000212-0-tps-300-300.jpg",
  true
);
game.start();
```

# demo

[https://fixify.store/games/puzzle/](https://fixify.store/games/puzzle/)

# API

- constructor

  - container 容器
  - size 拼图大小, 默认 3x3
  - url 背景图
  - isNumber 是否显示数字

- start()

  开始拼图

- shuffle()

  打乱重来

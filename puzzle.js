import Puzz from "./puzz.js";

export default class Puzzle {
  constructor(container, size = 3, url = "", isNumber = true) {
    const { width, height } = getElementSize(container);
    this.container = container;
    this.size = size;
    this.url = url;
    this.isNumber = isNumber;
    this.width = width;
    this.height = height;
    this.itemWidth = this.width / this.size;
    this.itemHeight = this.height / this.size;
    this.itemList = [];
    this.listOrder = [];
    this.init();
  }
  init() {
    this.container.style.background = "url(" + this.url + ")";
    this.itemWidth = this.width / this.size;
    this.itemHeight = this.height / this.size;
    this.itemList = [];
    this.create();
  }
  create() {
    var list = this.itemList;
    var item = null;
    var end = false;
    for (var i = 0, len = this.size * this.size; i < len; i++) {
      end = i + 1 == len ? true : false;
      item = new Puzz(
        i,
        this.itemWidth,
        this.itemHeight,
        this.size,
        this.container,
        this.url,
        end
      ); //new 新的item
      item.init();

      if (this.isNumber && !end) {
        item.setShowInt();
      }

      list.push(item);
    }
    if (this.size == 3) {
      this.bindWindow(); //绑定键盘事件 可以用小键盘操作
    }
  }
  regEvent(x, y) {
    //判断移动
    var list = this.itemList;
    var order = this.listOrder;
    var j = null;
    if (x > 0 && list[order[x - 1][y]].end) {
      //上
      list[order[x][y]].move(y, x - 1);
      list[order[x - 1][y]].move(y, x);
      j = order[x][y];
      order[x][y] = order[x - 1][y];
      order[x - 1][y] = j;
    } else if (y < order.length - 1 && list[order[x][y + 1]].end) {
      //右边
      list[order[x][y]].move(y + 1, x);
      list[order[x][y + 1]].move(y, x);
      j = order[x][y];
      order[x][y] = order[x][y + 1];
      order[x][y + 1] = j;
    } else if (x < order.length - 1 && list[order[x + 1][y]].end) {
      //下边
      list[order[x][y]].move(y, x + 1);
      list[order[x + 1][y]].move(y, x);
      j = order[x][y];
      order[x][y] = order[x + 1][y];
      order[x + 1][y] = j;
    } else if (y > 0 && list[order[x][y - 1]].end) {
      //左边
      list[order[x][y]].move(y - 1, x);
      list[order[x][y - 1]].move(y, x);
      j = order[x][y];
      order[x][y] = order[x][y - 1];
      order[x][y - 1] = j;
    }

    //this.solvability();
    if (this.isOkay()) {
      this.success();
    }
  }
  start() {
    var list = this.itemList;
    for (var i = 0, len = list.length; i < len; i++) {
      list[i].drawing();
      list[i].click(this.regEvent, this);
    }
    this.shuffle();
  }
  sort(array) {
    return array.sort(function () {
      return Math.random() - 0.5;
    });
  }
  shuffle() {
    //洗牌

    if (this.itemList.length == 0) {
      this.init();
      this.start();
      return;
    }

    var order = []; //位置序列

    for (var i = 0; i < this.size * this.size; i++) {
      order.push(i);
    }

    order = this.sort(order);

    while (!this.solvability(order.slice(0), this.size)) {
      //判断当前序列是否能还原
      order = this.sort(order);
    }

    var size = this.size;
    var listOrder = (this.listOrder = []);
    var itemList = this.itemList;

    for (i = 0; i < size; i++) {
      //矩阵
      listOrder.push(order.slice(i * size, (i + 1) * size));
    }
    for (let i = 0, len = listOrder.length; i < len; i++) {
      for (var j = 0; j < listOrder[i].length; j++) {
        itemList[listOrder[i][j]].move(j, i);
      }
    }
  }
  solvability(order, size) {
    //判断当前的拼图是否可以还原
    // 定理1：图形A与图形B等价的充要条件图形A的排列的逆序数加上0元素行号和列号的奇偶性等于图形B的排列的逆序数加上0元素行号和列号的奇偶性。为方便表述，把图形排列的逆序数加上0元素行号和列号的奇偶性称为图形的奇偶性。
    var a;
    var count = 0;
    var m = 0;
    var n = 0;

    var len = order.length;
    size = size || 3;
    //[0,1,2,3,4,5,7,6,8]
    for (var i = 0; i < len; i++) {
      var a = order[i];

      if (a == 8) {
        m = parseInt(i / size);
        n = parseInt(i % size);
      }

      for (var j = i + 1; j < len; j++) {
        if (order[j] < a) {
          count++;
        }
      }
    }
    //console.log(count);
    count += m;
    count += n;
    return count % 2 == 0;
  }
  isOkay() {
    var okay = true;
    var list = this.itemList;
    for (var i = 0, len = list.length; i < len; i++) {
      if (!list[i].isOkay()) {
        okay = false;
        break;
      }
    }
    return okay;
  }
  success() {
    //完成
    this.itemList = [];
    this.container.innerHTML = "";
  }
  keyMove(index) {
    var lie = parseInt((index - 1) / this.size);
    var row = parseInt((index - 1) % this.size);
    this.regEvent(lie, row);
  }
  bindWindow() {
    var _this = this;
    //var keyboard = {97:1,98:2,99:3,100:4,101:5,102:6,103:7,104:8,105:9};//正常键盘
    var keyboard = {
      97: 7,
      98: 8,
      99: 9,
      100: 4,
      101: 5,
      102: 6,
      103: 1,
      104: 2,
      105: 3,
    }; //反转键盘 789 = 123
    document.onkeyup = function (event) {
      var e = event || window.event;
      var index = keyboard[e.keyCode];
      if (index) {
        _this.keyMove(index);
      }
    };
  }
}

function getElementSize(element) {
  const { width, height } = element.getBoundingClientRect();
  // 取较大的值
  const size = Math.min(width, height);
  return {
    width: size,
    height: size,
  };
}

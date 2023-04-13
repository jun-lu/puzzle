export default class Puzz {
  constructor(index, width, height, size, wrap, url, end) {
    this.ele = null;
    this.left = 0;
    this.top = 0;
    this.defaultBackground = "#fff";
    this.width = width;
    this.height = height;
    this.size = size;
    this.wrap = wrap;
    this.url = url;
    this.end = end; // 标识是否最后一个
    this.index = index + 1;
    this.x = 0;
    this.y = 0;
  }
  init() {
    this.create();
  }
  setLeft(value) {
    this.left = value + "px";
  }
  setTop(value) {
    this.top = value + "px";
  }
  setDefaultBackground(color) {
    this.defaultBackground = color;
  }
  getProperty(key) {
    return this[key];
  }
  move(x, y) {
    //移动到一个坐标
    this.setLeft(x * this.width);
    this.setTop(y * this.height);
    this.update();
    this.x = x;
    this.y = y;
  }
  create() {
    var div = document.createElement("div");
    div.className = "puzz-item";
    div.style.width = this.width + "px";
    div.style.height = this.height + "px";
    this.ele = div;

    var col = parseInt((this.index - 1) / this.size);
    var row = parseInt((this.index - 1) % this.size);

    if (this.url && this.end == false) {
      this.setShowBackground(
        "url(" +
          this.url +
          ") no-repeat -" +
          row * this.width +
          "px -" +
          col * this.height +
          "px"
      );
    } else {
      this.setShowBackground(this.defaultBackground);
    }

    this.move(row, col);
  }
  setShowInt() {
    var p = document.createElement("p");
    p.innerText = this.index;
    this.ele.appendChild(p);
  }
  setShowBackground(background) {
    this.ele.style.background = background;
  }
  update() {
    this.ele.style.left = this.left;
    this.ele.style.top = this.top;
  }
  isOkay() {
    return (
      parseInt((this.index - 1) / this.size) == this.y &&
      parseInt((this.index - 1) % this.size) == this.x
    );
  }
  drawing() {
    this.wrap.appendChild(this.ele);
  }
  click(callback, obj) {
    var _this = this;
    this.ele.onclick = () => {
      callback.call(obj, _this.y, _this.x);
    };
  }
}

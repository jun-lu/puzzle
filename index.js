import Puzzle from "./puzzle.js";

var game = new Puzzle(
  document.getElementById("puzzle"),
  3,
  "https://img.alicdn.com/imgextra/i4/O1CN01eC3Z3t1DR8nRi2guC_!!6000000000212-0-tps-300-300.jpg",
  true
);
game.start();

var game2 = new Puzzle(
  document.getElementById("puzzle2"),
  4,
  "https://img.alicdn.com/imgextra/i4/O1CN01eC3Z3t1DR8nRi2guC_!!6000000000212-0-tps-300-300.jpg",
  true
);
game2.start();

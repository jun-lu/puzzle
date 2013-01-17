	
	//一个puzz类
	var Puzz = function(index, width, height, size, wrap, url, end){//顺序 宽度，高度，比例，父容器，url, 是否是最后一个元素
		this.ele = null;
		this.left = 0;
		this.top = 0;
		this.defaultBackground = "#fff";
		this.width = width;
		this.height = height;
		this.size = size;
		this.wrap = wrap;
		this.url = url;
		this.end = end;//标识是否最后一个
		this.index = index + 1;
		this.x = 0;
		this.y = 0;
	};
	Jun.mix(Puzz.prototype, {
		init:function(){
			this.create();
		},
		setLeft:function(value){
			this.left = value+'px';
		},
		setTop:function(value){
			this.top = value+'px';
		},
		setDefaultBackground:function(color){
			this.defaultBackground = color;
		},
		getProperty:function(key){
			return this[key];
		},
		move:function(x, y){//移动到一个坐标
			this.setLeft( x * this.width );
			this.setTop( y * this.height );
			this.update();
			this.x = x;
			this.y = y;
		},
		create:function(){
			var div = Jun.dom.create('div');
			div.className = "puzz-item";
			div.style.width = this.width+"px";
			div.style.height = this.height+"px";
			this.ele = div;
			
			var lie = parseInt((this.index-1)/this.size);
			var row = parseInt((this.index-1)%this.size);
			
			if(this.url && this.end == false){
				this.setShowBackground("url("+ this.url +") no-repeat -"+(row*this.width)+"px -"+(lie*this.height)+"px");	
			}else{
				this.setShowBackground(this.defaultBackground);
			}

			this.move(row, lie);

		},
		setShowInt:function(){
			var p = Jun.dom.create('p');
				p.innerText = this.index;
			Jun.dom.append(this.ele, p);
		},
		setShowBackground:function(background){
			this.ele.style.background = background;
		},
		update:function(){
			this.ele.style.left = this.left;
			this.ele.style.top = this.top;
		},
		isOkay:function(){
			return parseInt((this.index - 1) / this.size) == this.y  && parseInt((this.index-1)%this.size) == this.x;
		},
		drawing:function(x, y){
			Jun.dom.append(this.wrap, this.ele);
		},
		click:function(callback, obj){
			var _this = this;
			this.ele.onclick = function(){
				callback.call(obj, _this.y, _this.x);
			}
		}
	});
	
	
	var Puzzle = function(id, width, height, url, size, isNunber){//容器ID，宽度，高度，图片url, 拆分模块数量, 是否拼数字
		var dom = Jun.dom;
		this.dom = dom;
		this.ele = dom.$(id);
		this.url = url;
		this.width = width;
		this.height = height;
		this.size = size;
		this.itemList = [];//全部item
		this.listOrder = [];//顺序 多维
		this.isNunber = isNunber != false ? true : false;//undefined 
		this.init();
	};
	Jun.mix(Puzzle.prototype, {
		init:function(){
			this.ele.style.background = "url("+this.url+")";
			this.itemWidth = this.width / this.size;
			this.itemHeight = this.height / this.size;
			this.itemList = [];
			this.create();
		},
		create:function(){
			var list = this.itemList;
			var item = null;
			var end = false;
			var url = '';
			for(var i=0, len = this.size * this.size; i<len; i++){
				end =(i+1 == len ? true : false);
				item = new Puzz(i, this.itemWidth, this.itemHeight, this.size, this.ele, this.url, end);//new 新的item
				item.init();
	
				if(this.isNunber == true && end == false){
					item.setShowInt();
				}
				
				list.push( item );
			}
			if(this.size == 3){
				this.bindWindow();//绑定键盘事件 可以用小键盘操作
			}
		},
		regEvent:function(x, y){//判断移动

			var size = this.size;
			var list = this.itemList;
			var order = this.listOrder;
			
			var j = null ;
			
			if(x > 0 && list[order[x-1][y]].end){//上
				list[order[x][y]].move(y, x-1);
				list[order[x-1][y]].move(y, x);
				j = order[x][y];
				order[x][y] = order[x-1][y];
				order[x-1][y] = j;
			}else if(y < order.length-1 && list[order[x][y+1]].end){//右边
				list[order[x][y]].move(y+1, x);
				list[order[x][y+1]].move(y, x);
				j = order[x][y];
				order[x][y] = order[x][y+1];
				order[x][y+1] = j;
			}else if(x < order.length-1 && list[order[x+1][y]].end){//下边
				list[order[x][y]].move(y, x+1);
				list[order[x+1][y]].move(y, x);
				j = order[x][y];
				order[x][y] = order[x+1][y];
				order[x+1][y] = j;
			}else if(y > 0 && list[order[x][y-1]].end){//左边
				list[order[x][y]].move(y-1, x);
				list[order[x][y-1]].move(y, x);
				j = order[x][y];
				order[x][y] = order[x][y-1];
				order[x][y-1] = j;
			}
			
			//this.solvability();
			if(this.isOkay()){
				this.success();
			};
			
		},
		start:function(){
			var list = this.itemList;
			for(var i=0, len=list.length; i<len; i++){
				list[i].drawing();
				list[i].click(this.regEvent, this);
			};
			this.shuffle();
		},
		sort:function(array){
			return array.sort(function(){
				 return Math.random() - 0.5;
			});
		},
		shuffle:function(){//洗牌
		
			if(this.itemList.length == 0){
				this.init();
				this.start();
				return ;
			}
			
			var order = [];//位置序列
			
			for(var i=0; i<this.size * this.size; i++){
				order.push(i);
			};
			
			order = this.sort(order);
			
			while( ! this.solvability(order.slice(0), this.size) ){//判断当前序列是否能还原
				order = this.sort(order);
			}
			
				
			var size = this.size;
			var listOrder = this.listOrder = [];
			var itemList = this.itemList;
			
			for(i=0; i<size ; i++){//矩阵
				listOrder.push(order.slice(i*size, (i+1)*size));
			};
			var list = this.itemList;
			for(i=0,len=listOrder.length; i<len; i++){
				for(var j=0; j<listOrder[i].length; j++){
					itemList[listOrder[i][j]].move(j, i);
				}
			};

		},
		solvability:function(order, size){//判断当前的拼图是否可以还原
			// 定理1：图形A与图形B等价的充要条件图形A的排列的逆序数加上0元素行号和列号的奇偶性等于图形B的排列的逆序数加上0元素行号和列号的奇偶性。为方便表述，把图形排列的逆序数加上0元素行号和列号的奇偶性称为图形的奇偶性。
			var a;
			var count = 0;
			var m = 0;
			var n = 0;
			
			var len = order.length;
			size = size || 3;
			//[0,1,2,3,4,5,7,6,8]
			for(var i=0; i<len; i++){
				var a = order[i];
				
				if(a == 8){
					m = parseInt(i/size);
					n = parseInt(i%size);
				}
					
				for(var j=i+1; j<len; j++){
					
					if(order[j]<a){
						count++;
					}
				}
			}
			//console.log(count);
			count += m;
			count += n;
			return count%2 == 0;
		},
		isOkay:function(){
			var okay = true;
			var list = this.itemList;
			for(var i=0, len=list.length; i<len; i++){
				if( !list[i].isOkay() ){
					okay = false;
					break;
				};
			};
			return okay;
		},
		success:function(){//完成
			this.itemList = [];
			this.ele.innerHTML = '';
		},
		keyMove:function(index){
			var lie = parseInt((index-1)/this.size);
			var row = parseInt((index-1)%this.size);
			this.regEvent(lie , row);
		},
		bindWindow:function(){
			var _this = this;
			//var keyboard = {97:1,98:2,99:3,100:4,101:5,102:6,103:7,104:8,105:9};//正常键盘
			var keyboard = {97:7,98:8,99:9,100:4,101:5,102:6,103:1,104:2,105:3};//反转键盘 789 = 123  
			document.onkeyup = function(event){
				var e = event || window.event;
				var index = keyboard[e.keyCode];
				if(index){
					_this.keyMove(index);
				}
			}
		}
	});
	
	var PuzzTest = {// 测试api
		order1:[0,1,2,3,4,5,7,6,8],
		shuffleOrder:function(order){//按照order的顺序来刷新
			var size = this.size;
			var listOrder = this.listOrder = [];
			var itemList = this.itemList;
			
			for(i=0; i<size ; i++){//矩阵
				listOrder.push(order.slice(i*size, (i+1)*size));
			};
			var list = this.itemList;
			for(i=0,len=listOrder.length; i<len; i++){
				for(var j=0; j<listOrder[i].length; j++){
					itemList[listOrder[i][j]].move(j, i);
				}
			};
		}	
	};
	
	
	
	


    /**
        id 容器id
        width 宽度
        height 高度
        url 图片地址
        size 维度(拼图维度)
        isNunber 是否拼数字
    */
    
    var Puzzle = function(id, width, height, url, size, isNunber){
		var dom = Jun.dom;
        this.id = id;
		this.ele = dom.$(id);
		this.url = url;
		this.width = width;
		this.height = height;
		this.size = size;
        this.order = null;//初始顺序
		this.itemList = [];//全部item
		this.listOrder = [];//顺序 多维
		this.isNunber = isNunber != false ? true : false;//undefined
        this.process = []; //记录拼图过程
        this.lastTime = 0;//上一次拼图时间
        this.stepCount = 0;//步数统计
        this.beginTime = 0;//开始时间
        this.timeCount = 0;//累计时间
        this.timeHTML = '<div class="time"><span>0</span> <span>00:00.000</span></div>';
		this.init();
	};
	Jun.mix(Puzzle.prototype, {
		init:function(){
			this.ele.style.background = "url("+this.url+")";
			this.itemWidth = this.width / this.size;
			this.itemHeight = this.height / this.size;
            
            this.process = []; //记录拼图过程
            this.lastTime = 0;//上一次拼图时间
            this.stepCount = 0;//步数统计
            this.beginTime = 0;//开始时间
            this.timeCount = 0;//累计时间
            
            if(this.itemList.length == 0){
                this.create();
            }
		},
		create:function(){
			var list = this.itemList;
			var item = null;
			var end = false;
			var url = '';
			for(var i=0, len = this.size * this.size; i<len; i++){
				end =(i+1 == len ? true : false);
				item = new Puzz(i, this.itemWidth, this.itemHeight, this.size, this.ele, this.url, end, this);//new 新的item
				item.init();
	
				if(this.isNunber == true && end == false){
					item.setShowInt();
				}
				
				list.push( item );
			}
            
            var spans = this.ele.getElementsByTagName('span');
            
            this.stepCountEle = spans[0];
            this.timeCountEle = spans[1];
            
			if(this.size == 3){
				this.bindWindow();//绑定键盘事件 可以用小键盘操作
			}
		},
        updateStepCount:function(){
            this.stepCountEle.innerText = this.stepCount;
        },
        updateTimeCount:function(){
            function fomater(time){
                return Jun.pad(parseInt(time/100/60), 2, '0') + ":"+ Jun.pad(parseInt(time/100%60), 2, '0')+"."+parseInt(time%60);
              }
            this.timeCountEle.innerText = fomater(this.timeCount);
        },
        begin:function(){
          var _this = this;
          this.beginTime = new Date().getTime();
          this.timeInter = setInterval(function(){
            _this.timeCount = new Date().getTime() - _this.beginTime;
            _this.updateTimeCount();
          },10);
        },
        endTime:function(){
            clearInterval( this.timeInter );
        },
		regEvent:function(x, y, index){//判断移动
            
			var size = this.size;
			var list = this.itemList;
			var order = this.listOrder;
			
			var j = null ;
            
            if(this.lastTime == 0){
                this.lastTime = new Date().getTime();
                this.begin();
            }

            var step = {
                index:index,
                delay:new Date().getTime() - this.lastTime
            };
            
			this.lastTime = new Date().getTime();
            
			if(x > 0 && list[order[x-1][y]].end){//上
                this.stepCount++;
                index != undefined && this.process.push(step);
				list[order[x][y]].move(y, x-1);
				list[order[x-1][y]].move(y, x);
				j = order[x][y];
				order[x][y] = order[x-1][y];
				order[x-1][y] = j;
			}else if(y < order.length-1 && list[order[x][y+1]].end){//右边
                this.stepCount++;
                index != undefined && this.process.push(step);
				list[order[x][y]].move(y+1, x);
				list[order[x][y+1]].move(y, x);
				j = order[x][y];
				order[x][y] = order[x][y+1];
				order[x][y+1] = j;
			}else if(x < order.length-1 && list[order[x+1][y]].end){//下边
                this.stepCount++;
                index != undefined && this.process.push(step);
				list[order[x][y]].move(y, x+1);
				list[order[x+1][y]].move(y, x);
				j = order[x][y];
				order[x][y] = order[x+1][y];
				order[x+1][y] = j;
			}else if(y > 0 && list[order[x][y-1]].end){//左边
                this.stepCount++;
                index != undefined && this.process.push(step);
				list[order[x][y]].move(y-1, x);
				list[order[x][y-1]].move(y, x);
				j = order[x][y];
				order[x][y] = order[x][y-1];
				order[x][y-1] = j;
			}
			
            
            this.updateStepCount();
			//this.solvability();
			if(this.isOkay()){
				this.success();
                this.endTime();
			};
			
		},
		start:function(){
			var list = this.itemList;
			for(var i=0, len=list.length; i<len; i++){
				list[i].drawing();
				//list[i].click(this.regEvent, this);
			};
			this.shuffle();
		},
		sort:function(array){
			return array.sort(function(){
				 return Math.random() - 0.5;
			});
		},
		shuffle:function(order){//洗牌
            
			if(this.itemList.length == 0){
				this.init();
				this.start();
				return ;
			}
            
            this.beginTime = 0;
            this.stepCount = 0;
            this.timeCount = 0;
            this.updateStepCount();
            this.updateTimeCount();
            
            if(order === undefined){//如果没有指定顺序
                order = [];//位置序列
                for(var i=0; i<this.size * this.size; i++){
                    order.push(i);
                };
                order = this.sort(order);
			}
            
			while( ! this.solvability(order.slice(0), this.size) ){//判断当前序列是否能还原
				order = this.sort(order);
			}
			
			this.order = order;
			var size = this.size;
			var listOrder = this.listOrder = [];
			var itemList = this.itemList;
			
			for(i=0; i<size ; i++){//矩阵
				listOrder.push(order.slice(i*size, (i+1)*size));
			};
            
			for(i=0,len=listOrder.length; i<len; i++){
				for(var j=0; j<listOrder[i].length; j++){
					itemList[listOrder[i][j]].move(j, i);
                    itemList[listOrder[i][j]].show();
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
			//this.itemList = [];
			//this.ele.innerHTML = '';
            for(var i=0; i<this.itemList.length; i++){
                this.itemList[i].hide();
            }
            this.stopPlay();//停止播放
           
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
			};
		},
        stopPlay:function(){
            clearTimeout( this.playTimeer );
        },
        playVideo:function(){
            new PuzzlePlayVideo(this.id, this).play();
        }
	});
    

    /**
        puzzle 录像播放器
        
        puzzleVoid puzzle的实例
        必要数据
        
        在某个id容易中播放 puzzleVoid录像
    */
    
    function PuzzlePlayVideo(id, puzzleVoid){
        this.puzzleVoid = puzzleVoid;
        
        this.id = id;
        this.ele = dom.$(id);
        this.url = puzzleVoid.url;
        this.size = puzzleVoid.size;
        this.width = puzzleVoid.width;
        this.height = puzzleVoid.height;
        this.isNunber = puzzleVoid.isNunber;
        this.order = puzzleVoid.order;//初始顺序
        this.process = puzzleVoid.process.slice();//录像过程
        
        this.itemList = [];//全部item
		this.listOrder = [];//顺序多维
        
        this.init();
    };
    
    Jun.mix(PuzzlePlayVideo.prototype, Puzzle.prototype);
    Jun.mix(PuzzlePlayVideo.prototype, {
        play:function(){
            var i = 0;
            //this.timeCount = ;
            this.lastTime = 0;
            this.stopPlay();
            this.shuffle( this.order );
            this.playStep(i);
        },
        playStep:function(i){
            var _this = this;
            var order = this.order;
            var itemList = this.itemList;
            var step = this.process[i];
            
            var puzz = itemList[ step.index-1 ];
            this.regEvent(puzz.y, puzz.x);
            
            if(i+1 < this.process.length){
                this.playTimeer = setTimeout(function(){
                    _this.playStep(i+1);
                }, this.process[i+1].delay);
            }
        }
    });

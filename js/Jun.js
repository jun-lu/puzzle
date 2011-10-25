/*
 *
 *  Jun.dom  dom操作列表
 *  Jun.event Event事件对象
 *  Jun.array 数组快捷
 *  Jun.string 字符串快捷
 *  Jun.animate dom变快
 *  Jun.com 其他组件
 */
 
;(function(win, name, undef){
	
	win[name] = {};
	
	var mix = function(a, b){
		for(var i in b){
			a[i] = b[i];
		}
		return a;
	}
	var log = function(msg, type){
		window.console && window.console[type || 'log'](msg);
	}
	
	var B = {
		isIE:false,
		isIE6:false
	}
	
	mix(win[name], {"mix":mix, 'log':log, 'B':B});
	
	
})(window, 'Jun', undefined)
/*
 * Jun.dom 
 * Jun Lu 
 * 2011-02-08 20:42
 */
 
 ;(function(){

	 Jun.dom = {
		
		/* query */
		
		get:function(id){
			return document.getElementById(id);
		},
		$:function(id){
			return document.getElementById(id);
		},
		getTG:function(elem, tagName){
			return elem.getElementsByTagName(tagName);
		},
		
		query:function(string){
			return document.querySelector(string);
		},
		create:function(tagName){
			return document.createElement(tagName);
		},
		
		
		/* DOM Three find*/
		first:function(element){
			//elem = getElem(elem, this);
			var first = element.firstElementChild;//高级浏览器
			if(first || first === null){
				return first;
			}
			
			// first = elem.firstChild;//ie6 7 8
			// if(first ===null || this.isElement(first)){
				// return first;
			// }
			// return this.next(first);
			
			element = element.firstChild;
			
			while(element != null && !this.isElement(element)){
				element = element.nextSibling;
			}
			
			return element;
			//return elem.firstElementChild;//.firstChild;
			
		},
		
		last:function(elem){
			//elem = getElem(elem, this);
			var last = elem.lastElementChild;//.lastChild;
			if(last || last === null){
				return last;
			}
			last = elem.lastChild;
			if(last === null || this.isElement(last)){
				return last;
			}
			return this.prev(last);
		},
		
		hasChilds:function(elem){
			return elem.hasChildNodes();
		},
		
		parent:function(elem){
			//return elem.parentElement; ie 非标准
			return elem.parentNode;//对于已经删除的元素 标准返回null，IE6返回的祖先元素为 document-fragment
		},
		
		next:function(elem){
			//elem = getElem(elem, this);
			var next = elem.nextElementSibling;
			
			if(next || next === null){
				return next;
			}
			
			next = elem.nextSibling;
			if(next === null || this.isElement(next)){
				return next;
			}
			
			return this.next(next);
		},
		
		prev:function(elem){

			//elem = getElem(elem, this);
			var prev = elem.previousElementSibling;//.previousSibling;

			if(prev || prev === null){
				return prev;
			}
			prev = elem.previousSibling;

			if(prev === null || this.isElement(prev)){
				return prev;
			}
			return this.prev(prev);
		},
		find:function(elem, string){
			throw 'Jun.dom.find Error';
			//return document.querySelector(string);
		},
				
		/* dom 写入 */
		attr:function(elem, key, value){
			if(value){
				elem.setAttribute(key, value);
				return elem;
			}else{
				elem.getAttribute(key);
			}
		},
		
		removeAttr:function(elem, key){
			elem.removeAttribute(key);
			return elem;
		},
		
		css:function(elem, key, value){
			if(value === undefined){
				key = key.replace(/([A-Z])/g, "-$1");
				key = key.toLowerCase();
				return parseFloat(window.getComputedStyle(elem, null).getPropertyValue(key));
			}else{
				elem.style[key] = value;
				return elem;
			}
		},
		
		
		// 文档判断
		isElement:function(elem){
			//标准dom节点
			return elem.nodeType == 1;
		},
		
		isText:function(elem){
			// 文本节点
			return elem.nodeType == 3;
		},
		isString:function(content){
			return typeof content === "string";
		},
		// 文档处理
		html:function(elem, html){
			if(html){
				elem.innerHTML = html;
				return elem;
			}else{
				return elem.innerHTML;
			}
		},
		
		htmlForElem:function(html){
			var ele = this.create("DIV");
			var documentFragment = document.createDocumentFragment("DIV");
			ele.innerHTML = html;
			while(ele.firstChild){
				documentFragment.appendChild(ele.firstChild);
			}
			return documentFragment;
		},

		remove:function(ele){
			var parent = this.parent(ele);
			return parent && parent.removeChild(ele);
		},
		before:function(ele, content){
			if(this.isString(content)){
				content = this.htmlForElem(content);
			}
			return ele.parentNode.insertBefore(content, ele);
		},
		after:function(ele, content){
			if(this.isString(content)){
				content = this.htmlForElem(content);
			}
			var parent = this.parent(ele);
			return parent.lastChild == ele ? parent.appendChild(content) : parent.insertBefore(content, ele.nextSibling);

		},
		append:function(ele, content){
			if(this.isString(content)){
				content = this.htmlForElem(content);
			}
			return ele.appendChild( content );//如果传入字符串 返回值是 Document Fragment 并且为空
		},
		
		//文档动画
		animate:function(elem, style, val, callBack, time, px){
			px = px || 'px'; //---   这里还需要进一步判断
			time = time || 300;
			var b = parseFloat(Jun.dom.css(elem, style));
			val = val - b;
			var st = new Date().getTime();
			var a = setInterval(function(){
				var t = new Date().getTime() - st;
				if( t > time){t = time;clearInterval(a);callback&&callback();}
				elem.style[style] = parseFloat(tween.eain(t, b, val, time));// + px;
			}, 10);
			return a;
		},
		on:function(element, type, fn){
			if(element.addEventListener){
				element.addEventListener(type, fn, false);
			}else if(element.attachEvent){
				element.attachEvent("on"+type, fn);// this会指向window
			}else{
				element["on"+type] = fn;
			};
			return element;
		},
		off:function(element, type, fn){
			if(element.removeEventListener){
				element.removeEventListener(type, fn, false);
			}else if(element.detachEvent){
				element.detachEvent("on"+type, fn);
			}else{
				element["on"+type] = null;
			};
			return element;
		}
	 };
	 
	 
	 var tween = {
	 	eain:function(t, b, c, d){ return - c * (t /= d) * (t - 2) + b}
	 }
 	
  })();
 
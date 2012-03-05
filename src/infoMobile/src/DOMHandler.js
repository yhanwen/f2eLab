/**
 * DOM 方法集体
 */

var DOM = DOMHander = {
	getAll:function(sel,par){
		return (par||document).querySelectorAll(sel);
	},
	get:function(sel,par){
		return this.getAll(sel,par)[0];
	},
	create:function(tag){
		return document.createElement(tag);
	},
	getInnerHeight:function(){
		return window.innerHeight;
	},
	addClass:function(el,name){
		var className = el.className, classes =className.split(" "), newClassName=[];
		for(i in classes){
			if(classes[i]==name){
				return;
			}else{
				if(classes[i]!=""){
					newClassName.push(classes[i]);
				}
			}
		}
		newClassName.push(name);
		el.className = newClassName.join(" ");
	},
	removeClass:function(el,names){
		var className = el.className, classes =className.split(" "), newClassName=[];
		function setNewName(){
			for(i in classes){
				if (names.push) {
					var isRemove = false;
					for (j in names) {
						isRemove = isRemove||!(classes[i] != names[j] && classes[i] != "")
					}
					if(!isRemove)newClassName.push(classes[i]);
				}
				else {
					if (classes[i] != names && classes[i] != "") {
						newClassName.push(classes[i]);
					}
				}
			}
		}
		setNewName()
		
		el.className = newClassName.join(" ");
	},
	removeStyle:function(el,name){
		var style = el.getAttribute("style"), reg = new RegExp('^|\s|;\s'+name+'')
	}
}

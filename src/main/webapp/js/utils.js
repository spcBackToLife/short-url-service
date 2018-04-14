//获取request中的参数
function getQueryString(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

//以post方式调用ajax请求，参数分别是请求的url、json格式的参数、回调函数
function ajaxRequest(url,paramJson,func){
	if(paramJson==undefined){
		paramJson={};
	}
	if(func==undefined){
		func=_defaultAjaxCallBack;
	}
	$.post(url,paramJson,func,"json");
}

//以get方式调用ajax请求，参数分别是请求的url、json格式的参数、回调函数
function ajaxGetRequest(url,paramJson,func){
	if(paramJson==undefined){
		paramJson={};
	}
	if(func==undefined){
		func=_defaultAjaxCallBack;
	}
	$.get(url,paramJson,func,"json");
}

//以post方式调用ajax请求默认的回调函数
function _defaultAjaxCallBack(ret){
	if(ret.returnCode=='0'){
		$Top.Dialog.alert("操作成功！");
	}else{
		$Top.Dialog.alert("操作失败！");
	}
}

//自动补全contextpath的ajax请求
function ajaxRequestNoCtxPath(url,paramJson,successFunc,errorFunc){
	if(url.indexOf("/")==0){
		url = jsContextPath + url;
	}else{
		url = jsContextPath + "/"+ url;
	}
	if(paramJson==undefined){
		paramJson={};
	}
	if(successFunc==undefined){
		successFunc=_defaultSuccessCallBack;
	}
	if(errorFunc==undefined){
		errorFunc=_defaultErrorCallBack;
	}
	$.ajax({
		  type: 'POST',
		  url: url,
		  data: paramJson,
		  success: successFunc,
		  error : errorFunc ,
		  dataType: "json"
	});
}

function _defaultSuccessCallBack(data){
	 $Top.Dialog.alert("操作成功！");  
	 grid.loadData();
}

function _defaultErrorCallBack(data){
	 $Top.Dialog.alert(data.responseText);  
}

(function($){
	var idSeed = 0;
	$.extend({
		/**
	    *判断是否为空
	    */
	   isEmpty : function(v, allowBlank){
	       return v === null || v === undefined || (($.isArray(v) && !v.length)) || (!allowBlank ? v === '' : false);
	   },
	   //将参数转为对象
	   urlDecode : function(string, overwrite){
	       if($.isEmpty(string)){
	           return {};
	       }
	       var obj = {},
	           pairs = string.split('&'),
	           d = decodeURIComponent,
	           name,
	           value;
	       $.each(pairs, function(index,pair) {
	           pair = pair.split('=');
	           name = d(pair[0]);
	           value = d(pair[1]);
	           obj[name] = overwrite || !obj[name] ? value :
	                       [].concat(obj[name]).concat(value);
	       });
	       return obj;
	   },
	    //随机取数
	   	id : function(el, prefix){
	        return (el = $(el)[0] || {}).id = el.id || (prefix || "upp-gen") + (++idSeed);
		},
		//提交页面
		request:function(cfg){
			var url = cfg.url;
			if ($.isEmpty(url)){
				$Top.Dialog.alert('url参数不能为空！');
				return;
			}
			var index =url.indexOf("?") ,query;
			//已post方式提交,分解url及查询参数 
//			if( index !== -1){
//				query = url.substring(index + 1);
//				url = url.substring(0, index);
//			}
			
			var id = 'x-upp-form',
				 form = $("#"+id),
				 html="<form id='x-upp-form' style='display:none'><form/>",
				 extraParams = cfg.params;
			if (!form.length){
				form = $(html).appendTo("body");
			}else{
				form.html("");
			}
			form.attr({
				target : cfg.target || (extraParams && extraParams.target) || '_self',
				//action : url.indexOf('/') == 0 ? jsContextPath+ url : url,
				action:url,
				method:'POST'
			});
			if (query) {
				var o = $.urlDecode(query,false);
				for(var n in o){
					$("<input type=\"hidden\" name=\""+n+"\">").val(o[n]||'').appendTo(form);
				}
			}
			//处理额外参数
			if (extraParams) {
				for(var n in extraParams){
					$("<input type=\"hidden\" name=\""+n+"\">").val(extraParams[n]||'').appendTo(form);
				}
			}
			form[0].submit();
		}
		
	});
})(jQuery);


//弹出窗口
function popWindow(url,title,height,width) {
	var options = $.isPlainObject(url)?url:{
		url:url,
		title:title,
		height:height,
		width:width
	};
	var dlg = new $Top.Dialog({
		Modal:true,
		Title: options.title||"新增/编辑",
		Width:options.width || 740,
		Height:options.height || 530,
		URL:options.url,
		Params:options.params,
		ShowOkButton:false,
		ShowButtonRow:!!options.buttons
	});
	dlg.show();
    if(options.buttons){
    	for(var i in options.buttons){
    		var btn = options.buttons[i];
    		dlg.addButton(btn.id,btn.text,btn.handler)
    	}
    }
    return dlg;
};


//弹出自定义id的窗口(弹出多个dialog页面，并且页面之间有交互时需要用到，例如主从关系选择页面)
function popWindowWithId(url,title,id,height,width) {
	var options = $.isPlainObject(url)?url:{
		url:url,
		id:id,
		title:title,
		height:height,
		width:width
	};
	if(!options.id){
		$Top.Dialog.alert("对话框参数id不能为空！");
		return;
	}
	var dlg = new $Top.Dialog({
		Modal:true,
		Title: options.title||"新增/编辑",
		Width:options.width || 740,
		Height:options.height || 530,
		URL:options.url,
		ID:options.id,
		Params:options.params,
		ShowOkButton:false,
		ShowButtonRow:!!options.buttons
	});
	dlg.show();
    if(options.buttons){
    	for(var i in options.buttons){
    		var btn = options.buttons[i];
    		dlg.addButton(btn.id,btn.text,btn.handler)
    	}
    }
    return dlg;

}

//关闭弹出窗口
function closeDialog(){
	$Top.Dialog.close();
}

//删除的方法，多个id以逗号隔开
function deleteEntity(entityName,entityId,hint){
	if(hint==""||hint==undefined)
		hint="确定要删除吗？";
	$Top.Dialog.confirm(hint,function(){
	  	$.post(jsContextPath+"/upp/comm/delete.do",
	  			{"uppEntityId":entityId,"uppEntityName":entityName},
	  			function(result){	  				
					if(result.returnCode == '0'){
						$Top.Dialog.alert("删除成功！");
						grid.loadData();
					} else {
						$Top.Dialog.alert("删除失败！");
					}
		},"json");
	});
}

//批量删除实体的方法，多个id以逗号隔开
function deleteEntities(entityName,ids,hint){
	if(hint==""||hint==undefined)
		hint="确定要删除吗？";
	$Top.Dialog.confirm(hint,function(){
	  	$.post(jsContextPath+"/upp/comm/deleteBatch.do",
	  			{"ids":ids,"uppEntityName":entityName},
	  			function(result){	  				
					if(result.returnCode == '0'){
						$Top.Dialog.alert("删除成功！");
						grid.loadData();
					} else {
						$Top.Dialog.alert("删除失败！");
					}
		},"json");
	});
}

//根据传入sqlId批量删除的方法，多个id以逗号隔开
function deleteBySqls(sqlId,ids,hint){
	if(hint==""||hint==undefined)
		hint="确定要删除吗？";
	$Top.Dialog.confirm(hint,function(){
	  	$.post(jsContextPath+"/upp/comm/updateOrDeleteBySqls.do",
	  			{"ids":ids,"sqlId":sqlId},
	  			function(result){
					if(result.returnCode == '0'){
						$Top.Dialog.alert("删除成功！");
						grid.loadData();
					} else {
						$Top.Dialog.alert("删除失败！");
					}
		},"json");
	});
}

// 获取当前日期
function getDate() {
	var today = new Date(); 
	var fullYear = today.getFullYear();
	var month = (today.getMonth() + 1) < 10?("0" + (today.getMonth() + 1)):(today.getMonth() + 1);
	var day = today.getDate() < 10 ? ("0"+today.getDate()) : today.getDate();
 	return fullYear + '-' + month + '-' + day;
}

//回车触发查询
$(function() {
	$("#queryForm").bind("keydown", function(event) {
		if (event.keyCode == 13) {
			try {
				if (typeof (eval(searchHandler)) == "function") {
					searchHandler();
				}
			} catch (e) {
				//alert("查询的函数名是searchHandler，通用回车触发查询才有效");
			}
		}
	});
});

//字符串 全部替换
String.prototype.replaceAll = function(s1,s2) { 
    return this.replace(new RegExp(s1,"gm"),s2); 
}

//以js给textarea设置值得方式，需要以此方式更新剩余字数提示
function updateTextAreaCharsLeft(){
	$("textarea").each(function(i,item){
		if($(item).attr('maxNum')){
			item.nextSibling.innerText="剩余字数 :"+ ($(item).attr('maxNum') - item.value.length);
		}
	});
}

//处理键盘事件 禁止后退键（Backspace）调回至上一页面  
function forbidBackSpace(e) {
        var ev = e || window.event;
        var obj = ev.target || ev.srcElement; 
        var t = obj.type || obj.getAttribute('type');
        var vReadOnly = obj.readOnly;
        var vDisabled = obj.disabled;
        vReadOnly = (vReadOnly == undefined) ? false : vReadOnly;
        vDisabled = (vDisabled == undefined) ? true : vDisabled;
        var flag1 = ev.keyCode == 8 && (t == "password" || t == "text" || t == "textarea") && (vReadOnly == true || vDisabled == true);
        var flag2 = ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea";
        if (flag2 || flag1) return false;
}
document.onkeypress = forbidBackSpace;
document.onkeydown = forbidBackSpace;

//功能权限控制相关。在chrome下a href以及span加disable属性不起作用，标签解析时会在没有权限的元素上加  onmouseover="javascript:_removeClickFunc();"
//只处理a、span，用onmouseover事件触发函数把链接设为#或者移除span的onclick属性
function _removeClickFunc(e){
	var ev = e || window.event;
    var obj = ev.target || ev.srcElement; 
    var tagName = obj.tagName.toLowerCase();
    if(tagName == "a"){
   	 	obj.href="#";
    }
    if(tagName == "span"){
   		obj.onclick = null;
    }
    obj.onmouseover = null;
}

$.fn.serializeObject = function()    
{    
   var o = {};    
   var a = this.serializeArray();    
   $.each(a, function() {    
       if (o[this.name]) {    
           if (!o[this.name].push) {    
               o[this.name] = [o[this.name]];    
           }    
           o[this.name].push(this.value || '');    
       } else {    
           o[this.name] = this.value || '';    
       }    
   });    
   return o;    
};  
//链接
var linkFormatter =function(row, index, v, column){
		var emptyText=column.emptyText;
		v = v || emptyText;
	if(v === null || v === undefined || !$.trim(v).length){
       	return '&#160;';
   	}
	return '<span  class="x-grid-cell-link" title="'+v+'" column="'+column.name+'">'+v+'</span>';
};
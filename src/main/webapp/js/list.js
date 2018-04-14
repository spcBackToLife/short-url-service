var originalGridParam;//用于记录grid表格中定义的params。在searchHandler方法中用到

//dialog页面操作结果提示以及刷新列表页面grid
function refreshGrid(retObject){
	if(retObject.returnCode != "0"){
		$Top.Dialog.alert(retObject.returnMsg);
	}else{
		$Top.Dialog.alert(retObject.returnMsg);
		grid.loadData();
	}
}

//获取grid默认列checkbox选中行的属性值，参数为列的字段名，选中多行时返回格式为val1,val2
function getSelectedRowsValue(columnName,gridObj) {
	grid = gridObj == undefined ? grid : gridObj;
	var rows = grid.getSelectedRows();
	var rowsLength = rows.length;
	if(rowsLength == 0) {
		//top.Dialog.alert("请选中一条记录!");该行通常页面js函数中会加判断，重复弹提示不好
		return;
	}
	var ids="";
	$.each(rows,function(i,n){
		ids+=","+n[columnName];
	});
	return ids.substr(1);
}



//获取grid默认列checkbox选中行的属性值，参数为列的字段名，选中多行时返回格式为val1,val2
function getRowsValue(columnName,gridObj) {
	grid = gridObj == undefined ? grid : gridObj;
	debugger;
	var rows = grid.getData();
	
	var rowsLength = rows.length;
	if(rowsLength == 0) {
		//top.Dialog.alert("请选中一条记录!");该行通常页面js函数中会加判断，重复弹提示不好
		return;
	}
	var ids="";
	$.each(rows,function(i,n){
		ids+=","+n[columnName];
	});
	return ids.substr(1);
}

//获取以radio选中行的属性值，参数为radio的名称、列的字段名、grid组件的变量名（默认为grid）
//radio必须有name属性，只支持单选
function getRadioCheckedRowValue(radioName,columnName,gridObj){
	var checkedRowIndex=-1;
	$('input[name='+radioName+']').each(function(index,radioObj){    
		 if(radioObj.checked==true){
			 checkedRowIndex=index;
			 return false;
		 }
	});  
	if(checkedRowIndex>-1){
		grid = gridObj == undefined ? grid : gridObj;
		var checkedRow=grid.getRow(checkedRowIndex);
		return checkedRow[columnName];
	}
	return;
}

//查询。默认js中grid的名称都定义为“grid”，如果列表中有多个grid对象，可传入gird名称
function searchHandler(gridObj,queryFormId){
    grid = gridObj == undefined ? grid : gridObj;
    var formId = queryFormId == undefined ? "queryForm" : queryFormId;
	var query = $("#" + formId).formToArray();
	if(!originalGridParam){//用于记录grid表格中定义的params，以免查询时params重复
		originalGridParam = grid.getParams();
	}
	$.each(originalGridParam,function(i,n){
		query.push({name : i,value : n});
	});
	
	for(var i=0;i<query.length;i++){
		setCookie(query[i].name,$("#"+query[i].name).val());
	}
	
	grid.setOptions({ params : query});//grid.getParams()获取的就是query
    grid.setNewPage(1);
    grid.loadData();
    //grid.setOptions({ params : value});//（不能用这方法，否则翻页不保留查询条件）grid.getParams()获取的是setOptions中的参数，所以在这需要重置
}

//列表页面查询表单“重置”按钮触发的函数
function resetSearch(queryFormId){
	var formId = queryFormId == undefined ? "queryForm" : queryFormId;
	$("#" + formId)[0].reset();
	$("#" + formId+" select").setValue("")//resetValue(); 

	clearAllCookie()
	
}

//关系选择页面提交成功后，在tab页中寻找父页面
function _findIframeWindow(window){
	if(win != null){
		return; 
	}else{
		var $$ = window.$;
		if($$){
			$$("iframe[id^='page_']").each(function(){
				if($$(this).css("display") === "inline"){
					win = this.contentWindow;
					return false;
				}
			});
		}
		if(win != null){
			return;
		}
		var fs = window.frames;
		for(var i = 0 ; i < fs.length ; i++){
			_findIframeWindow(fs[i]);
		}
	}
}


function goBack(){
	
	top.document.getElementById("frmright").cookieFlag=true;
	top.frmright.history.go(-1);
	
	cookieFlag=true;
}

function viewDetails(url,queryFormId){
	var formId = queryFormId == undefined ? "queryForm" : queryFormId;

	var query = $("#" + formId).formToArray();
	
	for(var i=0;i<query.length;i++){
		setCookie(query[i].name,$("#"+query[i].name).val());
	}
	
	setCookie("formId",formId);
	setCookie("pageSize",grid.options.pageSize);
	setCookie("pageNo",grid.options.page);
	location.href = url;
	
}
$(function(){  
	   $($Top.frmright).load(function(){
		 //如果false删除cookies
		   
		   
		   if(top.document.getElementById("frmright").cookieFlag==true){
			   console.log(document.cookie);
			   
			   var query = $("#" + getCookie("formId")).formToArray();
			   for(var i=0;i<query.length;i++){
				   var el = $("#"+query[i].name);
				   if(el.prop("tagName")=="INPUT"){
					   el.val(getCookie(query[i].name));
				   }
				   else if(el.prop("tagName")=="SELECT"){
					   el.setValue(getCookie(query[i].name));

				   }
				   
				}
//			   query = $("#" + getCookie("formId")).formToArray();
//				if(!originalGridParam){//用于记录grid表格中定义的params，以免查询时params重复
//					originalGridParam = $Top.frmright.grid.getParams();
//				}
//				$.each(originalGridParam,function(i,n){
//					query.push({name : i,value : n});
//				});
				
				setTimeout(function(){
					searchHandler();
					   $Top.frmright.grid.options.pageSize=getCookie("pageSize");
					   var pageNo=getCookie("pageNo");
					   
//			            //页号重置
					   $Top.frmright.grid.setNewPage(pageNo);
//			            //刷新表格数据 
					   $Top.frmright.grid.loadData();
					   top.document.getElementById("frmright").cookieFlag=false;
				},0);
				
		   }
		  
	    });
      
});

function setCookie(c_name,value,expiredays)
{
var exdate=new Date()
exdate.setDate(exdate.getDate()+expiredays)
document.cookie=c_name+ "=" +escape(value)+
((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
}
function getCookie(c_name)
{
if (document.cookie.length>0)
  {
  c_start=document.cookie.indexOf(c_name + "=")
  if (c_start!=-1)
    { 
    c_start=c_start + c_name.length+1 
    c_end=document.cookie.indexOf(";",c_start)
    if (c_end==-1) c_end=document.cookie.length
    return unescape(document.cookie.substring(c_start,c_end))
    } 
  }
return ""
}
//清除cookie    
function clearCookie(name) {    
 setCookie(name, "", -1);    
}
function clearAllCookie(){
	var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
	if (keys) {
	for (var i = keys.length; i--;)
	document.cookie=keys[i]+'=0;expires=' + new Date( 0).toUTCString()
	} 
}
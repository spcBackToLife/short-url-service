/**
 * 获取grid中指定字段的集合
 * @param columnName
 * @param gridObj
 * @returns
 */
function getRowsValue(columnName,gridObj) {
   grid = gridObj === undefined ? grid : gridObj;
   var rows = grid.getData();
   var rowsLength = rows.length;
   if(rowsLength === 0) {
       //top.Dialog.alert("请选中一条记录!");该行通常页面js函数中会加判断，重复弹提示不好
       return;
   }
   var ids="";
   $.each(rows,function(i,n){
       ids+=","+n[columnName];
   });
   return ids.substr(1);

}

/**
 * 初始化表单
 */
function setFormValue(formId,baseInfo){
		if(baseInfo !== "" && baseInfo !== undefined){
			$("form[id='"+formId+"']").find("input[type!='button'][type!='submit']").each(function(){
				var inputName = $(this).attr("name");
				if(inputName !== undefined&&inputName !== null){
					if(baseInfo[inputName] !== undefined){
						$(this).val(baseInfo[inputName]);
						//$("#"+inputId).val(baseInfo[inputId]);
					}
				}
			});
			$("form[id='"+formId+"']").find(".selectTree").each(function(){
				var selectName = $(this).attr("name");
				if(selectName !== undefined && selectName !== null){
					if(baseInfo[selectName] !== undefined){
						$(this).setValue(baseInfo[selectName]);
					}
				}

			});

			$("form[id='"+formId+"']").find("textarea").each(function(){
				var textareaName = $(this).attr("name");
				if(textareaName !== undefined&&textareaName !== null){
					if(baseInfo[textareaName] !== undefined){
						$(this).val(baseInfo[textareaName]);
						//$("#"+textareaId).val(baseInfo[textareaId]);
					}
				}
			});
			$("form[id='"+formId+"']").find("select").each(function(){
				var selectName = $(this).attr("name");
				if(selectName !== undefined&&selectName !== null){
					if(baseInfo[selectName] !== undefined){
						//$("#"+selectId).setValue(baseInfo[selectId]);
						$(this).setValue(baseInfo[selectName]);
						//$(this).val(baseInfo[selectName]);
					}
				}
			});
		}
}


//禁用form表单中所有的input[文本框、复选框、单选框],select[下拉选],多行文本框[textarea]

function disableForm(formId,isDisabled) {
 var attr="disable";
	if(!isDisabled){
	   attr="enable";
	}
	$("form[id='"+formId+"'] :text").attr("disabled",isDisabled);
	
	$("form[id='"+formId+"'] textarea").attr("disabled",isDisabled);
//	$("#executeType").prop("disabled", false);
	$("form[id='"+formId+"'] select").attr("disabled",isDisabled);
//	$("form[id='"+formId+"'] select").attr("disabled",isDisabled);
	$("form[id='"+formId+"'] :radio").attr("disabled",isDisabled);
	$("form[id='"+formId+"'] :checkbox").attr("disabled",isDisabled);

	//禁用jquery easyui中的下拉选（使用input生成的combox）

	$("#" + formId + " input[class='combobox-f combo-f']").each(function () {
		if (this.id) {
			$("#" + this.id).combobox(attr);
		}
	});

	//禁用jquery easyui中的下拉选（使用select生成的combox）
	$("#" + formId + " select[class='combobox-f combo-f']").each(function () {
		if (this.id) {
			$("#" + this.id).combobox(attr);
		}
	});

	//禁用jquery easyui中的日期组件dataBox
	$("#" + formId + " input[class='datebox-f combo-f']").each(function () {
		if (this.id) {
			$("#" + this.id).datebox(attr);
		}
	});
}



function SetReadOnly(obj, backgroundColor) {
    if (obj) {
        var ieVer = GetIeVersion();// 获取IE版本
        if (obj.type == 'select-one') {
        // 下拉框时
            if (ieVer > 6) {
                obj.onfocus = function() {
                    var index = this.selectedIndex;
                    this.onchange = function() {
                        this.selectedIndex = index;
                    };
                };
            } else {
                obj.onbeforeactivate = function() { return false; };
                obj.onfocus = function() { obj.blur(); };
                obj.onmouseover = function() { obj.setCapture(); };
                obj.onmouseout = function() { obj.releaseCapture(); };
            }
        } else if (obj.type == 'checkbox') {
        // 复选框时
            obj.onclick = function() { return false; };
        } else if (obj.type == 'radio') {
        // 单选框时，设置所有具有相同name的radio为只读
            if (obj.name) {
                var arr = document.getElementsByName(obj.name);
                var len = arr.length;
                var tmp = null;
                for (var i = 0; i < len; i++)
                    if (arr[i].checked) {
                    tmp = arr[i];
                    break;
                }
                var func;
                if (tmp)
                    func = function() { tmp.checked = true; };
                else
                    func = function() { return false; };
                for (var i = 0; i < len; i++)
                    arr[i].onclick = func;
            } else
                obj.onclick = function() { return false; };
        } else {
            obj.readOnly = true;
            if (obj.type == 'text')
                obj.style.borderWidth = '0px';
        }
       if (backgroundColor)
            obj.style.backgroundColor = backgroundColor;
    }
}



function GetIeVersion() {
    var exp;
    try {
        var str = navigator.userAgent;
        var strIe = 'MSIE';
        if (str && str.indexOf(strIe) >= 0) {
            str = str.substring(str.indexOf(strIe) + strIe.length);
            str = str.substring(0, str.indexOf(';'));
            return parseFloat(str.trim());
        }
    }
    catch (exp) {
    }
    return 0;
}

function dicRender(rowdata, rowindex, value, column){
	var text = "";
	if(isEmpty(value)){
		return value;
	}
	if(column.parent !== '' && column.parent !== undefined){
		text = getDicText(rowdata[column.parent],value);
	}else{
		text = getDicText(column.src,value);
	}
	return text;
}
function dataRender(rowdata, rowindex, value, column){
	var text = "";
	text = getDicText("SCPS_COM_WEEK_VALUE",value);
	if(isEmpty(text)){
		text = getDicText("SCPS_COM_DATE_VALUE",value);
	}
	return text;
}

function getMultiText(codeNo,itemNo){
	var text='';
	 $.ajax({
	         url : path+"/upp/comm/queryForList.do",
	         data:{'sqlId':'common-GetMulItem',"codeNo":codeNo,'itemNo':itemNo},
	         async : false,
	         type : "POST",
	         dataType : 'json',
	         success : function (result){
	        	 if(result !== null && result !== undefined){
	         		if(result.length==1){
	         			text = result[0].key;
	         		}
	         	}
	         }
	     });
	 return text;
}

/**
 * 校验ip段
 * @param ips IP段
 * @param maxIpSize 最大ip数量
 * @returns {Boolean}
 */
function virifyIps(ips,maxIpSize){
	var flag =true;
	 $.ajax({
         url : path+"/util/verifyIps.do",
         data:{'ips':ips,"maxIpSize":maxIpSize},
         async : false,
         type : "POST",
         dataType : 'json',
         success : function (result){
        	 if(result !== null && result !== undefined){
         		if(result.returnCode!=0){
         			flag = false;
         			top.Dialog.alert(result.msg);
         		}
         	}
         }
     });
	 return flag;
}

function multiDicRender(rowdata, rowindex, value, column){
	var text='';
	if(isEmpty(value)){
		return "";
	}
	text = getMultiText(column.src,value);
	 return text;
}

function userRender(rowdata, rowindex, value, column){
	var text='';
	 $.ajax({
	         url : path+"/upp/comm/queryForList.do",
	         data:{'sqlId':'common-GetUser',"userId":value},
	         async : false,
	         type : "POST",
	         dataType : 'json',
	         success : function (result){
	        	 if(result !== null && result !== undefined){
	         		if(result.length==1){
	         			text = result[0].key;
	         		}
	         	}
	         }
	     });
	 return text;
}


function getOrgText(orgId){
	var text="";
	 $.ajax({
         url : path+"/upp/comm/queryForList.do",
         data:{'sqlId':'common-QueryDepartmentForSelect',"orgId":orgId},
         async : false,
         type : "POST",
         dataType : 'json',
         success : function (result){
        	 if(result !== null && result !== undefined){
         		if(result.length==1){
         			text = result[0].name;
         		}
         	}
         }
     });
	 return text;
}


function orgRender(rowdata, rowindex, value, column){
	return getOrgText(value);

}

/**
 * 根据字典code，字典value，查找对应的text
 */
function getDicText(codeNo,itemNo){
	var text='';
	 $.ajax({
	         url : path+"/upp/comm/queryForList.do",
	         data:{'sqlId':'common-GetItem',"codeNo":codeNo,'itemNo':itemNo},
	         async : false,
	         type : "POST",
	         dataType : 'json',
	         success : function (result){
	        	 if(result !==null && result !== undefined){
	         		if(result.length==1){
	         			text = result[0].key;
	         		}
	         	}
	         }
	     });
	 return text;
}
/**
 * 判断是否为非空
 * @param value
 * @returns {Boolean}
 */
function isNotEmpty(value){
	var flag = true;
	if(value === undefined || value === '' || value === null){
		flag = false;
	}
	return flag;
}

function isEmpty(value){
	var flag = false;
	if(value === undefined || value === '' || value === null){
		flag = true;
	}
	return flag;
}

/**
 * 向列表中增加数据
 * @param grid 要加入的表
 * @param datas 要加入的数据
 * @param key 主键判断标识
 */
function toGridAdd(grid,datas,key){
	for(var i = 0 ;i<datas.length;i++){
		var devId = datas[i][key];
		var flag = true;
		var records = grid.records;
		for(var record in records){
			if(records[record][key]==devId){
				flag = false;
				break;
			}
		}
		if(flag){
			grid.addRow(datas[i]);
		}
	}
}

function exportExcel(excelName,sqlId,ids){

		var url="";

		url += "&ids=" + ids;
		url += "&excelName=" + excelName;
		url += "&sqlId=" + sqlId;
		url += "&columns=" +  JSON.stringify(columns);
		 var form = $("<form>");   //定义一个form表单，用于提交参数，参数过长时用url无法提交
	     form.attr('style','display:none');
	     form.attr('target','');
	     form.attr('method','post');
	     form.attr('action',path+"/exportExcel/exportExcel.do");
	     $('body').append(form);
	     var arr=url.split("&");
	     for(var i=0;i<arr.length;i++){
	    	 var input1=$('<input>');
	    	 input1.attr('type','hidden');
	    	 var arr2=arr[i].split("=");
	         input1.attr('name',arr2[0]);
	         input1.attr('value',arr2[1]);
	         form.append(input1);
	     }
	     form.submit();   //表单提交
}



function downloadFile(fileId){
		var url="";
		url += "&id=" + fileId;

		 var form = $("<form>");   //定义一个form表单，用于提交参数，参数过长时用url无法提交
	     form.attr('style','display:none');
	     form.attr('target','');
	     form.attr('method','post');
	     form.attr('action',path+"/scps/file/download.do");
	     $('body').append(form);
	     var arr=url.split("&");
	     for(var i=0;i<arr.length;i++){
	    	 var input1=$('<input>');
	    	 input1.attr('type','hidden');
	    	 var arr2=arr[i].split("=");
	         input1.attr('name',arr2[0]);
	         input1.attr('value',arr2[1]);
	         form.append(input1);
	     }
	     form.submit();   //表单提交
}


function downloadCrossValidateReport(newParamStr){


	 var form = $("<form>");   //定义一个form表单，用于提交参数，参数过长时用url无法提交
     form.attr('style','display:none');
     form.attr('target','');
     form.attr('method','post');
     form.attr('action',path+"/data/downLoadCrossValidateReport.do");
     $('body').append(form);
     var arr=newParamStr.split("&");
     for(var i=0;i<arr.length;i++){
    	 var input1=$('<input>');
    	 input1.attr('type','hidden');
    	 var arr2=arr[i].split("=");
         input1.attr('name',arr2[0]);
         input1.attr('value',arr2[1]);
         form.append(input1);
     }
     form.submit();   //表单提交
}




function toQueryPair(key, value) {
    if (typeof value == 'undefined'){
        return key;
    }
    return key + '=' + encodeURIComponent(value === null ? '' : String(value));
}
function toQueryString(obj) {
    var ret = [];
    for(var key in obj){
        key = decodeURI(key);
        var values = obj[key];
        if(values && values.constructor == Array){//数组
            var queryValues = [];
            for (var i = 0, len = values.length, value; i < len; i++) {
                value = values[i];
                queryValues.push(toQueryPair(key, value));
            }
            ret = ret.concat(queryValues);
        }else{ //字符串
            ret.push(toQueryPair(key, values));
        }
    }
    return ret.join('&');
}

/**
 *
 * @param excelName 文件名称
 * @param param 参数及id
 * @param templateId 模板Id
 * @param calFun 调用controller名称
 */
function exportExcelByTemplate(excelName,templateId,calFun,param){

	var url="";
	var p = toQueryString(param);
	url += "&"+p;
	url += "&excelName=" + excelName;
	url += "&calFun=" + calFun;
	url += "&templateId=" +  templateId;
	 var form = $("<form>");   //定义一个form表单，用于提交参数，参数过长时用url无法提交
	 form.attr('accept-charset','utf-8');
     form.attr('style','display:none');
     form.attr('target','');
     form.attr('contentType',"application/x-www-form-urlencoded;charset=utf-8");
     form.attr('method','post');
     form.attr('action',path+"/exportExcel/"+calFun+".do");
     $('body').append(form);
     var arr=url.split("&");
     for(var i=0;i<arr.length;i++){
    	 var input1=$('<input>');
    	 input1.attr('type','hidden');
    	 var arr2=arr[i].split("=");
         input1.attr('name',arr2[0]);
         input1.attr('value',decodeURI(arr2[1]));
         form.append(input1);
     }
     form.submit();
}

//查询。默认js中grid的名称都定义为“grid”，如果列表中有多个grid对象，可传入gird名称
function searchHandler(gridObj, queryFormId){
    grid = gridObj === undefined ? grid : gridObj;
    var formId = queryFormId === undefined ? "queryForm" : queryFormId;
    var query = $("#" + formId).formToArray();
    if(!originalGridParam){
      //用于记录grid表格中定义的params，以免查询时params重复
      originalGridParam = grid.getParams();
    }
    $.each(originalGridParam,function(i,n){
      var flag = false;
      $.each(query,function(a,b){
        if (b.name==i){
        	flag = true;
        }
      });
      if(!flag){
        query.push({name : i,value : n});
      }
    });
    grid.setOptions({ params : query});//grid.getParams()获取的就是query
    grid.setNewPage(1);
    grid.loadData();
}

//查询。默认js中grid的名称都定义为“grid”，如果列表中有多个grid对象，可传入gird名称
function resetSearch(queryFormId){
 var formId = queryFormId === undefined ? "queryForm" : queryFormId;
  $("#"+formId)[0].reset();
  $("#"+formId+" .selectTree").resetValue();
}

//查询。默认js中grid的名称都定义为“grid”，如果列表中有多个grid对象，可传入gird名称
function doQuery(grid,formId){
	var query = $("#" + formId).formToArray();
	if(!originalGridParam){//用于记录grid表格中定义的params，以免查询时params重复
		originalGridParam = grid.getParams();
	}
	$.each(originalGridParam,function(i,n){
		query.push({name : i,value : n});
	});
	grid.setOptions({ params : query});//grid.getParams()获取的就是query
    grid.setNewPage(1);
    grid.loadData();
    //grid.setOptions({ params : value});//（不能用这方法，否则翻页不保留查询条件）grid.getParams()获取的是setOptions中的参数，所以在这需要重置
}


function getColor(value){
	if(value>80){
		return 'green';
	}else if(value >60){
		return 'yellow';
	}else if(value >41){
		return 'orange';

	}else {
		return 'red';
	}
}

/**
 * 根据用户id获取指定操作所对应的部门权限，ajax同步
 * @param funcId 功能id
 */
function getOperateOrg (funcId){
	var text="";
	 $.ajax({
		 url : path+"/util/getOperateOrg.do",
		 data:{'funcId':funcId},
         async : false,
         type : "POST",
         dataType : 'json',
         success : function (result){
        	 if(result !== null && result !== undefined){
        		 text = result;
         	}
         }
     });
	 return text;
}


/**
 * 检查选中数据操作的合法性
 * @param funcid 操作id
 * @param datas 选中的数据
 * @param orgColumn 部门对应的column
 */
function checkOperate(funcId,datas,orgColumn){
	var flag = true;
	var orgs = getOperateOrg(funcId);
	for(var index in datas){
		var data = datas[index];
		if( isEmpty(orgs.orgInfo[data[orgColumn]])){
			var text = getOrgText(data[orgColumn]);
			top.Dialog.alert('当前用户没有对<span class="red">'+text+'</span>部门数据的<span class="red">'+orgs.funcName+'</span>权限');
			flag = false;
			break;
		}
	}
	return flag;
}



/**
 * 检查选中数据操作的合法性
 * @param funcid 操作id
 * @param orgCode 部门id 如果为空，去当前部门
 */
function checkOperateByOrg(funcId,orgCode){
	var flag = false;
	
	 $.ajax({
		 url : path+"/util/checkOperateByOrg.do",
		 data:{'funcId':funcId,'orgCode':orgCode},
        async : false,
        type : "POST",
        dataType : 'json',
        success : function (result){
       	 if(result !== null && result !== undefined){
       		 if(!result.flag){
       			flag = false;
       			top.Dialog.alert(result.msg);
       		 }else{
       			 flag = true;
       		 }
        	}
        }
    });
	return flag;
}

(function($){
    $.fn.serializeJson=function(){
        var serializeObj={};
        var array=this.serializeArray();
        var str=this.serialize();
        $(array).each(function(){
            if(serializeObj[this.name]){
                if($.isArray(serializeObj[this.name])){
                    serializeObj[this.name].push(this.value);
                }else{
                    serializeObj[this.name]=[serializeObj[this.name],this.value];
                }
            }else{
                serializeObj[this.name]=this.value;
            }
        });
        return serializeObj;
    };
})(jQuery);


	function initComplete(){
		//解决框架中自动匹配宽度导致画面缩小后不出现横线滚动条
		$("html").css("overflow-x", "auto");
	}

	function getPersonInfo(){
		var param = new Object();
		param.perDevId = getQueryString("perDevId");
		$.post(path+"/perDevReport/getPersonLaskCheckInfo.do",param,function(result){
		},'json');
	}

jQuery.fn.extend({
	detailTableRender: function() {
			$(this).find('tr').filter(":has(table)").hide();
			var cusTreeTableAjax=false;
			var cusTreeTableDataValue;
			var clickObj;
			
			$(this).find(".img_remove2").attr("keepDefaultStyle","true");
			$(this).find(".img_add2").attr("keepDefaultStyle","true");
			
			if($(this).attr("ajaxMode")=="true"){
				cusTreeTableAjax=true;
			}
			if($(this).attr("trClick")=="true"){
				$(this).find("tr").eq(0).nextAll().not(":has(table)").each(function(){
					$(this).addClass("hand");
					$(this).hover(function(){
						$(this).addClass('highlight');
					}, function(){
						$(this).removeClass('highlight');
					});
					$(this).click(function(){
						if($(this).next().css("display")=="none"){
							if($(this).parents("table").attr("ohterClose")!="false"){
								$(this).parents("table").find(".img_remove2").attr("title",uncompile(epLanguage.table.expendBtnText));
								$(this).parents("table").find(".img_remove2").addClass("img_add2");
								$(this).parents("table").find(".img_remove2").removeClass("img_remove2");
								$(this).next().nextAll().filter(":has(table)").hide();
								$(this).next().prevAll().filter(":has(table)").hide();
								
							}
							if (cusTreeTableAjax == true) {
								clickObj = $(this).find(".img_add2");
								clickObj.each(function(){
									$(this).removeClass("img_add2");
									$(this).addClass("img_loading");
								});
								cusTreeTableDataValue=clickObj.attr("url");
								window.setTimeout(function(){
									cusTreeTableLoadLater(clickObj, cusTreeTableDataValue);
								}, 200);
							}
							else {
								$(this).next().show();
								$(this).find(".img_add2").each(function(){
									$(this).attr("title",uncompile(epLanguage.table.collapseBtnText));
									$(this).removeClass("img_add2");
									$(this).addClass("img_remove2");
								});
							}
							
						}
						else{
							$(this).next().hide();
							$(this).find(".img_remove2").each(function(){
								$(this).removeClass("img_remove2");
								$(this).addClass("img_add2");
								$(this).attr("title",uncompile(epLanguage.table.expendBtnText));
							});
						}
					});
				});
			}
			else{
				$(this).find(".img_add2").click(function(){
					cusTreeTableDataValue=$(this).attr("url");
					if($(this).parents("tr").next().css("display")=="none"){
						if($(this).parents("table").attr("ohterClose")!="false"){
							$(this).parents("table").find(".img_remove2").attr("title",uncompile(epLanguage.table.expendBtnText));
							$(this).parents("table").find(".img_remove2").addClass("img_add2");
							$(this).parents("table").find(".img_remove2").removeClass("img_remove2");
							$(this).parents("tr").next().nextAll().filter(":has(table)").hide();
							$(this).parents("tr").next().prevAll().filter(":has(table)").hide();
							
						}
						$(this).removeClass("img_add2");
						if(cusTreeTableAjax==true){
							$(this).addClass("img_loading");
							clickObj=$(this)
							window.setTimeout(function(){cusTreeTableLoadLater(clickObj,cusTreeTableDataValue);},200);
						}
						else{
							//alert(11)
							$(this).attr("title",uncompile(epLanguage.table.collapseBtnText));
							$(this).addClass("img_remove2");
							$(this).parents("tr").next().show();	
						}
						
					}
					else{
						$(this).parents("tr").next().hide();
						$(this).removeClass("img_remove2");
						$(this).addClass("img_add2");
						$(this).attr("title",uncompile(epLanguage.table.expendBtnText));
					}
				});
			}
	}
});
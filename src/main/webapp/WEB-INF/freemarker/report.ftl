<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>个人设备信息统计-详情</title>
<!--框架必需start-->
<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/cn.js"></script>
<script type="text/javascript" src="js/framework.js"></script>
<!--框架必需end-->
<!--数据表格start-->
<script src="js/epGrid.js" type="text/javascript"></script>
<!--数据表格end-->
<!--表单异步提交start-->
<script src="js/form.js" type="text/javascript"></script>
<!--表单异步提交end-->
<script src="js/list.js" type="text/javascript"></script>
<script src="js/utils.js" type="text/javascript"></script>
<script src="js/common.js" type="text/javascript"></script>
<!--父子表start-->
<script src="js/detailTable.js" type="text/javascript"></script>
<!--父子表end-->
<link rel="stylesheet" type="text/css" href="css/report.css">
<!-- 引入 echarts.js -->
<script type="text/javascript" src="js/echarts/echarts.min.js"></script>
<script src="js/personInfo.js"></script>
</head>
<body id="detailPage">
	<div class="mainArea">
		<div class="titleArea">
			<p class="titleIcon">&nbsp;</p>
			<h1>个人设备风险分布报告-详情</h1>
		</div>
		<div class="titleBar noBorder">
			<h3>设备情况</h3>
			<table class="tableStyle" cellpadding="0" cellspacing="0">
				<tr>
					<th>IP地址</th>
					<td>${personInfo["登陆IP"]}</td>
					<td class="spes" rowspan="5"><p>符合度</p>
						<p class="scroeShow" id="scoreFormat">${personInfo["score_format"]}</p></td>
				</tr>
				<tr>
					<th>用户姓名</th>
					<td>${personInfo["user_name"]}</td>
				</tr>
				<tr>
					<th>组织机构</th>
					<td>${personInfo["org_name"]}</td>
				</tr>
				<tr>
					<th>检查次数</th>
					<td>${personInfo["check_num"]}次</td>
				</tr>
				<tr>
					<th>操作系统</th>
					<td>当前操作系统版本：${personInfo["os_type"]}<br>当前系统版本号：${personInfo["os_version"]}</td>
				</tr>
			</table>
		</div>

		<div class="titleBar">
		  <h3>近期检查符合趋势</h3>
		  <div class="imgArea">
		    <!-- 近期符合度趋势对比 -->
		    <div class="drawingArea" id="recentComparison"></div>
		    <script type="text/javascript">
		      var myChart = echarts.init(document
		          .getElementById('recentComparison'), 'macarons');
		      option = {
		        tooltip : {
		          trigger : 'axis'
		        },
		        legend : {
		          left : 'right',
		          top : '6',
		          data : [ '当前部门' ]
		        },
		        grid : {
		          left : '3%',
		          right : '5%',
		          bottom : '3%',
		          containLabel : true
		        },
		        // toolbox: {
		        //     feature: {
		        //         saveAsImage: {}
		        //     }
		        // },
		        xAxis : {
		          type : 'category',
		          boundaryGap : false,
		          data : [
		            <#list monthInfo["xAxis"] as data>'${data}', </#list>
		          ]
		      },
		        yAxis : {
		          type : 'value',
		          max : 100
		        },
		        series : [ {
		          name : '当前部门',
		          type : 'line',
		          stack : '当前部门',
		          data : [
		            <#list monthInfo["orgScore"] as data>'${data}', </#list>
		          ]
		      } ]
		      };
		      // 使用刚指定的配置项和数据显示图表。
		      myChart.setOption(option);
		    </script>
		  </div>
		  <div class="descArea">
		    <p>最近两次检查对比</p>
		    <table cellpadding="0" cellspacing="0">
		      <tr>
		        <th>新增不合规</th>
		        <th>已整改</th>
		        <th>未整改</th>
		      </tr>
		      <tr>
		        <td class="add">${compare["add"]["num"]}</td>
		        <td class="repair">${compare["change"]["num"]}</td>
		        <td>${compare["noChange"]["num"]}</td>
		      </tr>
		    </table>
		    <p class="checkTime">
		    
		      上次检查时间：
			        <#if (compare["lastCheck"]?size>0)>   
			             ${compare["lastCheck"][0]}
			       </#if>  
		      </p>
		  </div>
		</div>

	<#function getResult data itemName>
		<#if data[itemName?upper_case] == "合规">
			<#return "<td class='td-checkResult-yes'>${data[itemName?upper_case]}</td>">
		<#else>
			<#return "<td class='td-checkResult-no'>${data[itemName?upper_case]}</td>">
		</#if>
	</#function>
	<#function getImage new corrected uncorrected itemName>
		<#if new?? && (new?size > 0) && new?seq_contains(itemName?upper_case)>
			<#return "<img src='images/icon_new_problem.png' />">
		<#elseif uncorrected?? && (uncorrected?size > 0) && uncorrected?seq_contains(itemName?upper_case)>
			<#return "<img src='images/icon_no_repair.png' />">
		<#else>
			<#return "">
		</#if>
	</#function>

	<#assign addList = compare["add"]["content"]>
	<#assign changeList = compare["change"]["content"]>
	<#assign noChangeList = compare["noChange"]["content"]>

	<div class="statisticsArea">
	  <div class="titleBar">
	    <h3>检查结果</h3>
	    <p class="subTxt">
	      最后检查时间：${personInfo["check_time"]?string["yyyy-MM-dd HH:mm:ss"]}</p>
	    <table class="countNum" cellpadding="0" cellspacing="0">
	      <tr>
	        <td>高风险不合规项数合计：${personInfo["high"]}</td>
	        <td>中风险不合规项数合计：${personInfo["mid"]}</td>
	        <td>低风险不合规项数合计：${personInfo["low"]}</td>
	      </tr>
	    </table>
	  </div>

	  <table class="detailTable" id="riskLevelTable" cellpadding="0"
	    cellspacing="0">
	    <tr>
	      <th class="td-checkConfig">检查配置项</th>
	      <th class="td-baseLineNum">基线编号</th>
	      <th class="td-desc">描述</th>
	      <th class="td-riskLevel">风险等级</th>
	      <th class="td-checkFailed">检查结果</th>
	    </tr>
	    <tbody>
	      <!-- 账户管理 -->
	      <tr>
	        <td class="td-checkConfig" rowspan="2">账户管理</td>
	        <td class="td-baseLineNum">SBL-System-Windows-01-01</td>
	        <td class="td-desc">重命名管理员账户Administrator${getImage(addList, changeList, noChangeList, "重命名管理员账户")}</td>
	        <td class="td-riskLevel level-m">中</td>
	        ${getResult(personInfo, "重命名管理员账户")}
	      </tr>
	      <tr>
	        <td class="td-baseLineNum">SBL-System-Windows-01-02</td>
	        <td class="td-desc">禁用来宾账户Guest${getImage(addList, changeList, noChangeList, "禁用来宾账户")}</td>
	        <td class="td-riskLevel level-m">中</td>
	        ${getResult(personInfo, "禁用来宾账户")}
	      </tr>
	      <!-- 口令管理 -->
	      <tr>
	        <td class="td-checkConfig" rowspan="5">口令管理</td>
	        <td class="td-baseLineNum">SBL-System-Windows-02-01</td>
	        <td class="td-desc">开启本地安全策略中的密码复杂性策略${getImage(addList, changeList, noChangeList, "密码复杂性")}</td>
	        <td class="td-riskLevel level-h">高</td>
	        ${getResult(personInfo, "密码复杂性")}
	      </tr>
	      <tr>
	        <td class="td-baseLineNum">SBL-System-Windows-02-02</td>
	        <td class="td-desc">开启本地安全策略中的密码长度最小值策略${getImage(addList, changeList, noChangeList, "密码长度")}
	        </td>
	        <td class="td-riskLevel level-m">中</td>
	        ${getResult(personInfo, "密码长度")}
	      </tr>
	      <tr>
	        <td class="td-baseLineNum">SBL-System-Windows-02-03</td>
	        <td class="td-desc">开启本地安全策略中的密码最长使用期限策略 ${getImage(addList, changeList, noChangeList, "密码最长使用期限")}</td>
	        <td class="td-riskLevel level-l">低</td>
	        ${getResult(personInfo, "密码最长使用期限")}
	      </tr>
	      <tr>
	        <td class="td-baseLineNum">SBL-System-Windows-02-04</td>
	        <td class="td-desc">开启本地安全策略中的强制密码历史策略${getImage(addList, changeList, noChangeList, "强制密码历史")}
	        </td>
	        <td class="td-riskLevel level-l">低</td>
	        ${getResult(personInfo, "强制密码历史")}
	      </tr>
	      <tr>
	        <td class="td-baseLineNum">SBL-System-Windows-02-05</td>
	        <td class="td-desc">开启本地安全策略中的账户锁定阀值策略${getImage(addList, changeList, noChangeList, "账户锁定阙值")}
	        </td>
	        <td class="td-riskLevel level-l">低</td>
	        ${getResult(personInfo, "账户锁定阙值")}
	      </tr>
	      <!-- 认证授权 -->
	      <tr>
	        <td class="td-checkConfig" rowspan="2">认证授权</td>
	        <td class="td-baseLineNum">SBL-System-Windows-03-01</td>
	        <td class="td-desc">远程系统强制关机强制关机仅指派给Administrator组${getImage(addList, changeList, noChangeList, "远程强制关机")}</td>
	        <td class="td-riskLevel level-h">高</td>
	        ${getResult(personInfo, "远程强制关机")}
	      </tr>
	      <tr>
	        <td class="td-baseLineNum">SBL-System-Windows-03-02</td>
	        <td class="td-desc">取得文件或其他对象的所有权仅指派给Administrator组${getImage(addList, changeList, noChangeList, "文件所有权")}
	        </td>
	        <td class="td-riskLevel level-m">中</td>
	        ${getResult(personInfo, "文件所有权")}
	      </tr>
	      <!-- 日志审计 -->
	      <tr>
	        <td class="td-checkConfig" rowspan="9">日志审计</td>
	        <td class="td-baseLineNum">SBL-System-Windows-04-01</td>
	        <td class="td-desc">已配置日志功能，对用户登录事件进行记录${getImage(addList, changeList, noChangeList, "审核登陆事件")}</td>
	        <td class="td-riskLevel level-m">中</td>
	        ${getResult(personInfo, "审核登陆事件")}
	      </tr>
	      <tr>
	        <td class="td-baseLineNum">SBL-System-Windows-04-02</td>
	        <td class="td-desc">已启动Windows系统的审核策略更改，成功与失败都要审核${getImage(addList, changeList, noChangeList, "审核策略更改")}</td>
	        <td class="td-riskLevel level-m">中</td>
	        ${getResult(personInfo, "审核策略更改")}
	      </tr>
	      <tr>
	        <td class="td-baseLineNum">SBL-System-Windows-04-03</td>
	        <td class="td-desc">已启动Windows系统的审核对象访问，成功与失败都要审核${getImage(addList, changeList, noChangeList, "审核对象访问")}</td>
	        <td class="td-riskLevel level-m">中</td>
	        ${getResult(personInfo, "审核对象访问")}
	      </tr>
	      <tr>
	        <td class="td-baseLineNum">SBL-System-Windows-04-04</td>
	        <td class="td-desc">已启动Windows系统的审核目录访问，成功与失败都要审核${getImage(addList, changeList, noChangeList, "审核目录访问")}</td>
	        <td class="td-riskLevel level-m">中</td>
	        ${getResult(personInfo, "审核目录访问")}
	      </tr>
	      <tr>
	        <td class="td-baseLineNum">SBL-System-Windows-04-05</td>
	        <td class="td-desc">已启动Windows系统的审核特权使用，成功与失败都要审核${getImage(addList, changeList, noChangeList, "审核特权使用")}</td>
	        <td class="td-riskLevel level-m">中</td>
	        ${getResult(personInfo, "审核特权使用")}
	      </tr>
	      <tr>
	        <td class="td-baseLineNum">SBL-System-Windows-04-06</td>
	        <td class="td-desc">已启动Windows系统的审核系统事件，成功与失败都要审核${getImage(addList, changeList, noChangeList, "审核系统事件")}</td>
	        <td class="td-riskLevel level-m">中</td>
	        ${getResult(personInfo, "审核系统事件")}
	      </tr>
	      <tr>
	        <td class="td-baseLineNum">SBL-System-Windows-04-07</td>
	        <td class="td-desc">已启动Windows系统的审核账户管理，成功与失败都要审核${getImage(addList, changeList, noChangeList, "审核账户管理")}</td>
	        <td class="td-riskLevel level-h">高</td>
	        ${getResult(personInfo, "审核账户管理")}
	      </tr>
	      <tr>
	        <td class="td-baseLineNum">SBL-System-Windows-04-08</td>
	        <td class="td-desc">已启动Windows系统的审核过程追踪，失败需要审核${getImage(addList, changeList, noChangeList, "审核过程追踪")}</td>
	        <td class="td-riskLevel level-m">中</td>
	        ${getResult(personInfo, "审核过程追踪")}
	      </tr>
	      <tr>
	        <td class="td-baseLineNum">SBL-System-Windows-04-09</td>
	        <td class="td-desc">设置日志容量和覆盖规则，保障日志存储${getImage(addList, changeList, noChangeList, "审核日志容量")}</td>
	        <td class="td-riskLevel level-m">中</td>
	        ${getResult(personInfo, "审核日志容量")}
	      </tr>
	      <!-- 系统服务 -->
	      <tr id="防火墙状态">
	        <td class="td-checkConfig" rowspan="2">系统服务</td>
	        <td class="td-baseLineNum">SBL-System-Windows-05-01</td>
	        <td class="td-desc">已启动Windows系统自带防火墙${getImage(addList, changeList, noChangeList, "防火墙状态")}</td>
	        <td class="td-riskLevel level-l">低</td>
	        ${getResult(personInfo, "防火墙状态")}
	      </tr>
	      <tr>
	        <td class="td-baseLineNum">SBL-System-Windows-05-02</td>
	        <td class="td-desc">已关闭Windows自动播放，防止从移动设备或光盘感染恶意代码${getImage(addList, changeList, noChangeList, "系统自动播放")}</td>
	        <td class="td-riskLevel level-h">高</td>
	        ${getResult(personInfo, "系统自动播放")}
	      </tr>
	      <!-- 补丁与防护软件 -->
	      <tr>
	        <td class="td-checkConfig" rowspan="2">补丁与防护软件</td>
	        <td class="td-baseLineNum">SBL-System-Windows-06-01</td>
	        <td class="td-desc">已部署中石油防病毒软件SEP 11并处于运行状态${getImage(addList, changeList, noChangeList, "sep是否运行")}</td>
	        <td class="td-riskLevel level-h">高</td>
	        ${getResult(personInfo, "sep是否运行")}
	      </tr>
	      <tr>
	        <td class="td-baseLineNum">SBL-System-Windows-06-02</td>
	        <td class="td-desc">已部署中石油防桌面管理软件VRV并处于运行状态${getImage(addList, changeList, noChangeList, "vrv是否运行")}</td>
	        <td class="td-riskLevel level-h">高</td>
	        ${getResult(personInfo, "vrv是否运行")}
	      </tr>
	      <!-- 默认共享 -->
	      <tr>
	        <td class="td-checkConfig">默认共享</td>
	        <td class="td-baseLineNum">SBL-System-Windows-07-01</td>
	        <td class="td-desc">已在非域环境下关闭Windows硬盘默认共享${getImage(addList, changeList, noChangeList, "磁盘默认共享")}
	        </td>
	        <td class="td-riskLevel level-l">低</td>
	        ${getResult(personInfo, "磁盘默认共享")}
	      </tr>
	      <!-- 远程维护 -->
	      <tr>
	        <td class="td-checkConfig" rowspan="2">远程维护</td>
	        <td class="td-baseLineNum">SBL-System-Windows-08-01</td>
	        <td class="td-desc">已关闭计算机远程协助（必要时可开启）${getImage(addList, changeList, noChangeList, "远程协助")}</td>
	        <td class="td-riskLevel level-m">中</td>
	        ${getResult(personInfo, "远程协助")}
	      </tr>
	      <tr>
	        <td class="td-baseLineNum">SBL-System-Windows-08-02</td>
	        <td class="td-desc">已关闭计算机远程桌面（必要时可开启）${getImage(addList, changeList, noChangeList, "远程桌面")}</td>
	        <td class="td-riskLevel level-m">中</td>
	        ${getResult(personInfo, "远程桌面")}
	      </tr>
	    </tbody>
	  </table>
	</div>

	</div>
</body>
</html>

var projectList;

//初始化权限树
$(function () {
    $('#treeDiv').tree({
        asyn: false, //异步
        rootId: 'root',
        rootText: '组织树',
        CommandName: 'java.tree.command',
        onNodeClick: showDataRuleList,
        showCheck: true, //是否显示checkbox框 , 默认所有节点出现选择框
        cascadeCheck: false, //级联选择，UP向上级联 DOWN向下级联 false不级联 true向上向下级联
        onCheck: onCheckOrUnCheck,
        params: {
        	daoBeanName:'serviceCenterDao',
            sqlId: 'project.function.treeList',
            parentId: 'root',
            userId: userId
        },
        onLoaded: function () {
            initData();
        }
    });
    projectList = $("#selectedProject");//document.getElementById("selectedProject");
});

// 初始化页面信息
function initData() {
	$.block({upRender : false});
    // 获取已选的项目	
    $.dataservice("spring:projectService.querySelectedProject", { userId: userId }, function (response) {
    	for (var i = 0; i < response.length; i++) {
    		projectList.append(getTr(response[i].projectId,response[i].projectName,response[i].startTime,response[i].endTime));
    		disPlayCalendar(response[i].projectId);//展示日期控件
    	}
		$.unblock({upRender : false});
    });
}

// 查询项目，更新备选项目
function queryProject(){
	$.block({upRender : false});
	var projectName = document.getElementById('projectName').value;
    $.dataservice("spring:projectService.queryProject", { projectName: projectName }, function (response) {
		var project1 = document.getElementById("project1");
		project1.options.length=0;
    	for (var i = 0; i < response.length; i++) {
    		var selectProject = document.getElementById("selectProject_ID_"+response[i].ID);
    		if( !selectProject ){
	    		var op=document.createElement("option");      // 新建OPTION (op) 
				op.setAttribute("value",response[i].ID);          // 设置OPTION的 VALUE 
				op.appendChild(document.createTextNode(response[i].NAME)); // 设置OPTION的 TEXT
				project1.appendChild(op);           // 为SELECT 新建一 OPTION(op)
    		}
    	}    	
		$.unblock({upRender : false});
    });
}

// 将左边项目添加到右边
function project1change(){
	var project1 = document.getElementById("project1");
	for (var i = project1.options.length - 1 ; i > -1 ; i--) {
		if(project1.options[i].selected){			
    		projectList.append(getTr(project1.options[i].value,project1.options[i].text,'',''));
    		disPlayCalendar(project1.options[i].value);//展示日期控件
			project1.remove(i);
		}
	}
}

//获取指定数据实体的所有数据规则权限集合并以列表的方式展现出来
function showDataRuleList(id, name, record, currentNode) {

}

/**
 * 勾选或取消组织树勾选触发事件
 * @param {} id
 * @param {} name
 * @param {} checked
 * @param {} record
 * @param {} currentNode
 */
function onCheckOrUnCheck(id, name, checked, record, currentNode) {
	
	// 获取勾选组织下的项目
	if(checked){		
		$.block({upRender : false});
	    $.dataservice("spring:projectService.querySelectedOrgProject", { organizationId: id }, function (response) {
			var project1 = document.getElementById("project1");
	    	for (var i = 0; i < response.length; i++) {
	    		// 添加右侧项目	    		
	    		var selectProject = document.getElementById("selectProject_ID_"+response[i].ID);
	    		if( !selectProject ){
	    			projectList.append(getTr(response[i].ID,response[i].NAME,'',''));
	    			disPlayCalendar(response[i].ID);//展示日期控件
	    		}
    			
    			// 删除左侧项目
				for (var j = project1.options.length - 1 ; j > -1 ; j--) {					
					if(project1.options[j].value == response[i].ID){
						project1.remove(j);
					}
				}
	    	}
	    	$.unblock({upRender : false});
	    });
	}
}

// 保存权限信息
function savePrivilege() {
	$.block({upRender : false});
	var projectList = [];

	// 整理已勾选的节点的权限集合
	var project2Ids = document.getElementsByName('selectProjectId');
	
	// 添加项目权限
	for(var j = 0;j < project2Ids.length;j++){
		var startTime = document.getElementById('startTime'+project2Ids[j].value).value;
		var endTime   = document.getElementById('endTime'  +project2Ids[j].value).value;
		projectList.push(project2Ids[j].value + ":"+startTime+":"+endTime);
	}
	
	// 保存项目权限信息
	$.dataservice("spring:projectService.savePrivilege", {
			projectList:projectList.join(","),
			userId : userId
		}, function(response) {
			$.unblock({upRender : false});
			$.messageBox.info({
				message : '保存成功!',
				timeout : 5,
				callback : function() {
					$(document).dialogClose();
				}
			});
	});
}


function addOption(select_,value_,text_){	
	var op=document.createElement("option");      // 新建OPTION (op) 
	op.setAttribute("value",value_);          // 设置OPTION的 VALUE 
	op.appendChild(document.createTextNode(text_)); // 设置OPTION的 TEXT
	select_.appendChild(op);           // 为SELECT 新建一 OPTION(op)
}

/**
 * 获取添加的行数据
 * @param {} projectId
 * @param {} porjectName
 * @param {} startTime
 * @param {} entTime
 * @return {}
 */
function getTr(projectId,porjectName,startTime,entTime){	
	var text = '<tr id="selectProject_ID_'+projectId+'">';
	text += '<input type="hidden" name="selectProjectId" value="'+projectId+'"/>';	
	text += '<input type="hidden" id="porjectName'+projectId+'" value="'+porjectName+'"/>';	
	text += "<td style=\"width:150px\"><b>"+porjectName+"</b></td>";
	text += '<td>时间<input type="text" name="startTime'+projectId+'" id="startTime'+projectId+'"  value="'+startTime+'" data-widget="calendar" data-options="{\'isShowWeek\':\'true\',\'dateFmt\':\'yyyy-MM\'}" class="input-small"/></td>';
	text += '<td>至<input type="text" name="endTime'+projectId+'"   id="endTime'+projectId+'"  value="'+entTime+'"  data-widget="calendar" data-options="{\'isShowWeek\':\'true\',\'dateFmt\':\'yyyy-MM\'}" class="input-small"/></td>';
	text += '<td style=\"width:40px\"><a onclick="projectRemove(\''+projectId+'\');">删除</a></td>';
	text += "</tr>";
	return text;
}


// 删除项目
function projectRemove(projectId){	
	var project1 = document.getElementById("project1");	
	var op=document.createElement("option");      // 新建OPTION (op) 
	op.setAttribute("value",projectId);          // 设置OPTION的 VALUE 
	op.appendChild(document.createTextNode(document.getElementById('porjectName'+projectId).value)); // 设置OPTION的 TEXT
	project1.appendChild(op);           // 为SELECT 新建一 OPTION(op)	
	$('#selectProject_ID_'+projectId).remove();
}


/**
 * 显示日期类型
 * @param {} PROJECT_ID
 */
function disPlayCalendar(PROJECT_ID){
	$("#startTime"+PROJECT_ID).calendar({
		isShowWeek : true,
		dateFmt : 'yyyy-MM-dd',
		onpicked : function() {
			var endTime = document.getElementById("endTime"+PROJECT_ID).value;
			var beginTime = this.value;
			if (beginTime && endTime) {
				var t = compareDate(beginTime, endTime);
				if (t > 0) {
					$.messageBox.info({message:"开始时间不能大于结束时间!"});
					this.value = ""
				}
			}
		}
	});
	$("#endTime"+PROJECT_ID).calendar({
		isShowWeek : true,
		dateFmt : 'yyyy-MM-dd',
		onpicked : function() {
			var beginTime = document.getElementById("startTime"+PROJECT_ID).value;
			var endTime = this.value;
			if (beginTime && endTime) {
				var t = compareDate(beginTime, endTime);
				if (t > 0) {
					$.messageBox.info({message:"结束时间不能小于开始时间!"});
					this.value = ""
				}
			}
		}
	});
}
function stringToTime(dateStr) {
	var day = dateStr.split('-');
	var date = new Date(Number(day[0]), Number(day[1]) - 1, Number(day[2]));
	return date;
}
function compareDate(dateString1, dateString2) {
	if (dateString1 != null && dateString2 != null) {
		var t1 = stringToTime(dateString1);
		var t2 = stringToTime(dateString2);
		return t1 - t2;
	}
	return 0;
}

/**
 * 清除全部
 */
function cleanAll(){
	
	// 整理已勾选的节点的权限集合
	var project2Ids = document.getElementsByName('selectProjectId');
	var projectLength = project2Ids.length;
	
	// 删除项目
	for(var j = 0;j <projectLength;j++){
		projectRemove(project2Ids[0].value);
	}
}



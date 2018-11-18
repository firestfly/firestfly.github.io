package bingo.vkcrm.service.report.v1.controllers;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import bingo.dao.Page;
import bingo.vkcrm.component.excel.ExportParameters;
import bingo.vkcrm.component.excel.Exporter;
import bingo.vkcrm.service.common.ListResult;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.report.v1.Version;
import bingo.vkcrm.service.report.v1.model.UserInfo;
import bingo.vkcrm.service.report.v1.services.CallCenterReportService;

@Controller
@RequestMapping(value = Version.API_PATH)
public class userInfoController  extends BaseController{
	
    @Autowired
    CallCenterReportService service;
	/**
	 * @Description: 客户信息查询报表（迭代三）
	 * 拥有权限的用户，通过该报表显示所负责的客户基本信息情况。支持多条件查询，并支持Excel下载。
	 * 系统支持选择1个项目或全部项目、1个网格或全部网格。
	 * 即选择运营中心而不选择项目时，相当于当前运营中心下所有的项目都查询出来。
	 * 选择项目而不选择网格时，相当天选择当前项目下的所有网格。系统支持分页、分组排序显示。
	 *
	 * 查询条件：管理中心、项目、网格、楼栋、房屋、房屋状态（全部、常住、空置、出租、度假）、
	 * 客房关系（业主、住户、其他。。。根据字典值CustomerRelationType）、年龄类型（全部、10岁以下、10~20岁、20~30岁、30~40岁、40~50岁、50~60岁、60岁以上）、
     * 客户类型（全部、VIP、普通、特需）、客户归属(全部、员工客户、非员工客户)、证件类型（根据字典值CustomerCertificateType）、
     * 证件号码、客户姓名、主用手机、生日、是否二手房（全部、是、否）、交付时间（开始时间~结束时间）、入住时间（开始时间~结束时间）
     * 
	 * 查询条件：sysUserId，mcId，checkInTimeStart，checkInTimeEnd，startDeliversTime，endDeliverTime，projectId，gridId，buildingCode，houseId，
     * houseStatus，houseCustomerRelationType，isSecondhand，customerType，customerAffilication，customerCertificateType，certificateId，fullName
     * mainMobile，birthday，startAge，endAge
     * 
     * 显示内容：客户编号、客户姓名、性别、年龄、客户类型、主用手机、备用手机、客户归属、证件类型、证件号码、生日、
     * 紧急联系人、紧急联系人手机、紧急联系人电话、有无车辆、邮编、通讯地址、户籍、Email、QQ、微信、血型、职业、工作单位、单位地址、特殊身份
     * 实时性不高，可以一天出一份数据。
	 * @param:userInfo
	 * @Author: luoml01
	 * @date: 2016年5月5日 下午3:28:08
	 * @return:{返回参数名}{返回参数说明} 
	 * @exception:TODO
	 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
	 */
    @RequestMapping(value = "/getuserInfolistReport",method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult getTaskReportNew(UserInfo userInfo){
    	userInfo.setSysUserId(getCurrentUser().getId());
    	  //10岁以下、10~20岁、20~30岁、30~40岁、40~50岁、50~60岁、60岁以上
        if(StringUtils.isNotEmpty(userInfo.getUerReportAgeTP())){
        	if("1".equals(userInfo.getUerReportAgeTP())){
        		userInfo.setStartAge("1");
        		userInfo.setEndAge("9");
        	}else if("2".equals(userInfo.getUerReportAgeTP())){
        		userInfo.setStartAge("10");
        		userInfo.setEndAge("19");
        	}else if("3".equals(userInfo.getUerReportAgeTP())){
        		userInfo.setStartAge("20");
        		userInfo.setEndAge("29");
        	}else if("4".equals(userInfo.getUerReportAgeTP())){
        		userInfo.setStartAge("30");
        		userInfo.setEndAge("30");
        	}else if("5".equals(userInfo.getUerReportAgeTP())){
        		userInfo.setStartAge("40");
        		userInfo.setEndAge("49");
        	}else if("6".equals(userInfo.getUerReportAgeTP())){
        		userInfo.setStartAge("50");
        		userInfo.setEndAge("59");
        	}else if("7".equals(userInfo.getUerReportAgeTP())){
        		userInfo.setStartAge("60");
        		userInfo.setEndAge("200");
        	}
        }
        Page page=null;
        if(userInfo.getCurPage()!=null&&userInfo.getPageSize()!=null){
            page=new Page();
            page.setPage(Integer.parseInt(userInfo.getCurPage()));
            page.setPageSize(Integer.parseInt(userInfo.getPageSize()));
        }
        
        ListResult<UserInfo> result=new ListResult<UserInfo>(page,service.getCustomerInfoReport(userInfo,page));
        return ServiceResult.succeed(result);
    }
    
    @RequestMapping(value = "/userInfoReport/export",method = RequestMethod.GET)
    @ResponseBody
    public ModelAndView exportTaskReport(UserInfo userInfo,HttpServletResponse response){
        ExportParameters parameters = new ExportParameters();
        // 设置需要导出的列ID
        parameters.setColumnsId(new String[]{"code", "fullName","sex", "age","customerType", "mainMobile","standbyMobile", "affiliation","certificateType", "certificateId","birthday","urgencyContacts","urgencyMobileNumber","urgencyPhoneNumber","isHaveCar","postCode","contactAddr","registerAddr","email","qq","weChat","blood","occupation","company","companyAddr","identity"});
        // 设置对应的列标题
        parameters.setColumnsHeader(new String[]{"客户编号", "客户姓名", "性别", "年龄", "客户类型","主用手机", "备用手机", "客户归属", "证件类型", "证件号码","生日", "紧急联系人", "紧急联系人手机", "紧急联系人电话", "有无车辆", "邮编","通讯地址","户籍","Email","QQ","微信","血型","职业","工作单位","单位地址","特殊身份"});
        // 设置对应列的数据类型
        parameters.setColumnsType(new String[]{"String", "String","String","String","String","String","String","String","String","String","String","String","String","String","String","String","String","String","String","String","String","String","String","String","String","String"});
        parameters.setColumnsAlign(new String[]{"left","left","left","left","left","left","left","left","left","left","left","left","left","left","left","left","left","left","left","left","left","left","left","left","left","left"});
        // 设置dao名称
        parameters.setDaoName("centerRoDao");
        // 设置排序列
        //parameters.setOrderBy("created asc");
        // 设置查询数据的sql
        parameters.setSqlId("sql.query.customerInfo.report");
        // 设置查询数据总数的sql
        parameters.setSqlCountId("sql.query.customerInfo.report.count");
        
        Map<String,Object> params=new HashMap<String, Object>();
        params.put("sysUserId",getCurrentUser().getId());//传入用户ID，去查当前用户拥有的项目权限
        if(StringUtils.isNotEmpty(userInfo.getMcId())){
            params.put("mcId",userInfo.getMcId());
        }
        //入住开始时间
        if(StringUtils.isNotEmpty(userInfo.getCheckInTimeStart())){
            params.put("checkInTimeStart",userInfo.getCheckInTimeStart());
        }
        //入住结束时间
        if(StringUtils.isNotEmpty(userInfo.getCheckInTimeEnd())){
            params.put("checkInTimeEnd",userInfo.getCheckInTimeEnd());
        }
        //交付开始时间
        if(StringUtils.isNotEmpty(userInfo.getStartDeliversTime())){
            params.put("startDeliversTime",userInfo.getStartDeliversTime());
        }
        //交付结束时间
        if(StringUtils.isNotEmpty(userInfo.getEndDeliverTime())){
            params.put("endDeliverTime",userInfo.getEndDeliverTime());
        }
        //项目
        if(StringUtils.isNotEmpty(userInfo.getProjectId())){
        	params.put("projectId",userInfo.getProjectId());
        }
        //网格
        if(StringUtils.isNotEmpty(userInfo.getGridId())){
            params.put("gridId",userInfo.getGridId());
        }
        //楼栋
        if(StringUtils.isNotEmpty(userInfo.getBuildingCode())){
            params.put("buildingCode",userInfo.getBuildingCode());
        }
        //房屋
        if(StringUtils.isNotEmpty(userInfo.getHouseId())){
            params.put("houseId",userInfo.getHouseId());
        }
        //房屋状态
        if(StringUtils.isNotEmpty(userInfo.getHouseStatus())){
            params.put("houseStatus",userInfo.getHouseStatus());
        }
        //客房关系
        if(StringUtils.isNotEmpty(userInfo.getHouseCustomerRelationType())){
            params.put("houseCustomerRelationType",userInfo.getHouseCustomerRelationType());
        }
        //是否二手房
        if(StringUtils.isNotEmpty(userInfo.getIsSecondhand())){
            params.put("isSecondhand",userInfo.getIsSecondhand());
        }
        //客户类型
        if(StringUtils.isNotEmpty(userInfo.getCustomerType())){
            params.put("customerType",userInfo.getCustomerType());
        }
        //客户归属
        if(StringUtils.isNotEmpty(userInfo.getCustomerAffilication())){
            params.put("customerAffilication",userInfo.getCustomerAffilication());
        }
        //客户证件类型
        if(StringUtils.isNotEmpty(userInfo.getCustomerCertificateType())){
            params.put("customerCertificateType",userInfo.getCustomerCertificateType());
        }
        //客户证件号码
        if(StringUtils.isNotEmpty(userInfo.getCertificateId())){
            params.put("CertificateId",userInfo.getCertificateId());
        }
        //客户姓名
        if(StringUtils.isNotEmpty(userInfo.getFullName())){
            params.put("FullName",userInfo.getFullName());
        }
        //主用手机
        if(StringUtils.isNotEmpty(userInfo.getMainMobile())){
            params.put("mainMobile",userInfo.getMainMobile());
        }
        //生日
        if(StringUtils.isNotEmpty(userInfo.getBirthday()+"")){
            params.put("birthday",userInfo.getBirthday());
        }
        //10岁以下、10~20岁、20~30岁、30~40岁、40~50岁、50~60岁、60岁以上
        if(StringUtils.isNotEmpty(userInfo.getUerReportAgeTP())){
        	if("1".equals(userInfo.getUerReportAgeTP())){
        		params.put("startAge",1);
        		params.put("endAge",9);
        	}else if("2".equals(userInfo.getUerReportAgeTP())){
        		params.put("startAge",10);
        		params.put("endAge",19);
        	}else if("3".equals(userInfo.getUerReportAgeTP())){
        		params.put("startAge",20);
        		params.put("endAge",29);
        	}else if("4".equals(userInfo.getUerReportAgeTP())){
        		params.put("startAge",30);
        		params.put("endAge",39);
        	}else if("5".equals(userInfo.getUerReportAgeTP())){
        		params.put("startAge",40);
        		params.put("endAge",49);
        	}else if("6".equals(userInfo.getUerReportAgeTP())){
        		params.put("startAge",50);
        		params.put("endAge",59);
        	}else if("7".equals(userInfo.getUerReportAgeTP())){
        		params.put("startAge",60);
        		params.put("endAge",200);
        	}
        }
        parameters.setParameters(params);
        // 调用导出方法
        Exporter.getInstance().export("任务报表"+ new SimpleDateFormat("yyyyMMdd").format(new Date())+".xlsx", parameters, response);
        return new ModelAndView();
    }
}

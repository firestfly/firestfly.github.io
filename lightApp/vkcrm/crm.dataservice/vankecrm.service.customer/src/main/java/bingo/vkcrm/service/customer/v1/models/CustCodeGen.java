package bingo.vkcrm.service.customer.v1.models;


import bingo.dao.orm.annotations.Table;

/**
 * dim_cust_code_gen 实体类
 * 客户编码生成表
 * Mon Sep 21 19:16:49 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
 */
@Table(name = "dim_cust_code_gen")
public class CustCodeGen {
	
	private String pid;//唯一主键，自增
	private String value;//插入临时值，通过此值会查自增的主键
	
	public void setPid(String pid){
		this.pid=pid;
	}
	public String getPid(){
		return pid;
	}
	public void setValue(String value){
		this.value=value;
	}
	public String getValue(){
		return value;
	}
}


package bingo.excel.model;

import bingo.dao.orm.annotations.Table;


   /**
    * dim_cust_code_gen 实体类
    * Mon Sep 21 19:16:49 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
    */ 

@Table(name = "Dim_Cust_Code_Gen")
public class DimCustCodeGen{
	private String pid;
	private String value;
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


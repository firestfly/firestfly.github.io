package bingo.excel.model;


   /**
    * tree_organization 实体类
    * Mon Sep 21 19:16:56 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
    */ 


public class TreeOrganization{
	private String id;
	private String parentid;
	private String name;
	private String leveltype;
	private String leveltypetext;
	private String isouter;
	public void setId(String id){
		this.id=id;
	}
	public String getId(){
		return id;
	}
	public void setParentid(String parentid){
		this.parentid=parentid;
	}
	public String getParentid(){
		return parentid;
	}
	public void setName(String name){
		this.name=name;
	}
	public String getName(){
		return name;
	}
	public void setLeveltype(String leveltype){
		this.leveltype=leveltype;
	}
	public String getLeveltype(){
		return leveltype;
	}
	public void setLeveltypetext(String leveltypetext){
		this.leveltypetext=leveltypetext;
	}
	public String getLeveltypetext(){
		return leveltypetext;
	}
	public void setIsouter(String isouter){
		this.isouter=isouter;
	}
	public String getIsouter(){
		return isouter;
	}
}


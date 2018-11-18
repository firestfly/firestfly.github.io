package bingo.excel.model;

/**
* main_carport 实体类
* Mon Dec 07 15:28:43 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
*/ 
public class MainCarport{
	
	private String id;//车位ID
	private String code;//车位编码
	private String name;//车位名称
	
	public void setId(String id){
		this.id=id;
	}
	public String getId(){
		return id;
	}
	public void setCode(String code){
		this.code=code;
	}
	public String getCode(){
		return code;
	}
	public void setName(String name){
		this.name=name;
	}
	public String getName(){
		return name;
	}
}


package bingo.vkcrm.service.customer.v1.models;



/**
 * 首页搜索结果数据项
 * @author 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
 *
 */
public class SearchResultItem {
	
	private String id;//数据在CRM的唯一标识
	private String name;//展示名称
	private String code;//数据编码（如客户编码，房屋编码）
	private String type;//数据类型（客户:customer;房屋:house;车位:carport）
	private String extend1;//扩展信息，不同数据类型可能有不同的展示内容，预留3个扩展信息字段
	private String extend2;//扩展信息，不同数据类型可能有不同的展示内容，预留3个扩展信息字段
	private String extend3;//扩展信息，不同数据类型可能有不同的展示内容，预留3个扩展信息字段
	
	/**
	 * @return the id
	 */
	public String getId() {
		return id;
	}
	/**
	 * @param id the id to set
	 */
	public void setId(String id) {
		this.id = id;
	}
	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}
	/**
	 * @param name the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}
	/**
	 * @return the code
	 */
	public String getCode() {
		return code;
	}
	/**
	 * @param code the code to set
	 */
	public void setCode(String code) {
		this.code = code;
	}
	/**
	 * @return the type
	 */
	public String getType() {
		return type;
	}
	/**
	 * @param type the type to set
	 */
	public void setType(String type) {
		this.type = type;
	}
	/**
	 * @return the extend1
	 */
	public String getExtend1() {
		return extend1==null?"":extend1;
	}
	/**
	 * @param extend1 the extend1 to set
	 */
	public void setExtend1(String extend1) {
		this.extend1 = extend1;
	}
	/**
	 * @return the extend2
	 */
	public String getExtend2() {
		return extend2==null?"":extend2;
	}
	/**
	 * @param extend2 the extend2 to set
	 */
	public void setExtend2(String extend2) {
		this.extend2 = extend2;
	}
	/**
	 * @return the extend3
	 */
	public String getExtend3() {
		return extend3==null?"":extend3;
	}
	/**
	 * @param extend3 the extend3 to set
	 */
	public void setExtend3(String extend3) {
		this.extend3 = extend3;
	}
	
	
	
	
	
    
}

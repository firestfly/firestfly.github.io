package bingo.vkcrm.service.report.v1.model;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;
/**
 * 客户信息修改记录
 * @author chengsiyuan
 *
 */


public class CustomerModifyReport {

	//客户名称
	private String customerName;
	//修改字段名称
	private String modifyField;
	//修改前数据
	private String beforeModift;
	//修改后数据
	private String afterModift;
	//修改人
	private String modifier;
	//修改人所在项目
	private String modifierProject;
	//修改人所在网格
	private String modifierGrid;
	//修改人所在管理中心
	private String modifiermanCenter;
	//修改时间
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date modifyTime;
	public String getCustomerName() {
		return customerName;
	}
	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}
	public String getModifyField() {
		return modifyField;
	}
	public void setModifyField(String modifyField) {
		this.modifyField = modifyField;
	}
	public String getBeforeModift() {
		return beforeModift;
	}
	public void setBeforeModift(String beforeModift) {
		this.beforeModift = beforeModift;
	}
	public String getAfterModift() {
		return afterModift;
	}
	public void setAfterModift(String afterModift) {
		this.afterModift = afterModift;
	}
	public String getModifier() {
		return modifier;
	}
	public void setModifier(String modifier) {
		this.modifier = modifier;
	}
	public String getModifierProject() {
		return modifierProject;
	}
	public void setModifierProject(String modifierProject) {
		this.modifierProject = modifierProject;
	}
	public String getModifierGrid() {
		return modifierGrid;
	}
	public void setModifierGrid(String modifierGrid) {
		this.modifierGrid = modifierGrid;
	}
	public String getModifiermanCenter() {
		return modifiermanCenter;
	}
	public void setModifiermanCenter(String modifiermanCenter) {
		this.modifiermanCenter = modifiermanCenter;
	}
	public Date getModifyTime() {
		return modifyTime;
	}
	public void setModifyTime(Date modifyTime) {
		this.modifyTime = modifyTime;
	}
	
	
}

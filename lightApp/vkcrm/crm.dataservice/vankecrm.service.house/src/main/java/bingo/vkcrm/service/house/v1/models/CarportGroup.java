package bingo.vkcrm.service.house.v1.models;

import bingo.dao.orm.annotations.Table;
import bingo.dao.orm.annotations.UUID;

/**
 * 车位分组
 */
@Table(name = "dim_carport_group")
public class CarportGroup {
    /**
     * 分组id
     */
    @UUID
    private String id;
    /**
     * 所属项目id
     */
    private String projectId;
    /**
     * 所属项目名称
     */
    private String projectName;
    /**
     * 分组名称
     */
    private String name;
    /**
     * 所属车场id
     */
    private String carparkId;
	/**
     * 车位数量
     */
    private int count;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }
    
    public String getCarparkId() {
		return carparkId;
	}

	public void setCarparkId(String carparkId) {
		this.carparkId = carparkId;
	}
	
    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }
}

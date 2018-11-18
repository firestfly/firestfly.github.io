package bingo.vkcrm.service.house.v1.models;

import bingo.dao.orm.annotations.IsKey;
import bingo.dao.orm.annotations.Table;
import bingo.vkcrm.service.model.BaseModel;
//import com.fasterxml.jackson.annotation.JsonFormat;
//import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
//import java.util.List;

/**
 * Created by Jim on 2016/01/28.
 */
@Table(name = "main_carpark")
public class Carpark extends BaseModel {
    /**
     * 车场ID
     */
    @IsKey
    private String id;
    /**
     * 车场编码
     */
    private String code;
    /**
     * 车场名称
     */
    private String name;

    /**
     * 所属项目id
     */
    private String projectId;
    /**
     * 描述
     */
    private String description;

    /**
     * 同步时间
     */
    private Date syncTime;

	/**
     * 车场是否删除
     */
    private Boolean isDeleted;

	/**
     * 车场删除时间
     */
    //@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    //@DateTimeFormat(style = "yyyy-MM-dd HH:mm:ss")
    private Date deleteTime;


	public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
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


    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getSyncTime() {
		return syncTime;
	}

	public void setSyncTime(Date syncTime) {
		this.syncTime = syncTime;
	}
    
    public Boolean getIsDeleted() {
		return isDeleted;
	}

	public void setIsDeleted(Boolean isDeleted) {
		this.isDeleted = isDeleted;
	}	

    public Date getDeleteTime() {
		return deleteTime;
	}

	public void setDeleteTime(Date deleteTime) {
		this.deleteTime = deleteTime;
	}	

}

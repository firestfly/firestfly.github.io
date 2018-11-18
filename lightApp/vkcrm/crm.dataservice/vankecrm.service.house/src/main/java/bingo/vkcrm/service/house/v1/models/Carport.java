package bingo.vkcrm.service.house.v1.models;

import bingo.dao.orm.annotations.IsKey;
import bingo.dao.orm.annotations.Table;
import bingo.vkcrm.service.model.BaseModel;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

/**
 * Created by szsonic on 2015/9/21.
 */
@Table(name = "main_carport")
public class Carport extends BaseModel {
    /**
     * 车位ID
     */
    @IsKey
    private String id;
    /**
     * 车位编码
     */
    private String code;
    /**
     * 车位名称
     */
    private String name;
    /**
     * 辅助编码
     */
    private String assistantCode;

    /**
     * 所属项目id
     */
    private String projectId;
    /**
     * 所属项目老ID（导入数据的ID）
     */
    private String oldId;
    /**
     * 所属项目名称
     */
    private String projectName;
    /**
     * 车位类型
     */
    private Integer parkingType;

    /**
     * 车位类型文本
     */
    private String parkingTypeText;

    /**
     * 产权类型
     */
    private Integer equityType;

    /**
     * 产权类型文本
     */
    private String equityTypeText;

    /**
     * 车位状态
     */
    private Integer status;

    /**
     * 车位状态文本
     */
    private String statusText;

    /**
     * 常用联系人
     */
    private String contactsId;

    /**
     * 开始时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date startTime;

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

    public String getAssistantCode() {
        return assistantCode;
    }

    public void setAssistantCode(String assistantCode) {
        this.assistantCode = assistantCode;
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

    public String getOldId() {
        return oldId;
    }

    public void setOldId(String oldId) {
        this.oldId = oldId;
    }

    public Integer getParkingType() {
        return parkingType;
    }

    public void setParkingType(Integer parkingType) {
        this.parkingType = parkingType;
    }

    public String getParkingTypeText() {
        return getValue("ParkingType", this.parkingType);
    }

    public Integer getEquityType() {
        return equityType;
    }

    public void setEquityType(Integer equityType) {
        this.equityType = equityType;
    }

    public String getEquityTypeText() {
        return getValue("EquityType", this.equityType);
    }

    public void setParkingTypeText(String parkingTypeText) {
        this.parkingTypeText = parkingTypeText;
    }

    public void setEquityTypeText(String equityTypeText) {
        this.equityTypeText = equityTypeText;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getStatusText() {
        return getValue("CarportStatus", this.status);
    }

    public String getContactsId() {
        return contactsId;
    }

    public void setContactsId(String contacsId) {
        this.contactsId = contacsId;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }
}

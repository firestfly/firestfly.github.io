package bingo.vkcrm.task.models.bmap.house;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * Created by szsonic on 2016/3/2/002.
 */
public class House {
    private String id;
    private String buildCode;
    private String deliverTime;
    private String checkInTime;
    private String setArea;
    private String builtUpArea;
    private String floor;
    private String unit;
    private String orientation;
    private String nameFormal;
    private String name;
    private String roomNumber;
    private String code;

    private String layout;
    private String statusuptime;
    private String equityType;

    private String buildingName;
    private String buildingAbrev;
    private String projectCode;
    private String status;
    private String unitId;
    private String houseId;
    private String assistCode;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date syncTime;
    private Integer type;
    public String getBuildCode() {
        return buildCode;
    }

    public void setBuildCode(String buildCode) {
        this.buildCode = buildCode;
    }

    public String getDeliverTime() {
        return deliverTime;
    }

    public void setDeliverTime(String deliverTime) {
        this.deliverTime = deliverTime;
    }

    public String getCheckInTime() {
        return checkInTime;
    }

    public void setCheckInTime(String checkInTime) {
        this.checkInTime = checkInTime;
    }

    public String getSetArea() {
        return setArea;
    }

    public void setSetArea(String setArea) {
        this.setArea = setArea;
    }

    public String getBuiltUpArea() {
        return builtUpArea;
    }

    public void setBuiltUpArea(String builtUpArea) {
        this.builtUpArea = builtUpArea;
    }

    public String getFloor() {
        return floor;
    }

    public void setFloor(String floor) {
        this.floor = floor;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getOrientation() {
        return orientation;
    }

    public void setOrientation(String orientation) {
        this.orientation = orientation;
    }

    public String getNameFormal() {
        return nameFormal;
    }

    public void setNameFormal(String nameFormal) {
        this.nameFormal = nameFormal;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLayout() {
        return layout;
    }

    public void setLayout(String layout) {
        this.layout = layout;
    }

    public String getStatusuptime() {
        return statusuptime;
    }

    public void setStatusuptime(String statusuptime) {
        this.statusuptime = statusuptime;
    }

    public String getEquityType() {
        return equityType;
    }

    public void setEquityType(String equityType) {
        this.equityType = equityType;
    }

    public String getBuildingName() {
        return buildingName;
    }

    public void setBuildingName(String buildingName) {
        this.buildingName = buildingName;
    }

    public String getBuildingAbrev() {
        return buildingAbrev;
    }

    public void setBuildingAbrev(String buildingAbrev) {
        this.buildingAbrev = buildingAbrev;
    }

    public String getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(String projectCode) {
        this.projectCode = projectCode;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getUnitId() {
        return unitId;
    }

    public void setUnitId(String unitId) {
        this.unitId = unitId;
    }

    public String getHouseId() {
        return houseId;
    }

    public void setHouseId(String houseId) {
        this.houseId = houseId;
    }

    public Date getSyncTime() {
        return syncTime;
    }

    public void setSyncTime(Date syncTime) {
        this.syncTime = syncTime;
    }

    public String getAssistCode() {
        return assistCode;
    }

    public void setAssistCode(String assistCode) {
        this.assistCode = assistCode;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }
}

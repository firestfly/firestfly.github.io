package bingo.vkcrm.service.customer.v1.models;

import java.util.Date;

/**
 * Created by 林 on 2016/4/13.
 * 过户日志
 */
public class HouserTransferLog {
    /**
     * 过户id
     */
    private int id;
    /**
     * 房屋code
     */
    private String houseId;
    /**
     * 历史客户id
     */
    private String exOwnerId;
    /**
     * 当前客户id
     */
    private String curOwnerid;
    /**
     * 记录创建人
     */
    private String creator;
    /**
     * 记录创建人id
     */
    private String creatorId;
    /**
     * 记录创建时间
     */
    private Date createTime;

    public int getId() { return id;}

    public void setId(int id) { this.id = id; }

    public String getExOwnerId() {return exOwnerId;}

    public void setExOwnerId(String exOwnerId) {this.exOwnerId = exOwnerId;}

    public String getCurOwnerid() {return curOwnerid;}

    public void setCurOwnerid(String curOwnerid) {this.curOwnerid = curOwnerid;}

    public String getCreator() { return creator;}

    public void setCreator(String creator) { this.creator = creator;}

    public String getCreatorId() {return creatorId;}

    public void setCreatorId(String creatorId) {this.creatorId = creatorId;}

    public Date getCreateTime() { return createTime;}

    public void setCreateTime(Date createTime) { this.createTime = createTime;}

    public String getHouseId() {return houseId;}

    public void setHouseId(String houseId) {this.houseId = houseId;}

}

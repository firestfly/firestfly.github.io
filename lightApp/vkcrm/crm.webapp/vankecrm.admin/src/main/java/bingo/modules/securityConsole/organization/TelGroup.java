package bingo.modules.securityConsole.organization;

import java.util.Date;


/**
 * tel_group 实体类
 * Thu Sep 24 14:05:57 CST 2015 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
 */


public class TelGroup {

    private String id;
    private String name;
    private String parentId;
    private String groupMaster;
    private String isConsult;
    private String isDeleted;
    private String deleter;
    private String deleterId;
    private Date deleteTime;

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

    public String getGroupMaster() {
        return groupMaster;
    }

    public void setGroupMaster(String groupMaster) {
        this.groupMaster = groupMaster;
    }

    public String getIsConsult() {
        return isConsult;
    }

    public void setIsConsult(String isConsult) {
        this.isConsult = isConsult;
    }

    /**
     * @return the parentId
     */
    public String getParentId() {
        return parentId;
    }

    /**
     * @param parentId the parentId to set
     */
    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    /**
     * @return the isDeleted
     */
    public String getIsDeleted() {
        return isDeleted;
    }

    /**
     * @param isDeleted the isDeleted to set
     */
    public void setIsDeleted(String isDeleted) {
        this.isDeleted = isDeleted;
    }

    /**
     * @return the deleter
     */
    public String getDeleter() {
        return deleter;
    }

    /**
     * @param deleter the deleter to set
     */
    public void setDeleter(String deleter) {
        this.deleter = deleter;
    }

    /**
     * @return the deleterId
     */
    public String getDeleterId() {
        return deleterId;
    }

    /**
     * @param deleterId the deleterId to set
     */
    public void setDeleterId(String deleterId) {
        this.deleterId = deleterId;
    }

    /**
     * @return the deleteTime
     */
    public Date getDeleteTime() {
        return deleteTime;
    }

    /**
     * @param deleteTime the deleteTime to set
     */
    public void setDeleteTime(Date deleteTime) {
        this.deleteTime = deleteTime;
    }


}


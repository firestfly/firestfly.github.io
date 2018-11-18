package bingo.vkcrm.service.tel.v1.models;

/**
 * 工号信息
 */
public class Agent {
    /**
     * 唯一编码
     */
    private String id;

    /**
     * 名称
     */
    private String name;

    /**
     * 电信工号
     */
    private String number;

    /**
     * 分组编码
     */
    private String groupId;

    /**
     * 分组名称
     */
    private String groupName;

    /**
     * 分组组长编码
     */
    private String groupMaster;

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

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getGroupMaster() {
        return groupMaster;
    }

    public void setGroupMaster(String groupMaster) {
        this.groupMaster = groupMaster;
    }
}

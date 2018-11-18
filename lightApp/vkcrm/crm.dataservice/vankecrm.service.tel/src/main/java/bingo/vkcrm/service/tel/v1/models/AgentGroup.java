package bingo.vkcrm.service.tel.v1.models;

/**
 * 话务组
 */
public class AgentGroup {

    /**
     * 唯一编码
     */
    private String id;

    /**
     * 组名
     */
    private String name;

    /**
     * 组长编码
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

    public String getGroupMaster() {
        return groupMaster;
    }

    public void setGroupMaster(String groupMaster) {
        this.groupMaster = groupMaster;
    }
}

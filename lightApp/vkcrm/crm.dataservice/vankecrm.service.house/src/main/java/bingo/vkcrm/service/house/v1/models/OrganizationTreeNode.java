package bingo.vkcrm.service.house.v1.models;

/**
 * 项目层级树节点
 */
public class OrganizationTreeNode {

    /**
     * 树节点id
     */
    private String id;
    /**
     * 树节点名称
     */
    private String name;
    /**
     * 当前层级类型
     */
    private int levelType;
    /**
     * 是否外盘
     */
    private boolean isOuter;
    /**
     * 是否叶子节点
     */
    private boolean hasChild;
    /**
     * 是否展开
     */
    private boolean isOpen;

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

    public int getLevelType() {
        return levelType;
    }

    public void setLevelType(int levelType) {
        this.levelType = levelType;
    }

    public boolean isOuter() {
        return isOuter;
    }

    public void setIsOuter(boolean isOuter) {
        this.isOuter = isOuter;
    }

    public boolean isHasChild() {
        return hasChild;
    }

    public void setHasChild(boolean hasChild) {
        this.hasChild = hasChild;
    }

    public boolean isOpen() {
        return isOpen;
    }

    public void setIsOpen(boolean isOpen) {
        this.isOpen = isOpen;
    }
}

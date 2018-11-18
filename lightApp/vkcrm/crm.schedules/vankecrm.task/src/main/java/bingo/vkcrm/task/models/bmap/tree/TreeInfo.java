package bingo.vkcrm.task.models.bmap.tree;

/**
 * Created by szsonic on 2016/2/24/024.
 */
public class TreeInfo {
    private String id;
    private String parentId;
    private String name;
    private String levelType;
    private String levelTypeText;
    private String isOuter;
    private String createTime;
    private Boolean isDeleted;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLevelType() {
        return levelType;
    }

    public void setLevelType(String levelType) {
        this.levelType = levelType;
    }

    public String getLevelTypeText() {
        return levelTypeText;
    }

    public void setLevelTypeText(String levelTypeText) {
        this.levelTypeText = levelTypeText;
    }

    public String getIsOuter() {
        return isOuter;
    }

    public void setIsOuter(String isOuter) {
        this.isOuter = isOuter;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public Boolean getDeleted() {
        return isDeleted;
    }

    public void setDeleted(Boolean deleted) {
        isDeleted = deleted;
    }

    @Override
    public boolean equals(Object obj){
        if(obj instanceof TreeInfo){
            TreeInfo treeInfo=(TreeInfo)obj;
            if(treeInfo.getId().equals(this.getId())){
                return true;
            }
        }
        return false;
    }
}

package bingo.vkcrm.service.task.v1.models.callbacks;

/**
 * Created by Wangzr on 16/3/16.
 */
public class ProjectManager {

    private String mobile;
    private String fullname;
    private String is_working;
    private String avatar;

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getIs_working() {
        return is_working;
    }

    public void setIs_working(String is_working) {
        this.is_working = is_working;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }
}

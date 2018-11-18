package bingo.vkcrm.task.models.business;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Created by szsonic on 2015/12/22.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class BusinessType {
    private String code;
    private String name;
    private String parent_code;
    private int flag;

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

    public String getParent_code() {
        return parent_code;
    }

    public void setParent_code(String parent_code) {
        this.parent_code = parent_code;
    }

    public int getFlag() {
        return flag;
    }

    public void setFlag(int flag) {
        this.flag = flag;
    }
}

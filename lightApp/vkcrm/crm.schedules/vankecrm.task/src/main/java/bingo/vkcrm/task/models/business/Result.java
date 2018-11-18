package bingo.vkcrm.task.models.business;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.Date;
import java.util.List;

/**
 * Created by szsonic on 2015/12/22.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class Result {
    private Boolean is_changed;
    private Long  last_modified;
    private List<BusinessType> data;

    public Boolean getIs_changed() {
        return is_changed;
    }

    public void setIs_changed(Boolean is_changed) {
        this.is_changed = is_changed;
    }




    public Long getLast_modified() {
        return last_modified;
    }

    public void setLast_modified(Long last_modified) {
        this.last_modified = last_modified;
    }

    public List<BusinessType> getData() {
        return data;
    }

    public void setData(List<BusinessType> data) {
        this.data = data;
    }
}

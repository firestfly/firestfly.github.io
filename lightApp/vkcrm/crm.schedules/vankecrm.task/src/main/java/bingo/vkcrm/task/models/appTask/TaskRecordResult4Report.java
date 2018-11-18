package bingo.vkcrm.task.models.appTask;

import java.util.List;

/**
 * Created by szsonic on 2016/1/22/022.
 */
public class TaskRecordResult4Report {

    private List<AppTaskRecord> tasks;

    private Integer total;

    public List<AppTaskRecord> getTasks() {
        return tasks;
    }

    public void setTasks(List<AppTaskRecord> tasks) {
        this.tasks = tasks;
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }
}

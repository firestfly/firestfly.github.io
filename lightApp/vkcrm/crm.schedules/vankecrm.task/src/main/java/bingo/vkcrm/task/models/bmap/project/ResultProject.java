package bingo.vkcrm.task.models.bmap.project;

import bingo.vkcrm.task.models.bmap.common.BaseResult;

import java.util.List;

/**
 * Created by szsonic on 2015/11/13.
 */
public class ResultProject extends BaseResult {

    private List<ProjectInfo> projects;


    public List<ProjectInfo> getProjects() {
        return projects;
    }

    public void setProjects(List<ProjectInfo> projects) {
        this.projects = projects;
    }
}

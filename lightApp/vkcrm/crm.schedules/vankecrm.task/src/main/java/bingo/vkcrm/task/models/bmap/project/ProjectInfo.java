package bingo.vkcrm.task.models.bmap.project;

/**
 * Created by szsonic on 2015/11/13.
 */
public class ProjectInfo {
    private String projectname;//全名
    private String projectcode;
    private String company;
    private String companycode;
    private String city;
    private String status;
    private String projecttype;
    private String projectsource;
    private String abrev;//别名

    public String getProjectname() {
        return projectname;
    }

    public void setProjectname(String projectname) {
        this.projectname = projectname;
    }

    public String getProjectcode() {
        return projectcode;
    }

    public void setProjectcode(String projectcode) {
        this.projectcode = projectcode;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getCompanycode() {
        return companycode;
    }

    public void setCompanycode(String companycode) {
        this.companycode = companycode;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getProjecttype() {
        return projecttype;
    }

    public void setProjecttype(String projecttype) {
        this.projecttype = projecttype;
    }

    public String getProjectsource() {
        return projectsource;
    }

    public void setProjectsource(String projectsource) {
        this.projectsource = projectsource;
    }

    public String getAbrev() {
        return abrev;
    }

    public void setAbrev(String abrev) {
        this.abrev = abrev;
    }
}

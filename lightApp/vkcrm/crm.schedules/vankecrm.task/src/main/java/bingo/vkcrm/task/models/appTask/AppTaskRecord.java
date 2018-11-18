package bingo.vkcrm.task.models.appTask;

import bingo.dao.orm.annotations.Table;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.apache.commons.lang3.StringUtils;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

/**
 * Created by szsonic on 2016/1/22/022.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@Table(name = "app_task_records")
public class AppTaskRecord {
    private String system_head;
    private String staff;
    private List<String> images;
    private String img;
    private List<Cooperator> cooperator;
    private String project_code;
    private String crm_evaluation;
    private String title;
    private String content;
    private String source;
    private String score;
    private String crm_duty;
    private String crm_source;
    private String status;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updated;
    private String staff_mobile;
    private String paid;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date appointment_start_time;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date appointment_end_time;
    private String address;
    private String task_no;
    private String report_user_mobile;
    private String business_type;
    private String house_code;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date created;
    private String mobile;
    private String housekeeper;
    private String contact;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date syncTime;
    private List<AppTimeline> timeline;

    public String getSystem_head() {
        return system_head;
    }

    public void setSystem_head(String system_head) {
        this.system_head = system_head;
    }

    public String getStaff() {
        return staff;
    }

    public void setStaff(String staff) {
        this.staff = staff;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }



    public String getProject_code() {
        return project_code;
    }

    public void setProject_code(String project_code) {
        this.project_code = project_code;
    }

    public String getCrm_evaluation() {
        return crm_evaluation;
    }

    public void setCrm_evaluation(String crm_evaluation) {
        this.crm_evaluation = crm_evaluation;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getScore() {
        return score;
    }

    public void setScore(String score) {
        this.score = score;
    }

    public String getCrm_duty() {
        return crm_duty;
    }

    public void setCrm_duty(String crm_duty) {
        this.crm_duty = crm_duty;
    }

    public String getCrm_source() {
        return crm_source;
    }

    public void setCrm_source(String crm_source) {
        this.crm_source = crm_source;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getUpdated() {
        return updated;
    }

    public void setUpdated(Date updated) {
        this.updated = updated;
    }

    public String getStaff_mobile() {
        return staff_mobile;
    }

    public void setStaff_mobile(String staff_mobile) {
        this.staff_mobile = staff_mobile;
    }

    public String getPaid() {
        return paid;
    }

    public void setPaid(String paid) {
        this.paid = paid;
    }

    public Date getAppointment_start_time() {
        return appointment_start_time;
    }

    public void setAppointment_start_time(Date appointment_start_time) {
        this.appointment_start_time = appointment_start_time;
    }

    public Date getAppointment_end_time() {
        return appointment_end_time;
    }

    public void setAppointment_end_time(Date appointment_end_time) {
        this.appointment_end_time = appointment_end_time;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getTask_no() {
        return task_no;
    }

    public void setTask_no(String task_no) {
        this.task_no = task_no;
    }

    public String getReport_user_mobile() {
        return report_user_mobile;
    }

    public void setReport_user_mobile(String report_user_mobile) {
        this.report_user_mobile = report_user_mobile;
    }

    public String getBusiness_type() {
        return business_type;
    }

    public void setBusiness_type(String business_type) {
        this.business_type = business_type;
    }

    public String getHouse_code() {
        return house_code;
    }

    public void setHouse_code(String house_code) {
        this.house_code = house_code;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getHousekeeper() {
        return housekeeper;
    }

    public void setHousekeeper(String housekeeper) {
        this.housekeeper = housekeeper;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public List<AppTimeline> getTimeline() {
        return timeline;
    }

    public void setTimeline(List<AppTimeline> timeline) {
        this.timeline = timeline;
    }

    public String getImg() {
        return StringUtils.join(images.toArray(),",");
    }

    public void setImg(String img) {
        this.img = img;
    }

    public List<Cooperator> getCooperator() {
        return cooperator;
    }

    public void setCooperator(List<Cooperator> cooperator) {
        this.cooperator = cooperator;
    }
}

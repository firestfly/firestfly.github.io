package bingo.vkcrm.task.models.appTask;

import bingo.dao.orm.annotations.IsKey;
import bingo.dao.orm.annotations.Table;
import bingo.vkcrm.common.enums.CachePrefix;
import bingo.vkcrm.common.utils.CacheUtil;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.apache.commons.lang3.StringUtils;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by szsonic on 2015/12/1.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@Table(name = "sync_task_records")
public class SyncTaskRecords {
    private String task_no;
    private String contact;
    private String mobile;
    private String created;
    private String project_code;
    private String project_name;
    private String house_code;
    private String house_name;
    private String report_user_mobile;
    private String score;
    private String status;
    private String system_head;
    private String system_head_name;
    private String staff;
    private String staff_name;
    private String source;
    private String crm_duty;
    private String crm_source;
    private String crm_priority;
    private String crm_evaluation;
    private String content;
    private String title;
    private String address;
    private String housekeeper;
    private String housekeeper_name;
    private String staff_mobile;
    private String paid;
    private String business_type;
    private String business_name;
    private List<String> images;
    private String imgs;
    private String appointment_start_time;
    private String appointment_end_time;
    private List<Cooperator> cooperator;
    private List<AppTimeline> timeline;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date sync_time;


    public String getTask_no() {
        return task_no;
    }

    public void setTask_no(String task_no) {
        this.task_no = task_no;
    }


    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }


    public String getProject_code() {
        return project_code;
    }

    public void setProject_code(String project_code) {
        this.project_code = project_code;
    }

    public String getProject_name() {
        Map<String,String> map=CacheUtil.get(Map.class,CachePrefix.PrjCode, this.project_code);
        if(map!=null){
            return map.get("name");
        }
        return null;
    }

    public void setProject_name(String project_name) {
        this.project_name = project_name;
    }

    public String getHouse_code() {
        return house_code;
    }

    public void setHouse_code(String house_code) {
        this.house_code = house_code;
    }

    public String getHouse_name() {
        return CacheUtil.get(CachePrefix.HouseCode,this.house_code);
    }

    public void setHouse_name(String house_name) {
        this.house_name = house_name;
    }

    public String getReport_user_mobile() {
        return report_user_mobile;
    }

    public void setReport_user_mobile(String report_user_mobile) {
        this.report_user_mobile = report_user_mobile;
    }

    public String getScore() {
        return score;
    }

    public void setScore(String score) {
        this.score = score;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

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

    public String getCrm_priority() {
        return crm_priority;
    }

    public void setCrm_priority(String crm_priority) {
        this.crm_priority = crm_priority;
    }

    public String getCrm_evaluation() {
        return crm_evaluation;
    }

    public void setCrm_evaluation(String crm_evaluation) {
        this.crm_evaluation = crm_evaluation;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getHousekeeper() {
        return housekeeper;
    }

    public void setHousekeeper(String housekeeper) {
        this.housekeeper = housekeeper;
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

    public String getBusiness_type() {
        return business_type;
    }

    public void setBusiness_type(String business_type) {
        this.business_type = business_type;
    }







    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public List<AppTimeline> getTimeline() {
        return timeline;
    }

    public void setTimeline(List<AppTimeline> timeline) {
        this.timeline = timeline;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }


    public Date getSync_time() {
        return sync_time;
    }

    public void setSync_time(Date sync_time) {
        this.sync_time = sync_time;
    }

    public String getAppointment_start_time() {
        return appointment_start_time;
    }

    public void setAppointment_start_time(String appointment_start_time) {
        this.appointment_start_time = appointment_start_time;
    }

    public String getAppointment_end_time() {
        return appointment_end_time;
    }

    public void setAppointment_end_time(String appointment_end_time) {
        this.appointment_end_time = appointment_end_time;
    }

    public String getCreated() {
        return created;
    }

    public void setCreated(String created) {
        this.created = created;
    }

    public List<Cooperator> getCooperator() {
        return cooperator;
    }

    public void setCooperator(List<Cooperator> cooperator) {
        this.cooperator = cooperator;
    }

    public String getBusiness_name() {
        return CacheUtil.get(CachePrefix.BizType,this.business_type);
    }

    public void setBusiness_name(String business_name) {
        this.business_name = business_name;
    }

    public String getSystem_head_name() {
        return system_head_name;
    }

    public void setSystem_head_name(String system_head_name) {
        this.system_head_name = system_head_name;
    }

    public String getStaff_name() {
        return staff_name;
    }

    public void setStaff_name(String staff_name) {
        this.staff_name = staff_name;
    }

    public String getHousekeeper_name() {
        return housekeeper_name;
    }

    public void setHousekeeper_name(String housekeeper_name) {
        this.housekeeper_name = housekeeper_name;
    }

    public String getImgs() {
        this.imgs=StringUtils.join(images.toArray(),",");
        return imgs;
    }

    public void setImgs(String imgs) {
        this.imgs = imgs;
    }
}

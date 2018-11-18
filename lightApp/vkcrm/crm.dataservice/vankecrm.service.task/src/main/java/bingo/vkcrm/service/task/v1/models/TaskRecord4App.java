package bingo.vkcrm.service.task.v1.models;

/**
 * Created by szsonic on 2015/9/22.
 * 提交到助这儿接口的数据格式（新增任务）
 */
public class TaskRecord4App {
    /**
     * 任务标题
     */
    private String title;
    /**
     * 任务描述
     */
    private String desc;
    /**
     * 处理时联系人姓名/称呼
     */
    private String contact;
    /**
     * 处理时联系人手机
     */
    private String mobile;
    /**
     * 任务相关地址，如有明确房号，需填写至房屋房号
     */
    private String address;
    /**
     * 项目编码
     */
    private String project_code;
    /**
     * 房屋编码
     */
    private String house_code;
    /**
     * 填具体业务类型
     */
    private String business_type;
    /**
     * 任务来源(call in)人的手机号
     */
    private String report_user_mobile;
    /**
     * 期望开始处理时间
     */
    private String appointment_start_time;
    /**
     * 期望处理完成时间
     */
    private String appointment_end_time;
    /**
     * 图片地址（暂时不传该字段,预留）
     */
    private String image;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getProject_code() {
        return project_code;
    }

    public void setProject_code(String project_code) {
        this.project_code = project_code;
    }

    public String getHouse_code() {
        return house_code;
    }

    public void setHouse_code(String house_code) {
        this.house_code = house_code;
    }

    public String getBusiness_type() {
        return business_type;
    }

    public void setBusiness_type(String business_type) {
        this.business_type = business_type;
    }

    public String getReport_user_mobile() {
        return report_user_mobile;
    }

    public void setReport_user_mobile(String report_user_mobile) {
        this.report_user_mobile = report_user_mobile;
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

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}

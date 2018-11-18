package bingo.vkcrm.task.models.appTask;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.apache.commons.lang3.StringUtils;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * Created by szsonic on 2015/11/10.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class AppTimeline  {
    private  String status;
    private  String msg;
    private List<String> images;
    private String img;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date time;
    private String creator;
    private String task_no;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }


    public String getTask_no() {
        return task_no;
    }

    public void setTask_no(String task_no) {
        this.task_no = task_no;
    }

    public String getImg() {
        return StringUtils.join(images.toArray(),",");
    }

    public void setImg(String img) {
        this.img = img;
    }
}

package bingo.vkcrm.task.models.tel;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * 坐席状态
 */
public class SetStatus {
    /**
     * 执行状态
     */
    private String exec;
    /**
     * 方法名称
     */
    private String methodName;
    /**
     * 工号状态
     */
    private String agentState;
    /**
     * 心跳时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date beatTime;
    /**
     * 回调
     */
    private String callBack;
    /**
     * 执行类型
     */
    private String execType;
    /**
     * 方法类型
     */
    private String methodType;
    /**
     * 名称
     */
    private String agentName;
    /**
     * 工号
     */
    private String agentId;
    /**
     * 分机号
     */
    private String agentStation;
    /**
     * 工号类型
     */
    private String agentType;
    /**
     * IP地址
     */
    private String iPAddress;
    /**
     * 状态
     */
    private String status;

    /**
     * 状态文本
     */
    private String statusText;
    /**
     * 录音ID
     */
    private String callId;
    /**
     * 客户号码
     */
    private String otherDN;
    /**
     * 呼叫类型
     */
    private String callInType;
    /**
     * 创建时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date stateTime;

    public String getExec() {
        return exec;
    }

    public void setExec(String exec) {
        this.exec = exec;
    }

    public String getMethodName() {
        return methodName;
    }

    public void setMethodName(String methodName) {
        this.methodName = methodName;
    }

    public String getAgentState() {
        return agentState;
    }

    public void setAgentState(String agentState) {
        this.agentState = agentState;
    }

    public Date getBeatTime() {
        return beatTime;
    }

    public void setBeatTime(Date beatTime) {
        this.beatTime = beatTime;
    }

    public String getCallBack() {
        return callBack;
    }

    public void setCallBack(String callBack) {
        this.callBack = callBack;
    }

    public String getExecType() {
        return execType;
    }

    public void setExecType(String execType) {
        this.execType = execType;
    }

    public String getMethodType() {
        return methodType;
    }

    public void setMethodType(String methodType) {
        this.methodType = methodType;
    }

    public String getAgentName() {
        return agentName;
    }

    public void setAgentName(String agentName) {
        this.agentName = agentName;
    }

    public String getAgentId() {
        return agentId;
    }

    public void setAgentId(String agentId) {
        this.agentId = agentId;
    }

    public String getAgentStation() {
        return agentStation;
    }

    public void setAgentStation(String agentStation) {
        this.agentStation = agentStation;
    }

    public String getAgentType() {
        return agentType;
    }

    public void setAgentType(String agentType) {
        this.agentType = agentType;
    }

    public String getiPAddress() {
        return iPAddress;
    }

    public void setiPAddress(String iPAddress) {
        this.iPAddress = iPAddress;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatusText() {
        return statusText;
    }

    public void setStatusText(String statusText) {
        this.statusText = statusText;
    }

    public String getCallId() {
        return callId;
    }

    public void setCallId(String callId) {
        this.callId = callId;
    }

    public String getOtherDN() {
        return otherDN;
    }

    public void setOtherDN(String otherDN) {
        this.otherDN = otherDN;
    }

    public String getCallInType() {
        return callInType;
    }

    public void setCallInType(String callInType) {
        this.callInType = callInType;
    }

    public Date getStateTime() {
        return stateTime;
    }

    public void setStateTime(Date stateTime) {
        this.stateTime = stateTime;
    }
}

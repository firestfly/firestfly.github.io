package bingo.vkcrm.service.tel.v1.models;

import java.util.Date;

/**
 * 工号状态
 */
public class AgentStatus {
    /**
     * 工号
     */
    private String agentId;
    /**
     * 工号状态
     */
    private String agentState;
    /**
     * 时间
     */
    private Date createDate;

    public String getAgentId() {
        return agentId;
    }

    public void setAgentId(String agentId) {
        this.agentId = agentId;
    }

    public String getAgentState() {
        return agentState;
    }

    public void setAgentState(String agentState) {
        this.agentState = agentState;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }
}

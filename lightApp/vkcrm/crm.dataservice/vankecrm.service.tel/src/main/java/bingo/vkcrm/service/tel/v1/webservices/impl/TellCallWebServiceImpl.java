package bingo.vkcrm.service.tel.v1.webservices.impl;

import bingo.common.core.ApplicationContext;
import bingo.vkcrm.service.service.BaseService;
import bingo.vkcrm.service.tel.v1.models.AgentStatus;
import bingo.vkcrm.service.tel.v1.models.IVR;
import bingo.vkcrm.service.tel.v1.models.SetStatus;
import bingo.vkcrm.service.tel.v1.webservices.TelCallWebService;
import bingo.vkcrm.common.utils.JedisUtil;
import bingo.vkcrm.common.utils.JsonUtil;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.jws.WebService;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.Set;

@WebService
public class TellCallWebServiceImpl extends BaseService implements TelCallWebService {

    private static final Log log = LogFactory.getLog(TellCallWebServiceImpl.class);

    private static final String AGENT_DB = "redis.agent.db";

    private static final String AGENT_STATUS_KEY = ApplicationContext.getProperty("Profile.agentstatus.key", "AGENT_ID_");

    private static final String SET_STATUS_KEY = ApplicationContext.getProperty("Profile.setstatus.key", "SET_ID_");

    private static final String SET_INFO_KEY = ApplicationContext.getProperty("Profile.setinfo.key", "SET_INFO");


    /**
     * 接收信息
     *
     * @param exec         是否执行
     * @param methodName   方法名称
     * @param callBack     回调
     * @param execType     执行类型
     * @param methodType   方法类型
     * @param agentID      坐席工号
     * @param agentStation 分机号
     * @param agentType    坐席类型
     * @param iPAddress    IP地址
     * @param status       坐席状态
     * @param callID       录音ID
     * @param otherDN      客户号码
     * @param callInType   呼叫类型
     * @param stateTime    状态发送的时间
     */
    public void receive(String exec, String methodName, String callBack, String execType, String methodType, String agentID, String agentStation, String agentType, String iPAddress, String status, String callID, String otherDN, String callInType, String stateTime, String telephonistId) throws Exception {
        if (StringUtils.isEmpty(agentID)) {
            log.error("AgentId为空");
            return;
        }
        //根据不同的处理类型分发至不同的处理方法
        if ("set".equalsIgnoreCase(methodType)) {
            receiveAgentStatus(exec, methodName, callBack, execType, methodType, agentID, agentStation, agentType, iPAddress, status, callID, otherDN, callInType, stateTime, telephonistId);
        } else if ("beat".equalsIgnoreCase(methodType)) {
            receiveHeartBeat(exec, methodName, callBack, execType, agentID, methodType);
        }
    }

    /**
     * 接收坐席状态
     *
     * @param exec         是否执行
     * @param methodName   方法名称
     * @param callBack     回调
     * @param execType     执行类型
     * @param methodType   方法类型
     * @param agentID      坐席工号
     * @param agentStation 分机号
     * @param agentType    班长或者是一般坐席，目前同一为坐席
     * @param iPAddress    IP地址
     * @param status       坐席状态：
     *                     1,
     *                     未登录状态
     *                     2,
     *                     登录状态
     *                     3,
     *                     空闲状态
     *                     4,
     *                     未就绪状态（示忙）
     *                     5,
     *                     震铃状态
     *                     6,
     *                     外拨号状态
     *                     8,
     *                     活动状态
     *                     10,
     *                     呼叫保持状态
     *                     11,
     *                     咨询状态
     *                     12,
     *                     会议状态
     *                     17,
     *                     后处理状态
     * @param callID       录音ID
     * @param otherDN      客户号码
     * @param callInType   呼叫类型：1为呼入，9为呼出
     * @param stateTime    状态发送的时间
     * @throws Exception
     */
    public void receiveAgentStatus(String exec, String methodName, String callBack, String execType, String methodType, String agentID, String agentStation, String agentType, String iPAddress, String status, String callID, String otherDN, String callInType, String stateTime, String telephonistId) throws Exception {

        log.debug("exec：" + exec);
        log.debug("methodName：" + methodName);
        log.debug("callBack：" + callBack);
        log.debug("execType：" + execType);
        log.debug("methodType：" + methodType);
        log.debug("agentID：" + agentID);
        log.debug("agentStation：" + agentStation);
        log.debug("agentType：" + agentType);
        log.debug("iPAddress：" + iPAddress);
        log.debug("status：" + status);
        log.debug("callID：" + callID);
        log.debug("otherDN：" + otherDN);
        log.debug("callInType：" + callInType);
        log.debug("stateTime：" + stateTime);

        String key = SET_STATUS_KEY + agentID;
        String infoKey = SET_INFO_KEY;
        //删除坐席信息
        JedisUtil.switchDb(AGENT_DB).del(key.getBytes("UTF-8"));
        //坐席主动登出，删除工号信息
        if ("0".equalsIgnoreCase(status)) {
            JedisUtil.switchDb(AGENT_DB).del((SET_STATUS_KEY + agentID).getBytes("UTF-8"));
        }
        SetStatus setStatus = new SetStatus();
        setStatus.setExec(exec);
        setStatus.setMethodName(methodName);
        setStatus.setCallBack(callBack);
        setStatus.setExecType(execType);
        setStatus.setMethodType(methodType);
        setStatus.setAgentId(agentID);
        setStatus.setAgentStation(agentStation);
        setStatus.setAgentType(agentType);
        setStatus.setiPAddress(iPAddress);
        setStatus.setStatus(status);
        setStatus.setCallId(callID);
        setStatus.setOtherDN(otherDN);
        setStatus.setCallInType(callInType);
        setStatus.setStateTime(stateTime);

        //插入坐席信息
        JedisUtil.switchDb(AGENT_DB).set(key.getBytes("UTF-8"), JsonUtil.toJson(setStatus).getBytes("UTF-8"));
        //插入坐席信息至缓存队列
        JedisUtil.switchDb(AGENT_DB).lpush(infoKey.getBytes("UTF-8"), JsonUtil.toJson(setStatus).getBytes("UTF-8"));
    }

    /**
     * 接收工号心跳
     *
     * @param exec       是否执行
     * @param methodName 方法名称
     * @param callBack   回调
     * @param execType   执行类型
     * @param agentID    坐席工号
     * @param methodType 方法类型
     * @throws Exception
     */
    public void receiveHeartBeat(String exec, String methodName, String callBack, String execType, String agentID, String methodType) throws Exception {

        log.debug("exec：" + exec);
        log.debug("methodName：" + methodName);
        log.debug("callBack：" + callBack);
        log.debug("execType：" + execType);
        log.debug("agentID：" + agentID);
        log.debug("methodType：" + methodType);

        String key = AGENT_STATUS_KEY + agentID;
        //删除工号信息
        JedisUtil.switchDb(AGENT_DB).del(key.getBytes("UTF-8"));
        AgentStatus agentStatus = new AgentStatus();
        agentStatus.setAgentId(agentID);
        agentStatus.setAgentState("online");
        agentStatus.setCreateDate(new Date());
        //插入工号信息
        JedisUtil.switchDb(AGENT_DB).set(key.getBytes("UTF-8"), JsonUtil.toJson(agentStatus).getBytes("UTF-8"));
    }
}

package bingo.vkcrm.service.tel.v1.services;

import bingo.common.core.ApplicationContext;
import bingo.vkcrm.service.common.User;
import bingo.vkcrm.service.service.BaseService;
import bingo.vkcrm.service.tel.v1.models.*;
import bingo.vkcrm.common.utils.JedisUtil;
import bingo.vkcrm.common.utils.JsonUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * 话务状态服务
 */
@Service
public class TelRecordService extends BaseService {


    private static final String AGENT_DB = "redis.agent.db";

    private static final String AGENT_STATUS_KEY = ApplicationContext.getProperty("Profile.agentstatus.key", "AGENT_ID_");

    private static final String SET_STATUS_KEY = ApplicationContext.getProperty("Profile.setstatus.key", "SET_ID_");

    private static final String AGENT_KEY = ApplicationContext.getProperty("Profile.agent.key", "AGENT_");

    private static final String GROUP_KEY = ApplicationContext.getProperty("Profile.group.key", "GROUP_");

    private static final String NUMBER_KEY = ApplicationContext.getProperty("Profile.number.key", "NUMBER_");

    private static final int AGENT_STATUS_TIMEOUT = Integer.parseInt(ApplicationContext.getProperty("Profile.agentstatus.timeout", "3"));


    /**
     * 保存事件开始状态
     *
     * @param uuid
     * @param telephonistId
     * @param telephonistName
     * @param seatId
     * @param status
     * @param date
     * @return
     */
    public boolean saveStartTelEvent(String key, String uuid, String telephonistId, String telephonistName, String seatId, String status, Date date) throws Exception {
        TelRecordEvent startEvent = new TelRecordEvent(uuid, telephonistId, telephonistName, seatId, status, date, null);
        String jsonString = JsonUtil.toJson(startEvent);
        JedisUtil.defaultDb().lpush(key, jsonString);
        return true;
    }

    /**
     * 保存事件结束状态
     *
     * @param uuid
     * @param telephonistId
     * @param telephonistName
     * @param seatId
     * @param status
     * @param date
     * @return
     */
    public boolean saveEndTelEvent(String key, String uuid, String telephonistId, String telephonistName, String seatId, String status, Date date) throws Exception {
        TelRecordEvent endEvent = new TelRecordEvent(uuid, telephonistId, telephonistName, seatId, status, null, date);
        String jsonString = JsonUtil.toJson(endEvent);
        JedisUtil.defaultDb().lpush(key, jsonString);
        return true;
    }

    /**
     * 判断是否离线
     *
     * @param agentId 坐席号
     * @return
     * @throws Exception
     */
    public boolean isOffline(String agentId) throws Exception {
        String key = AGENT_STATUS_KEY + agentId;
        String jsonString = JedisUtil.switchDb(AGENT_DB).get(key);
        if (StringUtils.isEmpty(jsonString)) {
            return false;
        }
        log.info("取出工号状态：" + jsonString);
        AgentStatus agentStatus = JsonUtil.fromJson(jsonString, AgentStatus.class);
        if (null == agentStatus) {
            return false;
        }
        if ("offline".equalsIgnoreCase(agentStatus.getAgentState())) {
            return true;
        } else if ("online".equalsIgnoreCase(agentStatus.getAgentState())) {
            return false;
        }
        return false;
    }

    /**
     * 更新工号心跳
     *
     * @throws Exception
     */
    public void updateAgentStatus() throws Exception {
        Date date = new Date();
        //获取Redis中匹配的key
        Set keys = JedisUtil.switchDb(AGENT_DB).keys(AGENT_STATUS_KEY + "*");
        if (keys != null) {
            //循环取出key对应的值，对比是否离线，或者超时
            Iterator iterator = keys.iterator();
            while (iterator.hasNext()) {
                String key = String.valueOf(iterator.next());
                log.debug("取出key：" + key);
                String jsonString = JedisUtil.switchDb(AGENT_DB).get(key);
                if (StringUtils.isEmpty(jsonString)) {
                    break;
                }
                log.info("取出工号状态：" + jsonString);
                AgentStatus agentStatus = JsonUtil.fromJson(jsonString, AgentStatus.class);
                if (agentStatus == null) {
                    break;
                }
                if ("offline".equalsIgnoreCase(agentStatus.getAgentState())) {
                    break;
                }
                long spanSecond = (date.getTime() - agentStatus.getCreateDate().getTime()) / 1000;

                //如果已超时，则更新坐席信息
                String setKey = SET_STATUS_KEY + agentStatus.getAgentId();
                log.debug("取出key：" + setKey);
                String setJsonString = JedisUtil.switchDb(AGENT_DB).get(setKey);
                if (StringUtils.isEmpty(setJsonString)) {
                    break;
                }
                log.debug("取出坐席信息：" + setJsonString);
                SetStatus setStatus = JsonUtil.fromJson(setJsonString, SetStatus.class);
                setStatus.setBeatTime(date);
                //超时，更新为离线状态
                if (spanSecond > AGENT_STATUS_TIMEOUT) {
                    JedisUtil.switchDb(AGENT_DB).del(key.getBytes("UTF-8"));
                    //setStatus.setAgentState("offline");
                } else {
                    JedisUtil.switchDb(AGENT_DB).del(key.getBytes("UTF-8"));
                    //setStatus.setAgentState("online");
                }
                //删除坐席信息
                JedisUtil.switchDb(AGENT_DB).del(setKey.getBytes("UTF-8"));
                //插入坐席信息
                //JedisUtil.switchDb(AGENT_DB).set(setKey.getBytes("UTF-8"), JsonUtil.toJson(setStatus).getBytes("UTF-8"));
            }
        }
    }

    /**
     * 缓存工号信息
     *
     * @throws Exception
     */
    public void cacheAgents() throws Exception {
        Map<String, Object> paramsMap = new HashMap<String, Object>();
        List<Agent> agents = bizRoDao.queryForList(Agent.class, "service.agent.get.info", paramsMap);
        for (Agent agent : agents) {
            JedisUtil.switchDb(AGENT_DB).del((AGENT_KEY + agent.getId() + "_" + GROUP_KEY + agent.getGroupId() + "_" + NUMBER_KEY + agent.getNumber()).getBytes("UTF-8"));
            JedisUtil.switchDb(AGENT_DB).set((AGENT_KEY + agent.getId() + "_" + GROUP_KEY + agent.getGroupId() + "_" + NUMBER_KEY + agent.getNumber()).getBytes("UTF-8"), JsonUtil.toJson(agent).getBytes("UTF-8"));
        }
        List<AgentGroup> agentGroups = bizRoDao.queryForList(AgentGroup.class, "service.agent.get.group", paramsMap);
        for (AgentGroup agentGroup : agentGroups) {
            JedisUtil.switchDb(AGENT_DB).del((GROUP_KEY + agentGroup.getId()).getBytes("UTF-8"));
            JedisUtil.switchDb(AGENT_DB).set((GROUP_KEY + agentGroup.getId()).getBytes("UTF-8"), JsonUtil.toJson(agentGroup).getBytes("UTF-8"));
        }
    }

    /**
     * 获取工号信息
     *
     * @param agentId
     * @return
     */
    @Cacheable(value = "agentCache", key = "'Agent_'.concat(#agentId)")
    public Agent getAgent(String agentId) {
        Map<String, Object> paramsMap = new HashMap<String, Object>();
        paramsMap.put("AgentId", agentId);
        return bizRoDao.queryForObject(Agent.class, "service.agent.get", paramsMap);
    }

    /**
     * 获取空闲咨询组坐席
     *
     * @throws Exception
     */
    public Map<String, List<Map<String, Object>>> getIdleGroupSet(User user) throws Exception {
        String userId = user.getId();
        String groupMasterId = null;
        //获取分组信息
        Set groupKeys = JedisUtil.switchDb(AGENT_DB).keys(GROUP_KEY + "*");
        Map<String, Object> groupMap = new HashMap<String, Object>();
        List<AgentGroup> agentGroups = new ArrayList<AgentGroup>();
        if (groupKeys != null) {
            Iterator iterator = groupKeys.iterator();
            while (iterator.hasNext()) {
                String key = String.valueOf(iterator.next());
                log.debug("取出分组key：" + key);
                String jsonString = JedisUtil.switchDb(AGENT_DB).get(key);
                if (StringUtils.isEmpty(jsonString)) {
                    break;
                }
                log.debug("取出分组信息：" + jsonString);
                AgentGroup agentGroup = JsonUtil.fromJson(jsonString, AgentGroup.class);
                agentGroups.add(agentGroup);
                groupMap.put(agentGroup.getId(), agentGroup.getName());
            }
        }
        //获取坐席信息
        Set setKeys = JedisUtil.switchDb(AGENT_DB).keys(SET_STATUS_KEY + "*");
        List<SetStatus> setStatuses = new ArrayList<SetStatus>();
        if (setKeys != null) {
            Iterator iterator = setKeys.iterator();
            while (iterator.hasNext()) {
                String key = String.valueOf(iterator.next());
                log.debug("取出坐席key：" + key);
                String jsonString = JedisUtil.switchDb(AGENT_DB).get(key);
                if (StringUtils.isEmpty(jsonString)) {
                    break;
                }
                log.debug("取出坐席信息：" + jsonString);
                SetStatus setStatus = JsonUtil.fromJson(jsonString, SetStatus.class);
                //3 为置闲状态
                //提取出状态为3的坐席信息
                //且分机号不为空的坐席信息
                //TODO:由于心跳包会定时更新坐席状态,后续考虑是否过滤心跳超时的坐席信息
                if ("3".equalsIgnoreCase(setStatus.getStatus()) && StringUtils.isNotBlank(setStatus.getAgentStation())) {
                    setStatuses.add(setStatus);
                }
            }
        }
        //获取话务员信息
        Set agentKeys = JedisUtil.switchDb(AGENT_DB).keys(AGENT_KEY + "*_" + GROUP_KEY + "*_" + NUMBER_KEY + "*");
        List<Agent> agents = new ArrayList<Agent>();
        List<Agent> groupMasterAgents = new ArrayList<Agent>();
        if (agentKeys != null) {
            Iterator iterator = agentKeys.iterator();
            while (iterator.hasNext()) {
                String key = String.valueOf(iterator.next());
                log.debug("取出话务员key：" + key);
                String jsonString = JedisUtil.switchDb(AGENT_DB).get(key);
                if (StringUtils.isEmpty(jsonString)) {
                    break;
                }
                log.debug("取出话务员信息：" + jsonString);
                Agent agent = JsonUtil.fromJson(jsonString, Agent.class);
                //获取当前话务员话务信息,提取组长ID
                if (agent != null && userId.equalsIgnoreCase(agent.getId())) {
                    groupMasterId = agent.getGroupMaster();
                }
                //组长ID不为空,提取组长信息至组长话务信息集合中
                if (StringUtils.isNotBlank(groupMasterId) && groupMasterId.equalsIgnoreCase(agent.getId())) {
                    //获取组长相关的话务员信息
                    groupMasterAgents.add(agent);
                }
                //排除当前登录的话务员相关信息
                if (!userId.equalsIgnoreCase(agent.getId())) {
                    agents.add(agent);
                }
            }
        }
        if (setStatuses != null) {
            Map<String, List<Map<String, Object>>> listMap = new HashMap<String, List<Map<String, Object>>>();
            List<Map<String, Object>> setMaps = new ArrayList<Map<String, Object>>();
            for (SetStatus setStatus : setStatuses) {
                Map<String, Object> setMap = new HashMap<String, Object>();
                Map<String, Object> groupMasterMap = new HashMap<String, Object>();
                for (Agent agent : agents) {
                    //由于同时只允许一个工号在线
                    //根据坐席状态中保存的工号信息,提取话务员信息的基本信息
                    if (setStatus.getAgentId().equalsIgnoreCase(agent.getNumber())) {
                        setMap.put("agentId", setStatus.getAgentId());
                        setMap.put("agentStation", setStatus.getAgentStation());
                        setMap.put("name", agent.getName());
                        setMap.put("groupName", agent.getGroupName());
                        setMap.put("groupId", agent.getGroupId());
                        break;
                    }
                }
                for (Agent groupMasterAgent : groupMasterAgents) {
                    if (setStatus.getAgentId().equalsIgnoreCase(groupMasterAgent.getNumber())) {
                        //获取组长
                        groupMasterMap.put("agentId", setStatus.getAgentId());
                        groupMasterMap.put("agentStation", setStatus.getAgentStation());
                        groupMasterMap.put("name", groupMasterAgent.getName());
                        groupMasterMap.put("groupName", groupMasterAgent.getGroupName());
                        groupMasterMap.put("groupId", groupMasterAgent.getGroupId());
                        List<Map<String, Object>> mapList = new ArrayList<Map<String, Object>>();
                        mapList.add(groupMasterMap);
                        listMap.put("组长", mapList);
                        break;
                    }
                }
                setMaps.add(setMap);
            }
            for (Map<String, Object> setMap : setMaps) {
                String groupNameKey = setMap.get("groupName") == null ? "" : setMap.get("groupName").toString();
                if (listMap.get(groupNameKey) == null) {
                    List<Map<String, Object>> maps = new ArrayList<Map<String, Object>>();
                    maps.add(setMap);
                    listMap.put(groupNameKey, maps);
                } else {
                    List<Map<String, Object>> maps = listMap.get(groupNameKey);
                    maps.add(setMap);
                    listMap.put(groupNameKey, maps);
                }
            }
            return listMap;
        }
        //TODO:提取当前空闲坐席,写入分组信息.
        return null;
    }

    /**
     * 定时清空缓存
     */
    public void cleanCache() {
        // 每天6点定时清缓存
        System.out.println("agent cache clean...");
    }

    /**
     * 获取空闲坐席列表
     *
     * @return
     * @throws Exception
     */
    public List<SetStatus> getIdleSets() throws Exception {
        List<SetStatus> sets = new ArrayList<SetStatus>();
        //获取Redis中匹配的key
        Set keys = JedisUtil.switchDb(AGENT_DB).keys(SET_STATUS_KEY + "*");
        if (keys != null) {
            Iterator iterator = keys.iterator();
            while (iterator.hasNext()) {
                String key = String.valueOf(iterator.next());
                log.debug("取出key：" + key);
                String jsonString = JedisUtil.switchDb(AGENT_DB).get(key);
                if (StringUtils.isEmpty(jsonString)) {
                    break;
                }
                log.debug("取出坐席信息：" + jsonString);
                SetStatus setStatus = JsonUtil.fromJson(jsonString, SetStatus.class);
                if (setStatus == null) {
                    break;
                }
//                setStatus.setAgentName(JedisUtil.switchDb(AGENT_DB).get(AGENT_KEY + setStatus.getAgentId()));
                if (!"3".equalsIgnoreCase(setStatus.getStatus())) {
                    break;
                }
                Agent agent = getAgent(setStatus.getAgentId());
                if (agent != null) {
                    setStatus.setAgentName(agent.getName());
                }
                sets.add(setStatus);
            }
        }
        return sets;
    }

    /**
     * 获取坐席列表
     *
     * @return
     * @throws Exception
     */
    public List<SetStatus> getSets() throws Exception {
        List<SetStatus> sets = new ArrayList<SetStatus>();
        //获取Redis中匹配的key
        Set keys = JedisUtil.switchDb(AGENT_DB).keys(SET_STATUS_KEY + "*");
        if (keys != null) {
            Iterator iterator = keys.iterator();
            while (iterator.hasNext()) {
                String key = String.valueOf(iterator.next());
                log.debug("取出key：" + key);
                String jsonString = JedisUtil.switchDb(AGENT_DB).get(key);
                if (StringUtils.isEmpty(jsonString)) {
                    break;
                }
                log.debug("取出坐席信息：" + jsonString);
                SetStatus setStatus = JsonUtil.fromJson(jsonString, SetStatus.class);
                if (setStatus == null) {
                    break;
                }
                Agent agent = getAgent(setStatus.getAgentId());
                if (agent != null) {
                    setStatus.setAgentName(agent.getName());
                }
//                setStatus.setAgentName(JedisUtil.switchDb(AGENT_DB).get(AGENT_KEY + setStatus.getAgentId()));
                sets.add(setStatus);
            }
        }
        return sets;
    }
}

package bingo.vkcrm.service.report.v1.services;

import bingo.vkcrm.service.report.v1.model.TellCallOutBasicRank;
import bingo.vkcrm.service.service.BaseService;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 话务排行榜服务
 */
@Service
public class TelRankService extends BaseService {

    /**
     * 获取呼出排行榜数据
     *
     * @param rankType 排行榜类型 ? 日 : 月
     * @param skillId  技能组ID
     * @return
     */
    public List<TellCallOutBasicRank> getTelCallOutBasicRankData(String rankType, String skillId) {
        Map<String, Object> paramsMap = new HashMap<String, Object>();
        List<TellCallOutBasicRank> callOutCountRanks = null;
        List<TellCallOutBasicRank> connectedCountRanks = null;
        List<TellCallOutBasicRank> succeededCountRanks = null;
        List<TellCallOutBasicRank> unConnectCountRanks = null;
        paramsMap.put("skillId", skillId);
        if ("month".equalsIgnoreCase(rankType)) {
            Calendar calendar = Calendar.getInstance();
            //得到月初
            calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMinimum(Calendar.DAY_OF_MONTH));
            Date firstDay = calendar.getTime();
            //得到月末
            calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
            Date lastDay = calendar.getTime();

            paramsMap.put("firstDay", new SimpleDateFormat("yyyy-MM-dd").format(firstDay) + " 00:00:00");
            paramsMap.put("lastDay", new SimpleDateFormat("yyyy-MM-dd").format(lastDay) + " 23:59:59");

            callOutCountRanks = bizRoDao.queryForList(TellCallOutBasicRank.class, "sql.tel.rank.callOutCount", paramsMap);
            connectedCountRanks = bizRoDao.queryForList(TellCallOutBasicRank.class, "sql.tel.rank.connectedCount", paramsMap);
            succeededCountRanks = bizRoDao.queryForList(TellCallOutBasicRank.class, "sql.tel.rank.succeededCount", paramsMap);
            unConnectCountRanks = bizRoDao.queryForList(TellCallOutBasicRank.class, "sql.tel.rank.unConnectCount", paramsMap);


        } else if ("day".equalsIgnoreCase(rankType)) {

            String currentDay = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
            paramsMap.put("currentDay", currentDay);

            callOutCountRanks = bizRoDao.queryForList(TellCallOutBasicRank.class, "sql.tel.rank.callOutCount", paramsMap);
            connectedCountRanks = bizRoDao.queryForList(TellCallOutBasicRank.class, "sql.tel.rank.connectedCount", paramsMap);
            succeededCountRanks = bizRoDao.queryForList(TellCallOutBasicRank.class, "sql.tel.rank.succeededCount", paramsMap);
            unConnectCountRanks = bizRoDao.queryForList(TellCallOutBasicRank.class, "sql.tel.rank.unConnectCount", paramsMap);

        }

        for (TellCallOutBasicRank callOutCountRank : callOutCountRanks) {
            for (TellCallOutBasicRank connectedCountRank : connectedCountRanks) {
                if (callOutCountRank.getTelephonistId().equalsIgnoreCase(connectedCountRank.getTelephonistId())) {
                    callOutCountRank.setConnectedCount(connectedCountRank.getConnectedCount());
                }
                for (TellCallOutBasicRank unConnectCountRank : unConnectCountRanks) {
                    if (callOutCountRank.getTelephonistId().equalsIgnoreCase(unConnectCountRank.getTelephonistId())) {
                        callOutCountRank.setUnConnectCount(unConnectCountRank.getUnConnectCount());
                    }
                    for (TellCallOutBasicRank succeededCountRank : succeededCountRanks) {
                        if (callOutCountRank.getTelephonistId().equalsIgnoreCase(succeededCountRank.getTelephonistId())) {
                            callOutCountRank.setSucceededCount(succeededCountRank.getSucceededCount());
                        }
                    }
                }
            }
        }

        return callOutCountRanks;
    }

}

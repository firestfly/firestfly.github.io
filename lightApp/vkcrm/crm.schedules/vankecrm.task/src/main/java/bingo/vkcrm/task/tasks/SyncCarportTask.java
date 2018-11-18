package bingo.vkcrm.task.tasks;

import bingo.vkcrm.common.utils.DateUtil;
import bingo.vkcrm.common.utils.UUIDUtil;
import bingo.vkcrm.task.common.AbstractQuartzTask;
import bingo.vkcrm.task.common.BmapRequestHead;
import bingo.vkcrm.task.models.bmap.carport.*;
import bingo.vkcrm.task.models.bmap.common.BmapSyncLog;
import bingo.vkcrm.task.models.sync.SyncConfig;
import bingo.vkcrm.task.services.SyncService;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.quartz.JobExecutionContext;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by szsonic on 2015/11/24.
 */
public class SyncCarportTask extends AbstractQuartzTask {
    private static final Log log = LogFactory.getLog(SyncCarportTask.class);
    private static final String SYNC_CODE = "syncCarport";//写入同步日志表中的code;用于区别同步数据接口
    private static final String SYNC_LOT_FUNCTIONId = "getlotinfobyproject";//调用战图的方法ID
    private static final String SYNC_CARPORT_FUNCTIONId = "getparkinfobylot";//调用战图的方法ID
    private static final String STATUS_DELETED = "deleted";//数据已删除
    private static final String SOURCE = "CRM";//调用战图接口的参数之一
    private static final String STATUS_RECORDED = "recorded";// 新申请，未录入战图

    @Override
    public boolean doTask(JobExecutionContext jobExecutionContext) throws Exception {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        SyncService syncService = (SyncService) jobExecutionContext.getMergedJobDataMap().get("syncService");
        SyncConfig config = syncService.querySyncConfig(SYNC_CODE);
        Date configSyncTime = config.getNextSyncTime();
        System.out.println("*****************同步战图车位定时任务开始*****************");
        if (new Date().getTime() < configSyncTime.getTime()) {
            System.out.println("同步战图车位定时任务-开始本次同步开始时间为：" + configSyncTime + "，未到时间10秒后再试");
            return true;//如果还没到配置时间，则不开始同步，直接退出
        }
        Integer pageSize = config.getPageSize();
        List<LotInfo> lotlist = new LinkedList<LotInfo>();//有变动的车场信息
        Date requestTime = config.getRequestTime();//获取请求参数（同步时间）
        Date lastRequestTime = config.getLastRequestTime();//上次请求时间（判断上次同步是否成功）
        // int failCount = syncService.querySyncLog(lastRequestTime, SYNC_CODE);//同步失败条数
        String syncTime = null;
        syncTime = sdf.format(requestTime);


        List<String> projectCodeList = syncService.queryAllProject();//获取所有项目code

        Integer projectCount = projectCodeList.size();//所有项目个数
        Integer curPage = 200;
        Integer group = projectCount / curPage;//一共要分为几次调用
        for (int i = 0; i <= group; i++) {
            Boolean hasNextPage = true;
            List<String> tmpProjectCodeList;
            if (i == group) {
                tmpProjectCodeList = projectCodeList.subList(i * curPage, projectCodeList.size() - 1);
            } else {
                tmpProjectCodeList = projectCodeList.subList(i * curPage, (i + 1) * curPage);
            }
            StringBuffer sbProjectCode = new StringBuffer();
            for (String s : tmpProjectCodeList) {
                sbProjectCode.append(s + "|");
            }
            Integer page = 1;//首次取第一页的数据
            String projectCode = sbProjectCode.toString();
            while (hasNextPage) {
                //把所有的项目code拼接起来，发送请求，一次请求所有项目下的车场信息。。。。
                projectCode = projectCode.substring(0, projectCode.length() - 1);//去除末尾的“|”
                RequestLot requestLot = new RequestLot();
                requestLot.setHead(BmapRequestHead.getRequestHead(SYNC_LOT_FUNCTIONId));
                RequestLotParameter parameter = new RequestLotParameter();
                parameter.setPage(page + "");
                parameter.setPagesize(pageSize + "");
                parameter.setSynctime(syncTime);
                parameter.setSource(SOURCE);
                parameter.setProjcode(projectCode);
                requestLot.setParameter(parameter);
                ResponseLot responseLot = syncService.syncLot(requestLot);//调用战图接口取数据
                if (BMAP_SUCCESS_CODE.equals(responseLot.getHead().getCode())) {
                    Integer resultCount = responseLot.getResult().getPagecount();
                    if (resultCount < pageSize) {
                        hasNextPage = false;
                    } else {
                        page++;
                    }
                    lotlist.addAll(responseLot.getResult().getLots());
                }
            }
        }


        List<LotInfo> newLotList = new LinkedList<LotInfo>();

        for (LotInfo lotInfo : lotlist) {
            if (lotInfo.getLotcode() != null && !STATUS_RECORDED.equals(lotInfo.getStatus())) {
                newLotList.add(lotInfo);
                //如果第一次循环先添加一个有效车场(车场code不为空，并且更新状态不是recorded(该状态为录入战图但并未启用))然后再进行判断
                break;
            }
        }
        for (LotInfo lotInfo : lotlist) {
            for (int i = 0; i < newLotList.size(); i++) {
                LotInfo newLot = newLotList.get(i);
                if (lotInfo.getLotcode() != null && !STATUS_RECORDED.equals(lotInfo.getStatus())) {
                    if (lotInfo.equals(newLot)) {
                        if (sdf.parse(lotInfo.getStatusuptime()).getTime() >= sdf.parse(newLot.getStatusuptime()).getTime()) {
                            newLotList.remove(i);
                            newLotList.add(i, lotInfo);
                        }
                        break;
                    } else {
                        if (i == newLotList.size() - 1) {
                            //如果该集合中并没有这个车场，则加到集合中
                            newLotList.add(lotInfo);
                        }
                    }
                } else {
                    break;
                }
            }
        }


        List<LotInfo> updateLotList = new ArrayList<LotInfo>();
        List<LotInfo> insertLotList = new ArrayList<LotInfo>();

        for (LotInfo lotInfo : newLotList) {
            String code = lotInfo.getLotcode();
            if (StringUtils.isNotEmpty(lotInfo.getStatus())) {
                if (STATUS_DELETED.equals(lotInfo.getStatus().toLowerCase())) {
                    lotInfo.setDeleted(true);
                } else {
                    lotInfo.setDeleted(false);
                }
            }
            if (syncService.existCarpark(code)) {
                updateLotList.add(lotInfo);
            } else {
                insertLotList.add(lotInfo);
            }
        }

        syncService.insertCarpark(insertLotList);
        syncService.updateCarpark(updateLotList);


        //获取所有有变动的车场信息
        syncCarportInfo(syncService, newLotList, config);
        return true;
    }

    /**
     * 同步车位信息
     *
     * @param syncService 同步服务
     * @param lotInfos    有变动的车场信息列表
     * @return boolean
     * @throws Exception
     */
    public boolean syncCarportInfo(SyncService syncService, List<LotInfo> lotInfos,SyncConfig config) throws Exception {

        int newCount = 0;
        int editCount = 0;
        Integer pageSize=config.getPageSize();
        config.getRequestTime();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date requestTime= config.getRequestTime();
        int i=0;
        for (LotInfo lotInfo : lotInfos) {
            i++;
            if (STATUS_RECORDED.equals(lotInfo.getStatus().toLowerCase())) {
                continue;//如果是录入但是还没启用的直接循环下一个;
            }
            log.debug("目前同步第"+i+"个车场");
            Integer page = 1;//首次取第一页的数据
            Boolean hasNextPage = true;
            List<CarportInfo> insertList = new LinkedList<CarportInfo>();
            List<CarportInfo> updateList = new LinkedList<CarportInfo>();
            while (hasNextPage) {
                String lotCode = lotInfo.getLotcode();
                String projectCode = lotInfo.getProjcode();
                RequestCarport requestCarport = new RequestCarport();
                requestCarport.setHead(BmapRequestHead.getRequestHead(SYNC_CARPORT_FUNCTIONId));
                RequestCarportParameter parameter = new RequestCarportParameter();
                parameter.setLotcode(lotCode);
                parameter.setPage(page + "");
                parameter.setPagesize(pageSize + "");
                parameter.setSynctime(sdf.format(requestTime));
                parameter.setSource(SOURCE);
                requestCarport.setParameter(parameter);
                //设置请求参数
                ResponseCarport responseCarport = syncService.syncCarport(requestCarport);
                if (BMAP_SUCCESS_CODE.equals(responseCarport.getHead().getCode())) {
                    if (responseCarport.getResult().getPagecount() < pageSize) {
                        hasNextPage = false;
                    } else {
                        page++;
                    }
                    List<CarportInfo> carportInfos = responseCarport.getResult().getParks();
                    for (CarportInfo carportInfo : carportInfos) {
                        Boolean isDeleted = false;
                        if (carportInfo.getStatus().equals(STATUS_DELETED)) {
                            isDeleted = true;
                        }
                        String code = carportInfo.getParkcode();//车位code，对应表中code字段
                        carportInfo.setDeleted(isDeleted);
                        carportInfo.setProjectCode(projectCode);
                        if (syncService.existCarport(code)) {
                            updateList.add(carportInfo);
                            editCount++;
                            //存在该车位则更新数据

                        } else {
                            //否则新增数据
                            carportInfo.setId(UUIDUtil.create());
                            insertList.add(carportInfo);
                            newCount++;
                        }
                    }
                }
            }

            //插入或更新数据
            List<CarportInfo> distinctUpdateList=distinctInfo(updateList);
            List<CarportInfo> distinctInsertList=distinctInfo(insertList);
            if(distinctUpdateList.size()>0){
                syncService.updateCarport(distinctUpdateList);
            }
            if(distinctInsertList.size()>0){
                syncService.insertCarport(distinctInsertList);
            }

        }
        config.setLastRequestTime(config.getRequestTime());
        syncService.updateSyncConfig(config,true);
        return true;
    }

    public List<CarportInfo> distinctInfo(List<CarportInfo> list){
        List<CarportInfo> distinctList = new ArrayList<CarportInfo>();
        // List<CarportInfo> rtList=new ArrayList<CarportInfo>();
        for (int i = 0; i < list.size(); i++) {
            if(i==0&&!STATUS_RECORDED.equals(list.get(i).getStatus())){
                distinctList.add(list.get(i));
            }
            for (int j = 0; j < distinctList.size(); j++) {
                CarportInfo distinct= distinctList.get(j);
                CarportInfo all=list.get(i);
                if (list.get(i).equals(distinctList.get(j))) {
                    distinctList.remove(j);
                    distinctList.add(j, list.get(i));
                    break;
                }
                if (j == distinctList.size() - 1) {
                    distinctList.add(list.get(i));
                    break;
                }
            }
        }
        return distinctList;
    }


    @Override
    public boolean onBefore(JobExecutionContext jobExecutionContext) throws Exception {

        return true;
    }

    @Override
    public void onException(JobExecutionContext jobExecutionContext, String fromMethod, Exception exception) {

    }

    @Override
    public boolean onAfter(JobExecutionContext jobExecutionContext) throws Exception {
        return true;
    }
}

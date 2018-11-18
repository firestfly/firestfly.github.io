
package bingo.vkcrm.service.task.v1.services;

import java.text.SimpleDateFormat;
import java.util.*;

import bingo.vkcrm.service.task.v1.models.*;
import bingo.vkcrm.common.utils.UUIDUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import bingo.dao.Page;
import bingo.vkcrm.service.model.DictionaryItem;
import bingo.vkcrm.service.service.BaseService;
import bingo.vkcrm.service.service.DictionaryService;

@Service
public class ProjectNoticeService extends BaseService {
    @Autowired
    DictionaryService dictionaryService;
    @Autowired
    ProjectService projectService;

    /**
     * 根据公告ID查询公告记录
     *
     * @param noticeId 公告id
     * @return
     */
    public ProjectNotice getNoticeById(String noticeId) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("noticeId", noticeId);
        ProjectNotice notice = bizRoDao.queryForObject(ProjectNotice.class, "sql.query.notice.byid", parameters);
        if(notice!=null){
            if(notice.getIsClosed() != null && notice.getIsClosed() == true){
                notice.setApproveStatus(ApproveStatus.Closed.getCode());
            }

            List<DictionaryItem> dictNoticeLevel = dictionaryService.get("ProjectNoticeLevel");
            List<DictionaryItem> dictApproveStatus = dictionaryService.get("ApproveStatus");
            List<DictionaryItem> dictNoticeStatus = dictionaryService.get("NoticeStatus");

            //通过公告级别插入级别文本
            for (DictionaryItem dictionaryItem : dictNoticeLevel) {
                if (dictionaryItem.getCode().equals(notice.getLevel())) {
                    notice.setLevelText(dictionaryItem.getValue());
                    break;
                }
            }
            //插入公告审批状态文本
            for (DictionaryItem dictionaryItem : dictApproveStatus) {
                if (dictionaryItem.getCode().equals(notice.getApproveStatus())) {
                    notice.setApproveStatusText(dictionaryItem.getValue());
                    break;
                }
            }

            //插入公告状态文本
            for (DictionaryItem dictionaryItem : dictNoticeStatus) {
                if (dictionaryItem.getCode().equals(notice.getNoticeStatus())) {
                    notice.setNoticeStatusText(dictionaryItem.getValue());
                    break;
                }
            }

            //设置公告所在项目文本
            if (!StringUtils.isEmpty(notice.getProjectCode())) {
                notice.setProjectName(projectService.getNameByCode(notice.getProjectCode()));
            }
        }
        return notice;
    }

    /**
     * 分页查询公告内容
     * 公告状态  0、全部     1、待发布    2、有效    3、失效
     *
     * @return
     */
    public List<ProjectNotice> queryNoticesByPage(String publisherId, Page page, String startTime, String endTime,
                                                  String publisher, String projectCode, String projectName,
                                                  String level, Integer noticeStatus, String content, Integer approveStatus) {
        Map<String, Object> parameters = new HashMap<String, Object>();

        if (noticeStatus != null) {
            parameters.put("noticeStatus", noticeStatus);
            switch (noticeStatus) {
                case 1: // 待生效
                    parameters.put("approveStatusExt", ApproveStatus.Approve.getCode());
                    break;
                case 2: // 已生效
                    parameters.put("approveStatusExt", ApproveStatus.Approve.getCode());
                    break;
                case 3: // 已失效
                    parameters.put("approveStatusExt", ApproveStatus.Approve.getCode());
                    break;
                default:
                    break;
            }
        }
        if (approveStatus != null) {
            parameters.put("approveStatus", approveStatus);
        }
        parameters.put("startTime", startTime);
        parameters.put("endTime", endTime);
        parameters.put("publisher", publisher);
        parameters.put("projectName", projectName);
        parameters.put("projectCode", projectCode);
        parameters.put("level", level);
        parameters.put("content", content);

        List<ProjectNotice> notices = bizRoDao.queryForListPage(ProjectNotice.class, page, "sql.query.notices", null, parameters, true);

        List<DictionaryItem> dictNoticeLevel = dictionaryService.get("ProjectNoticeLevel");
        List<DictionaryItem> dictApproveStatus = dictionaryService.get("ApproveStatus");
        List<DictionaryItem> dictNoticeStatus = dictionaryService.get("NoticeStatus");

        Date now = new Date();

        for (ProjectNotice notice : notices) {
            notice.setSelf(false);
            Date takeEffectTime = notice.getTakeEffectTime();
            Date lostEffectTime = notice.getLostEffectTime();

            if(notice.getIsClosed() != null && notice.getIsClosed() == true){
                notice.setApproveStatus(ApproveStatus.Closed.getCode());
            }

            if (now.getTime() < takeEffectTime.getTime()) {
                notice.setNoticeStatus(NoticeStatus.Pending.getCode());
            } else if (lostEffectTime.getTime() <= now.getTime()) {
                notice.setNoticeStatus(NoticeStatus.LostEffect.getCode());
            } else if (now.getTime() >= takeEffectTime.getTime() && now.getTime() < lostEffectTime.getTime()) {
                notice.setNoticeStatus(NoticeStatus.TakeEffect.getCode());
            }

            // 通过公告级别插入级别文本
            for (DictionaryItem dictionaryItem : dictNoticeLevel) {
                if (dictionaryItem.getCode().equals(notice.getLevel())) {
                    notice.setLevelText(dictionaryItem.getValue());
                    break;
                }
            }
            // 插入公告审批状态文本
            for (DictionaryItem dictionaryItem : dictApproveStatus) {
                if (dictionaryItem.getCode().equals(String.valueOf(notice.getApproveStatus()))) {
                    notice.setApproveStatusText(dictionaryItem.getValue());
                    break;
                }
            }

            // 插入公告状态文本
            for (DictionaryItem dictionaryItem : dictNoticeStatus) {
                if (dictionaryItem.getCode().equals(String.valueOf(notice.getNoticeStatus()))) {
                    notice.setNoticeStatusText(dictionaryItem.getValue());
                    break;
                }
            }

            //设置公告所在项目文本
            if (!StringUtils.isEmpty(notice.getProjectCode())) {
                notice.setProjectName(projectService.getNameByCode(notice.getProjectCode()));
            }

            //如果登陆者id跟创建人id一致，设置isself为true
            if (StringUtils.isNotEmpty(notice.getPublisherId())
                    && notice.getPublisherId().equals(publisherId)) {
                notice.setSelf(true);
            }
        }

        return notices;
    }

    /**
     * 删除公告信息,逻辑删除公告，只修改删除状态
     *
     * @param noticeids 公告Id集合 支持批量删除
     * @return
     */
    public boolean deleteNoticeById(String deleter, String deleterId, String[] noticeids) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("deleter", deleter);
        map.put("deleterId", deleterId);
        map.put("deleteTime", new Date());
        Integer ts = 0;
        for (String noticeId : noticeids) {
            map.put("noticeId", noticeId);
            ts += bizDao.update("sql.delete.notice.isdeleted", map);
        }
        return ts > 0;
    }

    /**
     * 修改公告信息
     *
     * @param projectnotice 公告内容实体
     * @return
     */
    public boolean updateProject(String operator,String phone,ProjectNotice projectnotice) {
        // 状态更改后审批状态为待审批
        projectnotice.setApproveStatus(ApproveStatus.Pending.getCode());
        bizDao.update("sql.update.notice", projectnotice);
        //插入日志
        addNoticeLog(5,operator,phone,null,projectnotice);
        return true;
    }

    /**
     * 修改公告状态
     *
     * @param noticeid 公告id
     * @return
     */
//    public boolean updateStatus(String noticeid, String status) {
//        Map<String, Object> map = new HashMap<String, Object>();
//        map.put("noticeid", noticeid);
//        map.put("status", status);
//        return centerDao.update("sql.update.notice.status.byid", map) > 0;
//    }

    /**
     * 新增公告信息
     */
    public boolean addNotice(ProjectNotice projectnotice) {
        String id = UUIDUtil.create();
        projectnotice.setId(id);
        projectnotice.setPublishTime(new Date());
        projectnotice.setApproveStatus(ApproveStatus.Pending.getCode());//新增公告审批状态为待审批
        projectnotice.setNoticeStatus(NoticeStatus.Pending.getCode());//迭代一默认待生效
        bizDao.insert("sql.insert.notice", projectnotice);
        addNoticeLog(1,null,null,null,projectnotice);//创建公告的日志
        return true;
    }

    /**
     * 判断一个项目下有无公告
     *
     * @param projectCode
     * @return
     */
    public Boolean queryHasProjectNotice(String projectCode) {
        String sql = "sql.query.notice.ishasnotice";
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("projectCode", projectCode);
        return bizRoDao.exists(sql, params);
    }


    /**
     * 关闭公告
     * @param noticeId 公告id
     * @param userId 用户id
     * @return
     */
    public Boolean updateClose(String noticeId, String userId){
        String sql = "sql.update.notice.close";
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("noticeId", noticeId);
        parameters.put("approveStatus", ApproveStatus.Closed.getCode());
        parameters.put("userId", userId);
        return bizDao.update(sql, parameters) > 0;
    }


    /**
     * 公告审核
     *
     * @return
     */
    public Boolean saveApprove(String noticeId, String approverId, int result, String opinion,String operator,String phone) {
        int i = 0;
        Map<String, Object> params = new HashMap<String, Object>();

        ProjectNoticeItems item = new ProjectNoticeItems();
        item.setApproveTime(new Date());
        item.setNoticeId(noticeId);
        item.setOpinion(opinion);
        item.setApproverId(approverId);
        item.setResult(result);
        bizDao.insert(item);
        params.put("id", noticeId);
        params.put("approveStatus", result);
        bizDao.update("sql.query.notice.approve", params);
        ProjectNotice projectNotice=new ProjectNotice();
        projectNotice.setId(noticeId);
        addNoticeLog(result,operator,phone,opinion,projectNotice);
        return true;
    }


    /**
     * 公告日志
     * @param actCode 动作编码为1~6，见下面描述的中的编号
     * @param operator 操作人
     * @param phone 联系电话
     * @param opinion   审批意见
     * @param projectNotice 公告信息
     * 1、公告的创建
        显示的日志如： 2015-12-28  15:00呼叫中心王晓明创建了一条普通公告，有效时间为：2015-12-28  18:00到2015-12-28 20:00，公告当前的状态为：待审核。查看公告内容请点击详情。
       2、通过审核
        显示的日志如：2015-12-28  15:05公告已经通过审核，操作人：谭晶晶  联系电话：13302991296。审核意见：谢谢及时反馈。
       3、审核不通过
        显示的日志如：2015-12-28  15:05公告没有通过审核，操作人：谭晶晶  联系电话：13302991296，公告当前的状态为：已关闭。审核意见：对不起，公告仅用来录入紧急提醒的消息，以上内容不适合作为公告发布，烦请通过邮件向呼叫中心知识库运营小组反馈。
       4、公告被退回
        显示的日志如：2015-12-28  15:05公告被退回，操作人：谭晶晶  联系电话：13302991296，公告当前的状态为：被退回。审核意见：烦请详细说明下停水的原因，以便我们清晰的跟客户解释，谢谢。
       5、公告内容修改后被再次发布
        显示的日志如：2015-12-28  15:08呼叫中心王晓明重新提交了一条普通公告，有效时间为：2015-12-28  18:00到2015-12-28 20:00，公告当前的状态为：待审核。查看公告内容请点击详情。
     * @return true
     */
    public Boolean addNoticeLog(Integer actCode,String operator,String phone,String opinion, ProjectNotice projectNotice){
        SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String time=sdf.format(new Date());
        StringBuffer content=new StringBuffer();
        Map<String,Object> params=new HashMap<String, Object>();
        params.put("id",UUIDUtil.create());
        params.put("notice_id",projectNotice.getId());
        params.put("logTime",new Date());
        switch (actCode) {
            case 1:
                content.append(time).append(" 呼叫中心").append(projectNotice.getPublisher()).append("创建了一条").append(projectNotice.getLevelText()).
                        append("公告,有效时间为").append(sdf.format(projectNotice.getTakeEffectTime())).append("到").append(sdf.format(projectNotice.getLostEffectTime())).
                        append(",公告当前状态为:待审核。");
                params.put("notice_detail",projectNotice.getContent());
                break;
            case 2:
                content.append(time).append(" 公告已经通过审核，操作人：").append(operator).
                        append(" 联系电话:").append(phone).append("。审核意见：").append(opinion).append("。");
                break;
            case 3:
                content.append(time).append(" 公告没有通过审核，操作人：").append(operator).
                        append(" 联系电话:").append(phone).append("。公告当前的状态为：已关闭").append("。审核意见：").append(opinion).append("。");
                break;
            case 4:
                content.append(time).append(" 公告被退回，操作人：").append(operator).
                        append(" 联系电话:").append(phone).append("。公告当前的状态为：被退回").append("。审核意见：").append(opinion).append("。");
                break;
            case 5:
                content.append(time).append(" 呼叫中心").append(projectNotice.getPublisher()).append("重新提交了一条").append(projectNotice.getLevelText()).
                        append("公告,有效时间为").append(sdf.format(projectNotice.getTakeEffectTime())).append("到").append(sdf.format(projectNotice.getLostEffectTime())).
                        append(",公告当前状态为:").append(projectNotice.getNoticeStatusText()).append("。");
                params.put("notice_detail",projectNotice.getContent());
                break;
        }
        params.put("content",content.toString());
        bizDao.insert("sql.insert.noticeLog",params);
        return true;
    }

    /**
     * 根据公告ID获取公告日志
     * @param noticeId 公告ID
     * @return 公告日志
     */
    public List<ProjectNoticeLog> queryNoitceLog(String noticeId){
        Map<String,String> params=new HashMap<String, String>();
        params.put("noticeId",noticeId);
        return bizRoDao.queryForList(ProjectNoticeLog.class,"sql.query.noticeLog",params);
    }

}
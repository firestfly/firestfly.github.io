package bingo.vkcrm.service.task.v1.controllers;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import bingo.vkcrm.component.notify.DaoFactory;
import bingo.vkcrm.component.notify.NotifyCenter;
import bingo.vkcrm.service.common.User;
import bingo.vkcrm.service.task.v1.Version;
import bingo.vkcrm.service.task.v1.models.ApproveStatus;
import bingo.vkcrm.service.task.v1.services.ProjectService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import bingo.dao.Page;
import bingo.vkcrm.service.common.ListResult;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.task.v1.models.ProjectNotice;
import bingo.vkcrm.service.task.v1.services.ProjectNoticeService;

@Controller
@RequestMapping(value = Version.API_PATH)
public class ProjectNoticeController extends BaseController {

    private static final Log log = LogFactory.getLog(ProjectNoticeController.class);

    @Autowired
    private ProjectNoticeService service;

    @Autowired
    private ProjectService prjService;

    @Autowired
    DaoFactory notifyDaoFactory;

    private final String NOTIFY_NOTICE_TYPE = "2";

    /**
     * 分页查询公告列表
     *
     * @param curPage      当前页面
     * @param pageSize     页面大小
     * @param startTime    开始时间
     * @param endTime      结束时间
     * @param publisher    发布人
     * @param projectName  项目名称
     * @param noticeStatus 公告状态  0、全部     1、待生效    2、已有效    3、已失效
     * @param content      公告内容
     * @return
     */
    @RequestMapping(value = "/notices", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryNotices(int curPage, int pageSize, String startTime, String endTime,
                                      String publisher, String projectCode,
                                      String projectName, String level, Integer noticeStatus, String content,
                                      Integer approveStatus) {
        Page page = new Page();
        page.setPage(curPage);
        page.setPageSize(pageSize);
        String currentUserId = getCurrentUser().getId();
        List<ProjectNotice> list = service.queryNoticesByPage(currentUserId, page, startTime, endTime,
                publisher, projectCode, projectName, level, noticeStatus, content, approveStatus);
        ListResult<ProjectNotice> listResult = new ListResult<ProjectNotice>(page, list);
        return ServiceResult.succeed(listResult);
    }

    /**
     * 根据公告Id,查询一条记录
     *
     * @param noticeId 公告Id
     * @return
     */
    @RequestMapping(value = "/notice/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getNoticeById(@PathVariable(value = "id") String noticeId) {
        ProjectNotice notice = service.getNoticeById(noticeId);
        return ServiceResult.succeed(notice);
    }

    /**
     * 删除公告信息
     * @param noticeIds 公告ID集合 支持批量删除
     * @return
     */
//	@RequestMapping(value = "/delete", method = RequestMethod.POST)
//	@ResponseBody
//	public ServiceResult deleteProjectNotice(String noticeIds) {
//		try {
//			String user = getCurrentUser().getId();
//		    String userid = getCurrentUser().getName();
//			String[] noticeid = noticeIds.split(",");
//			boolean zt = service.deleteNoticeById(user,userid,noticeid);
//            return ServiceResult.succeed(zt);
//		} catch (Exception ex) {
//			ex.printStackTrace();
//			return ServiceResult.error(ex);
//		}
//	}

    /**
     * 更新公告信息
     *
     * @param notice 公告实体
     * @return
     */
    @RequestMapping(value = "/notice/{id}/update", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult updateNotice(@PathVariable(value = "id") String noticeId, ProjectNotice notice) {
        User loginUser = getCurrentUser();
        ProjectNotice existsNotice = service.getNoticeById(noticeId);

        String operator = getCurrentUser().getName();
        String phone = getCurrentUser().getMobilePhone();
        boolean ts = service.updateProject(operator, phone, notice);
        if (ts && (existsNotice.getApproveStatus() == 4 || existsNotice.getApproveStatus() == 2)) {
            // approveStatus == 4 代表退回; approveStatus == 2 代表已发布;
            // 如果是退回后更新,或编辑已发布的公告,则再次发送通知
            try {
                SimpleDateFormat format = new SimpleDateFormat("HH点mm分");
                String notifyTime = format.format(new Date());
                String projectName = prjService.getNameByCode(notice.getProjectCode());
                String level = notice.getLevelText();

                NotifyCenter notifyCenter = NotifyCenter.getInstance(notifyDaoFactory);
                // XX点XX分，[东莞金域华府]提交了一个的[紧急/普通]公告，请尽快审批
                String notifyContent = notifyTime + "，[" + projectName + "]提交了一个的[" + level + "]公告，请尽快审批";

                notifyCenter.publish(NOTIFY_NOTICE_TYPE, notifyContent, loginUser.getId());
            } catch (Throwable ex) {
                log.error("项目公告" + notice.getId() + "发送通知失败");
                ex.printStackTrace();
            }
        }
        return ServiceResult.succeed(ts);
    }


    /**
     * 关闭公告
     *
     * @param noticeId
     * @return
     */
    @RequestMapping(value = "/notice/{id}/close", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult closeNotice(@PathVariable(value = "id") String noticeId) {
        User loginUser = super.getCurrentUser();
        boolean isSuccess = service.updateClose(noticeId, loginUser.getId());
        return ServiceResult.succeed(isSuccess);
    }

    /**
     * 更改公告状态
     *
     * @param noticeId 公告id
     * @param status   状态
     * @return
     */
//    @RequestMapping(value = "/update/{id}/status", method = RequestMethod.POST)
//    @ResponseBody
//    private ServiceResult updateStatus(@PathVariable(value = "id") String noticeId, String status) {
//        try {
//            boolean ts = service.updateStatus(noticeId, status);
//            return ServiceResult.succeed(ts);
//        } catch (Exception ex) {
//            ex.printStackTrace();
//            return ServiceResult.error(ex);
//        }
//    }

    /**
     * 新增一条公告
     *
     * @param notice
     * @return
     */
    @RequestMapping(value = "/notice/add", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult addNotice(ProjectNotice notice) {
        User loginUser = super.getCurrentUser();
        notice.setPublisherId(loginUser.getId());

        boolean isSuccess = service.addNotice(notice);
        if (isSuccess) {
            try {
                SimpleDateFormat format = new SimpleDateFormat("HH点mm分");
                String notifyTime = format.format(notice.getPublishTime());
                String projectName = prjService.getNameByCode(notice.getProjectCode());
                String level = notice.getLevelText();

                NotifyCenter notifyCenter = NotifyCenter.getInstance(notifyDaoFactory);
                // XX点XX分，[东莞金域华府]提交了一个的[紧急/普通]公告，请尽快审批
                String notifyContent = notifyTime + "，[" + projectName + "]提交了一个的[" + level + "]公告，请尽快审批";

                notifyCenter.publish(NOTIFY_NOTICE_TYPE, notifyContent, notice.getPublisherId());
            } catch (Throwable ex) {
                log.error("项目公告" + notice.getId() + "发送通知失败");
                ex.printStackTrace();
            }
        }

        return ServiceResult.succeed(isSuccess);
    }

    /**
     * 公告审批
     *
     * @param noticeId
     * @param result   审核结果(通过\不通过\退回)
     * @param opinion  审核意见
     * @return
     */
    @RequestMapping(value = "/notice/{id}/approve", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult approveNotice(@PathVariable(value = "id") String noticeId, int result, String opinion) {
        String approverId = getCurrentUser().getId();
        String operator = getCurrentUser().getName();
        String phone = getCurrentUser().getMobilePhone();
        boolean isSuccess = service.saveApprove(noticeId, approverId, result, opinion, operator, phone);
        if (isSuccess) {
            if (result == ApproveStatus.Reject.getCode()) {
                isSuccess = service.updateClose(noticeId, approverId);
            }
        }
        return ServiceResult.succeed(isSuccess);
    }


    /**
     * 公告日志
     *
     * @param noticeId
     * @return
     */
    @RequestMapping(value = "/notice/{noticeId}/log", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult noticeLog(@PathVariable(value = "noticeId") String noticeId) {
        return ServiceResult.succeed(service.queryNoitceLog(noticeId));
    }


}

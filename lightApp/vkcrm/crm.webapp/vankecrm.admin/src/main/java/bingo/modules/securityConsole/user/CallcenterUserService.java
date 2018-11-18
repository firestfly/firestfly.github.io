package bingo.modules.securityConsole.user;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import bingo.modules.securityConsole.common.Constants;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import bingo.common.BaseService;
import bingo.common.ServiceResult;
import bingo.modules.securityConsole.common.DictionaryItem;
import bingo.modules.securityConsole.common.DictionaryService;
import bingo.modules.securityConsole.common.UUIDUtil;
import bingo.modules.securityConsole.log.SecLogService;
import bingo.security.SecurityContext;

@Service
public class CallcenterUserService extends BaseService {

    @Autowired
    private SecLogService secLogService;

    /**
     * 呼叫中心用户不会在客服中心展示
     */
    private static final String CALLCENTER_SEC_USER_TYPE = "callcenter";

    @Autowired
    DictionaryService dictionaryService;


    /**
     * 创建或者修改话务员
     *
     * @param telTelephonist
     * @param actionType
     * @param groups
     * @param password
     * @param telecomnoId
     * @param skillId
     * @return
     */
    public ServiceResult saveOrUpdate(TelTelephonist telTelephonist, String actionType, String groups,
                                      String password, String[] telecomnoId, String[] skillId) {

        //校验前台传过来的数据是否正确
        //话务员名称、编码，联系电话、职务、分组都是必填的
        if (StringUtils.isEmpty(telTelephonist.getLoginId())
                || StringUtils.isEmpty(telTelephonist.getName())
                || StringUtils.isEmpty(telTelephonist.getMobileNumber())
                || StringUtils.isEmpty(telTelephonist.getDutyId())
                || StringUtils.isEmpty(groups)) {
            return ServiceResult.error("保存话务员信息失败：话务员名称、编码，联系电话、职务、分组都是必填的.");
        }

        for (int i = 0; i < telecomnoId.length; i++) {
            if (StringUtils.isEmpty(telecomnoId[i]) || StringUtils.isEmpty(skillId[i])) {
                return ServiceResult.error("保存话务员信息失败：“电信工号”、“技能名称”必须填写。");
            }
        }

        // 校验电信工号是否数字
        for (int i = 0; i < telecomnoId.length; i++) {
            telecomnoId[i] = telecomnoId[i].trim();
            if (!StringUtils.isNumeric(telecomnoId[i])) {
                return ServiceResult.error("保存话务员信息失败：电信工号必须是数字。");
            }
        }

        // 校验电信工号是否有重复
        List<String> check = new ArrayList<String>();
        for (int i = 0; i < telecomnoId.length; i++) {
            if (check.contains(telecomnoId[i])) {
                return ServiceResult.error("保存话务员信息失败：电信工号不能重复（" + telecomnoId[i] + "）。");
            }
            check.add(telecomnoId[i]);
        }

        // 校验用户手机号码不能重复
        Map<String, String> queryForm = new HashMap<String, String>();
        queryForm.put("id", telTelephonist.getId());
        queryForm.put("mobilePhone", telTelephonist.getMobileNumber());
        if (rnDao.exists("user.isMobilePhoneExist", queryForm)) {
            return ServiceResult.error("手机号码已存在，不能重复！");
        }

        // 校验电信工号跟数据库已有的工号是否重复
        String telecomnoIdJoin = StringUtils.join(telecomnoId, ",");
        Map<String, Object> queryParam = new HashMap<String, Object>();
        queryParam.put("telephonistId", telTelephonist.getId());
        queryParam.put("numbers", "'" + telecomnoIdJoin.replace(",", "','") + "'");
        List<TelTelecomno> doubleTelTelecomno = callCenterRnDao.queryForList(TelTelecomno.class, "callcenter.selectDoubleTelecomno", queryParam);
        if (null != doubleTelTelecomno && doubleTelTelecomno.size() > 0) {
            List<String> telTelecomnos = new ArrayList<String>();
            for (TelTelecomno telTelecomno : doubleTelTelecomno) {
                telTelecomnos.add(telTelecomno.getNumber());
            }
            return ServiceResult.error("保存话务员信息失败：电信工号已分配给其它话务员，不能重复分配（" + StringUtils.join(telTelecomnos, ",") + "）。");
        }

        // 前台传职务到后台是ID加名称，需要在此处做拆分(ID:名称)
        String[] dutyTemp = telTelephonist.getDutyId().split(":");
        telTelephonist.setDutyId(dutyTemp[0]);
        telTelephonist.setDutyText(dutyTemp[1]);


        // 验证编码唯一性：需要校验呼叫中心话务员编码，安全用户ID和登录账号，预防账号重复
        boolean isSecUserExists = rnDao.exists("callcenter.isSecUserExists", telTelephonist);
        if (isSecUserExists) {
            return ServiceResult.error("保存话务员信息失败：话务员编码已存在，请使用其它编码。");
        }


        /** 新增话务员
         * 新增话务员需要验证编码唯一性
         * 新增SEC_USER，便于系统登录，设置密码，授权等信息处理
         */
        if (StringUtils.isEmpty(telTelephonist.getId())) {

            // 新增用户时密码是必填的
            if (StringUtils.isEmpty(password)) {
                return ServiceResult.error("保存话务员信息失败：新增话务员必须填写密码。");
            }

            String newUserId = UUIDUtil.create();

            // 设置sys用户，用户ID登录账号和话务员一致
            SecUser secUser = new SecUser();
            secUser.setId(newUserId);
            secUser.setLoginId(telTelephonist.getLoginId());
            secUser.setName(telTelephonist.getName());
            secUser.setMobilePhone(telTelephonist.getMobileNumber());
            secUser.setPassword(SecurityContext.getProvider().encryptPassword(password));
            secUser.setCreatedBy(SecurityContext.getCurrentUser().getId());
            secUser.setCreatedDate(new Date());
            secUser.setType(CALLCENTER_SEC_USER_TYPE);
            secUser.setStatus(Constants.USER_STATUS_ENABLED);

            //之前是写死了品高软件开发的组织编码,现在更改为写死呼叫中心的组织的编码,区别在于,这次是经过客户和项目经理确认的.
            secUser.setOrgId("BFAB3E63-6A5D-46EE-B284-AE77CAE2074A");

            dao.insert(secUser);
            telTelephonist.setId(newUserId);
            secLogService.logOperation("新增话务员", "新增安全框架用户" + telTelephonist.toString() + "成功!");
            callCenterDao.insert(telTelephonist);
            secLogService.logOperation("新增话务员", "新增话务员" + telTelephonist.toString() + "成功!");
        } else {

            // 修改话务员信息，可修改字段有：话务员名称，联系电话，职务，所属分组
            Map<String, Object> telTelephonistUpdateMap = new HashMap<String, Object>();
            telTelephonistUpdateMap.put("id", telTelephonist.getId());//话务员主键
            telTelephonistUpdateMap.put("name", telTelephonist.getName());//修改话务员名称
            telTelephonistUpdateMap.put("dutyId", telTelephonist.getDutyId());//修改话务员职务ID
            telTelephonistUpdateMap.put("dutyText", telTelephonist.getDutyText());//修改话务员职位名称
            telTelephonistUpdateMap.put("mobileNumber", telTelephonist.getMobileNumber());//修改话务员联系电话
            callCenterDao.getJdbcDao().updateByMap("tel_Telephonist", "id", telTelephonistUpdateMap, false);
            secLogService.logOperation("修改话务员", "修改话务员" + telTelephonist.toString() + "成功!");

            // 修改统一信息用户信息，修改字段包括：用户名称，手机号码，最后修改人，修改人名称，修改时间
            Map<String, Object> secuserUpdateMap = new HashMap<String, Object>();
            secuserUpdateMap.put("id", telTelephonist.getId());//话务员主键
            secuserUpdateMap.put("login_Id", telTelephonist.getLoginId());//话务员名称
            secuserUpdateMap.put("name", telTelephonist.getName());//话务员名称
            secuserUpdateMap.put("mobile_Phone", telTelephonist.getMobileNumber());//话务员联系电话
            secuserUpdateMap.put("last_Updated_By", SecurityContext.getCurrentUser().getId());//更新修改人
            secuserUpdateMap.put("last_Updated_Date", new Date());//更新修改时间
            dao.getJdbcDao().updateByMap("sec_user", "id", secuserUpdateMap, false);
            secLogService.logOperation("修改话务员", "修改安全框架用户" + telTelephonist.toString() + "成功!");
        }

        // 修改话务员分组：新增修改话务员后统一设置分组。
        // 1.查出话务员已有分钟。
        // 2.检查已有分组是否在此次选择中，无需要删除
        // 3.检查此次选择的分组是否在原有的分组中，无则新增

        // 已选分组去重
        List<String> groupArr = new ArrayList<String>();
        for (String group : groups.split(",")) {
            if (!groupArr.contains(group) && StringUtils.isNotEmpty(group)) {
                groupArr.add(group);
            }
        }

        // 查出话务员已有分组
        List<TelTelephonistGroup> oldGroupList = callCenterRnDao.getJdbcDao().queryForList(TelTelephonistGroup.class, "callcenter.getGroups", telTelephonist.getId());

        // 删除话务员分组
        for (TelTelephonistGroup group : oldGroupList) {
            group.setIsdeleted("1");
        }
        for (TelTelephonistGroup group : oldGroupList) {
            for (String newGroup : groupArr) {
                if (group.getGroupId().equals(newGroup)) {
                    group.setIsdeleted("0");
                    break;
                }
            }
        }
        List<TelTelephonistGroup> deleteGroupList = new ArrayList<TelTelephonistGroup>();
        for (TelTelephonistGroup group : oldGroupList) {
            if (group.getIsdeleted().equals("1")) {
                group.setDeleter(SecurityContext.getCurrentUser().getName());
                group.setDeleterId(SecurityContext.getCurrentUser().getId());
                group.setDeleteTime(new Date());
                deleteGroupList.add(group);
                secLogService.logOperation("删除话务员分组", "删除话务员分组" + group + "成功!");
            }
        }
        if (deleteGroupList.size() > 0) {
            callCenterDao.batchUpdate(TelTelephonistGroup.class, deleteGroupList);
        }

        // 新增话务员分组
        List<TelTelephonistGroup> newGroupList = new ArrayList<TelTelephonistGroup>();
        for (String newGroup : groupArr) {
            boolean isGroupInOldGroups = false;
            for (TelTelephonistGroup group : oldGroupList) {
                if (group.getGroupId().equals(newGroup)) {
                    isGroupInOldGroups = true;
                    break;
                }
            }
            if (!isGroupInOldGroups) {
                TelTelephonistGroup telTelephonistGroup = new TelTelephonistGroup();
                //telTelephonistGroup.setId(Dao.getUUID());
                telTelephonistGroup.setTelephonistId(telTelephonist.getId());
                telTelephonistGroup.setGroupId(newGroup);
                telTelephonistGroup.setCreatorId(SecurityContext.getCurrentUser().getId());
                telTelephonistGroup.setCreator(SecurityContext.getCurrentUser().getName());
                telTelephonistGroup.setCreateTime(new Date());
                telTelephonistGroup.setIsdeleted("0");
                newGroupList.add(telTelephonistGroup);
                secLogService.logOperation("新增话务员分组", "新增话务员分组" + telTelephonistGroup + "成功!");
            }
        }
        if (newGroupList.size() > 0) {
            callCenterDao.batchInsert(TelTelephonistGroup.class, newGroupList);
        }

        // 设置话务员电信工号，多个工号用逗号分隔
        // 先清除用户电信工号再插入新电信工号
        callCenterDao.getJdbcDao().delete("callcenter.deleteTelTelecomno", telTelephonist.getId());
        secLogService.logOperation("删除话务员电信工号", "删除话务员电信工号（全部）成功!");
        List<TelTelecomno> telTelecomnoList = new ArrayList<TelTelecomno>();

        for (int i = 0; i < telecomnoId.length; i++) {
            TelTelecomno telTelecomno = new TelTelecomno();
            telTelecomno.setNumber(telecomnoId[i]);
            telTelecomno.setSkillid(skillId[i]);
            telTelecomno.setTelephonistid(telTelephonist.getId());
            telTelecomnoList.add(telTelecomno);
            secLogService.logOperation("新增话务员电信工号", "新增话务员电信工号" + telTelecomno + "成功!");
        }

        if (telTelecomnoList.size() > 0) {
            callCenterDao.batchInsert(TelTelecomno.class, telTelecomnoList);
        }

        return ServiceResult.succeed("保存话务员信息成功。");
    }

    // 根据UserId获取用户信息
    public Map<String, Object> getUserInfoById(String userId) {
        Map<String, String> queryMap = new HashMap<String, String>();
        queryMap.put("ACCOUNT", userId);
        return callCenterRnDao.queryForMap("callcenter.user.user_list", queryMap);
    }

    /**
     * 批量删除话务员
     * 1.删除话务员分组对应关系
     * 2.删除话务员电信工号
     * 3.删除话务员基本信息
     * 4.将安全框架用户标志为不可用
     *
     * @param userIds 用户Id集合
     */
    public ServiceResult deleteUsers(String[] userIds) {
        for (String userId : userIds) {
            List<TelTelephonistGroup> oldGroupList = callCenterRnDao.getJdbcDao().queryForList(TelTelephonistGroup.class, "callcenter.getGroups", userId);
            for (TelTelephonistGroup group : oldGroupList) {
                group.setIsdeleted("1");
                group.setDeleter(SecurityContext.getCurrentUser().getName());
                group.setDeleterId(SecurityContext.getCurrentUser().getId());
                group.setDeleteTime(new Date());
            }
            callCenterDao.batchUpdate(TelTelephonistGroup.class, oldGroupList);//删除分组
            callCenterDao.getJdbcDao().delete("callcenter.deleteTelTelecomno", userId);//删除电信工号
            callCenterDao.getJdbcDao().delete("callcenter.deleteTelTelephonist", userId);//删除话务员

            // 设置安全框架用户为不可用
            Map<String, Object> secuserUpdateMap = new HashMap<String, Object>();
            secuserUpdateMap.put("id", userId);//话务员主键
            secuserUpdateMap.put("status", "disabled");
            dao.getJdbcDao().updateByMap("sec_user", "id", secuserUpdateMap, false);
            secLogService.logOperation("删除话务员", "删除话务员（编号=" + userId + ")成功!");
        }

        return ServiceResult.succeed("删除用户成功");
    }

    /**
     * 获取职务，技能列表，话务员技能
     *
     * @param userId
     * @return
     */
    public ServiceResult getTelecomno(String userId) {

        TelecomnoReturnObject telecomnoReturnObject = new TelecomnoReturnObject();
        telecomnoReturnObject.setTelephonistDuty(dictionaryService.queryCallcenterItems("TelephonistDuty"));

        List<Map<String, Object>> skillList = callCenterRnDao.getJdbcDao().queryForListMap("callcenter.selectSkill");
        telecomnoReturnObject.setSkillList(skillList);

        List<Map<String, Object>> userSkillList = callCenterRnDao.getJdbcDao().queryForListMap("callcenter.selectTelecomno", userId);
        telecomnoReturnObject.setUserSkillList(userSkillList);

        telecomnoReturnObject.setSecUser(rnDao.select(SecUser.class, userId));

        return ServiceResult.succeed(telecomnoReturnObject);
    }

    public class TelecomnoReturnObject {

        /**
         * 职务数据列表
         */
        List<DictionaryItem> telephonistDuty;
        /**
         * 技能列表
         **/
        List<Map<String, Object>> skillList;
        /**
         * 用户技能列表
         */
        List<Map<String, Object>> userSkillList;
        /**
         * 安全管理人员信息
         */
        SecUser secUser;


        /**
         * @return the telephonistDuty
         */
        public List<DictionaryItem> getTelephonistDuty() {
            return telephonistDuty;
        }

        /**
         * @param telephonistDuty the telephonistDuty to set
         */
        public void setTelephonistDuty(List<DictionaryItem> telephonistDuty) {
            this.telephonistDuty = telephonistDuty;
        }

        /**
         * @return the skillList
         */
        public List<Map<String, Object>> getSkillList() {
            return skillList;
        }

        /**
         * @param skillList the skillList to set
         */
        public void setSkillList(List<Map<String, Object>> skillList) {
            this.skillList = skillList;
        }

        /**
         * @return the userSkillList
         */
        public List<Map<String, Object>> getUserSkillList() {
            return userSkillList;
        }

        /**
         * @param userSkillList the userSkillList to set
         */
        public void setUserSkillList(List<Map<String, Object>> userSkillList) {
            this.userSkillList = userSkillList;
        }

        /**
         * @return the secUser
         */
        public SecUser getSecUser() {
            return secUser;
        }

        /**
         * @param secUser the secUser to set
         */
        public void setSecUser(SecUser secUser) {
            this.secUser = secUser;
        }


    }
}

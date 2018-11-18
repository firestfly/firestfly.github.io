package bingo.modules.securityConsole.telcallreason;

import java.util.Date;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import bingo.common.BaseService;
import bingo.common.ServiceResult;
import bingo.security.SecurityContext;

/**
 * 采集原因配置
 * @author chengsiyuan
 *
 */
@Service
public class TelCallReasonService extends BaseService{

	/**
	 * 获取通话原因明细
	 * @return
	 */
	public TelCallReason getTelCallReson(String id){
		return callCenterRnDao.select(TelCallReason.class,id);
	}
	
	/**
	 * 更新通话原因
	 * @param telcallreason
	 */
	public ServiceResult saveOrUpdate(TelCallReason telcallreason){
		
		// 校验通话记录原因名称唯一
		if(callCenterDao.exists("callcenter.telcallreason.exists", telcallreason)){
			return ServiceResult.error("通话原因已存在，不能重复添加！");
		}
		// 设置通话类型名称
		if(telcallreason.getType() ==  ReasonType.呼入.code){
			telcallreason.setTypeText(ReasonType.呼入.name);
		}
		if(telcallreason.getType() ==  ReasonType.呼出.code){
			telcallreason.setTypeText(ReasonType.呼出.name);
		}
		
		// 新增通话记录原因
		if(StringUtils.isEmpty(telcallreason.getId())){
			telcallreason.setEnabled(true);
			telcallreason.setCreateTime(new Date());
			telcallreason.setCreator(SecurityContext.getCurrentUser().getName());
			telcallreason.setCreatorId(SecurityContext.getCurrentUser().getId());
			callCenterDao.insert(telcallreason);
			return ServiceResult.succeed("新增通话原因成功！");
		// 修改通话记录原因
		}else{		
			telcallreason.setEnabled(true);
			callCenterDao.updateFields(telcallreason,"type","typeText","content","sortNo","isEnabled");
			return ServiceResult.succeed("修改通话原因成功！");
		}
	}
	/**
	 * 删除通话原因
	 */
	public ServiceResult deleteCallReason(String id){
		TelCallReason telcallreason = new TelCallReason();
		telcallreason.setId(id);
		telcallreason.setEnabled(false);
		callCenterDao.updateFields(telcallreason,"isEnabled");
		return ServiceResult.succeed("删除通话原因成功！");
	}	

    /**
     * <code>{@link ReasonType}</code>
     * 通话原因定义枚举类
     * @author 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
     */
    public enum ReasonType {
    	//枚举定义
        呼入("呼入",1),
        呼出("呼出",2);
        
        // 成员变量
        public int code;//类型编码
        public String name;//类型名称

        // 构造方法
        private ReasonType(String name, int code) {
            this.name = name;
            this.code = code;
        }
    }
	
}

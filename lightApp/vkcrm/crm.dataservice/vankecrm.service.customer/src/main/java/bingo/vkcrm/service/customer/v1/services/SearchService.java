package bingo.vkcrm.service.customer.v1.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import bingo.vkcrm.service.customer.v1.CustomerCommonService;
import bingo.vkcrm.service.customer.v1.models.SearchResultItem;
import bingo.vkcrm.service.service.BaseService;

/**
 * 
 * <code>{@link SearchService}</code>
 * 首页搜索服务类
 *
 * @author 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
 */
@Service
public class SearchService extends CustomerCommonService {
	
    /**
     * 根据字段查询客户信息
     * @param column main_customer 表的字段
     * @return list<SearchResultItem> 搜索结果集合
     */
    public List<SearchResultItem> search(String code,String value,String userId) {
    	CostomerSearchType costomerSearchType = CostomerSearchType.getCostomerSearchType(code);    	
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("column", costomerSearchType.column);
        parameters.put("value", value);
        parameters.put("userId",userId);
        List<SearchResultItem> searchResultItems = centerRoDao.queryForList(SearchResultItem.class,costomerSearchType.sqlId, parameters);
        for(SearchResultItem item : searchResultItems){
        	item.setType("customer");//设置数据类型，前台好辨认
        }
        
        return searchResultItems;
    }
    
    
    /**
     * <code>{@link CostomerSearchType}</code>
     * 查询类型定义枚举类
     * @author 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
     */
    public enum CostomerSearchType {
    	//枚举定义
        客户名称("客户名称","customerName","fullName","sql.query.customer.index.search.fuzzy"),
        主要手机号码("主要手机号码","customerNumberMain","mainMobile","sql.query.customer.index.search.precise"),
        备用手机号码("备用手机号码","customerNumberStandby","standbyMobile","sql.query.customer.index.search.precise"),
        家庭电话("家庭电话","customerNumberHomeTel","homeTel","sql.query.customer.index.search.precise"),
        办公电话("办公电话","customerNumberOfficeTel","officeTel","sql.query.customer.index.search.precise"),
        证件号码("证件号码","customerCertificateId","certificateId","sql.query.customer.index.search.precise");
        
        // 成员变量
        public String code;//类型编码
        public String name;//类型名称
        public String column;//数据库字段
        public String sqlId;//查询sqlId

        // 构造方法
        private CostomerSearchType(String name, String code,String column,String sqlId) {
            this.name = name;
            this.code = code;
            this.column = column;
            this.sqlId = sqlId;
        }
        
        /**
         * 通过code获取枚举
         * @param code
         * @return
         */
        public static CostomerSearchType getCostomerSearchType(String code){
        	for(CostomerSearchType item : CostomerSearchType.values()){
        		if(item.code.equals(code)){
        			return item;
        		}
        	}
        	return null;
        }
    }
    
    

}

package bingo.vkcrm.common.enums;

/**
 * 缓存的Key前缀
 * Created by Wangzr on 15/12/29.
 */
public enum CachePrefix {

    /**
     * 根据客户来电号码缓存客户Id集合
     */
    Tel("Tel"),
    /**
     * 根据临时客户来电号码缓存客户Id集合
     */
    TMP_TEL("Tmp_Tel"),
    /**
     * 根据客户Id缓存客户信息
     */
    Cust("CustId"),
    /**
     * 根据临时客户Id缓存临时客户信息
     */
    TMP_CUST("Tmp_CustId"),
    /**
     * 根据项目编码缓存项目名称
     */
    PrjCode("PrjCode"),
    /**
     * 根据项目id缓存项目信息
     */
    PrjId("PrjId"),
    /**
     * 根据号码前缀缓存归属地
     */
    Location("Location"),
    /**
     * 根据房屋编码缓存房屋信息
     */
    HouseCode("HouseCode"),
    /**
     * 根据房屋Id缓存房屋信息
     */
    HouseId("HouseId"),
    /**
     * 根据业务类型编号缓存业务类型名称
     */
    BizType("BizType"),
    /**
     * 根据任务返回的用户编码缓存用户名
     */
    TaskUser("TaskUser"),
    /**
     * 根据UserId缓存用户名
     */
    UserId("UserId"),
    /**
     * 房屋布局编码
     */
    Layout("Layout");

    private String prefix;
    private CachePrefix(String prefix)
    {
        this.prefix = prefix;
    }
    public String getVal(){
        return this.prefix;
    }
}

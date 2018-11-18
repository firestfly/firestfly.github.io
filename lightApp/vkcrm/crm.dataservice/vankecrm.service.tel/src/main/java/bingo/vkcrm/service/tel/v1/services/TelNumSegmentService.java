package bingo.vkcrm.service.tel.v1.services;

import java.util.HashMap;
import java.util.Map;

import bingo.vkcrm.common.enums.CachePrefix;
import bingo.vkcrm.common.utils.CacheUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import bingo.vkcrm.service.service.BaseService;
import bingo.vkcrm.service.tel.v1.models.NumberAttribution;

@Service
public class TelNumSegmentService extends BaseService {

    private final String LOCAL_AREA = "深圳";

    /**
     * 归属地查询
     *
     * @param phoneNumber
     * @return
     */
    public NumberAttribution getAttribution(String phoneNumber) {
        NumberAttribution attribution = new NumberAttribution();
        String numberPrefix = null;
        //电话号码开头为0为电话号码、1为手机号码
        if (phoneNumber.charAt(0) == '0' && phoneNumber.length() >= 3) {
            numberPrefix = phoneNumber.substring(0, 3);
            attribution = this.get(numberPrefix);
            // 若根据前三位查不到归属地，则根据四位
            if (attribution == null && phoneNumber.length() >= 4) {
                numberPrefix = phoneNumber.substring(0, 4);
                attribution = this.get(numberPrefix);
            }
        } else if (phoneNumber.substring(0, 1).equals("1") && phoneNumber.length() == 11) {
            //根据前七位
            numberPrefix = phoneNumber.substring(0, 7);
            attribution = this.get(numberPrefix);
        }
        return attribution;
    }

    /**
     * 电话号码处理
     *
     * @param phoneNumber
     * @return
     *
     * @rule
     * 1、号码位数为 5 位，或者第一位是 9 开头的号码，直接返回号码
     * 2、以 0 开头，返回号码为：9 + 号码
     * 3、以 1 开头，且不为 5 位数，判断归属地，如果是外地(非深圳市)，返回号码为 90+ 号码； 如果是本地(深圳市)，返回号码为 9+ 号码
     * 4、其他情况返回号码都是 9+ 号码
     */
    public String handleNumber(String phoneNumber) {
        if(StringUtils.isEmpty(phoneNumber)){
            return "";
        }
        else if (phoneNumber.length() == 5 || phoneNumber.startsWith("9")) {
            // 号码位数为 5 位，或者第一位是 9 开头的号码，直接返回号码
            return phoneNumber;
        } else if (phoneNumber.startsWith("0")) {
            // 以 0 开头，返回号码为：9 + 号码
            return "9" + phoneNumber;
        } else if (phoneNumber.startsWith("1") && phoneNumber.length() != 5) {
            // 以 1 开头，且不为 5 位数，判断归属地，如果是外地(非深圳)，返回号码为 90 + 号码； 如果是本地(深圳)，返回号码为 9 + 号码
            // 获取归属地
            NumberAttribution attribution = getAttribution(phoneNumber);
            if(attribution==null||attribution.getMobileArea()==null){
                return "9" + phoneNumber;
            }
            if (attribution.getMobileArea().indexOf(LOCAL_AREA) > 0) {
                return "9" + phoneNumber;
            } else {
                return "90" + phoneNumber;
            }
        } else {
            // 其他情况返回号码都是 9 + 号码
            return "9" + phoneNumber;
        }
    }

    /**
     * 根据号码前缀获取来电归属地
     *
     * @param numberPrefix 来电号码前缀
     * @return
     */
    private NumberAttribution get(String numberPrefix) {
        return CacheUtil.get(NumberAttribution.class, CachePrefix.Location, numberPrefix);
    }

    /**
     * 根据号码前几位查询归属地
     * 从Redis中读取数据,修改为使用get方法
     *
     * @return
     */
    @Deprecated
    public NumberAttribution getFromDb(String areaCode, String mobileNumber) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        NumberAttribution numbers = new NumberAttribution();
        if (StringUtils.isNotEmpty(areaCode)) {
            parameters.put("AreaCode", areaCode);
        }
        if (StringUtils.isNotEmpty(mobileNumber)) {
            parameters.put("MobileNumber", mobileNumber);
        }
        numbers = bizRoDao.queryForObject(NumberAttribution.class, "phonenumber-segment-Attribution", parameters);
        return numbers;
    }
}

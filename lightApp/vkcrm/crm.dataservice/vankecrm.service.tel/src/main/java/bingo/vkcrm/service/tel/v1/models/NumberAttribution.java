package bingo.vkcrm.service.tel.v1.models;

/**
 * 来电号码归属地
 */
public class NumberAttribution {
    /**
     * 号码段
     */
    private String MobileNumber;
    /**
     * 归属地
     */
    private String MobileArea;
    /**
     * 手机卡类型
     */
    private String MobileType;

    public String getMobileNumber() {
        return MobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        MobileNumber = mobileNumber;
    }

    public String getMobileArea() {
        return MobileArea;
    }

    public void setMobileArea(String mobileArea) {
        MobileArea = mobileArea;
    }

}

package bingo.vkcrm.service.customer.v1.models;

/**
 * Created by Wangzr on 15/11/22.
 */
public enum CertificateType {
    身份证(1);


    private Integer code;
    private CertificateType(int code){
        this.code = code;
    }

    public int getCode(){
        return this.code;
    }
}

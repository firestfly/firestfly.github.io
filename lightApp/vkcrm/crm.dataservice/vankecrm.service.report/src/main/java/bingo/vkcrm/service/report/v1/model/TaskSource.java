package bingo.vkcrm.service.report.v1.model;

/**
 * Created by szsonic on 2016/1/23/023.
 */
public enum TaskSource {
    /**
     * 乐帮
     */
    乐帮("lebang"),
    /**
     * 助这儿
     */
    助这儿("zhuzher"),
    /**
     * FM
     */
    FM("fm"),
    /**
     * CRM
     */
    CRM("crm");

    private final String code;

    private TaskSource(String mCode) {
        this.code = mCode;
    }

    public String getCode() {
        return code;
    }
}

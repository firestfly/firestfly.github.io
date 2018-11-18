package bingo.vkcrm.service.enums;

/**
 * Created by Wangzr on 15/12/23.
 */
public enum DictionaryCodes {

    NoticeStatus("NoticeStatus"),
    CustomerIdentity("CustomerIdentity"),
    CallType("CallType"),
    AnswerAbnormalCode("AnswerAbnormalCode"),
    CustomerType("CustomerType"),
    CustomerCertificateType("CustomerCertificateType"),
    HouseCustomerRelationType("HouseCustomerRelationType"),
    OrgLevelType("OrgLevelType"),
    ProcessingWay("ProcessingWay"),
    CustomerSex("CustomerSex"),
    TaskLevelType("TaskLevelType"),
    from("from"),
    TopicsOptionMode("TopicsOptionMode"),
    CustomerRelationType("CustomerRelationType"),
    TelephonistDuty("TelephonistDuty"),
    Broadband("Broadband"),
    EquityType("EquityType"),
    TaskSource("TaskSource"),
    OptionCategory("OptionCategory"),
    DocType("DocType"),
    TelSource("TelSource"),
    operator("operator"),
    CustomerBlood("CustomerBlood"),
    OptionProcessMode("OptionProcessMode"),
    CustomerOccupation("CustomerOccupation"),
    TelStatus("TelStatus"),
    CarBrand("CarBrand"),
    CarColor("CarColor"),
    CarStatus("CarStatus"),
    Sex("Sex"),
    HouseStatus("HouseStatus"),
    approveStatus("approveStatus"),
    Duty("Duty"),
    AnomalousTagCategory("AnomalousTagCategory"),
    PetBreed("PetBreed"),
    PetSex("PetSex"),
    CustomerTags("CustomerTags"),
    PetStatus("PetStatus"),
    AppTaskStatus("AppTaskStatus"),
    CustomerHobbies("CustomerHobbies"),
    QuestionnaireStatus("QuestionnaireStatus"),
    ProjectNoticeLevel("ProjectNoticeLevel"),
    CustomerAffilication("CustomerAffilication"),
    AnomalousErrorCategory("AnomalousErrorCategory"),
    FinishType("FinishType"),
    ParkingType("ParkingType"),
    HouseEquityType("HouseEquityType"),
    projectsource("projectsource"),
    TaskStatus("TaskStatus"),
    CarportStatus("CarportStatus"),
    CarportCustomerRelation("CarportCustomerRelation");

    private final String val;

    private DictionaryCodes(String value) {
        val = value;
    }

    public String getCode() {
        return val;
    }
}

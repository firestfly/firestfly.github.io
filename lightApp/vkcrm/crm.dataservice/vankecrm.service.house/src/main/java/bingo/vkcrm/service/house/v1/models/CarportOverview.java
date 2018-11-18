package bingo.vkcrm.service.house.v1.models;

/**
 * 车位概览
 * @author chengsiyuan
 */
public class CarportOverview {
    /**
     * 车位id
     */
    public String id;
    /**
     * 车位名称
     */
	public String name;
    /**
     * 车主
     */
	public String owner;
    /**
     * 车主联系电话
     */
    public String mobilePhone;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getMobilePhone() {
        return mobilePhone;
    }

    public void setMobilePhone(String mobilePhone) {
        this.mobilePhone = mobilePhone;
    }
}

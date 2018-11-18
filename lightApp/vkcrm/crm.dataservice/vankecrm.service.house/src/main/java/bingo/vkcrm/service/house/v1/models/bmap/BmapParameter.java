package bingo.vkcrm.service.house.v1.models.bmap;

import java.util.List;

/**
 * Created by szsonic on 2016/3/18/018.
 */
public class BmapParameter {
    private String propsize;
    private List<RequestHouse> props;
    private String source;
    private String account;
    public String getPropsize() {
        return propsize;
    }

    public void setPropsize(String propsize) {
        this.propsize = propsize;
    }

    public List<RequestHouse> getProps() {
        return props;
    }

    public void setProps(List<RequestHouse> props) {
        this.props = props;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }
}

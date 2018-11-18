package bingo.vkcrm.service.house.v1.models.bmap;

import java.util.List;

/**
 * Created by szsonic on 2016/3/21/021.
 */
public class BmapResponseResult {
    private String page;
    private String pagecount;
    private String timestamp;
    private List<BmapResponseProps> props;

    public String getPage() {
        return page;
    }

    public void setPage(String page) {
        this.page = page;
    }

    public String getPagecount() {
        return pagecount;
    }

    public void setPagecount(String pagecount) {
        this.pagecount = pagecount;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public List<BmapResponseProps> getProps() {
        return props;
    }

    public void setProps(List<BmapResponseProps> props) {
        this.props = props;
    }
}

package bingo.vkcrm.component.notify;

import bingo.dao.IDao;

/**
 * Created by Wangzr on 16/1/20.
 */
public class DaoFactory {

    IDao bizDao;

    IDao orgDao;

    public IDao getBizDao() {
        return bizDao;
    }

    public void setBizDao(IDao bizDao) {
        this.bizDao = bizDao;
    }

    public IDao getOrgDao() {
        return orgDao;
    }

    public void setOrgDao(IDao orgDao) {
        this.orgDao = orgDao;
    }
}

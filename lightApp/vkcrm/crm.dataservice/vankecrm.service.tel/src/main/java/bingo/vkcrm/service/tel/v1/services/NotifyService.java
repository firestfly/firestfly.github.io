package bingo.vkcrm.service.tel.v1.services;

import bingo.vkcrm.component.notify.DaoFactory;
import bingo.vkcrm.service.service.BaseService;
import org.springframework.stereotype.Service;

/**
 * Created by Wangzr on 16/1/20.
 */
@Service
public class NotifyService extends BaseService {

    public DaoFactory getFactory(){
        DaoFactory factory = new DaoFactory();
        factory.setBizDao(this.bizRoDao);
        factory.setOrgDao(this.sysRoDao);
        return factory;
    }
}

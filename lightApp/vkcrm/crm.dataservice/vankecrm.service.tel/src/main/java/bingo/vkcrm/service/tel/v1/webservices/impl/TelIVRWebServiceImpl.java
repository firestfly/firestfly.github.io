package bingo.vkcrm.service.tel.v1.webservices.impl;

import bingo.dao.IDao;
import bingo.vkcrm.service.service.BaseService;
import bingo.vkcrm.service.tel.v1.models.IVR;
import bingo.vkcrm.service.tel.v1.webservices.TelIVRWebService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.remoting.jaxrpc.ServletEndpointSupport;

import javax.jws.WebService;
import javax.xml.rpc.ServiceException;
import java.text.SimpleDateFormat;

@WebService
public class TelIVRWebServiceImpl extends ServletEndpointSupport implements TelIVRWebService {
    private static final Log log = LogFactory.getLog(TelIVRWebServiceImpl.class);

    @Autowired
    public IDao bizDao;

    @Override
    protected void onInit() throws ServiceException {
        super.onInit();
    }

    /**
     * 接收IVR数据
     *
     * @param callId     录音ID
     * @param otherDN    客户号码
     * @param methodName 方法名称
     * @param ivrLevel   IVR级别
     * @param ivrDate    IVR时间
     */
    public void receiveIVR(String callId, String otherDN, String methodName, String ivrLevel, String ivrDate) throws Exception {

        log.debug("接受IVR数据:" + "callId：" + callId + "otherDN：" + otherDN + "methodName：" + methodName + "ivrLevel：" + ivrLevel + "ivrDate：" + ivrDate);

        if ("ivr".equalsIgnoreCase(methodName)) {
            IVR iVR = new IVR();
            iVR.setCallId(callId);
            iVR.setOtherDN(otherDN);
            iVR.setMethodName(methodName);
            iVR.setIvrLevel(ivrLevel);
            iVR.setIvrDate(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(ivrDate));
            bizDao.insert(IVR.class, iVR);
        }

    }
}

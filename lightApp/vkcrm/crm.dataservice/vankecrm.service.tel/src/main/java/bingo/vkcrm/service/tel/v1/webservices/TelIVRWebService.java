package bingo.vkcrm.service.tel.v1.webservices;

import javax.jws.WebParam;
import javax.jws.WebService;
import java.rmi.Remote;

@WebService
public interface TelIVRWebService extends Remote {
    void receiveIVR(@WebParam(name = "callId") String callId, @WebParam(name = "otherDN") String otherDN, @WebParam(name = "methodName") String methodName, @WebParam(name = "ivrLevel") String ivrLevel, @WebParam(name = "ivrDate") String ivrDate) throws Exception;
}

package bingo.vkcrm.service.tel.v1.webservices;

import javax.jws.WebParam;
import javax.jws.WebService;
import java.util.Date;

@WebService
public interface TelCallWebService {

    void receive(@WebParam(name = "exec") String exec, @WebParam(name = "methodName") String methodName, @WebParam(name = "callBack") String callBack, @WebParam(name = "execType") String execType, @WebParam(name = "methodType") String methodType, @WebParam(name = "agentID") String agentID, @WebParam(name = "agentStation") String agentStation, @WebParam(name = "agentType") String agentType, @WebParam(name = "iPAddress") String iPAddress, @WebParam(name = "status") String status, @WebParam(name = "callID") String callID, @WebParam(name = "otherDN") String otherDN, @WebParam(name = "callInType") String callInType, @WebParam(name = "stateTime") String stateTime, @WebParam(name = "telephonistId") String telephonistId) throws Exception;

    void receiveAgentStatus(@WebParam(name = "exec") String exec, @WebParam(name = "methodName") String methodName, @WebParam(name = "callBack") String callBack, @WebParam(name = "execType") String execType, @WebParam(name = "methodType") String methodType, @WebParam(name = "agentID") String agentID, @WebParam(name = "agentState") String agentState, @WebParam(name = "agentType") String agentType, @WebParam(name = "iPAddress") String iPAddress, @WebParam(name = "status") String status, @WebParam(name = "callID") String callID, @WebParam(name = "otherDN") String otherDN, @WebParam(name = "callInType") String callInType, @WebParam(name = "stateTime") String stateTime, @WebParam(name = "telephonistId") String telephonistId) throws Exception;

    void receiveHeartBeat(@WebParam(name = "exec") String exec, @WebParam(name = "methodName") String methodName, @WebParam(name = "callBack") String callBack, @WebParam(name = "execType") String execType, @WebParam(name = "agentID") String agentID, @WebParam(name = "methodType") String methodType) throws Exception;

}


package net.bioslink.manage.webservice;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.logging.Logger;
import javax.xml.namespace.QName;
import javax.xml.ws.Service;
import javax.xml.ws.WebEndpoint;
import javax.xml.ws.WebServiceClient;
import javax.xml.ws.WebServiceFeature;


/**
 * This class was generated by the JAX-WS RI.
 * JAX-WS RI 2.1.6 in JDK 6
 * Generated source version: 2.1
 * 
 */
@WebServiceClient(name = "ImsImgInfoServiceImplService", targetNamespace = "http://webservice.manage.bioslink.net/", wsdlLocation = "http://ims.vanke.com/manage/service/ImgInfoService?wsdl")
public class ImsImgInfoServiceImplService
    extends Service
{

    private final static URL IMSIMGINFOSERVICEIMPLSERVICE_WSDL_LOCATION;
    private final static Logger logger = Logger.getLogger(net.bioslink.manage.webservice.ImsImgInfoServiceImplService.class.getName());

    static {
        URL url = null;
        try {
            URL baseUrl;
            baseUrl = net.bioslink.manage.webservice.ImsImgInfoServiceImplService.class.getResource(".");
            url = new URL(baseUrl, "http://ims.vanke.com/manage/service/ImgInfoService?wsdl");
        } catch (MalformedURLException e) {
            logger.warning("Failed to create URL for the wsdl Location: 'http://ims.vanke.com/manage/service/ImgInfoService?wsdl', retrying as a local file");
            logger.warning(e.getMessage());
        }
        IMSIMGINFOSERVICEIMPLSERVICE_WSDL_LOCATION = url;
    }

    public ImsImgInfoServiceImplService(URL wsdlLocation, QName serviceName) {
        super(wsdlLocation, serviceName);
    }

    public ImsImgInfoServiceImplService() {
        super(IMSIMGINFOSERVICEIMPLSERVICE_WSDL_LOCATION, new QName("http://webservice.manage.bioslink.net/", "ImsImgInfoServiceImplService"));
    }

    /**
     * 
     * @return
     *     returns ImsImgInfoService
     */
    @WebEndpoint(name = "ImsImgInfoServiceImplPort")
    public ImsImgInfoService getImsImgInfoServiceImplPort() {
        return super.getPort(new QName("http://webservice.manage.bioslink.net/", "ImsImgInfoServiceImplPort"), ImsImgInfoService.class);
    }

    /**
     * 
     * @param features
     *     A list of {@link javax.xml.ws.WebServiceFeature} to configure on the proxy.  Supported features not in the <code>features</code> parameter will have their default values.
     * @return
     *     returns ImsImgInfoService
     */
    @WebEndpoint(name = "ImsImgInfoServiceImplPort")
    public ImsImgInfoService getImsImgInfoServiceImplPort(WebServiceFeature... features) {
        return super.getPort(new QName("http://webservice.manage.bioslink.net/", "ImsImgInfoServiceImplPort"), ImsImgInfoService.class, features);
    }

}


/*
 * 
 */

package cn.com.flaginfo.ws;

import java.net.MalformedURLException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.xml.namespace.QName;
import javax.xml.ws.WebEndpoint;
import javax.xml.ws.WebServiceClient;
import javax.xml.ws.WebServiceFeature;
import javax.xml.ws.Service;

/**
 * This class was generated by Apache CXF 2.2.4
 * Tue Nov 03 10:46:02 CST 2015
 * Generated source version: 2.2.4
 * 
 */


@WebServiceClient(name = "Sms", 
                  wsdlLocation = "http://sms.api.ums86.com:8899/sms_hb/services/Sms?wsdl",
                  targetNamespace = "http://ws.flaginfo.com.cn") 
public class Sms_Service extends Service {

    public final static URL WSDL_LOCATION;
    public final static QName SERVICE = new QName("http://ws.flaginfo.com.cn", "Sms");
    public final static QName SmsHttpPort = new QName("http://ws.flaginfo.com.cn", "SmsHttpPort");
    static {
        URL url = null;
        try {
            url = new URL("http://sms.api.ums86.com:8899/sms_hb/services/Sms?wsdl");
        } catch (MalformedURLException e) {
            System.err.println("Can not initialize the default wsdl from http://sms.api.ums86.com:8899/sms_hb/services/Sms?wsdl");
            // e.printStackTrace();
        }
        WSDL_LOCATION = url;
    }

    public Sms_Service(URL wsdlLocation) {
        super(wsdlLocation, SERVICE);
    }

    public Sms_Service(URL wsdlLocation, QName serviceName) {
        super(wsdlLocation, serviceName);
    }

    public Sms_Service() {
        super(WSDL_LOCATION, SERVICE);
    }

    /**
     * 
     * @return
     *     returns SmsPortType
     */
    @WebEndpoint(name = "SmsHttpPort")
    public SmsPortType getSmsHttpPort() {
        return super.getPort(SmsHttpPort, SmsPortType.class);
    }

    /**
     * 
     * @param features
     *     A list of {@link javax.xml.ws.WebServiceFeature} to configure on the proxy.  Supported features not in the <code>features</code> parameter will have their default values.
     * @return
     *     returns SmsPortType
     */
    @WebEndpoint(name = "SmsHttpPort")
    public SmsPortType getSmsHttpPort(WebServiceFeature... features) {
        return super.getPort(SmsHttpPort, SmsPortType.class, features);
    }
    
    public static void main(String[] args) throws MalformedURLException {
    	Sms_Service ss = new Sms_Service(new URL("http://sms.api.ums86.com:8899/sms_hb/services/Sms?wsdl"));
    	String result = ss.getSmsHttpPort().sms("1", "2", "3", "短信内容, 最大402个字符", "13455555555", "11111111111221233212", "", "", "", "", "");
    	//ss.getSmsHttpPort().
    	//获取当前时间
    			Date now = new Date();
    			//精确到毫秒
    	    	SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmssSSS");
    	    	//获取三位随机数
    	    	int random= new java.util.Random().nextInt(900)+100;
    	    	//时间数17位拼接三位随机数
    	    	String serialNumber = formatter.format(now) + String.valueOf(random);
    	System.out.println("流水号"+serialNumber);
	}

}
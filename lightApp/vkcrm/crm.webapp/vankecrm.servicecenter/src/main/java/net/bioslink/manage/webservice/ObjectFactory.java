
package net.bioslink.manage.webservice;

import javax.xml.bind.JAXBElement;
import javax.xml.bind.annotation.XmlElementDecl;
import javax.xml.bind.annotation.XmlRegistry;
import javax.xml.namespace.QName;


/**
 * This object contains factory methods for each 
 * Java content interface and Java element interface 
 * generated in the net.bioslink.manage.webservice package. 
 * <p>An ObjectFactory allows you to programatically 
 * construct new instances of the Java representation 
 * for XML content. The Java representation of XML 
 * content can consist of schema derived interfaces 
 * and classes representing the binding of schema 
 * type definitions, element declarations and model 
 * groups.  Factory methods for each of these are 
 * provided in this class.
 * 
 */
@XmlRegistry
public class ObjectFactory {

    private final static QName _QueryCardImgInfoResponse_QNAME = new QName("http://webservice.manage.bioslink.net/", "queryCardImgInfoResponse");
    private final static QName _WriteBackCustCode_QNAME = new QName("http://webservice.manage.bioslink.net/", "writeBackCustCode");
    private final static QName _GetFileCodeResponse_QNAME = new QName("http://webservice.manage.bioslink.net/", "getFileCodeResponse");
    private final static QName _WriteBackCustCodeResponse_QNAME = new QName("http://webservice.manage.bioslink.net/", "writeBackCustCodeResponse");
    private final static QName _GetFileCode_QNAME = new QName("http://webservice.manage.bioslink.net/", "getFileCode");
    private final static QName _QueryImgInfoByPageResponse_QNAME = new QName("http://webservice.manage.bioslink.net/", "queryImgInfoByPageResponse");
    private final static QName _QueryImgInfo_QNAME = new QName("http://webservice.manage.bioslink.net/", "queryImgInfo");
    private final static QName _QueryCardImgInfo_QNAME = new QName("http://webservice.manage.bioslink.net/", "queryCardImgInfo");
    private final static QName _QueryImgInfoByPage_QNAME = new QName("http://webservice.manage.bioslink.net/", "queryImgInfoByPage");
    private final static QName _QueryImgInfoResponse_QNAME = new QName("http://webservice.manage.bioslink.net/", "queryImgInfoResponse");

    /**
     * Create a new ObjectFactory that can be used to create new instances of schema derived classes for package: net.bioslink.manage.webservice
     * 
     */
    public ObjectFactory() {
    }

    /**
     * Create an instance of {@link QueryImgInfo }
     * 
     */
    public QueryImgInfo createQueryImgInfo() {
        return new QueryImgInfo();
    }

    /**
     * Create an instance of {@link ImsImgInfoVO }
     * 
     */
    public ImsImgInfoVO createImsImgInfoVO() {
        return new ImsImgInfoVO();
    }

    /**
     * Create an instance of {@link QueryCardImgInfoResponse }
     * 
     */
    public QueryCardImgInfoResponse createQueryCardImgInfoResponse() {
        return new QueryCardImgInfoResponse();
    }

    /**
     * Create an instance of {@link QueryImgInfoByPage }
     * 
     */
    public QueryImgInfoByPage createQueryImgInfoByPage() {
        return new QueryImgInfoByPage();
    }

    /**
     * Create an instance of {@link GetFileCode }
     * 
     */
    public GetFileCode createGetFileCode() {
        return new GetFileCode();
    }

    /**
     * Create an instance of {@link WriteBackCustCodeResponse }
     * 
     */
    public WriteBackCustCodeResponse createWriteBackCustCodeResponse() {
        return new WriteBackCustCodeResponse();
    }

    /**
     * Create an instance of {@link QueryImgInfoByPageResponse }
     * 
     */
    public QueryImgInfoByPageResponse createQueryImgInfoByPageResponse() {
        return new QueryImgInfoByPageResponse();
    }

    /**
     * Create an instance of {@link WriteBackCustCode }
     * 
     */
    public WriteBackCustCode createWriteBackCustCode() {
        return new WriteBackCustCode();
    }

    /**
     * Create an instance of {@link QueryImgInfoResponse }
     * 
     */
    public QueryImgInfoResponse createQueryImgInfoResponse() {
        return new QueryImgInfoResponse();
    }

    /**
     * Create an instance of {@link GetFileCodeResponse }
     * 
     */
    public GetFileCodeResponse createGetFileCodeResponse() {
        return new GetFileCodeResponse();
    }

    /**
     * Create an instance of {@link ValueObject }
     * 
     */
    public ValueObject createValueObject() {
        return new ValueObject();
    }

    /**
     * Create an instance of {@link QueryCardImgInfo }
     * 
     */
    public QueryCardImgInfo createQueryCardImgInfo() {
        return new QueryCardImgInfo();
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link QueryCardImgInfoResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://webservice.manage.bioslink.net/", name = "queryCardImgInfoResponse")
    public JAXBElement<QueryCardImgInfoResponse> createQueryCardImgInfoResponse(QueryCardImgInfoResponse value) {
        return new JAXBElement<QueryCardImgInfoResponse>(_QueryCardImgInfoResponse_QNAME, QueryCardImgInfoResponse.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link WriteBackCustCode }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://webservice.manage.bioslink.net/", name = "writeBackCustCode")
    public JAXBElement<WriteBackCustCode> createWriteBackCustCode(WriteBackCustCode value) {
        return new JAXBElement<WriteBackCustCode>(_WriteBackCustCode_QNAME, WriteBackCustCode.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link GetFileCodeResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://webservice.manage.bioslink.net/", name = "getFileCodeResponse")
    public JAXBElement<GetFileCodeResponse> createGetFileCodeResponse(GetFileCodeResponse value) {
        return new JAXBElement<GetFileCodeResponse>(_GetFileCodeResponse_QNAME, GetFileCodeResponse.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link WriteBackCustCodeResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://webservice.manage.bioslink.net/", name = "writeBackCustCodeResponse")
    public JAXBElement<WriteBackCustCodeResponse> createWriteBackCustCodeResponse(WriteBackCustCodeResponse value) {
        return new JAXBElement<WriteBackCustCodeResponse>(_WriteBackCustCodeResponse_QNAME, WriteBackCustCodeResponse.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link GetFileCode }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://webservice.manage.bioslink.net/", name = "getFileCode")
    public JAXBElement<GetFileCode> createGetFileCode(GetFileCode value) {
        return new JAXBElement<GetFileCode>(_GetFileCode_QNAME, GetFileCode.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link QueryImgInfoByPageResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://webservice.manage.bioslink.net/", name = "queryImgInfoByPageResponse")
    public JAXBElement<QueryImgInfoByPageResponse> createQueryImgInfoByPageResponse(QueryImgInfoByPageResponse value) {
        return new JAXBElement<QueryImgInfoByPageResponse>(_QueryImgInfoByPageResponse_QNAME, QueryImgInfoByPageResponse.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link QueryImgInfo }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://webservice.manage.bioslink.net/", name = "queryImgInfo")
    public JAXBElement<QueryImgInfo> createQueryImgInfo(QueryImgInfo value) {
        return new JAXBElement<QueryImgInfo>(_QueryImgInfo_QNAME, QueryImgInfo.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link QueryCardImgInfo }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://webservice.manage.bioslink.net/", name = "queryCardImgInfo")
    public JAXBElement<QueryCardImgInfo> createQueryCardImgInfo(QueryCardImgInfo value) {
        return new JAXBElement<QueryCardImgInfo>(_QueryCardImgInfo_QNAME, QueryCardImgInfo.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link QueryImgInfoByPage }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://webservice.manage.bioslink.net/", name = "queryImgInfoByPage")
    public JAXBElement<QueryImgInfoByPage> createQueryImgInfoByPage(QueryImgInfoByPage value) {
        return new JAXBElement<QueryImgInfoByPage>(_QueryImgInfoByPage_QNAME, QueryImgInfoByPage.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link QueryImgInfoResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://webservice.manage.bioslink.net/", name = "queryImgInfoResponse")
    public JAXBElement<QueryImgInfoResponse> createQueryImgInfoResponse(QueryImgInfoResponse value) {
        return new JAXBElement<QueryImgInfoResponse>(_QueryImgInfoResponse_QNAME, QueryImgInfoResponse.class, null, value);
    }

}

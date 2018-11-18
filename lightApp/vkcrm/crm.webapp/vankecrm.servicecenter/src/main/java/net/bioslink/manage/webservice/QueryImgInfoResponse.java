
package net.bioslink.manage.webservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for queryImgInfoResponse complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="queryImgInfoResponse">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="imgInfoResult" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "queryImgInfoResponse", propOrder = {
    "imgInfoResult"
})
public class QueryImgInfoResponse {

    protected String imgInfoResult;

    /**
     * Gets the value of the imgInfoResult property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getImgInfoResult() {
        return imgInfoResult;
    }

    /**
     * Sets the value of the imgInfoResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setImgInfoResult(String value) {
        this.imgInfoResult = value;
    }

}

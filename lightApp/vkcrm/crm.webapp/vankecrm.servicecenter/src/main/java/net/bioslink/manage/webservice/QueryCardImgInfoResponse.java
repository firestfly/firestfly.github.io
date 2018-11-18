
package net.bioslink.manage.webservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for queryCardImgInfoResponse complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="queryCardImgInfoResponse">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="cardImgInfoResult" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "queryCardImgInfoResponse", propOrder = {
    "cardImgInfoResult"
})
public class QueryCardImgInfoResponse {

    protected String cardImgInfoResult;

    /**
     * Gets the value of the cardImgInfoResult property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCardImgInfoResult() {
        return cardImgInfoResult;
    }

    /**
     * Sets the value of the cardImgInfoResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCardImgInfoResult(String value) {
        this.cardImgInfoResult = value;
    }

}

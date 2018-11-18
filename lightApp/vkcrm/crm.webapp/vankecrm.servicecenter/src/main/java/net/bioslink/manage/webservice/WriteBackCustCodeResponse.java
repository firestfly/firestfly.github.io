
package net.bioslink.manage.webservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for writeBackCustCodeResponse complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="writeBackCustCodeResponse">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="writeResult" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "writeBackCustCodeResponse", propOrder = {
    "writeResult"
})
public class WriteBackCustCodeResponse {

    protected String writeResult;

    /**
     * Gets the value of the writeResult property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getWriteResult() {
        return writeResult;
    }

    /**
     * Sets the value of the writeResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setWriteResult(String value) {
        this.writeResult = value;
    }

}

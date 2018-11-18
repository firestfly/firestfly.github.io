
package net.bioslink.manage.webservice;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for queryImgInfoByPageResponse complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="queryImgInfoByPageResponse">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="imgInfoPageResult" type="{http://webservice.manage.bioslink.net/}imsImgInfoVO" maxOccurs="unbounded" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "queryImgInfoByPageResponse", propOrder = {
    "imgInfoPageResult"
})
public class QueryImgInfoByPageResponse {

    protected List<ImsImgInfoVO> imgInfoPageResult;

    /**
     * Gets the value of the imgInfoPageResult property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the imgInfoPageResult property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getImgInfoPageResult().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link ImsImgInfoVO }
     * 
     * 
     */
    public List<ImsImgInfoVO> getImgInfoPageResult() {
        if (imgInfoPageResult == null) {
            imgInfoPageResult = new ArrayList<ImsImgInfoVO>();
        }
        return this.imgInfoPageResult;
    }

}

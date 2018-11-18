/**  
 * @Title: RequestUtils.java
 * @Package: bingo.vkcrm.common.utils
 * @author: luoml01 
 * @date: 2016年3月22日下午2:03:15
 * @version V1.0 
 * @see       
 * @since JDK 1.6   
 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
 */   
package bingo.vkcrm.common.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import javax.servlet.http.HttpServletRequest;

/**   
 * @ClassName: RequestUtils   
 * @Description:TODO
 * @author: luoml01 
 * @date: 2016年3月22日 下午2:03:15   
 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有   
 */
public class RequestUtils {
	
	/**
	 * @Description: 请求对象解析工具
	 * @param  HttpServletRequest 对象
	 * @Author: luoml01
	 * @date: 2016年3月22日 
	 * @return:String字符串
     * @exception:
	 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
	 */
	public static String getStrParam(HttpServletRequest request){
		   InputStream input = null;
		   StringBuffer sb = new StringBuffer(); 
		   String buffer = null; 
			try {
				input = request.getInputStream();
				BufferedReader br = new BufferedReader(new InputStreamReader(input, "UTF-8")); 
		           while ((buffer = br.readLine()) != null) { 
		               sb.append(buffer); 
		           } 
			} catch (IOException e) {
				e.printStackTrace();
			}
		return sb.toString();
	}
}

/**
 * This file created at 2010-10-22.
 *
 * Copyright (c) 2002-2010 Bingosoft, Inc. All rights reserved.
 */
package bingo.modules.securityConsole.common;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * <code>{@link ValidateUtil}</code>
 *
 * 服务类基础类
 *
 * @author 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
 */
public class ValidateUtil {
    /**  
    * 手机号验证  
    *   
    * @param  str  
    * @return 验证通过返回true  
    */  
   public static boolean isMobile(String str) {
	   if(null == str || str.equals("")){
		   return false;
	   }
       Pattern p = null;   
       Matcher m = null;   
        boolean b = false;
	   if(str.substring(0,1).equals("1")){
	        p = Pattern.compile("^[1]{1}[0-9]{10}$"); // 验证手机号   
	   }else{
	        p = Pattern.compile("^[0-9]{1,20}$"); // 数字
	   }
        m = p.matcher(str);   
        b = m.matches();    
        return b;   
    }   
    /**  
     * 电话号码验证  
     *   
     * @param  str  
     * @return 验证通过返回true  
     */  
    public static boolean isPhone(String str) {    
        Pattern p1 = null,p2 = null;   
        Matcher m = null;   
        boolean b = false;     
        p1 = Pattern.compile("^[0][1-9]{2,3}-[0-9]{5,10}$");  // 验证带区号的   
        p2 = Pattern.compile("^[1-9]{1}[0-9]{5,8}$");         // 验证没有区号的   
        if(str.length() >9)   
        {   m = p1.matcher(str);   
            b = m.matches();     
        }else{   
            m = p2.matcher(str);   
            b = m.matches();    
        }     
        return b;   
    } 
    
    public static void main(String[] args) {
		System.out.println(" = "+isMobile(""));
		System.out.println("135444 = "+isMobile("135444"));
		System.out.println("11111111111 = "+isMobile("11111111111"));
		System.out.println("332323 = "+isMobile("332323"));
		System.out.println("12312312312312312312312312 = "+isMobile("12312312312312312312312312"));
		System.out.println("1 = "+isMobile("1"));
		System.out.println("3 = "+isMobile("3"));
	}



}
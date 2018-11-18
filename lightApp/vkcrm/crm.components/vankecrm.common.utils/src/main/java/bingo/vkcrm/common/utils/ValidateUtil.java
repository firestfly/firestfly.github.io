/**
 * This file created at 2010-10-22.
 *
 * Copyright (c) 2002-2010 Bingosoft, Inc. All rights reserved.
 */
package bingo.vkcrm.common.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * <code>{@link ValidateUtil}</code>
 *
 * 服务类基础类
 *
 * @author qiuchsh
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



}
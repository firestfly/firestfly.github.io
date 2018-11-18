/**
 * This file created at 2010-10-22.
 *
 * Copyright (c) 2002-2010 Bingosoft, Inc. All rights reserved.
 */
package bingo.excel.util;

import java.util.Map;

/**
 * <code>{@link MapHelper}</code>
 *
 * 服务类基础类
 *
 * @author 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
 */
public class MapHelper {

	public static void print(Map<String, Object> map){		
		if(null == map){
			System.out.println("null");
		}else{
			for(Object key: map.keySet()){
				System.out.println(key +"\t:"+map.get(key));				
			}
		}
	}
	public static void print1(Map<String, String> map){	
		if(null == map){
			System.out.println("null");
		}else{
			for(Object key: map.keySet()){
				if(key.toString().indexOf("数据<供应商")>=0){
					System.out.println(key +"\t:"+map.get(key));
				}				
			}
		}
	}
	
	/**
	 * 通过key获取Map值
	 * @param map
	 * @param key
	 * @return
	 */
	public static String saveGetString(Map<String, Object> map,String key){
		if(null == map || null == map.get(key)){
			return "";
		}
		return map.get(key).toString().trim();	
	}
}
/**
 * 
 */
package bingo.vkcrm.common.utils;

/**
 * @author leoly
 *
 */

import javax.crypto.Cipher;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESedeKeySpec;
import javax.crypto.spec.IvParameterSpec;
import java.security.Key;

/**
 * 3DES加密工具类
 * 
 * @author Leoly
 * @date 2012-10-11
 */
public class Des3 {
	// 向量
	private final static String iv = "01234567";
	// 加解密统一使用的编码方式
	private final static String encoding = "utf-8";

	/**
	 * 3DES加密
	 * 
	 * @param plainText
	 *            普通文本
	 * @return
	 * @throws Exception
	 */
	public static String encode(String plainText, String secretKey) throws Exception {
		Key deskey = null;
		DESedeKeySpec spec = new DESedeKeySpec(secretKey.getBytes());
		SecretKeyFactory keyfactory = SecretKeyFactory.getInstance("desede");
		deskey = keyfactory.generateSecret(spec);

		Cipher cipher = Cipher.getInstance("desede/CBC/PKCS5Padding");
		IvParameterSpec ips = new IvParameterSpec(iv.getBytes());
		cipher.init(Cipher.ENCRYPT_MODE, deskey, ips);
		byte[] encryptData = cipher.doFinal(plainText.getBytes(encoding));
		return UipBase64.encode(encryptData);
	}	

	/**
	 * 3DES解密
	 * 
	 * @param encryptText
	 *            加密文本
	 * @return
	 * @throws Exception
	 */
	public static String decode(String encryptText, String secretKey) throws Exception {
		Key deskey = null;
		DESedeKeySpec spec = new DESedeKeySpec(secretKey.getBytes());
		SecretKeyFactory keyfactory = SecretKeyFactory.getInstance("desede");
		deskey = keyfactory.generateSecret(spec);
		Cipher cipher = Cipher.getInstance("desede/CBC/PKCS5Padding");
		IvParameterSpec ips = new IvParameterSpec(iv.getBytes());
		cipher.init(Cipher.DECRYPT_MODE, deskey, ips);

		byte[] decryptData = cipher.doFinal(UipBase64.decode(encryptText));

		return new String(decryptData, encoding);
	}

	public static void main(String[] args) throws Exception {
		// {house_pk:"1",page_no:1,page_size:15,res1:"",res2:""}
		String baseStr = "{\"bill_end_mth\":null,\"bill_start_mth\":null,\"house_mdscode\":\"1003A11000000000C8AS\",\"pwd\":null,\"project_code\":\"15\"}";
		System.out.println("原始字符串：" + baseStr);
//		String secretKey = "tU!x%$rUlqz3V2B4&dQnt9iL";
//		System.out.println("密钥：" + secretKey);
		String secretKey = "ySiWZ/Hv2bpikmPblP000000";
		String secretStr = Des3.encode(baseStr, secretKey);
		System.out.println("加密字符串：" + secretStr);

//		String decodeStr = Des3.decode("3ESiWvy7XC2GHHN3C0SzEyVR_TwOfhKBwW9to921QkY55fwWFcGLwGu9usAh SYIFG2Zwi6-PmkKDd-jFVoRuEfoqSFNlT4OW8MlUZnEu6oK8LFw8DNgiT5-P qcNwTcKy", "tU!x%$rUlqz3V2B4&dQnt9iL");
//		System.out.println("解密字符串：" + decodeStr);
	}
}

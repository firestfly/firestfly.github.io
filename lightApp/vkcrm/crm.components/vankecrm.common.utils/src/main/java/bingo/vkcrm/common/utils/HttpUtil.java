package bingo.vkcrm.common.utils;

import org.apache.commons.lang3.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.LineNumberReader;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.UnknownHostException;

public class HttpUtil {

    /**
     * 获取客户端真实IP地址
     *
     * @param httpServletRequest
     * @return
     */
    public static String getIpAddress(HttpServletRequest httpServletRequest) {
        String ip = httpServletRequest.getHeader("X-Forwarded-For");
        if (StringUtils.isNotEmpty(ip)) {
            String[] ips = StringUtils.split(ip, ",");
            if (ips != null) {
                for (String tmpip : ips) {
                    if (StringUtils.isEmpty(tmpip)) {
                        continue;
                    }
                    tmpip = tmpip.trim();
                    if (isIPAddress(tmpip) && !tmpip.startsWith("10.") && !tmpip.startsWith("192.168.") && !"127.0.0.1".equals(tmpip)) {
                        return tmpip.trim();
                    }
                }
            }
        }
        ip = httpServletRequest.getHeader("x-real-ip");
        if (isIPAddress(ip)) {
            return ip;
        }
        ip = httpServletRequest.getRemoteAddr();
        if (isIPAddress(ip)) {
            return ip;
        }
        return "127.0.0.1";

    }

    /**
     * 判断字符串是否是一个IP地址
     *
     * @param ipAddress
     * @return
     */
    public static boolean isIPAddress(String ipAddress) {
        if (StringUtils.isEmpty(ipAddress)) {
            return false;
        }
        String[] ips = StringUtils.split(ipAddress, ".");
        if (ips.length != 4) {
            return false;
        }
        try {
            int ipa = Integer.parseInt(ips[0]);
            int ipb = Integer.parseInt(ips[1]);
            int ipc = Integer.parseInt(ips[2]);
            int ipd = Integer.parseInt(ips[3]);
            return ipa >= 0 && ipa <= 255 && ipb >= 0 && ipb <= 255 && ipc >= 0
                    && ipc <= 255 && ipd >= 0 && ipd <= 255;
        } catch (Exception e) {
        }

        return false;
    }


    /**
     * 获取客户端信息
     *
     * @param request
     * @return
     */
    public static String getUseAgent(HttpServletRequest httpServletRequest) {
        return httpServletRequest.getHeader("user-agent");
    }

    /**
     * 获取MAC地址
     *
     * @param ip
     * @return
     */
    public static String getMACAddress(String ip) {
        String str = "";
        String macAddress = "";
        try {
            Process p = Runtime.getRuntime().exec("nbtstat -A " + ip);
            InputStreamReader ir = new InputStreamReader(p.getInputStream());
            LineNumberReader input = new LineNumberReader(ir);
            for (int i = 1; i < 100; i++) {
                str = input.readLine();
                if (str != null) {
                    if (str.indexOf("MAC Address") > 1) {
                        macAddress = str.substring(str.indexOf("MAC Address") + 14, str.length());
                        break;
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace(System.out);
        }
        return macAddress;
    }

    /**
     * 获取MAC信息
     *
     * @param ip
     * @return
     */
    public static String getIpMac(String ip) {
        try {
            InetAddress ipAddr = InetAddress.getLocalHost();
            NetworkInterface network = NetworkInterface.getByInetAddress(ipAddr);
            if (network != null) {
                byte[] mac = network.getHardwareAddress();
                if (mac != null) {
                    StringBuilder sb = new StringBuilder();
                    for (int i = 0; i < mac.length; i++) {
                        sb.append(String.format("%02X%s", mac[i], (i < mac.length - 1) ? "-" : ""));
                    }
                    return sb.toString();
                }
            }
        } catch (UnknownHostException e) {
            e.printStackTrace();
        } catch (SocketException e) {
            e.printStackTrace();
        }
        return "mac not found";
    }
}

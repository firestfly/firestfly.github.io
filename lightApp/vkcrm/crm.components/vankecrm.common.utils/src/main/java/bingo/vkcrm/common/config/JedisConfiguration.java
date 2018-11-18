package bingo.vkcrm.common.config;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * Redis配置上下文
 */
public class JedisConfiguration extends Properties {

    private static final Log log = LogFactory.getLog(JedisConfiguration.class);

    private static final long serialVersionUID = 50440463580273222L;

    private static JedisConfiguration instance = null;

    public static synchronized JedisConfiguration getInstance() {
        if (instance == null) {
            instance = new JedisConfiguration();
        }
        return instance;
    }

    public String getProperty(String key, String defaultValue) {
        String val = getProperty(key);
        return (val == null || val.isEmpty()) ? defaultValue : val;
    }

    public String getString(String name, String defaultValue) {
        return this.getProperty(name, defaultValue);
    }

    public int getInt(String name, int defaultValue) {
        String val = this.getProperty(name);
        return (val == null || val.isEmpty()) ? defaultValue : Integer.parseInt(val);
    }

    public long getLong(String name, long defaultValue) {
        String val = this.getProperty(name);
        return (val == null || val.isEmpty()) ? defaultValue : Integer.parseInt(val);
    }

    public float getFloat(String name, float defaultValue) {
        String val = this.getProperty(name);
        return (val == null || val.isEmpty()) ? defaultValue : Float.parseFloat(val);
    }

    public double getDouble(String name, double defaultValue) {
        String val = this.getProperty(name);
        return (val == null || val.isEmpty()) ? defaultValue : Double.parseDouble(val);
    }

    public byte getByte(String name, byte defaultValue) {
        String val = this.getProperty(name);
        return (val == null || val.isEmpty()) ? defaultValue : Byte.parseByte(val);
    }

    /**
     * 读取上下文中的配置文件进行初始化
     */
    public JedisConfiguration(){
        InputStream inputStream = this.getClass().getResourceAsStream("/config/redis.xml");
        try {
            this.loadFromXML(inputStream);
            inputStream.close();
        } catch (IOException e) {
            e.printStackTrace();
            log.error("请确保config/redis.xml存在。");
        }
    }
}

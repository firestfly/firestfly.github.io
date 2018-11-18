package bingo.vkcrm.common.utils;


import bingo.vkcrm.common.config.JedisConfiguration;
import org.apache.commons.lang3.StringUtils;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

import java.io.UnsupportedEncodingException;
import java.util.*;

/**
 * Redis操作工具类
 * <p>
 * 用法:
 * JedisUtil.switchDb(0).get('xxx')
 * JedisUtil.switchDb('redis.default.db').get('xxx')
 */
public class JedisUtil {

    private static String JEDIS_URL;
    private static int JEDIS_PORT;
    private static String JEDIS_PASSWORD;
    private static int JEDIS_TIMEOUT;
    private static int JEDIS_DEFAULT_DB;
    private static String JEDIS_ENCODE;
    //private static String JEDIS_SLAVE;

    private static HashMap<Integer, JedisPool> jedisPools;

    static {
        jedisPools = new HashMap<Integer, JedisPool>(12);
    }

    private int db;
    private String charset;

    public JedisUtil(int db, String charset) {
        this.db = db;
        this.charset = charset;
    }

    /**
     * 切换日志Redis数据库
     *
     * @return
     */
    public static JedisUtil defaultDb() {
        return switchDb("redis.default.db");
    }

    /**
     * 切换缓存Redis数据库
     *
     * @return
     */
    public static JedisUtil cacheDb() { return switchDb("redis.cache.db"); }

    /**
     * 切换Redis数据库
     *
     * @param dbConfig redis.xml中的数据库配置文件key,为空默认为redis.default.db
     * @return
     */
    public static JedisUtil switchDb(String dbConfig) {
        if (StringUtils.isEmpty(dbConfig)) {
            throw new IllegalArgumentException("dbConfig不能为空");
        }
        JedisConfiguration conf = JedisConfiguration.getInstance();
        int db = conf.getInt(dbConfig, 0);
        return switchDb(db);
    }

    public static JedisUtil switchDb(int db) {
        if (!jedisPools.containsKey(db)) {
            JedisConfiguration conf = JedisConfiguration.getInstance();
            String url = conf.getString("redis.url", "127.0.0.1");
            Integer port = conf.getInt("redis.port", 6379);
            String password = conf.getString("redis.password", null);
//            Integer dbIndex = conf.getInt("redis.default.db", 0);
            Integer timeout = conf.getInt("redis.timeout", 60000);
            JEDIS_ENCODE = conf.getString("redis.encode", "UTF8");

            JedisPoolConfig config = new JedisPoolConfig();
            config.setMaxTotal(conf.getInt("redis.maxActive", 300));
            config.setMaxIdle(conf.getInt("redis.maxIdle", 100));
            config.setMaxWaitMillis(conf.getInt("redis.maxWait", 1000));
            config.setTestOnBorrow(true);
            config.setTestOnReturn(true);
            config.setTestWhileIdle(true);
            config.setMinEvictableIdleTimeMillis(60000l);
            config.setTimeBetweenEvictionRunsMillis(3000l);
            config.setNumTestsPerEvictionRun(-1);
            jedisPools.put(db, new JedisPool(config, url, port, timeout, password, db));
        }
        return new JedisUtil(db, JEDIS_ENCODE);
    }


    /**
     * 获取数据
     *
     * @param key
     * @return
     */
    public String get(String key) {
        String value = null;
        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {
            jedisPool = jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            value = jedis.get(key);
        } catch (Exception e) {
            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();
        } finally {
            //返还到连接池
            close(jedis);
        }

        return value;
    }

    /**
     * 根据正则表达式列出key
     *
     * @param pattern 正则表达式
     * @return
     */
    public Set keys(String pattern) {
        Set value = null;
        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {
            jedisPool = jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            value = jedis.keys(pattern);
        } catch (Exception e) {
            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();
        } finally {
            //返还到连接池
            close(jedis);
        }

        return value;
    }

    /**
     * 根据正则表达式列出key
     *
     * @param pattern 正则表达式
     * @return
     */
    public Set keys(byte[] pattern) {
        Set value = null;
        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {
            jedisPool = jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            value = jedis.keys(pattern);
        } catch (Exception e) {
            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();
        } finally {
            //返还到连接池
            close(jedis);
        }

        return value;
    }

    /**
     * 关闭连接
     *
     * @param jedis
     */
    public void close(Jedis jedis) {
        try {
            jedisPools.get(this.db).returnResourceObject(jedis);

        } catch (Exception e) {
            if (jedis.isConnected()) {
                jedis.quit();
                jedis.disconnect();
            }
        }
    }

    /**
     * 获取数据
     *
     * @param key
     * @return
     */
    public byte[] get(byte[] key) {

        byte[] value = null;
        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {
            jedisPool = jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            value = jedis.get(key);
        } catch (Exception e) {
            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();
        } finally {
            //返还到连接池
            close(jedis);
        }
        return value;
    }

    /**
     * 插入数据
     *
     * @param key
     * @param value
     */
    public void set(byte[] key, byte[] value) {

        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {
            jedisPool = JedisUtil.jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            jedis.set(key, value);
        } catch (Exception e) {
            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();
        } finally {
            //返还到连接池
            close(jedis);
        }
    }

    public void set(String key, String value) {
        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {
            jedisPool = JedisUtil.jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            jedis.set(key, value);
        } catch (Exception e) {
            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();
        } finally {
            //返还到连接池
            close(jedis);
        }
    }

    public void set(String key, String value, Integer expire) {
        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {
            jedisPool = JedisUtil.jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            jedis.set(key, value);
            jedis.expire(key, expire);
        } catch (Exception e) {
            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();
        } finally {
            //返还到连接池
            close(jedis);
        }
    }

    /**
     * 插入数据（设置Key超时时间）
     *
     * @param key
     * @param value
     * @param time
     */
    public void set(byte[] key, byte[] value, int time) {

        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {
            jedisPool = jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            jedis.set(key, value);
            jedis.expire(key, time);
        } catch (Exception e) {
            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();
        } finally {
            //返还到连接池
            close(jedis);
        }
    }

    /**
     * 更新Key的超时时间
     *
     * @param key
     * @param time
     */
    public void expire(byte[] key, int time) {

        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {
            jedisPool = jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            jedis.expire(key, time);
        } catch (Exception e) {
            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();
        } finally {
            //返还到连接池
            close(jedis);
        }
    }

    /**
     * 插入数据（哈希表）
     *
     * @param key
     * @param field
     * @param value
     */
    public void hset(byte[] key, byte[] field, byte[] value) {
        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {
            jedisPool = jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            jedis.hset(key, field, value);
        } catch (Exception e) {
            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();
        } finally {
            //返还到连接池
            close(jedis);
        }
    }

    /**
     * 插入数据（哈希表，存在则更新，不存在则插入）
     *
     * @param key
     * @param field
     * @param value
     */
    public void hset(String key, String field, String value) {
        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {
            jedisPool = jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            jedis.hset(key, field, value);
        } catch (Exception e) {
            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();
        } finally {
            //返还到连接池
            close(jedis);
        }
    }

    /**
     * 获取数据（哈希表，获取指定key的指定字段的string值）
     *
     * @param key
     * @param field
     * @return
     */
    public String hget(String key, String field) {

        String value = null;
        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {
            jedisPool = jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            value = jedis.hget(key, field);
        } catch (Exception e) {
            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();
        } finally {
            //返还到连接池
            close(jedis);
        }

        return value;
    }

    /**
     * 获取数据（哈希表，获取指定key的指定field的byte[]值）
     *
     * @param key
     * @param field
     * @return
     */
    public byte[] hget(byte[] key, byte[] field) {

        byte[] value = null;
        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {
            jedisPool = jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            value = jedis.hget(key, field);
        } catch (Exception e) {
            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();
        } finally {
            //返还到连接池
            close(jedis);
        }

        return value;
    }

    /**
     * 删除数据（哈希表，删除指定key的指定field的byte[]值）
     *
     * @param key
     * @param field
     */
    public void hdel(byte[] key, byte[] field) {

        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {
            jedisPool = jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            jedis.hdel(key, field);
        } catch (Exception e) {
            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();
        } finally {
            //返还到连接池
            close(jedis);
        }
    }

    /**
     * 插入数据（队列，从头插入）
     *
     * @param key
     * @param value
     */
    public void lpush(byte[] key, byte[] value) {
        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {

            jedisPool = jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            jedis.lpush(key, value);
        } catch (Exception e) {
            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();
        } finally {
            //返还到连接池
            close(jedis);
        }
    }

    /**
     * 插入数据（队列，从头插入）
     *
     * @param key
     * @param value
     */
    public void lpush(String key, String value) throws UnsupportedEncodingException {
        this.lpush(key.getBytes(this.charset), value.getBytes(this.charset));
    }

    /**
     * 插入数据（队列，从尾插入）
     *
     * @param key
     * @param value
     */
    public void rpush(byte[] key, byte[] value) {
        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {
            jedisPool = jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            jedis.rpush(key, value);
        } catch (Exception e) {
            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();
        } finally {
            //返还到连接池
            close(jedis);
        }
    }

    public void rpush(String key, String value) throws UnsupportedEncodingException {
        this.rpush(key.getBytes(this.charset), value.getBytes(this.charset));
    }

    /**
     * 插入数据（从队列尾部取出数据，插入到指定destination头部）
     *
     * @param key
     * @param destination
     */
    public void rpoplpush(byte[] key, byte[] destination) {

        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {

            jedisPool = jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            jedis.rpoplpush(key, destination);

        } catch (Exception e) {
            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();
        } finally {

            //返还到连接池
            close(jedis);

        }
    }

    /**
     * 查询数据列（队列，指定key）
     *
     * @param key
     * @return
     */
    public List<byte[]> lpopList(byte[] key) {

        List<byte[]> list = null;
        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {

            jedisPool = jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            list = jedis.lrange(key, 0, -1);

        } catch (Exception e) {

            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();

        } finally {

            //返还到连接池
            close(jedis);

        }
        return list;
    }

    /**
     * 查询数据（队列，指定key）
     *
     * @param key
     * @return
     */
    public byte[] lpop(byte[] key) {
        byte[] bytes = null;
        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {

            jedisPool = jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            bytes = jedis.lpop(key);

        } catch (Exception e) {

            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();

        } finally {

            //返还到连接池
            close(jedis);

        }
        return bytes;
    }

    /**
     * 删除数据（队列，从尾部）
     *
     * @param key
     * @return
     */
    public byte[] rpop(byte[] key) {

        byte[] bytes = null;
        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {

            jedisPool = jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            bytes = jedis.rpop(key);

        } catch (Exception e) {

            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();

        } finally {

            //返还到连接池
            close(jedis);

        }
        return bytes;
    }

    /**
     * 删除数据（队列，从尾部）
     *
     * @param key
     * @return
     */
    public String rpop(String key) throws UnsupportedEncodingException {
        return new String(this.rpop(key.getBytes(this.charset)), this.charset);
    }


    /**
     * 插入数据（哈希表，多个field）
     *
     * @param key
     * @param hash
     */
    public void hmset(Object key, Map<String, String> hash) {
        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {
            jedisPool = jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            jedis.hmset(key.toString(), hash);
        } catch (Exception e) {
            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();

        } finally {
            //返还到连接池
            close(jedis);

        }
    }

    /**
     * 插入数据（哈希表，多个field，过期时间）
     *
     * @param key
     * @param hash
     * @param time
     */
    public void hmset(Object key, Map<String, String> hash, int time) {
        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {

            jedisPool = jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            jedis.hmset(key.toString(), hash);
            jedis.expire(key.toString(), time);
        } catch (Exception e) {
            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();

        } finally {
            //返还到连接池
            close(jedis);

        }
    }

    /**
     * 获取数据（哈希表，批量获取field）
     *
     * @param key
     * @param fields
     * @return
     */
    public List<String> hmget(Object key, String... fields) {
        List<String> result = null;
        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {

            jedisPool = jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            result = jedis.hmget(key.toString(), fields);

        } catch (Exception e) {
            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();

        } finally {
            //返还到连接池
            close(jedis);

        }
        return result;
    }

    /**
     * 获取key（哈希表）
     *
     * @param key
     * @return
     */
    public Set<String> hkeys(String key) {
        Set<String> result = null;
        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {
            jedisPool = jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            result = jedis.hkeys(key);

        } catch (Exception e) {
            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();

        } finally {
            //返还到连接池
            close(jedis);

        }
        return result;
    }

    /**
     * 获取数据（队列，根据下标范围获取数据）
     *
     * @param key
     * @param from
     * @param to
     * @return
     */
    public List<byte[]> lrange(byte[] key, int from, int to) {
        List<byte[]> result = null;
        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {
            jedisPool = jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            result = jedis.lrange(key, from, to);

        } catch (Exception e) {
            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();

        } finally {
            //返还到连接池
            close(jedis);

        }
        return result;
    }

    /**
     * 获取数据（队列，根据下标范围获取数据）
     *
     * @param key
     * @param from
     * @param to
     * @return
     */
    public List<String> lrange(String key, int from, int to) {
        List<String> result = null;
        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {
            jedisPool = jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            result = jedis.lrange(key, from, to);

        } catch (Exception e) {
            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();

        } finally {
            //返还到连接池
            close(jedis);

        }
        return result;
    }

    /**
     * 获取数据（队列，根据下标范围获取数据）
     *
     * @param key
     * @param count
     * @param value
     * @return
     */
    public long lrem(String key, int count, String value) {
        long result = 0;
        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {
            jedisPool = jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            result = jedis.lrem(key, count, value);
        } catch (Exception e) {
            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();
        } finally {
            //返还到连接池
            close(jedis);

        }
        return result;
    }

    /**
     * 获取数据（哈希表，获取所有key，value）
     *
     * @param key
     * @return
     */
    public Map<byte[], byte[]> hgetAll(byte[] key) {
        Map<byte[], byte[]> result = null;
        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {
            jedisPool = jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            result = jedis.hgetAll(key);
        } catch (Exception e) {
            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();

        } finally {
            //返还到连接池
            close(jedis);
        }
        return result;
    }

    /**
     * 删除数据
     *
     * @param key
     */
    public void del(byte[] key) {

        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {
            jedisPool = jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            jedis.del(key);
        } catch (Exception e) {
            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();
        } finally {
            //返还到连接池
            close(jedis);
        }
    }

    /**
     * 获取个数（队列）
     *
     * @param key
     * @return
     */
    private long llen(byte[] key) {

        long len = 0;
        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {
            jedisPool = jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            len = jedis.llen(key);
        } catch (Exception e) {
            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();
        } finally {
            //返还到连接池
            close(jedis);
        }
        return len;
    }


    /**
     * 获取个数（队列）
     *
     * @param key
     * @return
     */
    public long llen(String key) throws UnsupportedEncodingException {
        return this.llen(key.getBytes(this.charset));
    }


    public String lindex(String key, long index) {
        String val = null;
        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {
            jedisPool = jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            val = jedis.lindex(key, index);
        } catch (Exception e) {
            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();
        } finally {
            //返还到连接池
            close(jedis);
        }
        return val;
    }

    /**
     * 判断key是否存在
     *
     * @param key
     * @return
     */
    public Boolean exists(String key) {
        Boolean flag = false;
        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {
            jedisPool = jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            flag = jedis.exists(key);
        } catch (Exception e) {
            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();
        } finally {
            //返还到连接池
            close(jedis);
        }
        return flag;
    }

    public String[] smembers(String key) {
        Set<String> vals = new HashSet<String>();
        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {
            jedisPool = jedisPools.get(this.db);
            jedis = jedisPool.getResource();
            vals = jedis.smembers(key);
        } catch (Exception e) {
            //释放redis对象
            e.printStackTrace();
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();
        } finally {
            //返还到连接池
            close(jedis);
        }
        return vals.toArray(new String[0]);
    }



    /**
     * 往集合中插入数据
     *
     * @param key
     * @return
     */
    public Long sadd(String key,String val) {
        Long result=null;
        Jedis jedis = null;
        JedisPool jedisPool = null;
        try {
            jedisPool = jedisPools.get(this.db);
            jedis = jedisPool.getResource();
             result = jedis.sadd(key,val);
        } catch (Exception e) {
            //释放redis对象
            if (jedisPool != null) {
                jedisPool.returnResourceObject(jedis);
            }
            e.printStackTrace();
        } finally {
            //返还到连接池
            close(jedis);
        }
        return result;
    }

}

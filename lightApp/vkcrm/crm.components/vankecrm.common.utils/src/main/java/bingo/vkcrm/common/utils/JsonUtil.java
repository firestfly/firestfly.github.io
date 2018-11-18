package bingo.vkcrm.common.utils;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonParser.Feature;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import java.io.IOException;
import java.text.SimpleDateFormat;

/**
 * JSON的工具类
 * <p/>
 * <h3>Here is an example:</h3>
 * <p/>
 * <pre>
 *     // 将json通过类型转换成对象
 *     {@link JsonUtil JsonUtil}.fromJson("{\"username\":\"username\", \"password\":\"password\"}", User.class);
 * </pre>
 * <hr />
 * <pre>
 *     // 传入转换的引用类型
 *     {@link JsonUtil JsonUtil}.fromJson("[{\"username\":\"username\", \"password\":\"password\"}, {\"username\":\"username\", \"password\":\"password\"}]", new TypeReference&lt;List&lt;User&gt;&gt;);
 * </pre>
 * <hr />
 * <pre>
 *     // 将对象转换成json
 *     {@link JsonUtil JsonUtil}.toJson(user);
 * </pre>
 * <hr />
 * <pre>
 *     // 将对象转换成json, 可以设置输出属性
 *     {@link JsonUtil JsonUtil}.toJson(user, {@link JsonInclude.Include Inclusion.ALWAYS});
 * </pre>
 * <hr />
 * <pre>
 *     // 将对象转换成json, 传入配置对象
 *     {@link ObjectMapper ObjectMapper} mapper = new ObjectMapper();
 *     mapper.setSerializationInclusion({@link JsonInclude.Include Inclusion.ALWAYS});
 *     mapper.configure({@link Feature Feature.FAIL_ON_UNKNOWN_PROPERTIES}, false);
 *     mapper.configure({@link Feature Feature.FAIL_ON_NUMBERS_FOR_ENUMS}, true);
 *     mapper.setDateFormat(new {@link SimpleDateFormat SimpleDateFormat}("yyyy-MM-dd HH:mm:ss"));
 *     {@link JsonUtil JsonUtil}.toJson(user, mapper);
 * </pre>
 * <hr />
 * <pre>
 *     // 获取Mapper对象
 *     {@link JsonUtil JsonUtil}.mapper();
 * </pre>
 *
 * @see JsonUtil JsonUtil
 * @see Feature Feature
 * @see ObjectMapper ObjectMapper
 * @see JsonInclude.Include Inclusion
 * @see IOException IOException
 * @see SimpleDateFormat SimpleDateFormat
 */
@SuppressWarnings("unchecked")
public final class JsonUtil {

    private static ObjectMapper MAPPER;

    static {
        MAPPER = generateMapper(JsonInclude.Include.ALWAYS);
        MAPPER.configure(Feature.ALLOW_UNQUOTED_CONTROL_CHARS, true) ;
        MAPPER.configure(Feature.ALLOW_SINGLE_QUOTES, true) ;
    }

    private JsonUtil() {
    }

    /**
     * 将json通过类型转换成对象
     * <p/>
     * <pre>
     *     {@link JsonUtil JsonUtil}.fromJson("{\"username\":\"username\", \"password\":\"password\"}", User.class);
     * </pre>
     *
     * @param json  json字符串
     * @param clazz 泛型类型
     * @return 返回对象
     * @throws IOException
     */
    public static <T> T fromJson(String json, Class<T> clazz) throws IOException {
        json=json.replace("\\","/");
        return clazz.equals(String.class) ? (T) json : MAPPER.readValue(json, clazz);
    }

    /**
     * 将json通过类型转换成对象
     * <p/>
     * <pre>
     *     {@link JsonUtil JsonUtil}.fromJson("[{\"username\":\"username\", \"password\":\"password\"}, {\"username\":\"username\", \"password\":\"password\"}]", new TypeReference&lt;List&lt;User&gt;&gt;);
     * </pre>
     *
     * @param json          json字符串
     * @param typeReference 引用类型
     * @return 返回对象
     * @throws IOException
     */
    public static <T> T fromJson(String json, TypeReference<?> typeReference) throws IOException {
        return (T) (typeReference.getType().equals(String.class) ? json : MAPPER.readValue(json, typeReference));
    }

    /**
     * 将对象转换成json
     * <p/>
     * <pre>
     *     {@link JsonUtil JsonUtil}.toJson(user);
     * </pre>
     *
     * @param src 对象
     * @return 返回json字符串
     * @throws IOException
     */
    public static <T> String toJson(T src) throws IOException {
        return src instanceof String ? (String) src : MAPPER.writeValueAsString(src);
    }

    /**
     * 将对象转换成json, 可以设置输出属性
     * <p/>
     * <pre>
     *     {@link JsonUtil JsonUtil}.toJson(user, {@link JsonInclude.Include Include.ALWAYS});
     * </pre>
     * <p/>
     * {@link JsonInclude.Include Include 对象枚举}
     * <ul>
     * <li>{@link JsonInclude.Include Include.ALWAYS 全部列入}</li>
     * <li>{@link JsonInclude.Include Include.NON_DEFAULT 字段和对象默认值相同的时候不会列入}</li>
     * <li>{@link JsonInclude.Include Include.NON_EMPTY 字段为NULL或者""的时候不会列入}</li>
     * <li>{@link JsonInclude.Include Include.NON_NULL 字段为NULL时候不会列入}</li>
     * </ul>
     *
     * @param src     对象
     * @param include 传入一个枚举值, 设置输出属性
     * @return 返回json字符串
     * @throws IOException
     */
    public static <T> String toJson(T src, JsonInclude.Include include) throws IOException {
        if (src instanceof String) {
            return (String) src;
        } else {
            ObjectMapper customMapper = generateMapper(include);
            return customMapper.writeValueAsString(src);
        }
    }

    /**
     * 将对象转换成json, 传入配置对象
     * <p/>
     * <pre>
     *     {@link ObjectMapper ObjectMapper} mapper = new ObjectMapper();
     *     mapper.setSerializationInclusion({@link JsonInclude.Include Include.ALWAYS});
     *     mapper.configure({@link Feature Feature.FAIL_ON_UNKNOWN_PROPERTIES}, false);
     *     mapper.configure({@link Feature Feature.FAIL_ON_NUMBERS_FOR_ENUMS}, true);
     *     mapper.setDateFormat(new {@link SimpleDateFormat SimpleDateFormat}("yyyy-MM-dd HH:mm:ss"));
     *     {@link JsonUtil JsonUtil}.toJson(user, mapper);
     * </pre>
     * <p/>
     * {@link ObjectMapper ObjectMapper}
     *
     * @param src    对象
     * @param mapper 配置对象
     * @return 返回json字符串
     * @throws IOException
     * @see ObjectMapper
     */
    public static <T> String toJson(T src, ObjectMapper mapper) throws IOException {
        if (null != mapper) {
            if (src instanceof String) {
                return (String) src;
            } else {
                return mapper.writeValueAsString(src);
            }
        } else {
            return null;
        }
    }

    /**
     * 返回{@link ObjectMapper ObjectMapper}对象, 用于定制性的操作
     *
     * @return {@link ObjectMapper ObjectMapper}对象
     */
    public static ObjectMapper mapper() {
        return MAPPER;
    }

    /**
     * 通过Include创建ObjectMapper对象
     * <p/>
     * {@link JsonInclude.Include Include 对象枚举}
     * <ul>
     * <li>{@link JsonInclude.Include Include.ALWAYS 全部列入}</li>
     * <li>{@link JsonInclude.Include Include.NON_DEFAULT 字段和对象默认值相同的时候不会列入}</li>
     * <li>{@link JsonInclude.Include Include.NON_EMPTY 字段为NULL或者""的时候不会列入}</li>
     * <li>{@link JsonInclude.Include Include.NON_NULL 字段为NULL时候不会列入}</li>
     * </ul>
     *
     * @param include 传入一个枚举值, 设置输出属性
     * @return 返回ObjectMapper对象
     */
    private static ObjectMapper generateMapper(JsonInclude.Include include) {

        ObjectMapper customMapper = new ObjectMapper();

        // 设置输出时包含属性的风格
        customMapper.setSerializationInclusion(include);

        // 设置输入时忽略在JSON字符串中存在但Java对象实际没有的属性
        customMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        customMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);

        // 禁止使用int代表Enum的order()來反序列化Enum,非常危險
        customMapper.configure(DeserializationFeature.FAIL_ON_NUMBERS_FOR_ENUMS, true);

        // 所有日期格式都统一为以下样式
        customMapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));

        return customMapper;
    }
}
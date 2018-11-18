package bingo.vkcrm.service.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 长日期类型Json序列化（yyyy-MM-dd HH:mm:ss）
 */
public class DateTimeJsonSerializer extends JsonSerializer<Date> {
    private final String DATETIME_FORMAT_STRING = "yyyy-MM-dd HH:mm:ss";

    @Override
    public void serialize(Date date, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException, JsonProcessingException {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(DATETIME_FORMAT_STRING);
        String formattedDate = simpleDateFormat.format(date);
        jsonGenerator.writeString(formattedDate);
    }
}

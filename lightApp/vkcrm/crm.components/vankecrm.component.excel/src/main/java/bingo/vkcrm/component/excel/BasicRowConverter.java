package bingo.vkcrm.component.excel;

import bingo.common.core.utils.StringUtils;

import java.util.Map;

/**
 * Created by Wangzr on 16/3/4.
 */
public class BasicRowConverter implements IRowConverter {

    public BasicRowConverter() {
    }

    public Map<String, Object> convert(Map<String, Object> row, String[] columnIds, String[] columnTypes) {
        Object columnData = null;

        for(int i = 0; i < columnIds.length; ++i) {
            columnData = row.get(columnIds[i].toUpperCase());
            if(null != columnData) {
                if("link".equalsIgnoreCase(columnTypes[i])) {
                    row.put(columnIds[i].toUpperCase(), this.substringBefore(columnData.toString(), "^"));
                }

                if("ch".equalsIgnoreCase(columnTypes[i]) || "cb".equalsIgnoreCase(columnTypes[i])) {
                    row.put(columnIds[i].toUpperCase(), "0".equalsIgnoreCase(columnData.toString())?"否":"是");
                }
            }
        }

        return row;
    }

    private String substringBefore(String rawString, String match) {
        if(StringUtils.isEmpty(rawString)) {
            return rawString;
        } else {
            int index = rawString.indexOf(match);
            if(index != -1) {
                rawString = rawString.substring(0, index);
            }

            return rawString;
        }
    }
}

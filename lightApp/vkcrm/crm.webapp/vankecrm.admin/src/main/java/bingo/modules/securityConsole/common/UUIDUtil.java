package bingo.modules.securityConsole.common;

import java.util.UUID;

/**
 * Created by hades on 15/9/18.
 */
public class UUIDUtil {

    public static String create(){
        return UUID.randomUUID().toString().replace("-", "");
    }
}

package bingo.vkcrm.component.notify.impl;

import bingo.vkcrm.component.notify.NotifyRuleResolve;

import java.util.List;

/**
 * Created by Wangzr on 16/1/19.
 */
public class NotifyUserResolve extends NotifyRuleResolve {

    public String[] resolve(List<String> values) {
        return values.toArray(new String[0]);
    }
}

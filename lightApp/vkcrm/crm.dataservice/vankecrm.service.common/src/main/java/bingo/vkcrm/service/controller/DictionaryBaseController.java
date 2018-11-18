package bingo.vkcrm.service.controller;

import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.exceptions.BadRequestException;
import bingo.vkcrm.service.exceptions.NotFoundException;
import bingo.vkcrm.service.model.DictionaryItem;
import bingo.vkcrm.service.service.DictionaryService;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.StopWatch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 数据公共字典Controller
 */
@Controller
public class DictionaryBaseController extends BaseController {

    @Autowired
    DictionaryService dictionaryService;

    /**
     * 获取字典表数据项
     *
     * @return ServiceResult
     */
    @RequestMapping(value = "/dict/{code}/items", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getDictioanryItems(@PathVariable("code") String dictionaryCode) throws Exception {
        if (StringUtils.isEmpty(dictionaryCode)) {
            throw new BadRequestException("字典编码为空.");
        }
        List<DictionaryItem> list = dictionaryService.get(dictionaryCode, true);
        if (list == null) {
            throw new NotFoundException("查询结果为空.");
        }
        return ServiceResult.succeed(list);
    }

    /**
     * 批量获取数据字典表项
     *
     * @param dictionaryCodes 数据字典项
     * @return
     */
    @RequestMapping(value = "/batch/dict/{codes}/items", method = RequestMethod.GET)
    @ResponseBody
    @Deprecated
    public ServiceResult merge(@PathVariable("codes") String[] dictionaryCodes) throws Exception {
        if (dictionaryCodes == null) {
            throw new BadRequestException("字典编码为空.");
        }
        HashMap<String, List<DictionaryItem>> dictionries = dictionaryService.queryAll(dictionaryCodes);
        if (dictionries == null) {
            throw new NotFoundException("查询结果为空.");
        }
        return ServiceResult.succeed(dictionries);
    }

    /**
     * 批量获取数据字典表项
     *
     * @param codes 数据字典项集合
     * @return
     */
    @RequestMapping(value = "/dict/items", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult queryDictionaryItems(String[] codes) throws Exception {
        if (codes == null) {
            throw new BadRequestException("字典编码为空.");
        }
        HashMap<String, List<DictionaryItem>> dictionaries = dictionaryService.queryAll(codes, true);
        if (dictionaries == null) {
            throw new NotFoundException("查询结果为空.");
        }
        return ServiceResult.succeed(dictionaries);
    }

    /**
     * 重新加载缓存
     * @return
     */
    @RequestMapping(value = "/dict/cache/reload", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult reloadCache(){
        dictionaryService.init2Cache();
        return ServiceResult.succeed(dictionaryService.getCacheCount());
    }

}

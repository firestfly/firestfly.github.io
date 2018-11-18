package com.vankeservice.controller;

import bingo.security.SecurityContext;
import com.vankeservice.common.controller.BaseController;
import com.vankeservice.common.model.DataTablePage;
import com.vankeservice.common.utility.JsonUtil;
import com.vankeservice.model.DecorationRecord;
import com.vankeservice.service.DecorationRecordService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/decorationRecord")
public class DecorationRecordController extends BaseController<DecorationRecord, DecorationRecordService> {

    @Override
    @RequestMapping(method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public Integer add(DecorationRecord bean) {
        bean.setCreateBy(SecurityContext.getCurrentUser().getId());
        return super.add(bean);
    }

    @Override
    @RequestMapping(method = RequestMethod.PUT)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Integer edit(DecorationRecord bean) {
        bean.setUpdateBy(SecurityContext.getCurrentUser().getId());
        return super.edit(bean);
    }

    @Override
    @RequestMapping(value = "/{start}/{length}/{draw}", method = RequestMethod.GET)
    public DataTablePage<DecorationRecord> list(@PathVariable("draw") Integer draw, @PathVariable("length") Integer length, @PathVariable("start") Integer start, @RequestParam(value = "search[value]", required = false) String searchInfoStr) throws Exception {
        DecorationRecord decorationRecord = JsonUtil.fromJson(searchInfoStr, DecorationRecord.class);
        if (null == decorationRecord) {
            decorationRecord = new DecorationRecord();
        }
        decorationRecord.setCreateBy(SecurityContext.getCurrentUser().getId());
        return super.list(draw, length, start, JsonUtil.toJson(decorationRecord));
    }
}

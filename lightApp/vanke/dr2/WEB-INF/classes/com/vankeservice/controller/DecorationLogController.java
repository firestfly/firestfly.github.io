package com.vankeservice.controller;

import bingo.security.SecurityContext;
import com.vankeservice.common.controller.BaseController;
import com.vankeservice.model.DecorationLog;
import com.vankeservice.service.DecorationLogService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/decorationLog")
public class DecorationLogController extends BaseController<DecorationLog, DecorationLogService> {
    @Override
    @RequestMapping(method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public Integer add(DecorationLog bean) {
        bean.setProcessBy(SecurityContext.getCurrentUser().getId());
        return super.add(bean);
    }
}

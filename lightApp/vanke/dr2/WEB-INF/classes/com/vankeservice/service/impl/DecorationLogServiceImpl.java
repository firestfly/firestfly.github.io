package com.vankeservice.service.impl;

import com.vankeservice.common.service.AbstractBaseService;
import com.vankeservice.dao.DecorationLogDao;
import com.vankeservice.model.DecorationLog;
import com.vankeservice.service.DecorationLogService;
import org.springframework.stereotype.Service;

@Service
public class DecorationLogServiceImpl extends AbstractBaseService<DecorationLog,DecorationLogDao> implements DecorationLogService {
}

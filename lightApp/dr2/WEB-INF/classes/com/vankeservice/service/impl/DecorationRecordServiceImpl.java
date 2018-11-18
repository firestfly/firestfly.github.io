package com.vankeservice.service.impl;

import com.vankeservice.common.service.AbstractBaseService;
import com.vankeservice.dao.DecorationRecordDao;
import com.vankeservice.model.DecorationRecord;
import com.vankeservice.service.DecorationRecordService;
import org.springframework.stereotype.Service;

@Service
public class DecorationRecordServiceImpl extends AbstractBaseService<DecorationRecord,DecorationRecordDao> implements DecorationRecordService {
}

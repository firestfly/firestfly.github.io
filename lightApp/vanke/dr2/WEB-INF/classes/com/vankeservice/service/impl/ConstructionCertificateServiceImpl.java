package com.vankeservice.service.impl;

import com.vankeservice.common.service.AbstractBaseService;
import com.vankeservice.dao.ConstructionCertificateDao;
import com.vankeservice.model.ConstructionCertificate;
import com.vankeservice.service.ConstructionCertificateService;
import org.springframework.stereotype.Service;

@Service
public class ConstructionCertificateServiceImpl extends AbstractBaseService<ConstructionCertificate, ConstructionCertificateDao> implements ConstructionCertificateService {
}

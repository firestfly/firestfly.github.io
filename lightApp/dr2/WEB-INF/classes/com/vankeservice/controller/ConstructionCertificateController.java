package com.vankeservice.controller;

import com.vankeservice.common.controller.BaseController;
import com.vankeservice.common.model.DataTablePage;
import com.vankeservice.model.ConstructionCertificate;
import com.vankeservice.service.ConstructionCertificateService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/constructionCertificate")
public class ConstructionCertificateController extends BaseController<ConstructionCertificate, ConstructionCertificateService> {

}

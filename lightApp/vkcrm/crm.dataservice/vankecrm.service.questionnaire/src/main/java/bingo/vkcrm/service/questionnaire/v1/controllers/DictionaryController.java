package bingo.vkcrm.service.questionnaire.v1.controllers;

import bingo.vkcrm.service.controller.DictionaryBaseController;
import bingo.vkcrm.service.questionnaire.v1.Version;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 字典控制器
 */
@Controller
@RequestMapping(value = Version.API_PATH)
public class DictionaryController extends DictionaryBaseController {

}

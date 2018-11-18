package bingo.vkcrm.service.task.v1.controllers;

import bingo.vkcrm.service.controller.DictionaryBaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import bingo.vkcrm.service.task.v1.Version;

@Controller
@RequestMapping(value = Version.API_PATH)
public class DictionaryController extends DictionaryBaseController {

}

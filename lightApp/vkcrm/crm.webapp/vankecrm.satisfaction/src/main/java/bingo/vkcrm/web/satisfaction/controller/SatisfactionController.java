package bingo.vkcrm.web.satisfaction.controller;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

/**
 * 问卷管理
 */
@Controller
public class SatisfactionController {

    private static final Log log = LogFactory.getLog(SatisfactionController.class);

    @RequestMapping(value = "/page/questionnaire/manage", method = RequestMethod.GET)
    public ModelAndView forQuestionnaireManage() {
        ModelAndView modelAndView;
        try {
            modelAndView = new ModelAndView("/modules/questionnaire/index");
        } catch (Exception ex) {
            ex.printStackTrace();
            log.error(ex.getMessage());
            modelAndView = new ModelAndView("/error", "errorMsg", ex.getStackTrace());
        }
        return modelAndView;
    }

    @RequestMapping(value = "/page/questionnaire/call", method = RequestMethod.GET)
    public ModelAndView forQuestionnaireCall() {
        ModelAndView modelAndView;
        try {
            modelAndView = new ModelAndView("/modules/call/index");
        } catch (Exception ex) {
            ex.printStackTrace();
            log.error(ex.getMessage());
            modelAndView = new ModelAndView("/error", "errorMsg", ex.getStackTrace());
        }
        return modelAndView;
    }

    @RequestMapping(value = "/page/questionnaires/{questionnaireId}", method = RequestMethod.GET)
    public ModelAndView forQuestionnaireEdit(@PathVariable(value = "questionnaireId") String questionnaireId) {
        ModelAndView modelAndView;
        try {
            modelAndView = new ModelAndView("/modules/questionnaire/edit");
            if (StringUtils.isEmpty(questionnaireId)) {
                modelAndView.addObject("questionnaireId", questionnaireId);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            log.error(ex.getMessage());
            modelAndView = new ModelAndView("/error", "errorMsg", ex.getStackTrace());
        }
        return modelAndView;
    }

    @RequestMapping(value = "/page/questionnaire", method = RequestMethod.GET)
    public ModelAndView forQuestionnaireAdd() {
        ModelAndView modelAndView;
        try {
            modelAndView = new ModelAndView("/modules/questionnaire/edit");
        } catch (Exception ex) {
            ex.printStackTrace();
            log.error(ex.getMessage());
            modelAndView = new ModelAndView("/error", "errorMsg", ex.getStackTrace());
        }
        return modelAndView;
    }
}

package bingo.vkcrm.web.servicecenter.controller;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "page")
public class SearchController {

    private static final String ERROR_PAGE_500 = "/error/500";

    private static final Log log = LogFactory.getLog(SearchController.class);

    /**
     * 搜索首页
     *
     * @return
     */
    @RequestMapping(value = "/search", method = RequestMethod.GET)
    public ModelAndView forIndex() {
        ModelAndView modelAndView;
        try {
            modelAndView = new ModelAndView("/modules/search/index");
        } catch (Exception ex) {
            ex.printStackTrace();
            log.error(ex.getMessage());
            modelAndView = new ModelAndView(ERROR_PAGE_500, "errorMessage", ex.getStackTrace());
        }
        return modelAndView;
    }
}

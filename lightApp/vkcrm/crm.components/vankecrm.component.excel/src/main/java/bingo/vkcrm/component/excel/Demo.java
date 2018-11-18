package bingo.vkcrm.component.excel;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by Wangzr on 16/3/7.
 */
public class Demo {

    @RequestMapping(value = "/exportTest", method = RequestMethod.GET)
    public ModelAndView exportExcel(HttpServletResponse response) {

        ExportParameters parameters = new ExportParameters();
        // 设置需要导出的列ID
        parameters.setColumnsId(new String[]{"id", "fullName"});
        // 设置对应的列标题
        parameters.setColumnsHeader(new String[]{"Id", "姓名"});
        // 设置对应列的数据类型
        parameters.setColumnsType(new String[]{"String", "String"});
        // 设置dao名称
        parameters.setDaoName("centerRoDao");
        // 设置排序列
        parameters.setOrderBy("id asc");
        // 设置查询数据的sql
        parameters.setSqlId("export.test");
        // 设置查询数据总数的sql
        parameters.setSqlCountId("export.test.count");

        // 调用导出方法
        Exporter.getInstance().export("test.xlsx", parameters, response);

        return new ModelAndView();
    }
}

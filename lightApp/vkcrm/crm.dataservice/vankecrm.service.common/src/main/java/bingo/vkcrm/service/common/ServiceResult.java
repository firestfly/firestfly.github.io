package bingo.vkcrm.service.common;

import bingo.vkcrm.service.exceptions.ServiceException;

/**
 * Rest API接口的返回数据格式
 * <p/>
 * links：当前页面包含的相关的链接
 * list：返回的数据集合
 * statusCode：当前请求状态码
 * message：当前请求消息
 * version：当前接口的版本（最新版本、当前使用版本、当前版本过期时间）?（如果接口有更新，用什么形式通知接口使用者？）
 */
public class ServiceResult {

    //常用HTTP状态说明
    public static final int CODE_OK = 200; //正常
    public static final int CODE_MOVED_TEMPORARILY = 302; //重定向
    public static final int CODE_NOT_MODIFYIED = 304; //资源未修改
    public static final int CODE_BAD_REQUEST = 400; //请求错误
    public static final int CODE_UNAUTHORIZED = 401; //未认证
    public static final int CODE_FORBIDDEN = 403; //禁止访问
    public static final int CODE_NOT_FOUND = 404; //资源不存在
    public static final int CODE_SERVER_ERROR = 500; //服务端错误

    /**
     * 是否成功
     */
    private boolean success;
    /**
     * 返回消息
     */
    private String message;
    /**
     * HttpStatusCode
     */
    private int code = CODE_OK;

    /**
     * 出错处理所需的附属对象
     */
    private Object details;

    public ServiceResult() {
    }

    public ServiceResult(boolean success) {
        this.success = success;
    }

    public ServiceResult(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public ServiceResult(boolean success, String message, Object details) {
        this.success = success;
        this.message = message;
        this.details = details;
    }

    public Object getDetails() {
        return details;
    }

    public void setDetails(Object details) {
        this.details = details;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public int getCode() {
        return code;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public static ServiceResult succeed(Object data) {
        ServiceResult serviceResult = new ServiceResult();
        serviceResult.success = true;
        serviceResult.message = "success";
        serviceResult.details = data;
        return serviceResult;
    }
    

    public static ServiceResult error(String message) {
        ServiceResult serviceResult = new ServiceResult();
        serviceResult.success = false;
        serviceResult.message = message;
        return serviceResult;
    }
    

    public static ServiceResult error(Throwable ex) {
        ServiceResult serviceResult = new ServiceResult();
        serviceResult.success = false;
        serviceResult.message = ex.getMessage();
        serviceResult.code = CODE_SERVER_ERROR;
        return serviceResult;
    }

    public static ServiceResult error(ServiceException ex) {
        ServiceResult serviceResult = new ServiceResult();
        serviceResult.success = false;
        serviceResult.message = ex.getErrorMessage();
        serviceResult.code = ex.getCode();
        return serviceResult;
    }
}
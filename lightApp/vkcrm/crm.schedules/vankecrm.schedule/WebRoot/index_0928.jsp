<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@page import="bingo.uims.business.task.thread.ExcelImportThread"%>
<%@ page language="java" pageEncoding="UTF-8"%>
<%
new ExcelImportThread().work();

%>
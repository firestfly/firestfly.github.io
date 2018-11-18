/*
 * @(#)bingo.schedules.abstracts AbstractQuartzTask.java created at 2013-5-27.
 *
 * Copyright (c) 2002-2013 Bingosoft, Inc. All rights reserved.
 */
package bingo.vkcrm.task.common;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.StatefulJob;
import org.springframework.scheduling.quartz.QuartzJobBean;

import java.util.Date;

/**
 * 定时任务抽象类
 */
public abstract class AbstractQuartzTask extends QuartzJobBean implements StatefulJob {

	protected static final Log log = LogFactory.getLog(AbstractQuartzTask.class);
	protected static final String BMAP_SUCCESS_CODE ="000";//战图调用成功的code

	protected String taskName = null;

	protected static final String METHOD_ON_BEFORE = "onBefore";
	protected static final String METHOD_DO_TASK = "doTask";
	protected static final String METHOD_ON_AFTER = "onAfter";
	protected static final String METHOD_EXCEPTION = "exception";

	/** default constructor */
	public AbstractQuartzTask() {
	}

	@Override
	protected void executeInternal(JobExecutionContext jobExecutionContext)
			throws JobExecutionException {
		log.info("-----------------------------------------------------------");
		log.info("# Begin execute - [" + taskName + "]:");
		log.info("Execute time:" + new Date());
		try {
			if (onBefore(jobExecutionContext)) {
				if (doTask(jobExecutionContext)) {
					if (!onAfter(jobExecutionContext)) {
						onException(jobExecutionContext, METHOD_ON_AFTER,
								new Exception("Method [" + METHOD_ON_AFTER + "] execute return false"));
					}
				} else {
					onException(jobExecutionContext, METHOD_DO_TASK,
							new Exception("Method [" + METHOD_DO_TASK + "] execute return false"));
				}
			} else {
				onException(jobExecutionContext, METHOD_ON_BEFORE,
						new Exception("Method [" + METHOD_ON_BEFORE + "] execute return false"));
			}
		} catch(JobExecutionException e) {
			e.printStackTrace();
			onException(jobExecutionContext, METHOD_EXCEPTION, e);
			throw e;
		} catch(Exception e) {
			e.printStackTrace();
			log.error(this, e);
			onException(jobExecutionContext, METHOD_EXCEPTION, e);
		}

		log.info("Execute end:" + new Date());
		log.info("Next fire time:" + jobExecutionContext.getNextFireTime());
		log.info("# End execute - [" + taskName + "]:");
		log.info("-----------------------------------------------------------");
	}

	/**
	 * 执行调度任务
	 * @param jobExecutionContext
	 * @return
	 * @throws Exception
	 */
	public abstract boolean doTask(JobExecutionContext jobExecutionContext) throws Exception;

	/**
	 * 执行调度前的处理
	 * @param jobExecutionContext
	 * @return
	 * @throws Exception
	 */
	public abstract boolean onBefore(JobExecutionContext jobExecutionContext) throws Exception;

	/**
	 * 错误处理
	 * @param jobExecutionContext
	 * @param fromMethod
	 * @param exception
	 */
	public abstract void onException(JobExecutionContext jobExecutionContext, String fromMethod,
									 Exception exception);

	/**
	 * 执行调度后的处理
	 * @param jobExecutionContext
	 * @return
	 * @throws Exception
	 */
	public abstract boolean onAfter(JobExecutionContext jobExecutionContext) throws Exception;

	/**
	 * 获取当前任务名称
	 * @return
	 */
	public String getTaskName() {
		return this.taskName;
	}
}

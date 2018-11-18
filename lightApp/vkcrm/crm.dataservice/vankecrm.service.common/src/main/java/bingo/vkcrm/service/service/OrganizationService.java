package bingo.vkcrm.service.service;

import bingo.vkcrm.service.common.Organization;

/**
 * 获取用户组织信息
 */
public interface OrganizationService {

    Organization getUserOrganization(String loginId);
}

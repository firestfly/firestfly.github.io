package bingo.vkcrm.service.customer.v1.services;

import bingo.vkcrm.common.utils.UUIDUtil;
import bingo.vkcrm.service.annotation.OperationLog;
import bingo.vkcrm.service.annotation.OperationType;
import bingo.vkcrm.service.common.User;
import bingo.vkcrm.service.customer.v1.CustomerCommonService;
import bingo.vkcrm.service.customer.v1.models.Pet;
import bingo.vkcrm.service.enums.RelationTypes;
import bingo.vkcrm.service.enums.ResourceTypes;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PetService extends CustomerCommonService {

    /**
     * 根据客户uuid查询宠物信息
     *
     * @param customerId 客户id
     * @return List<Pet>
     */
    public List<Pet> queryAllPets(String customerId) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("customerId", customerId);
        return centerRoDao.queryForList(Pet.class, "sql.query.pets", parameters);
    }

    /**
     * 根据客户uuid查询宠物信息
     *
     * @param petId 宠物id
     * @return List<Pet>
     */
    public Pet getPet(String petId) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("petId", petId);
        return centerRoDao.queryForObject(Pet.class, "sql.query.pet", parameters);
    }

    /**
     * 添加宠物信息
     *
     * @param pet     宠物信息
     * @param creator 创建人
     * @return 操作是否成功
     */
    public boolean addPet(Pet pet, User creator) {
        String uuid = UUIDUtil.create();
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("id", uuid);
        parameters.put("customerId", pet.getCustomerId());
        parameters.put("name", pet.getName());
        parameters.put("adoptTime", pet.getAdoptTime());
        parameters.put("breed", pet.getBreed());
        parameters.put("sex", pet.getSex());
        parameters.put("status", pet.getStatus());
        parameters.put("description", pet.getDescription());
        parameters.put("user", creator.getName());
        parameters.put("userid", creator.getId());
        if (centerDao.insert("sql.insert.pet", parameters) > 0) {
            logRelation2RedisMQ(pet.getCustomerId(), pet.getHouseId(), uuid, "新增", ResourceTypes.Car.getValue(), RelationTypes.Owner.getCode());
        }
        return true;
    }

    /**
     * 更新宠物信息
     *
     * @param petId    宠物编码
     * @param pet      宠物信息
     * @param modifier 修改人
     * @return 操作是否成功
     */
    @OperationLog(operationType = OperationType.UpdateEntity, operationName = "修改宠物相关信息", springServiceName = "petService", targetClass = PetService.class, resultClass = Pet.class, targetMethod = "getPet", queueKey = "datachangelog.key", idIndex = {0, 1, 2, 3})
    public boolean update(String customerId, String buildingId, String buildingType, String petId, Pet pet, User modifier) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("id", petId);
        parameters.put("name", pet.getName());
        parameters.put("adoptTime", pet.getAdoptTime());
        if (null != pet.getBreed() && 0 != pet.getBreed()) {
            parameters.put("breed", pet.getBreed());
        }
        if (null != pet.getSex() && 0 != pet.getSex()) {
            parameters.put("sex", pet.getSex());
        }
        if (null != pet.getStatus() && 0 != pet.getStatus()) {
            parameters.put("status", pet.getStatus());
        }
        parameters.put("description", pet.getDescription());
        parameters.put("user", modifier.getName());
        parameters.put("userid", modifier.getId());
        return centerDao.update("sql.update.pet", parameters) > 0;
    }

    /**
     * 删除宠物信息
     *
     * @param petId
     * @return
     */
    public boolean delete(String petId) {
        int result = 0;
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("id", petId);
        result = centerDao.update("sql.delete.pet", parameters);
        return result > 0;
    }
}

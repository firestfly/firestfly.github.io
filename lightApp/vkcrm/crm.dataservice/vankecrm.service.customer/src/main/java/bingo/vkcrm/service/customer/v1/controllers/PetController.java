package bingo.vkcrm.service.customer.v1.controllers;

import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.customer.v1.Version;
import bingo.vkcrm.service.customer.v1.models.Pet;
import bingo.vkcrm.service.customer.v1.services.PetService;
import bingo.vkcrm.service.enums.BuildingTypes;
import bingo.vkcrm.service.exceptions.BadRequestException;
import bingo.vkcrm.service.exceptions.NotFoundException;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * 宠物
 */
@Controller
@RequestMapping(value = Version.API_PATH)
public class PetController extends BaseController {

    private static final Log log = LogFactory.getLog(CustomerController.class);

    @Autowired
    PetService service;

    /**
     * 查询宠物信息
     *
     * @param customerId 客户id
     * @return
     */
    @RequestMapping(value = "/customer/{customerId}/pets", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryAllPets(@PathVariable(value = "customerId") String customerId) throws Exception {
        if (StringUtils.isEmpty(customerId)) {
            throw new BadRequestException("客户编码为空.");
        }
        List<Pet> list = service.queryAllPets(customerId);
        if (list == null) {
            throw new NotFoundException("查询结果为空.");
        }
        return ServiceResult.succeed(list);
    }

    /**
     * 查询宠物信息
     *
     * @param petId 宠物id
     * @return
     */
    @RequestMapping(value = "/pet/{petId}", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult getPet(@PathVariable("petId") String petId) throws Exception {
        if (StringUtils.isEmpty(petId)) {
            throw new BadRequestException("宠物编码为空.");
        }
        Pet pet = service.getPet(petId);
        if (pet == null) {
            throw new NotFoundException("查询结果为空.");
        }
        return ServiceResult.succeed(pet);
    }

    /**
     * 添加客户宠物信息
     * 传入Pet对象
     *
     * @param pet 宠物信息
     * @return
     */
    @RequestMapping(value = "/customer/pet/add", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult addPet(Pet pet) throws Exception {
        if (pet == null) {
            throw new BadRequestException("宠物信息为空.");
        }
        // 接口对外发布，外部系统传房屋Code不传房屋id，需要将房屋code转成id
        if(StringUtils.isEmpty(pet.getHouseId()) && StringUtils.isNotEmpty(pet.getHouseCode())){
        	pet.setHouseId(service.getHouseIdByCode(pet.getHouseCode()));
        }        
        service.addPet(pet, getCurrentUser());
        return ServiceResult.succeed(true);
    }

    /**
     * 更新宠物信息
     *
     * @param pet
     */
    @RequestMapping(value = "/customer/pet/{petId}/update", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult update(@PathVariable(value = "petId") String petId, Pet pet) throws Exception {
        if (StringUtils.isEmpty(petId)) {
            throw new BadRequestException("宠物编码为空.");
        }
        if (pet == null) {
            throw new BadRequestException("宠物信息为空.");
        }
        // 接口对外发布，外部系统传房屋Code不传房屋id，需要将房屋code转成id
        if (BuildingTypes.House.equals(pet.getBuildingType())) {
            pet.setBuildingId(service.getHouseIdByCode(pet.getBuildingCode()));
        } else if (BuildingTypes.Carport.equals(pet.getBuildingType())) {
            pet.setBuildingId(service.getCarportIdByCode(pet.getBuildingCode()));
        }        
        service.update(pet.getCustomerId(), pet.getBuildingId(),pet.getBuildingType(), petId, pet, getCurrentUser());
        return ServiceResult.succeed(true);
    }
    
    /**
     * 删除宠物
     * @param petId
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/customer/pet/{petId}/delete", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult delete(@PathVariable(value = "petId") String petId) throws Exception {
        if (StringUtils.isEmpty(petId)) {
            throw new BadRequestException("宠物编码为空.");
        }   
        boolean result = false;
        result = service.delete(petId);
        if(result){
        	return ServiceResult.succeed(true);
        }else {
        	return ServiceResult.error("删除失败");
        }
        
    }
}

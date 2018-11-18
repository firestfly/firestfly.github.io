package bingo.vkcrm.service.customer.v1.controllers;

import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.customer.v1.models.Car;
import bingo.vkcrm.service.customer.v1.services.CarService;
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
 * 客户车辆信息
 */
@RequestMapping(value = "api/v1")
@Controller
public class CarController extends BaseController {
    @Autowired
    CarService service;

    private static final Log log = LogFactory.getLog(CustomerController.class);

    /**
     * 查询客户车辆信息
     *
     * @param customerId
     * @return
     */
    @RequestMapping(value = "/customer/{customerId}/cars", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryCars(@PathVariable(value = "customerId") String customerId) throws Exception {
        if (StringUtils.isEmpty(customerId)) {
            throw new BadRequestException("客户编码为空.");
        }
        List<Car> cars = service.queryAllCars(customerId);
        if (cars == null) {
            throw new NotFoundException("查询结果为空.");
        }
        return ServiceResult.succeed(cars);
    }

    /**
     * 查询车辆信息
     *
     * @param carId 车辆id
     * @return
     */
    @RequestMapping(value = "/car/{carId}", method = RequestMethod.GET)
    @ResponseBody
    public ServiceResult queryCar(@PathVariable("carId") String carId) throws Exception {
        if (StringUtils.isEmpty(carId)) {
            throw new BadRequestException("车辆编码为空.");
        }
        Car car = service.getCar(carId);
        if (car == null) {
            throw new NotFoundException("查询结果为空.");
        }
        return ServiceResult.succeed(car);
    }

    /**
     * 添加车辆信息
     *
     * @param car 车辆信息
     * @return
     */
    @RequestMapping(value = "/customer/car/add", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult add(Car car) throws Exception {
        if (car == null) {
            throw new BadRequestException("车辆信息为空.");
        }
        if (StringUtils.isEmpty(car.getLicenseNumber())) {
            throw new BadRequestException("车牌号为空");
        }

        // 接口对外发布，外部系统传房屋Code不传房屋id，需要将房屋code转成id
        if (StringUtils.isEmpty(car.getHouseId()) && StringUtils.isNotEmpty(car.getHouseCode())) {
            car.setHouseId(service.getHouseIdByCode(car.getHouseCode()));
        }
        service.add(car, getCurrentUser());
        return ServiceResult.succeed(true);
    }


    /**
     * 更新车辆信息
     *
     * @param car
     * @return
     */
    @RequestMapping(value = "/customer/car/{carId}/update", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult update(@PathVariable(value = "carId") String carId, Car car) throws Exception {
        if (StringUtils.isEmpty(carId)) {
            throw new BadRequestException("车辆编码为空.");
        }
        if (car == null) {
            throw new BadRequestException("车辆信息为空.");
        }
        // 接口对外发布，外部系统传房屋Code不传房屋id，需要将房屋code转成id
        if (BuildingTypes.House.equals(car.getBuildingType())) {
            car.setBuildingId(service.getHouseIdByCode(car.getBuildingCode()));
        } else if (BuildingTypes.Carport.equals(car.getBuildingType())) {
            car.setBuildingId(service.getCarportIdByCode(car.getBuildingCode()));
        }
        service.update(car.getCustomerId(), car.getBuildingId(), car.getBuildingType(), carId, car, getCurrentUser());
        return ServiceResult.succeed(true);
    }

    /**
     * 删除客户车辆
     *
     * @param carId
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/customer/car/{carId}/delete", method = RequestMethod.POST)
    @ResponseBody
    public ServiceResult deleted(@PathVariable(value = "carId") String carId) throws Exception {
        if (StringUtils.isEmpty(carId)) {
            throw new BadRequestException("车辆id信息为空.");
        }
        boolean result = false;
        result = service.delete(carId);
        if (result) {
            return ServiceResult.succeed(true);
        } else {
            return ServiceResult.error("删除失败");
        }

    }
}
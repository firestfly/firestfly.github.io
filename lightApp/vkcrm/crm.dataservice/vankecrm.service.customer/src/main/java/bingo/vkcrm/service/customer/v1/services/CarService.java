package bingo.vkcrm.service.customer.v1.services;

import bingo.vkcrm.common.utils.UUIDUtil;
import bingo.vkcrm.service.annotation.OperationLog;
import bingo.vkcrm.service.annotation.OperationType;
import bingo.vkcrm.service.common.User;
import bingo.vkcrm.service.customer.v1.CustomerCommonService;
import bingo.vkcrm.service.customer.v1.models.Car;
import bingo.vkcrm.service.enums.RelationTypes;
import bingo.vkcrm.service.enums.ResourceTypes;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CarService extends CustomerCommonService {
    /**
     * 根据客户id查询客户车辆信息
     *
     * @param customerId
     * @return list<Car> 车辆集合
     */
    public List<Car> queryAllCars(String customerId) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("customerId", customerId);
        return centerRoDao.queryForList(Car.class, "sql.query.cars", parameters);
    }

    /**
     * 根据车辆id查询客户车辆信息
     *
     * @param carId 车辆id
     * @return Car 车辆信息
     */
    public Car getCar(String carId) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("carId", carId);
        return centerRoDao.queryForObject(Car.class, "sql.query.car", parameters);
    }

    /**
     * 添加车辆数据
     *
     * @param car     车辆信息
     * @param creator 记录创建人
     * @return 操作是否成功
     */
    public boolean add(Car car, User creator) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        String uuid = UUIDUtil.create();
        parameters.put("id", uuid);
        parameters.put("customerId", car.getCustomerId());
        parameters.put("licenseNumber", car.getLicenseNumber());
        parameters.put("buyTime", car.getBuyTime());
        parameters.put("brand", car.getBrand());
        parameters.put("color", car.getColor());
        parameters.put("status", car.getStatus());
        parameters.put("user", creator.getName());
        parameters.put("userId", creator.getId());
        if (centerDao.insert("sql.insert.car", parameters) > 0) {
            logRelation2RedisMQ(car.getCustomerId(), car.getHouseId(), uuid, "新增", ResourceTypes.Car.getValue(), RelationTypes.Owner.getCode());
        }
        return true;
    }

    /**
     * 修改车辆信息
     *
     * @param carId    车辆编码
     * @param car      车辆信息
     * @param modifier 记录修改人
     * @return 操作是否成功
     */
    @OperationLog(operationType = OperationType.UpdateEntity, operationName = "修改汽车相关信息", springServiceName = "carService", targetClass = CarService.class, resultClass = Car.class, targetMethod = "getCar", queueKey = "datachangelog.key", idIndex = {0, 1, 2, 3})
    public boolean update(String customerId, String buildingId, String buildingType, String carId, Car car, User modifier) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("id", carId);
        parameters.put("licenseNumber", car.getLicenseNumber());
        parameters.put("buyTime", car.getBuyTime());
        if (null != car.getBrand() && 0 != car.getBrand()) {
            parameters.put("brand", car.getBrand());
        }
        if (null != car.getColor() && 0 != car.getColor()) {
            parameters.put("color", car.getColor());
        }
        if (null != car.getStatus() && 0 != car.getStatus()) {
            parameters.put("status", car.getStatus());
        }
        parameters.put("user", modifier.getName());
        parameters.put("userId", modifier.getId());

        return centerDao.update("sql.update.car", parameters) > 0;
    }

    /**
     * 删除车辆（设isDelete为1）
     *
     * @param carId
     * @return
     */
    public boolean delete(String carId) {
        int result = 0;
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("id", carId);
        result = centerDao.update("sql.delete.car", parameters);
        return result > 0;
    }
}

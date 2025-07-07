package com.example.projectschedulehaircutserver.service.service;

import com.example.projectschedulehaircutserver.dto.ServiceDTO;
import com.example.projectschedulehaircutserver.response.ServiceManagementResponse;
import com.example.projectschedulehaircutserver.response.ShowAllServiceByComboIdResponse;

import java.io.IOException;
import java.util.Set;

public interface ProductService {
    Set<ServiceDTO> findAllService();


    Set<ShowAllServiceByComboIdResponse> findAllServiceByComboId(Integer id);

    Set<ServiceDTO> findAllServiceByCategoryId(Integer categoryId);

    Set<ServiceManagementResponse> getAllServices();

    void createService(ServiceDTO serviceDTO) throws IOException;

    void updateService(ServiceDTO serviceDTO) throws IOException;
    void deleteService(Integer serviceId);
}

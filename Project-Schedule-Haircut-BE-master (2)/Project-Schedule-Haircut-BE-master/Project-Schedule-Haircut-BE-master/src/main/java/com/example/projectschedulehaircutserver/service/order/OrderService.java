package com.example.projectschedulehaircutserver.service.order;

import com.example.projectschedulehaircutserver.dto.OrderDTO;
import com.example.projectschedulehaircutserver.exeption.LoginException;
import com.example.projectschedulehaircutserver.exeption.OrderException;
import com.example.projectschedulehaircutserver.request.ActionOrderByCustomerRequest;
import com.example.projectschedulehaircutserver.request.AllOrderEmployeeAndDateRequest;
import com.example.projectschedulehaircutserver.request.OrderScheduleHaircutRequest;

import java.util.Date;
import java.util.Set;

public interface OrderService {
    String bookingScheduleHaircut(OrderScheduleHaircutRequest request) throws LoginException, OrderException;

    Set<OrderDTO> showOrderByCustomerStatus_0() throws LoginException;

    Set<OrderDTO> showOrderByCustomerStatus_1() throws LoginException;

    Set<OrderDTO> showOrderByCustomerStatus_2() throws LoginException;

    void updateBookingStatus(Integer bookingId, Integer status);

    void cancelBooking(Integer bookingId, Integer status);

    Set<OrderDTO> findAllOrderByEmployeeAndDate(AllOrderEmployeeAndDateRequest request) throws LoginException;

    String ConfirmDoneOrCancelOrderedByCustomer(ActionOrderByCustomerRequest request) throws LoginException;
}

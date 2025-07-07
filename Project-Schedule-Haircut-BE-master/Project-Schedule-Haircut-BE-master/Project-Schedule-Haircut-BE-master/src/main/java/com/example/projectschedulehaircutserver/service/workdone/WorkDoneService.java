package com.example.projectschedulehaircutserver.service.workdone;

import com.example.projectschedulehaircutserver.exeption.LoginException;
import com.example.projectschedulehaircutserver.request.AddWorkDoneInOrderRequest;

public interface WorkDoneService {
    String addWorkDoneInOrder(AddWorkDoneInOrderRequest request) throws LoginException;
}

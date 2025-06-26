package com.example.projectschedulehaircutserver.service.account;

import com.example.projectschedulehaircutserver.response.AccountManagementResponse;

import java.util.List;

public interface AccountService {
    List<AccountManagementResponse> getAllAccounts();

    void changeIsBlockedAccount(Boolean isBlocked, Integer accountId);
}

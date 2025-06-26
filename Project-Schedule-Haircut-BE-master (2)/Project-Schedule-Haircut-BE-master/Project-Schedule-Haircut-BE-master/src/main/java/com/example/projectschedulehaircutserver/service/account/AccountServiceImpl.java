package com.example.projectschedulehaircutserver.service.account;

import com.example.projectschedulehaircutserver.dto.AccountDTO;
import com.example.projectschedulehaircutserver.entity.Account;
import com.example.projectschedulehaircutserver.entity.Customer;
import com.example.projectschedulehaircutserver.repository.AccountRepo;
import com.example.projectschedulehaircutserver.response.AccountManagementResponse;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@AllArgsConstructor
public class AccountServiceImpl implements AccountService {
    private final AccountRepo accountRepo;

    // lấy danh sách tài khoản
    @Override
    public List<AccountManagementResponse> getAllAccounts() {
        try {
            List<Object[]> rawResults = accountRepo.getAllAccountsRaw();
            if (rawResults.isEmpty()) {
                throw new NoSuchElementException("Danh sách tài khoản trống");
            }

            List<AccountManagementResponse> responseList = new ArrayList<>();

            for (Object[] row : rawResults) {
                Long id = toLong(row[0]);
                String type = toString(row[1]);

                AccountDTO accountDTO = AccountDTO.builder()
                        .userName(toString(row[2]))
                        .fullName(toString(row[3]))
                        .age(toInteger(row[4]))
                        .address(toString(row[5]))
                        .phone(toString(row[6]))
                        .email(toString(row[7]))
                        .build();

                String role = toString(row[8]);
                Boolean isBlocked = toBoolean(row[9]);
                List<String> times = toStringList(row[10]);
                Integer bookingCount = toInteger(row[11]);

                AccountManagementResponse response = AccountManagementResponse.builder()
                        .id(id)
                        .type(type)
                        .account(accountDTO)
                        .role(role)
                        .isBlocked(isBlocked)
                        .times(times)
                        .bookingCount(bookingCount)
                        .build();

                responseList.add(response);
            }

            return responseList;
        } catch (DataAccessException e) {
            throw new RuntimeException("Lỗi khi truy vấn danh sách tài khoản", e);
        }
    }

    // khoá hoặc mở khoá tài khoản
    @Override
    public void changeIsBlockedAccount(Boolean isBlocked, Integer accountId) {
        Account account = accountRepo.findAccountById(accountId).orElseThrow(() -> new RuntimeException("Account không tồn tại"));

        account.setIsBlocked(isBlocked);

        accountRepo.save(account);
    }

    private Long toLong(Object obj) {
        return obj != null ? ((Number) obj).longValue() : null;
    }

    private Integer toInteger(Object obj) {
        return obj != null ? ((Number) obj).intValue() : null;
    }

    private String toString(Object obj) {
        return obj != null ? obj.toString() : null;
    }

    private Boolean toBoolean(Object obj) {
        if (obj instanceof Boolean bool) {
            return bool;
        } else if (obj instanceof Number num) {
            return num.intValue() == 1;
        }
        return null;
    }

    private List<String> toStringList(Object obj) {
        return obj != null ? List.of(obj.toString().split(",")) : null;
    }

}
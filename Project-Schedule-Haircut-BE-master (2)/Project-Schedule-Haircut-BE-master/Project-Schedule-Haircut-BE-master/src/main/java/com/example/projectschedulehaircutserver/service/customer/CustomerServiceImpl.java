package com.example.projectschedulehaircutserver.service.customer;

import com.example.projectschedulehaircutserver.dto.CustomerDTO;
import com.example.projectschedulehaircutserver.entity.Account;
import com.example.projectschedulehaircutserver.entity.Customer;
import com.example.projectschedulehaircutserver.entity.Role;
import com.example.projectschedulehaircutserver.exeption.CustomerException;
import com.example.projectschedulehaircutserver.exeption.LoginException;
import com.example.projectschedulehaircutserver.repository.AccountRepo;
import com.example.projectschedulehaircutserver.repository.CustomerRepo;
import com.example.projectschedulehaircutserver.repository.RoleRepo;
import com.example.projectschedulehaircutserver.response.AccountManagementResponse;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;
import java.util.Set;

@Service
@AllArgsConstructor
public class CustomerServiceImpl implements CustomerService{
    private CustomerRepo customerRepo;
    private AccountRepo accountRepo;
    private RoleRepo roleRepo;
    private PasswordEncoder encoder;

    // tạo tài khoản khách hàng
    @Override
    public void createCustomer(CustomerDTO customerDTO) {
        try {
            Role role = roleRepo.findById(2).orElseThrow(() -> new RuntimeException("No roles specified."));

            Account account = Account.builder()
                    .fullName(customerDTO.getFullName())
                    .userName(customerDTO.getUserName())
                    .password(encoder.encode(customerDTO.getPassword()))
                    .age(customerDTO.getAge())
                    .address(customerDTO.getAddress())
                    .role(role)
                    .phone(customerDTO.getPhone())
                    .build();

            Account savedAccount = accountRepo.save(account);

            Customer customer = new Customer();
                customer.setFullName(customerDTO.getFullName());
                customer.setUserName(customerDTO.getUserName());
                customer.setPassword(encoder.encode(customerDTO.getPassword()));
                customer.setRole(role);
                customer.setAge(customerDTO.getAge());
                customer.setAddress(customerDTO.getAddress());
                customer.setPhone(customerDTO.getPhone());
                customer.setIsBlocked(false);
//                customer.setAccount(savedAccount);

                customerRepo.save(customer);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // lấy thông tin tài khoản khách hàng
    @Override
    public CustomerDTO getInformationCustomer(String username) throws CustomerException {
        try {
            Customer customer = customerRepo.findCustomerByUsername(username)
                    .orElseThrow(() -> new CustomerException("Không tìm thấy thông tin khách hàng"));

            return CustomerDTO.builder()
                    .id(customer.getId())
                    .userName(customer.getUsername())
                    .email(customer.getEmail())
                    .phone(customer.getPhone())
                    .address(customer.getAddress())
                    .avatar(customer.getAvatar())
                    .build();
        } catch (CustomerException e) {
            throw e;
        } catch (Exception e) {
            throw new CustomerException("Lỗi khi lấy thông tin khách hàng: " + e.getMessage());
        }
    }

    // cập nhật thông tin tài khoản khách hàng
    @Override
    @Transactional
    public String updateProfileCustomer(CustomerDTO customerDTO) throws LoginException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            try {
                Customer customer = (Customer) authentication.getPrincipal();

                updateCustomerFields(customer, customerDTO);

                customerRepo.save(customer);
                return "Cập nhật thành công";
            } catch (Exception e){
                throw new RuntimeException(e.getMessage());
            }
        } else {
            throw new LoginException("Bạn Chưa Đăng Nhập");
        }
    }


    private void updateCustomerFields(Customer customer, CustomerDTO dto) {
        if (dto.getEmail() != null && !dto.getEmail().isEmpty()) {
            customer.setEmail(dto.getEmail());
        }
        if (dto.getPhone() != null && !dto.getPhone().isEmpty()) {
            customer.setPhone(dto.getPhone());
        }
        if (dto.getAddress() != null && !dto.getAddress().isEmpty()) {
            customer.setAddress(dto.getAddress());
        }
        if (dto.getAvatar() != null && !dto.getAvatar().isEmpty()) {
            customer.setAvatar(dto.getAvatar());
        }
    }

//    private void updateAssociatedAccount(Customer customer, CustomerDTO dto) {
//        Account account = customer.getAccount();
//        if (account != null) {
//            if(dto.getEmail() != null && !dto.getEmail().isEmpty()){
//                account.setEmail(dto.getEmail());
//            }
//            if (dto.getPhone() != null && !dto.getPhone().isEmpty()) {
//                account.setPhone(dto.getPhone());
//            }
//            if (dto.getAddress() != null && !dto.getAddress().isEmpty()) {
//                account.setAddress(dto.getAddress());
//            }
//            if (dto.getAvatar() != null && !dto.getAvatar().isEmpty()) {
//                account.setAvatar(dto.getAvatar());
//            }
//            accountRepo.save(account);
//        }
//    }
}

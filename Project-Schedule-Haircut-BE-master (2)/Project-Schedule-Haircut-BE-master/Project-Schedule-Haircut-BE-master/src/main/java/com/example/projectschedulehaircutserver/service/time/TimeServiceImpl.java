package com.example.projectschedulehaircutserver.service.time;

import com.example.projectschedulehaircutserver.dto.TimeDTO;
import com.example.projectschedulehaircutserver.entity.Employee;
import com.example.projectschedulehaircutserver.entity.Time;
import com.example.projectschedulehaircutserver.repository.EmployeeRepo;
import com.example.projectschedulehaircutserver.repository.TimeRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TimeServiceImpl implements TimeService{
    private final TimeRepo timeRepo;
    private final EmployeeRepo employeeRepo;

    // lấy danh sách khung giờ của nhân viên theo ngày
    @Override
    public Set<TimeDTO> findTimeByEmployeeIdAndOrderDate(Integer employeeId, LocalDate orderDate) {
        Set<Object[]> results = timeRepo.findTimeByEmployeeIdAndOrderDate(employeeId, orderDate);

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        return results.stream()
                .map(obj -> {
                    Integer id = (Integer) obj[0];
                    String timeName = (String) obj[1];
                    Integer isBusy = ((Long) obj[2]).intValue();

                    // Nếu là hôm nay và khung giờ đã qua thì đánh dấu isBusy = 1
                    if (orderDate.equals(today)) {
                        LocalTime timeSlot = LocalTime.parse(timeName); // timeName là dạng "HH:mm"
                        if (timeSlot.isBefore(now)) {
                            isBusy = 1;
                        }
                    }

                    return new TimeDTO(id, timeName, isBusy);
                })
                .sorted(Comparator.comparingInt(TimeDTO::getId))
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    // lấy dánh sách khung giờ
    @Override
    public Set<TimeDTO> findAllTimes() {
        return timeRepo.findAllTimes();
    }

    // thêm khung giờ
    @Override
    @Transactional
    public void addTimeForEmployee(Integer timeId, Integer employeeId) {
        Employee employee = employeeRepo.findById(employeeId).orElseThrow();

        Time time = timeRepo.findById(timeId).orElseThrow();

        // Kiểm tra xem employee đã có khung giờ này chưa
        if (employee.getTimes().contains(time)) {
            throw new RuntimeException("Nhân viên đã có thời gian này rồi");
        }

        // Thêm khung giờ vào nhân viên
        employee.getTimes().add(time);
        time.getEmployees().add(employee);

        // Lưu thay đổi
        employeeRepo.save(employee);
        timeRepo.save(time);
    }


    // xóa khung giờ
    @Override
    @Transactional
    public void removeTimeFromEmployee(Integer timeId, Integer employeeId) {
        Employee employee = employeeRepo.findById(employeeId).orElseThrow();

        Time time = timeRepo.findById(timeId).orElseThrow();
        if (!employee.getTimes().contains(time)) {
            throw new RuntimeException("Nhân viên không có khung giờ này");
        }

        employee.getTimes().remove(time);
        time.getEmployees().remove(employee);

        employeeRepo.save(employee);
        timeRepo.save(time);
    }


}


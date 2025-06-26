package com.example.projectschedulehaircutserver.service.role;

import com.example.projectschedulehaircutserver.dto.RoleDTO;
import com.example.projectschedulehaircutserver.entity.Role;
import com.example.projectschedulehaircutserver.repository.RoleRepo;
import jakarta.persistence.EntityManager;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class RoleServiceImpl implements RoleService{
    private RoleRepo roleRepo;

    @Override
    public void createRole(RoleDTO roleDTO) {
        Role role = Role.builder()
                .name(roleDTO.getName())
                .build();
        roleRepo.save(role);
    }

}

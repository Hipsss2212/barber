package com.example.projectschedulehaircutserver.response;

import com.example.projectschedulehaircutserver.dto.ComboDTO;
import com.example.projectschedulehaircutserver.dto.ServiceDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ServiceAndComboResponse {
    private Set<ServiceDTO> serviceDTOS;
    private Set<ComboDTO> comboDTOS;
}

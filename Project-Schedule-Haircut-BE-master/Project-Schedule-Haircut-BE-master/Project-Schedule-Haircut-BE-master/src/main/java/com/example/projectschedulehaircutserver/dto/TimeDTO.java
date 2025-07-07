package com.example.projectschedulehaircutserver.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TimeDTO {
    private Integer id;
    private String timeName;
    private Integer isBusy;

    public TimeDTO(Integer id, String timeName) {
        this.id = id;
        this.timeName = timeName;
    }
}

package com.example.projectschedulehaircutserver.repository;

import com.example.projectschedulehaircutserver.dto.ComboDTO;
import com.example.projectschedulehaircutserver.entity.Combo;
import com.example.projectschedulehaircutserver.response.ComboManagementResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface ComboRepo extends JpaRepository<Combo, Integer> {
    @Query("select c from Combo c where c.id = :id")
    Combo findComboById(@Param("id") Integer id);

    @Query("select new com.example.projectschedulehaircutserver.dto.ComboDTO(c.id, c.name,  c.image, c.price, c.haircutTime) " +
            "from Combo c")
    Set<ComboDTO> findAllCombo();

    @Query("select c from Combo c")
    List<Combo> findAllCombos();

    @Query("select c from Combo c where c.name = :name")
    Optional<Combo> findComboByName(@Param("name") String name);

    @Query("select new com.example.projectschedulehaircutserver.dto.ComboDTO(c.id, c.name,  c.image, c.price, c.haircutTime) " +
            "from Combo c " +
            "JOIN Category ct ON ct.id = c.category.id " +
            "WHERE ct.id = :categoryId")
    Set<ComboDTO> findAllComboByCategoryId(@Param("categoryId") Integer categoryId);

    @Query("SELECT DISTINCT c FROM Combo c LEFT JOIN FETCH c.services ORDER BY c.id ASC")
    List<Combo> getAllCombos();


    @Query("SELECT COUNT(c) > 0 FROM Combo c WHERE c.name = :name")
    boolean existsByName(@Param("name") String name);
}

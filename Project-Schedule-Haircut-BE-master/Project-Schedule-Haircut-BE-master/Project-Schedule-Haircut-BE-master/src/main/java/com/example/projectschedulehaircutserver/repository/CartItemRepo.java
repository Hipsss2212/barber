package com.example.projectschedulehaircutserver.repository;

import com.example.projectschedulehaircutserver.entity.CartItem;
import com.example.projectschedulehaircutserver.response.CartItemResponse;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.Set;

public interface CartItemRepo extends JpaRepository<CartItem, Integer> {
    @Query("select ci " +
            "from CartItem ci " +
            "where ci.combo.id = :comboId and ci.cart.id = :cartId")
    Optional<CartItem> findCartItemByComboIdAndCartId(@Param("comboId") Integer comboId, @Param("cartId") Integer cartId);

    @Query("select ci " +
            "from CartItem ci " +
            "where ci.service.id = :serviceId and ci.cart.id = :cartId")
    Optional<CartItem> findCartItemByServiceIdAndCartId(@Param("serviceId") Integer serviceId, @Param("cartId") Integer cartId);

    @Query("SELECT new com.example.projectschedulehaircutserver.response.CartItemResponse(" +
            "ci.id, " +
            "COALESCE(c.id, s.id), " +
            "COALESCE(c.name, s.name), " +
            "COALESCE(c.image, s.image), " +
            "COALESCE(c.price, s.price), " +
            "COALESCE(c.haircutTime, s.haircutTime), " +
            "COALESCE(c.category.type, s.category.type) " +
            ") " +
            "FROM CartItem ci " +
            "LEFT JOIN ci.combo c " +
            "LEFT JOIN ci.service s " +
            "LEFT JOIN c.category " +
            "LEFT JOIN s.category " +
            "WHERE ci.cart.id = :cartId")
    Set<CartItemResponse> findCartItemsByCartId(@Param("cartId") Integer cartId);

    @Query("SELECT COUNT(ci) FROM CartItem ci WHERE ci.cart.id = :cartId")
    Integer countByCartId(@Param("cartId") Integer cartId);

    @Modifying
    @Transactional
    @Query("DELETE FROM CartItem ci WHERE ci.cart.id = :cartId")
    void clearCartItemsByCartId(@Param("cartId") Integer cartId);

    @Modifying
    @Query("DELETE FROM CartItem ci WHERE ci.id IN :ids")
    void deleteAllByIdIn(@Param("ids") Set<Integer> ids);
}

package com.example.projectschedulehaircutserver.service.cart;

import com.example.projectschedulehaircutserver.entity.Cart;
import com.example.projectschedulehaircutserver.entity.CartItem;
import com.example.projectschedulehaircutserver.entity.Combo;
import com.example.projectschedulehaircutserver.entity.Customer;
import com.example.projectschedulehaircutserver.exeption.CartItemException;
import com.example.projectschedulehaircutserver.exeption.ComboException;
import com.example.projectschedulehaircutserver.exeption.LoginException;
import com.example.projectschedulehaircutserver.repository.*;
import com.example.projectschedulehaircutserver.request.AddComboInCartItemRequest;
import com.example.projectschedulehaircutserver.request.AddServiceInCartItemRequest;
import com.example.projectschedulehaircutserver.response.CartItemResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;

@Service
@AllArgsConstructor
public class CartServiceImpl implements CartService{
    private final CartRepo cartRepo;
    private final CartItemRepo cartItemRepo;
    private final ComboRepo comboRepo;
    private final ServiceRepo serviceRepo;


    // thêm combo vào giỏ hàng
    @Override
    public String addCartItemInCartTypeCombo(AddComboInCartItemRequest request) throws CartItemException, ComboException, LoginException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)){
            Customer customer = (Customer) authentication.getPrincipal();
            Combo combo = comboRepo.findComboById(request.getComboId());
            Cart cart = cartRepo.findCartByCustomerId(customer.getId()).orElseThrow();
            if (combo.getId() != null && cart.getId() != null){
                Optional<CartItem> isCartItem = cartItemRepo.findCartItemByComboIdAndCartId(request.getComboId(), cart.getId());
                try {
                    if (isCartItem.isPresent()){
                        throw new CartItemException("Bạn Đã Thêm Combo Này Vào Giỏ Hàng");
                    } else {
                        var cartItem = CartItem.builder()
                                .cart(cart)
                                .combo(combo)
                                .service(null)
                                .build();
                        cartItemRepo.save(cartItem);
                    }
                    return "Thêm Combo Vào Giỏ Hàng Thành Công";
                } catch (CartItemException e){
                    throw new CartItemException(e.getMessage());
                }
            } else {
                throw new ComboException("Không Tìm Thấy Combo");
            }
        } else {
            throw new LoginException("Bạn Chưa Đăng Nhập");
        }
    }

    // thêm dịch vụ vào giỏ hàng
    @Override
    public String addCartItemInCartTypeService(AddServiceInCartItemRequest request) throws CartItemException, ComboException, LoginException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)){
            Customer customer = (Customer) authentication.getPrincipal();
            com.example.projectschedulehaircutserver.entity.Service service = serviceRepo.findServiceById(request.getServiceId()).orElseThrow();
            Cart cart = cartRepo.findCartByCustomerId(customer.getId()).orElseThrow();
            if (service.getId() != null && cart.getId() != null){
                Optional<CartItem> isCartItem = cartItemRepo.findCartItemByServiceIdAndCartId(request.getServiceId(), cart.getId());
                try {
                    if (isCartItem.isPresent()){
                        throw new CartItemException("Bạn Đã Thêm Dịch Vụ Này Vào Giỏ Hàng");
                    } else {
                        var cartItem = CartItem.builder()
                                .cart(cart)
                                .combo(null)
                                .service(service)
                                .build();
                        cartItemRepo.save(cartItem);
                    }
                    return "Thêm Dịch Vụ Vào Giỏ Hàng Thành Công";
                } catch (Exception e){
                    throw new CartItemException(e.getMessage());
                }
            } else {
                throw new ComboException("Không Tìm Thấy Dịch Vụ");
            }
        } else {
            throw new LoginException("Bạn Chưa Đăng Nhập");
        }
    }

    // lấy danh sách cart item
    @Override
    public Set<CartItemResponse> getCartItem() throws LoginException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            Customer customer = (Customer) authentication.getPrincipal();
            Cart cart = cartRepo.findCartByCustomerId(customer.getId()).orElseThrow();

            return cartItemRepo.findCartItemsByCartId(cart.getId());
        } else {
            throw new LoginException("Bạn Chưa Đăng Nhập");
        }
    }

    // đếm số lượng dịch vụ trong giỏ hàng
    @Override
    public Integer countCartItem() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            Customer customer = (Customer) authentication.getPrincipal();
            Cart cart = cartRepo.findCartByCustomerId(customer.getId()).orElseThrow();

            return cartItemRepo.countByCartId(cart.getId());
        } else {
            return 0;
        }
    }

    @Override
    @Transactional
    public void deleteCartItem(Set<Integer> cartItemIds) {
        cartItemRepo.deleteAllByIdIn(cartItemIds);
    }


}

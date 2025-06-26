package com.example.projectschedulehaircutserver.service.cart;

import com.example.projectschedulehaircutserver.exeption.CartItemException;
import com.example.projectschedulehaircutserver.exeption.ComboException;
import com.example.projectschedulehaircutserver.exeption.LoginException;
import com.example.projectschedulehaircutserver.request.AddComboInCartItemRequest;
import com.example.projectschedulehaircutserver.request.AddServiceInCartItemRequest;
import com.example.projectschedulehaircutserver.response.CartItemResponse;

import java.util.Set;

public interface CartService {
    String addCartItemInCartTypeCombo(AddComboInCartItemRequest request) throws CartItemException, ComboException, LoginException;

    String addCartItemInCartTypeService(AddServiceInCartItemRequest request) throws CartItemException, ComboException, LoginException;

    Set<CartItemResponse> getCartItem() throws LoginException;

    Integer countCartItem();

    void deleteCartItem(Set<Integer> cartItemIds);
}

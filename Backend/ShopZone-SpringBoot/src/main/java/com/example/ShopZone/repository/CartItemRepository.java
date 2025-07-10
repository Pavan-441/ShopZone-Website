package com.example.ShopZone.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ShopZone.model.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long>{
    List<CartItem> findByCartId(Long cartId);
}

package com.example.ShopZone.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ShopZone.model.Cart;

public interface CartRepository extends JpaRepository<Cart, Long>{
    
}

package com.example.ShopZone.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ShopZone.model.Products;

public interface ProductRepository extends JpaRepository<Products, Long>{

}

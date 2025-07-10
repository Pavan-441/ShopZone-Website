package com.example.dto;
import lombok.Data;

@Data

public class CartItemDTO {
    private Long userId;
    private Long productId;
    private int quantity;

}




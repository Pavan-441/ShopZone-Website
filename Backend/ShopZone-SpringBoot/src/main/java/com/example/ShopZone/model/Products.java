package com.example.ShopZone.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
// import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Products")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Products {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Product name is required")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    private Double price;

    private String imageUrl;

    private String category;

    @OneToMany(mappedBy = "products", cascade = CascadeType.ALL)
    // @JsonManagedReference(value = "product-cartitem")
    @JsonBackReference(value = "product-cartitem")
    private List<CartItem> cartItems;

}

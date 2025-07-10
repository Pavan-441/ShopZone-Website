package com.example.ShopZone.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ShopZone.model.Cart;
import com.example.ShopZone.model.CartItem;
import com.example.ShopZone.model.Products;
import com.example.ShopZone.model.User;
import com.example.ShopZone.service.ShopZoneService;
import com.example.dto.AdminLoginDTO;
import com.example.dto.CartItemDTO;
import com.example.dto.CartItemUpdateDTO;
import com.example.dto.ProductDTO;
import com.example.dto.LoginDTO;
import com.example.dto.RegisterDTO;
// import com.example.dto.UserResponseDTO;

import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:4200")

@RestController
public class ShopZoneController {

    @Autowired
    ShopZoneService service;

    @RequestMapping("/connect")
    public String testing() {
        return "API is running";
    }

    // Register API
    @PostMapping("/register")
    public String registerUser(@RequestBody @Valid RegisterDTO dto) {
        return service.registerUser(dto);
    }

    // Login API
    @PostMapping("/login")
    public String loginUser(@RequestBody @Valid LoginDTO dto) {
        return service.loginUser(dto);
    }

    @PostMapping("/admin")
    public ResponseEntity<Map<String, Object>> loginAdmin(@RequestBody AdminLoginDTO dto) {
        Map<String, Object> response = new HashMap<>();

        if ("admin@shopzone.com".equals(dto.getEmail()) && "admin".equals(dto.getPassword())) {
            response.put("message", "Login successful");
            response.put("role", "ADMIN");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    // Users API's
    // @PostMapping("/users")
    // public String postUserDetails(@RequestBody User user) {
    // return service.postUsers(user);
    // }

    @GetMapping("/users")
    public List<User> getAllUserDetails() {
        return service.getAllUsers();
    }

    @GetMapping("/users/{id}")
    // public User getAllUserDetailsById(@PathVariable Long id){
    // return service.getAllUsersById(id);
    // }

    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        User user = service.getAllUsersById(id);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with ID " + id);
        }
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{id}")
    public String updateUserDetailsById(@PathVariable Long id, @RequestBody User user) {
        return service.updateUserById(id, user);
    }

    @DeleteMapping("/users/{id}")
    public String deleteUserDetailsById(@PathVariable Long id) {
        return service.deleteUserById(id);
    }

    // Products table API's

    @PostMapping("/products")
    public String postProductDetails(@RequestBody ProductDTO dto) {
        return service.postProducts(dto);
    }

    @GetMapping("/products")
    public List<ProductDTO> getAllProducts() {
        return service.getAllProducts();
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<?> getProductDetailsById(@PathVariable Long id) {
        Products product = service.getProductById(id);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found with ID " + id);
        }
        return ResponseEntity.ok(product);
    }

    @PutMapping("/products/{id}")
    public String updateProductDetailsById(@PathVariable Long id, @RequestBody Products product) {
        return service.updateProductById(id, product);
    }

    @DeleteMapping("/products/{id}")
    public String deleteProductDetailsById(@PathVariable Long id) {
        return service.deleteProductById(id);
    }

    // CRUD operations for Cart Table

    // @PostMapping("/cart/{id}")
    // public String postCartDetails(@PathVariable Long id, @RequestBody Cart cart) {
    //     return service.postCart(id, cart);
    // }

    @GetMapping("/cart")
    public List<Cart> getAllCartDetails() {
        return service.getAllCart();
    }

    @GetMapping("/cart/{id}")
    public ResponseEntity<?> getCartDetailsById(@PathVariable Long id) {
        Cart cart = service.getCartById(id);
        if (cart == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("cart not found with cart_id " + id);
        }
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/cart/{id}")
    public String updateCartDetailsById(@PathVariable Long id, @RequestBody Cart cart) {
        return service.updateCartById(id, cart);
    }

    @DeleteMapping("/cart/{id}")
    public String deleteCartDetailsById(@PathVariable Long id) {
        return service.deleteCartById(id);
    }

    // CRUD operations for CartItem Table

    // @PostMapping("/cartitems")
    // public String postCartItems(@RequestBody CartItemDTO dto) {
    // return service.postCartItem(dto);
    // }

    @PostMapping("/cartitems")
    public ResponseEntity<?> postCartItems(@RequestBody CartItemDTO dto) {
        String result = service.postCartItem(dto);
        if (result.contains("not found")) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("{\"message\": \"" + result + "\"}");
        }
        return ResponseEntity.ok("{\"message\": \"" + result + "\"}");
    }

    @GetMapping("/cartitems")
    public List<CartItem> getAllCartItemDetails() {
        return service.getAllCartItems();
    }

    // @GetMapping("/cartitem/{id}")
    // public CartItem getCartItemDetailsById(@PathVariable Long id) {
    //     return service.getCartItemById(id);
    // }

    @GetMapping("/cartitems/user/{userId}")
    public ResponseEntity<?> getCartItemsByUserId(@PathVariable Long userId) {
        List<CartItem> items = service.getCartItemsByUserId(userId);
        // if (items == null || items.isEmpty()) {
        // return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No cart items found
        // for user ID " + userId);
        // }
        return ResponseEntity.ok(items);
    }

    @PutMapping("/cartitem/{id}")
    public String updateCartItemDetailsById(@PathVariable Long id, @RequestBody CartItemUpdateDTO dto) {
        try{
        return service.updateCartItemById(id, dto.getQuantity());
        }catch(Exception e){
            System.err.println("Error updating cart item: " + e.getMessage()); // Fallback to System.err
            return "Error updating cart item: " + e.getMessage();
        }
    }

    @DeleteMapping("/cartitem/{id}")
    public String deleteCartItemDetailsById(@PathVariable Long id) {
        return service.deleteCartItemById(id);
    }

    

}

package com.example.ShopZone.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ControllerAdvice;

import com.example.ShopZone.model.Cart;
import com.example.ShopZone.model.CartItem;
import com.example.ShopZone.model.Products;
import com.example.ShopZone.model.User;
import com.example.ShopZone.repository.CartItemRepository;
import com.example.ShopZone.repository.CartRepository;
import com.example.ShopZone.repository.ProductRepository;
import com.example.ShopZone.repository.UserRepository;
import com.example.dto.CartItemDTO;
import com.example.dto.ProductDTO;
import com.example.dto.LoginDTO;
import com.example.dto.RegisterDTO;

import org.slf4j.Logger;

@Service
@ControllerAdvice
public class ShopZoneService {

    @Autowired
    UserRepository userrepo;

    @Autowired
    ProductRepository productrepo;

    @Autowired
    CartRepository cartrepo;

    @Autowired
    CartItemRepository cartitemrepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final Logger logger = LoggerFactory.getLogger(ShopZoneService.class);

    // Register service - add user to Users
    public String registerUser(RegisterDTO dto) {
        try {
            User user = new User();
            user.setName(dto.getName());
            user.setEmail(dto.getEmail());
            user.setPassword(passwordEncoder.encode(dto.getPassword()));

            Cart cart = new Cart();
            cart.setUser(user);
            user.setCart(cart);

            User savedUser = userrepo.save(user);

            if (savedUser != null) {
                return "Registered Successfully";
            } else {
                return "Error while registering user";
            }

        } catch (Exception e) {
            logger.error("Exception during registration: ", e);
            e.printStackTrace();
            return "Registration failed due to an internal error";
        }
    }

    // Login service - checks credentials and returns string msg
    public String loginUser(LoginDTO dto) {
        try {
            Optional<User> userOpt = userrepo.findByEmail(dto.getEmail());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                if (passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
                    return "Login successful";
                }
            }
            return "Invalid credentials";
        } catch (Exception e) {
            logger.error("Exception occurred in loginUser()", e);
            return "Error during login: " + e.getMessage();
        }
    }

    // User CRUD Operations
    // All CRUD Logics

    // For Get the user logic

    public List<User> getAllUsers() {
        try {
            return userrepo.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch users", e);
        }
    }

    // For Get the user by Id
    public User getAllUsersById(Long id) {
        try {
            return userrepo.findById(id).orElseGet(() -> {
                logger.warn("User with Id {} not found", id);
                return null;
            });
        } catch (Exception e) {
            // e.printStackTrace();
            logger.error("Exception occurred in getAllUsersById()", e);

            return null;
        }
    }

    // For updating the user by id
    public String updateUserById(Long id, User updatedUser) {
        try {
            return userrepo.findById(id).map(existingUser -> {
                existingUser.setName(updatedUser.getName());
                existingUser.setEmail(updatedUser.getEmail());

                if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                    String encodedPassword = passwordEncoder.encode(updatedUser.getPassword());
                    existingUser.setPassword(encodedPassword);
                }

                userrepo.save(existingUser);
                return "Updated successfully";
            }).orElse("User with ID " + id + " not found");
        } catch (Exception e) {
            logger.error("Exception occurred in updateUsersById()", e);
            return "Error updating user: " + e.getMessage();
        }
    }

    // For deleting user by Id
    public String deleteUserById(Long id) {
        try {
            userrepo.deleteById(id);
            return "Deleted Successfully";
        } catch (Exception e) {
            logger.error("Exception occurred in deleting user by id", e);

            // e.printStackTrace();
            return null;
        }
    }

    // Products CRUD Operations
    // Create products
    public String postProducts(ProductDTO dto) {
        try {
            Products product = new Products();
            product.setName(dto.getName());
            product.setDescription(dto.getDescription());
            product.setPrice(dto.getPrice());
            product.setImageUrl(dto.getImageUrl());
            product.setCategory(dto.getCategory());
            productrepo.save(product);
            return "Product added successfully";
        } catch (Exception e) {
            return e.getMessage();
        }
    }

    public List<ProductDTO> getAllProducts() {
        try {
            return productrepo.findAll().stream().map(p -> {
                ProductDTO dto = new ProductDTO();
                dto.setId(p.getId());
                dto.setName(p.getName());
                dto.setDescription(p.getDescription());
                dto.setPrice(p.getPrice());
                dto.setImageUrl(p.getImageUrl());
                dto.setCategory(p.getCategory());
                return dto;
            }).collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // Get product by using id
    public Products getProductById(Long id) {
        try {
            return productrepo.findById(id).orElse(null);
        } catch (Exception e) {
            logger.error("Exception occurred in getProductById()", e);

            // e.printStackTrace();
            return null;
        }
    }

    // Update the product by using id(admin)
    public String updateProductById(Long id, ProductDTO dto) {
        try {
            return productrepo.findById(id).map(existingProduct -> {
                existingProduct.setName(dto.getName());
                existingProduct.setDescription(dto.getDescription());
                existingProduct.setPrice(dto.getPrice());
                existingProduct.setImageUrl(dto.getImageUrl());
                existingProduct.setCategory(dto.getCategory());

                productrepo.save(existingProduct);
                return "Updated Successfully";
            }).orElse("Product with ID " + id + " is not found.");
        } catch (Exception e) {
            e.printStackTrace();
            return "Error occurred";
        }
    }

    // Delete the product by using id
    public String deleteProductById(Long id) {
        try {
            productrepo.deleteById(id);
            return "Deleted Successfully";
        } catch (Exception e) {
            return e.getMessage();
        }
    }

    // Cart CRUD Operations

    // Get all carts from the table

    public List<Cart> getAllCart() {
        try {
            return cartrepo.findAll();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // Get cart from the table by using id
    public Cart getCartById(Long id) {
        try {
            return cartrepo.findById(id).orElse(null);
        } catch (Exception e) {
            logger.error("Exception occured in getCartById()", e);
            e.printStackTrace();
            return null;
        }
    }

    // Update the cart by id
    public String updateCartById(Long id, Cart updatedCart) {
        try {
            return cartrepo.findById(id).map(existingCart -> {
                existingCart.setCartItems(updatedCart.getCartItems());
                existingCart.setUser(updatedCart.getUser());

                cartrepo.save(existingCart);
                return "Updated Successfully";
            }).orElse("Cart not found");
        } catch (Exception e) {
            logger.error("Exception occured in updateCartById()", e);
            // e.printStackTrace();
            return null;
        }
    }

    // Delete cart by id
    public String deleteCartById(Long id) {
        try {
            cartrepo.deleteById(id);
            return "Deleted Successfully";
        } catch (Exception e) {
            logger.error("Exception occured in deleteCartById()", e);
            return e.getMessage();
        }

    }

    // CartItem CRUD Operations

    // Create cart item
    public String postCartItem(CartItemDTO dto) {
        try {
            User user = userrepo.findById(dto.getUserId()).orElse(null);
            if (user == null || user.getCart() == null) {
                return "User or Cart not found";
            }

            Cart cart = user.getCart();
            Products product = productrepo.findById(dto.getProductId()).orElse(null);
            if (product == null) {
                return "Product not found with id: " + dto.getProductId();
            }

            // Check if the item already exists in cart
            CartItem existingCartItem = cart.getCartItems() != null
                    ? cart.getCartItems().stream()
                            .filter(item -> item.getProducts().getId().equals(dto.getProductId()))
                            .findFirst()
                            .orElse(null)
                    : null;

            if (existingCartItem != null) {
                existingCartItem.setQuantity(existingCartItem.getQuantity() + dto.getQuantity());
                cartitemrepo.save(existingCartItem);
                return "Quantity updated successfully";
            } else {
                CartItem cartItem = new CartItem();
                cartItem.setCart(cart);
                cartItem.setProducts(product);
                cartItem.setQuantity(dto.getQuantity());

                if (cart.getCartItems() == null)
                    cart.setCartItems(new ArrayList<>());
                cart.getCartItems().add(cartItem);

                if (product.getCartItems() == null)
                    product.setCartItems(new ArrayList<>());
                product.getCartItems().add(cartItem);

                cartitemrepo.save(cartItem);
                return "Product added to cart successfully";
            }

        } catch (Exception e) {
            logger.error("Exception in postCartItem()", e);
            return e.getMessage();
        }
    }

    // Get all cartItems from the table
    public List<CartItem> getAllCartItems() {
        try {
            return cartitemrepo.findAll();
        } catch (Exception e) {
            logger.error("Exception occured in getAllCartItems()", e);
            // e.printStackTrace();
            return null;
        }
    }

    // Get cart items by id
    public List<CartItem> getCartItemsByUserId(Long userId) {
        User user = userrepo.findById(userId).orElse(null);
        if (user == null || user.getCart() == null) {
            return new ArrayList<>();
        }
        Long cartId = user.getCart().getId();
        return cartitemrepo.findByCartId(cartId);
    }

    // update cart items by id
    public String updateCartItemById(Long id, int quantity) {
        try {
            return cartitemrepo.findById(id).map(existingCartItem -> {
                existingCartItem.setQuantity(quantity);

                cartitemrepo.save(existingCartItem);
                return "CartItem quantity updated Successfully";
            }).orElse("CartItem not found");
        } catch (Exception e) {
            logger.error("Exception occured in updateCartItemById()", e);
            // e.printStackTrace();
            System.err.println("Exception occurred in updateCartItemById(): " + e.getMessage());
            return e.getMessage();
        }
    }

    // Delete cart items by id
    public String deleteCartItemById(Long id) {
        try {
            cartitemrepo.deleteById(id);
            return "Deleted Successfully";
        } catch (Exception e) {
            logger.error("Exception occured in deleteCartItemById()", e);
            return e.getMessage();
        }

    }
}

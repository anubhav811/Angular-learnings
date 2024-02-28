package com.anubhav.ecommerce.controller;

import com.anubhav.ecommerce.dto.Purchase;
import com.anubhav.ecommerce.dto.PurchaseResponse;
import com.anubhav.ecommerce.service.CheckoutService;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/checkout")
public class CheckoutController {

    private CheckoutService checkoutService;

    public CheckoutController(CheckoutService theCheckoutService){
        checkoutService = theCheckoutService;
    }

    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase){
        PurchaseResponse purchaseResponse = checkoutService.placeOrder(purchase);
        return purchaseResponse;
    }
}

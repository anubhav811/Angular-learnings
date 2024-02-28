package com.anubhav.ecommerce.service;

import com.anubhav.ecommerce.dto.Purchase;
import com.anubhav.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
}

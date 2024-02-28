package com.anubhav.ecommerce.dto;

import com.anubhav.ecommerce.entity.Address;
import com.anubhav.ecommerce.entity.Customer;
import com.anubhav.ecommerce.entity.Order;
import com.anubhav.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {
    private Customer customer ;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}

package com.anubhav.ecommerce.service;

import com.anubhav.ecommerce.dao.CustomerRepository;
import com.anubhav.ecommerce.dto.Purchase;
import com.anubhav.ecommerce.dto.PurchaseResponse;
import com.anubhav.ecommerce.entity.Customer;
import com.anubhav.ecommerce.entity.Order;
import com.anubhav.ecommerce.entity.OrderItem;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService{

    private CustomerRepository customerRepository;

    public CheckoutServiceImpl(CustomerRepository theCustomerRepository){
        this.customerRepository = theCustomerRepository;
    }
    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {
        // retrieve the order info from dto
        Order order = purchase.getOrder();
        // generate tracking number
        String orderTrackingNumber  = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);
        // populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(order::add); // or forEach(order-> order.add(item))

        // populate order with billingAddress and ShippingAddress;
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        //populate Customer with Order
        Customer customer = purchase.getCustomer();
        customer.add(order);

        // save to db
        customerRepository.save(customer);

        // return a response
        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {
        return UUID.randomUUID().toString();
    }
}

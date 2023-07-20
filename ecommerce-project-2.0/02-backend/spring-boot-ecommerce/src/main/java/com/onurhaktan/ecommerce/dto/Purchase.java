package com.onurhaktan.ecommerce.dto;

import com.onurhaktan.ecommerce.entity.Address;
import com.onurhaktan.ecommerce.entity.Customer;
import com.onurhaktan.ecommerce.entity.Order;
import com.onurhaktan.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Order order;
    private Address billingAddress;
    private Address shippingAddress;
    private Set<OrderItem> orderItems;

}

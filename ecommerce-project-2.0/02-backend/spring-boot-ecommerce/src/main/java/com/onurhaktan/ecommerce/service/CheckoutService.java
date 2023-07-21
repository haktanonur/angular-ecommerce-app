package com.onurhaktan.ecommerce.service;

import com.onurhaktan.ecommerce.dto.Purchase;
import com.onurhaktan.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);

}

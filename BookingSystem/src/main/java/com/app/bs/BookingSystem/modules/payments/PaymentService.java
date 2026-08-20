package com.app.bs.BookingSystem.modules.payments;

import com.app.bs.BookingSystem.modules.bookings.BookingService;
import java.math.BigDecimal;

import org.json.JSONObject;
import org.springframework.stereotype.Service;

import com.app.bs.BookingSystem.config.RazorPayProperties;
import com.app.bs.BookingSystem.modules.bookings.Booking;
import com.app.bs.BookingSystem.modules.payments.DTO.CreateOrderResponseDto;
import com.app.bs.BookingSystem.modules.payments.DTO.VerifyPaymentRequestDto;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final RazorpayClient razorpayClient;
    private final PaymentRepository paymentRepository;
    private final RazorPayProperties razorPayProperties;

    public CreateOrderResponseDto createOrder(Booking booking) throws RazorpayException {
        int amountInPaise = booking.getTotalAmount()
                .multiply(BigDecimal.valueOf(100))
                .intValueExact();

        JSONObject options = new JSONObject();
        options.put("amount", amountInPaise);
        options.put("currency", "INR");
        options.put("receipt", booking.getId().toString());

        Order order = razorpayClient.orders.create(options);

        createPayment(order, booking);

        CreateOrderResponseDto createOrderResponseDto = new CreateOrderResponseDto();
        createOrderResponseDto.setBookingId(booking.getId());
        createOrderResponseDto.setKeyId(razorPayProperties.getKeyId());
        createOrderResponseDto.setOrderId(order.get("id").toString());
        createOrderResponseDto.setAmount(amountInPaise);
        return createOrderResponseDto;
    }

    private Payment createPayment(Order order, Booking booking) {
        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setRazorPayOrderId(order.get("id").toString());
        payment.setPaymentStatus(PaymentStatus.PROCESSING);
        paymentRepository.save(payment);
        return payment;
    }

    @Transactional
    public boolean verifyPayment(VerifyPaymentRequestDto dto) {
        Payment payment = paymentRepository.findByRazorPayOrderId(dto.getRazorpayOrderId());
        if (payment == null || !payment.getBooking().getId().equals(dto.getBookingId())) {
            return false; 
        }

        String payload = dto.getRazorpayOrderId()
                + "|"
                + dto.getRazorpayPaymentId();

        try {

            boolean signatureIsValid = Utils.verifySignature(
                    payload,
                    dto.getRazorpaySignature(),
                    razorPayProperties.getKeySecret());

            if (signatureIsValid) {

                payment.setRazorPayPaymentId(
                        dto.getRazorpayPaymentId());

                payment.setPaymentStatus(PaymentStatus.SUCCESS);
            }else{
                payment.setPaymentStatus(PaymentStatus.FAILED);
            }

            return signatureIsValid;

        } catch (RazorpayException e) {

            throw new RuntimeException(
                    "Razorpay signature verification failed", e);
        }
    }

    public void refundPayment(Booking booking) {
    Payment payment = paymentRepository.findByBooking(booking);

    if (payment == null || payment.getPaymentStatus() != PaymentStatus.SUCCESS) {
        // nothing was actually captured for this booking — nothing to refund
        return;
    }

    try {
        JSONObject options = new JSONObject();
        options.put("amount", booking.getTotalAmount()
                .multiply(BigDecimal.valueOf(100))
                .intValueExact()); // full refund, in paise
        options.put("speed", "normal");

        razorpayClient.payments.refund(payment.getRazorPayPaymentId(), options);

        payment.setPaymentStatus(PaymentStatus.REFUND);
        paymentRepository.save(payment);

    } catch (RazorpayException e) {
        throw new RuntimeException("Refund failed for booking " + booking.getId(), e);
    }
}

}
import 'package:payhere_mobilesdk_flutter/payhere_mobilesdk_flutter.dart';

class PayHereService {
  static void pay({
    required String orderId,
    required double amount,
  }) {
    Map<String, dynamic> paymentObject = {
      // Sandbox
      "sandbox": true,

      // Merchant Details
      "merchant_id": "1235501",

      // Replace this with the Merchant Secret generated for your Android app
      // (PayHere Dashboard → Integrations → Add App)
      "merchant_secret": "MjUyOTk4MTI4NTUxODc2NTg1NDY0MDQ4OTE4OTE2NjMyNDYwODU=",

      // Your backend notify URL (must be publicly accessible)
      "notify_url": "https://YOUR_DOMAIN/api/payments/notify",

      // Payment Details
      "order_id": orderId,
      "items": "Traffic Fine Payment",
      "amount": amount.toStringAsFixed(2),
      "currency": "LKR",

      // Customer Details
      "first_name": "Driver",
      "last_name": "User",
      "email": "driver@test.com",
      "phone": "0771234567",
      "address": "Colombo",
      "city": "Colombo",
      "country": "Sri Lanka",

      // Optional
      "delivery_address": "Colombo",
      "delivery_city": "Colombo",
      "delivery_country": "Sri Lanka",

      "custom_1": "",
      "custom_2": "",
    };

    PayHere.startPayment(
      paymentObject,
          (paymentId) {
        print("Payment Success: $paymentId");
      },
          (error) {
        print("Payment Failed: $error");
      },
          () {
        print("Payment Cancelled");
      },
    );
  }
}
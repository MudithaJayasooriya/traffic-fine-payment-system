import 'package:flutter/material.dart';
import 'package:payhere_mobilesdk_flutter/payhere_mobilesdk_flutter.dart';

import '../../models/fine.dart';
import '../../services/fine_service.dart';
// pay_fine_screen.dart import removed — no longer needed


class FineDetailsScreen extends StatefulWidget {

  final Fine fine;
  final VoidCallback onPaymentComplete;

  const FineDetailsScreen({
    super.key,
    required this.fine,
    required this.onPaymentComplete,
  });

  @override
  State<FineDetailsScreen> createState() => _FineDetailsScreenState();
}


class _FineDetailsScreenState extends State<FineDetailsScreen> {

  final FineService _fineService = FineService();
  bool _isProcessing = false;

  Future<void> _handlePayHerePayment() async {
    setState(() => _isProcessing = true);

    try {
      // 1. Get merchant params from backend
      final paymentData = await _fineService.initiatePayment(
        widget.fine.referenceNumber,
        widget.fine.amount,
        widget.fine.id,
      );

      if (paymentData == null) throw Exception("Unable to initialize payment");

      // 2. Build PayHere payment object
      Map payHereObject = {
        "sandbox": true,
        "merchant_id": paymentData["merchant_id"],
        "merchant_secret": paymentData["merchant_secret"],
        "notify_url": paymentData["notify_url"],
        "order_id": paymentData["order_id"],
        "items": "Traffic Fine ${widget.fine.referenceNumber}",
        "amount": widget.fine.amount.toStringAsFixed(2),
        "currency": "LKR",
        "first_name": paymentData["first_name"] ?? "Driver",
        "last_name": paymentData["last_name"] ?? "User",
        "email": paymentData["email"] ?? "driver@example.com",
        "phone": paymentData["phone"] ?? "0771234567",
        "address": paymentData["address"] ?? "Main Road",
        "city": paymentData["city"] ?? "Colombo",
        "country": "Sri Lanka",
        "custom_1": widget.fine.referenceNumber,
        "custom_2": "",
      };

      setState(() => _isProcessing = false);

      // 3. Start PayHere SDK
      PayHere.startPayment(
        payHereObject,

        // SUCCESS
            (paymentId) async {
          debugPrint("Payment Success. PayHere ID: $paymentId");

          // Update fine status to PAID in backend directly
          final success = await _fineService.markFineAsPaid(
            widget.fine.referenceNumber,
          );

          if (success) {
            if (context.mounted) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text("Payment successful!"),
                  backgroundColor: Colors.green,
                ),
              );
              widget.onPaymentComplete(); // refresh fine list
              Navigator.pop(context);
            }
          } else {
            if (context.mounted) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text("Payment done but status update failed. Contact support."),
                  backgroundColor: Colors.orange,
                ),
              );
            }
          }
        },

        // FAILED
            (error) {
          debugPrint("Payment Failed: $error");
          if (context.mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text("Payment failed: $error"),
                backgroundColor: Colors.red,
              ),
            );
          }
        },

        // DISMISSED
            () {
          debugPrint("Payment dismissed by user");
          if (context.mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text("Payment cancelled.")),
            );
          }
        },
      );

    } catch (e) {
      setState(() => _isProcessing = false);
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Error: $e")),
        );
      }
    }
  }


  @override
  Widget build(BuildContext context) {

    final bool isPaid =
        widget.fine.status.toUpperCase() == "PAID" ||
            widget.fine.status.toUpperCase() == "SUCCESS";

    return Scaffold(
      appBar: AppBar(
        title: const Text("Fine Details"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [

            Text(
              "Reference : ${widget.fine.referenceNumber}",
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),

            const SizedBox(height: 25),

            _detail("Category",  widget.fine.categoryName),
            _detail("Officer ID", widget.fine.officerId.toString()),
            _detail("Driver ID",  widget.fine.driverId.toString()),
            _detail("Status",     widget.fine.status),

            const Spacer(),

            Text(
              "Amount",
              style: TextStyle(color: Colors.grey[600]),
            ),

            Text(
              "LKR ${widget.fine.amount.toStringAsFixed(2)}",
              style: const TextStyle(
                fontSize: 30,
                color: Colors.red,
                fontWeight: FontWeight.bold,
              ),
            ),

            const SizedBox(height: 25),

            SizedBox(
              width: double.infinity,
              height: 55,
              child: ElevatedButton(
                onPressed: (isPaid || _isProcessing)
                    ? null
                    : _handlePayHerePayment,
                child: _isProcessing
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text(
                  "PAY NOW",
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),

          ],
        ),
      ),
    );
  }


  Widget _detail(String title, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title, style: const TextStyle(color: Colors.grey)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
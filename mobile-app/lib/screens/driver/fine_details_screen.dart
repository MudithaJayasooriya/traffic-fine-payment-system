import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:payhere_mobilesdk_flutter/payhere_mobilesdk_flutter.dart';

import '../../models/fine.dart';
import '../../services/fine_service.dart';

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

  Future<void> _completePaymentSuccess() async {
    final success = await _fineService.markFineAsPaid(
      widget.fine.referenceNumber,
    );

    if (!mounted) return;

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Payment successful!"),
          backgroundColor: Colors.green,
        ),
      );
      widget.onPaymentComplete(); // refresh fine list
      Navigator.pop(context);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Payment recorded but status update failed."),
          backgroundColor: Colors.orange,
        ),
      );
    }
  }

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

      // Web/Desktop Fallback: PayHere Flutter SDK only supports native Android/iOS
      if (kIsWeb) {
        if (!mounted) return;
        showDialog(
          context: context,
          builder: (ctx) => AlertDialog(
            title: const Text("PayHere Web Checkout"),
            content: Text(
              "PayHere Mobile SDK is designed for Android/iOS devices.\n\n"
              "Simulate successful payment for Fine #${widget.fine.referenceNumber} (LKR ${widget.fine.amount})?",
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(ctx),
                child: const Text("Cancel"),
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
                onPressed: () {
                  Navigator.pop(ctx);
                  _completePaymentSuccess();
                },
                child: const Text("Confirm Payment", style: TextStyle(color: Colors.white)),
              ),
            ],
          ),
        );
        return;
      }

      // 3. Start PayHere Native SDK on Mobile Android / iOS
      PayHere.startPayment(
        payHereObject,

        // SUCCESS
        (paymentId) async {
          debugPrint("Payment Success. PayHere ID: $paymentId");
          await _completePaymentSuccess();
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
          debugPrint("Payment Dismissed");
        },
      );
    } catch (e) {
      setState(() => _isProcessing = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Payment error: $e"),
            backgroundColor: Colors.red,
          ),
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
      backgroundColor: const Color(0xFF021022),
      appBar: AppBar(
        backgroundColor: const Color(0xFF07223A),
        title: const Text("Fine Ticket Details", style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFFFF6EA))),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Color(0xFF9FCAFF)),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Ref Header Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF07223A),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFF164E70)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.3),
                    blurRadius: 20,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        "TRAFFIC FINE TICKET",
                        style: TextStyle(
                          fontSize: 11,
                          letterSpacing: 2,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFFD7A46B),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                        decoration: BoxDecoration(
                          color: isPaid
                              ? const Color(0xFF1FC97A).withOpacity(0.2)
                              : const Color(0xFFFF8A4D).withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: isPaid
                                ? const Color(0xFF1FC97A).withOpacity(0.5)
                                : const Color(0xFFFF8A4D).withOpacity(0.5),
                          ),
                        ),
                        child: Text(
                          isPaid ? 'PAID' : 'UNPAID',
                          style: TextStyle(
                            color: isPaid ? const Color(0xFF1FC97A) : const Color(0xFFFF8A4D),
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    widget.fine.referenceNumber,
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFFFFF6EA),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Fine Details Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF062033),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFF1F4F78).withOpacity(0.6)),
              ),
              child: Column(
                children: [
                  _detail("Offence Category", widget.fine.categoryName),
                  const Divider(color: Color(0xFF1F4F78), height: 24),
                  _detail("Issuing Officer ID", widget.fine.officerId.toString()),
                  const Divider(color: Color(0xFF1F4F78), height: 24),
                  _detail("Driver ID", widget.fine.driverId.toString()),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Amount Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF072B46),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFF4AA3FF).withOpacity(0.4)),
              ),
              child: Column(
                children: [
                  const Text(
                    "Total Fine Amount Payable",
                    style: TextStyle(color: Color(0xFFAACDE9), fontSize: 13),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    "LKR ${widget.fine.amount.toStringAsFixed(2)}",
                    style: const TextStyle(
                      fontSize: 32,
                      color: Color(0xFF4AA3FF),
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 28),

            SizedBox(
              width: double.infinity,
              height: 54,
              child: ElevatedButton(
                onPressed: (isPaid || _isProcessing)
                    ? null
                    : _handlePayHerePayment,
                style: ElevatedButton.styleFrom(
                  backgroundColor: isPaid ? const Color(0xFF164E70) : const Color(0xFF4AA3FF),
                  foregroundColor: const Color(0xFF021022),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: _isProcessing
                    ? const SizedBox(
                        height: 22,
                        width: 22,
                        child: CircularProgressIndicator(color: Color(0xFF021022), strokeWidth: 2.5),
                      )
                    : Text(
                        isPaid ? "FINE PAID" : "PAY NOW VIA PAYHERE",
                        style: const TextStyle(
                          fontSize: 16,
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
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title, style: const TextStyle(color: Color(0xFFAACDE9), fontSize: 14)),
        Flexible(
          child: Text(
            value,
            textAlign: TextAlign.end,
            style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFFFF6EA), fontSize: 14),
          ),
        ),
      ],
    );
  }
}
import 'package:flutter/material.dart';
import '../../models/fine.dart';
import '../../services/fine_service.dart';

class FinePaymentScreen extends StatefulWidget {
  final Fine fine;
  final VoidCallback onPaymentComplete;

  const FinePaymentScreen({super.key, required this.fine, required this.onPaymentComplete});

  @override
  State<FinePaymentScreen> createState() => _FinePaymentScreenState();
}

class _FinePaymentScreenState extends State<FinePaymentScreen> {
  final FineService _fineService = FineService();
  bool _isProcessing = false;

  Future<void> _handlePayment() async {
    setState(() => _isProcessing = true);

    final paymentParams = await _fineService.initiatePayment(
        widget.fine.referenceNumber,
        widget.fine.amount,
      widget.fine.id,
    );

    setState(() => _isProcessing = false);

    if (paymentParams != null) {
      showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
          title: const Text('PayHere Secure Checkout'),
          content: Text('Order ID: ${paymentParams['order_id']}\nAmount: LKR ${paymentParams['amount']}\n\nProceed to simulate gateway capture callback.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Payment Succeeded! Status synchronized & Officer notified.')),
                );
                widget.onPaymentComplete();
                Navigator.pop(context);
              },
              child: const Text('Simulate Success'),
            ),
          ],
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Could not initialize checkout window.')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Settle Fine Amount')),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Reference Code: ${widget.fine.referenceNumber}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const Divider(height: 32),
            Text('Violation Type: ${widget.fine.categoryName}', style: const TextStyle(fontSize: 16)),
            const SizedBox(height: 10),
            Text('Traffic Officer ID: ${widget.fine.officerId}', style: const TextStyle(fontSize: 16)),
            const SizedBox(height: 10),
            Text('Current Status: ${widget.fine.status}', style: const TextStyle(fontSize: 16, color: Colors.amber)),
            const Spacer(),
            Text('Total Amount Due: LKR ${widget.fine.amount}', style: const TextStyle(fontSize: 22, color: Colors.red, fontWeight: FontWeight.bold)),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
                onPressed: _isProcessing ? null : _handlePayment,
                child: _isProcessing
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text('Pay via PayHere Gateway', style: TextStyle(fontSize: 16, color: Colors.white)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
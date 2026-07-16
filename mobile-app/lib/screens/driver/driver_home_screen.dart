import 'package:flutter/material.dart';
import '../../models/fine.dart';
import '../../services/fine_service.dart';
import 'fine_details_screen.dart';

class DriverHomeScreen extends StatefulWidget {
  const DriverHomeScreen({super.key});

  @override
  State<DriverHomeScreen> createState() => _DriverHomeScreenState();
}

class _DriverHomeScreenState extends State<DriverHomeScreen> {
  final FineService _fineService = FineService();
  List<Fine> _fines = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadFines();
  }

  Future<void> _loadFines() async {
    setState(() => _isLoading = true);

    // Call with empty parentheses matching your updated token-aware signature
    final fines = await _fineService.getDriverFines();

    setState(() {
      _fines = fines;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    // TAB 1 FILTER: Matches your exact backend status "NOT_PAID" from Postman
    final activeFines = _fines.where((fine) {
      final status = fine.status.toUpperCase();
      return status == 'NOT_PAID' || status == 'PENDING';
    }).toList();

    // TAB 2 FILTER: Show it in History if the payment was successful
    final paymentHistory = _fines.where((fine) {
      final status = fine.status.toUpperCase();
      return status == 'SUCCESS' || status == 'PAID';
    }).toList();

    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('My Traffic Fines Dashboard'),
          actions: [
            IconButton(
              icon: const Icon(Icons.refresh),
              onPressed: _loadFines,
            ),
          ],
          bottom: const TabBar(
            tabs: [
              Tab(icon: Icon(Icons.gavel), text: "My Fines"),
              Tab(icon: Icon(Icons.history), text: "Payment History"),
            ],
          ),
        ),
        body: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : TabBarView(
          children: [
            _buildFinesTab(activeFines),
            _buildHistoryTab(paymentHistory),
          ],
        ),
      ),
    );
  }

  Widget _buildFinesTab(List<Fine> activeFines) {
    if (activeFines.isEmpty) {
      return const Center(
        child: Text('No active traffic fines found.', style: TextStyle(fontSize: 16)),
      );
    }

    return ListView.builder(
      itemCount: activeFines.length,
      itemBuilder: (context, index) {
        final fine = activeFines[index];
        return Card(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          elevation: 2,
          child: ListTile(
            title: Text(fine.categoryName, style: const TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text('Ref: ${fine.referenceNumber}\nAmount: LKR ${fine.amount.toStringAsFixed(2)}'),
            trailing: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.redAccent,
                foregroundColor: Colors.white,
              ),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => FineDetailsScreen(
                      fine: fine,
                      onPaymentComplete: _loadFines,
                    ),
                  ),
                );
              },
              child: const Text('Pay'),
            ),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => FineDetailsScreen(
                    fine: fine,
                    onPaymentComplete: _loadFines,
                  ),
                ),
              );
            },
          ),
        );
      },
    );
  }

  Widget _buildHistoryTab(List<Fine> paymentHistory) {
    if (paymentHistory.isEmpty) {
      return const Center(
        child: Text('No payment history records found.', style: TextStyle(fontSize: 16)),
      );
    }

    return ListView.builder(
      itemCount: paymentHistory.length,
      itemBuilder: (context, index) {
        final fine = paymentHistory[index];
        return Card(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          elevation: 1,
          color: Colors.green.withOpacity(0.05),
          child: ListTile(
            leading: const Icon(Icons.check_circle, color: Colors.green, size: 36),
            title: Text(fine.categoryName, style: const TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text('Ref: ${fine.referenceNumber}\nAmount Paid: LKR ${fine.amount.toStringAsFixed(2)}'),
            trailing: Text(
              fine.status.toUpperCase(),
              style: const TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 14),
            ),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => FineDetailsScreen(
                    fine: fine,
                    onPaymentComplete: _loadFines,
                  ),
                ),
              );
            },
          ),
        );
      },
    );
  }
}
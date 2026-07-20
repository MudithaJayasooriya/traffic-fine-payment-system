import 'package:flutter/material.dart';
import '../../models/fine.dart';
import '../../services/fine_service.dart';
import '../../services/api_service.dart';
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

  Future<void> _handleLogout() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text("Logout"),
        content: const Text("Are you sure you want to log out?"),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text("Cancel"),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text("Logout", style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );

    if (confirm == true) {
      await ApiService.logout();
      if (!mounted) return;
      Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
    }
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
          backgroundColor: const Color(0xFF07223A),
          title: const Text('Driver Fines Portal', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFFFF6EA))),
          actions: [
            IconButton(
              icon: const Icon(Icons.person, color: Color(0xFF4AA3FF)),
              tooltip: 'My Profile',
              onPressed: () {
                Navigator.pushNamed(context, '/profile');
              },
            ),
            IconButton(
              icon: const Icon(Icons.refresh, color: Color(0xFF9FCAFF)),
              tooltip: 'Refresh',
              onPressed: _loadFines,
            ),
            IconButton(
              icon: const Icon(Icons.logout, color: Color(0xFFFF8A8A)),
              tooltip: 'Logout',
              onPressed: _handleLogout,
            ),
          ],
          bottom: const TabBar(
            indicatorColor: Color(0xFF4AA3FF),
            indicatorWeight: 3,
            labelColor: Color(0xFF4AA3FF),
            unselectedLabelColor: Color(0xFFAACDE9),
            tabs: [
              Tab(icon: Icon(Icons.gavel), text: "My Fines"),
              Tab(icon: Icon(Icons.history), text: "Payment History"),
            ],
          ),
        ),
        body: _isLoading
            ? const Center(child: CircularProgressIndicator(color: Color(0xFF4AA3FF)))
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
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.check_circle_outline, size: 64, color: Color(0xFF1FC97A)),
            SizedBox(height: 12),
            Text('No active traffic fines found.', style: TextStyle(fontSize: 16, color: Color(0xFFEAF6FF))),
            SizedBox(height: 4),
            Text('You have a clean driving record!', style: TextStyle(fontSize: 13, color: Color(0xFFAACDE9))),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: activeFines.length,
      itemBuilder: (context, index) {
        final fine = activeFines[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 14),
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: const Color(0xFF07223A),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFF1F4F78)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.3),
                blurRadius: 16,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      fine.categoryName,
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFFFFF6EA)),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFF8A4D).withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFFF8A4D).withOpacity(0.5)),
                    ),
                    child: const Text(
                      'UNPAID',
                      style: TextStyle(color: Color(0xFFFF8A4D), fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Text('Ref: ${fine.referenceNumber}', style: const TextStyle(color: Color(0xFFAACDE9), fontSize: 13)),
              const SizedBox(height: 4),
              Text(
                'Amount: LKR ${fine.amount.toStringAsFixed(2)}',
                style: const TextStyle(color: Color(0xFF4AA3FF), fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 14),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF4AA3FF),
                    foregroundColor: const Color(0xFF021022),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
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
                  child: const Text('View & Pay Fine', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildHistoryTab(List<Fine> paymentHistory) {
    if (paymentHistory.isEmpty) {
      return const Center(
        child: Text('No payment history records found.', style: TextStyle(fontSize: 16, color: Color(0xFFAACDE9))),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: paymentHistory.length,
      itemBuilder: (context, index) {
        final fine = paymentHistory[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 14),
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: const Color(0xFF062033),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFF1F4F78).withOpacity(0.6)),
          ),
          child: ListTile(
            contentPadding: EdgeInsets.zero,
            leading: Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: const Color(0xFF1FC97A).withOpacity(0.15),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.check_circle, color: Color(0xFF1FC97A), size: 28),
            ),
            title: Text(fine.categoryName, style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFEAF6FF))),
            subtitle: Text(
              'Ref: ${fine.referenceNumber}\nPaid: LKR ${fine.amount.toStringAsFixed(2)}',
              style: const TextStyle(color: Color(0xFFAACDE9), height: 1.4),
            ),
            trailing: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFF1FC97A).withOpacity(0.2),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFF1FC97A).withOpacity(0.5)),
              ),
              child: const Text(
                'PAID',
                style: TextStyle(color: Color(0xFF1FC97A), fontSize: 11, fontWeight: FontWeight.bold),
              ),
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
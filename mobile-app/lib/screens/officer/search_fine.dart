import 'package:flutter/material.dart';
import '../../services/fine_service.dart';
import '../../models/fine.dart';

class SearchFineScreen extends StatefulWidget {
  const SearchFineScreen({super.key});

  @override
  State<SearchFineScreen> createState() => _SearchFineScreenState();
}

class _SearchFineScreenState extends State<SearchFineScreen> {
  final controller = TextEditingController();
  final FineService service = FineService();
  Fine? fine;
  bool hasSearched = false;

  void search() async {
    FocusScope.of(context).unfocus();
    final result = await service.searchFine(controller.text);
    setState(() {
      fine = result;
      hasSearched = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF021022),
      appBar: AppBar(
        elevation: 0,
        backgroundColor: const Color(0xFF07223A),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Color(0xFF9FCAFF)),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text("Search Traffic Fines", style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFFFF6EA))),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            // Modern Search Bar Layout
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: controller,
                    style: const TextStyle(color: Color(0xFFEAF6FF)),
                    decoration: InputDecoration(
                      hintText: "Enter Fine Reference (e.g. FINE-XXXX)",
                      prefixIcon: const Icon(Icons.search, color: Color(0xFF5AA3FF)),
                      filled: true,
                      fillColor: const Color(0xFF06223B),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(color: Color(0xFF214F73)),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(color: Color(0xFF5AA3FF), width: 2),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                SizedBox(
                  height: 56,
                  child: ElevatedButton(
                    onPressed: search,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF4AA3FF),
                      foregroundColor: const Color(0xFF021022),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                    child: const Icon(Icons.search, size: 22),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 32),

            // Dynamic Results Section
            if (fine != null)
              _buildTicketResult()
            else if (hasSearched)
              Column(
                children: [
                  Icon(Icons.folder_off_rounded, size: 64, color: Colors.blueGrey.shade700),
                  const SizedBox(height: 16),
                  const Text(
                    "No fine record found for this reference.",
                    style: TextStyle(color: Color(0xFFAACDE9), fontSize: 16, fontWeight: FontWeight.w500),
                  ),
                ],
              )
          ],
        ),
      ),
    );
  }

  Widget _buildTicketResult() {
    final statusUpper = fine!.status.toUpperCase();
    final isPaid = statusUpper == 'PAID' || statusUpper == 'SUCCESS';

    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: const Color(0xFF07223A),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFF164E70)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, 8),
          )
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Top Bar of Ticket
          Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("REFERENCE NUMBER", style: TextStyle(fontSize: 10, color: Color(0xFFD7A46B), fontWeight: FontWeight.bold, letterSpacing: 1.5)),
                    const SizedBox(height: 4),
                    Text(
                      fine!.referenceNumber,
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFFFFF6EA), letterSpacing: 0.5),
                    ),
                  ],
                ),
                // Status Badge
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                  decoration: BoxDecoration(
                    color: isPaid ? const Color(0xFF1FC97A).withOpacity(0.2) : const Color(0xFFFF8A4D).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: isPaid ? const Color(0xFF1FC97A).withOpacity(0.5) : const Color(0xFFFF8A4D).withOpacity(0.5)),
                  ),
                  child: Text(
                    isPaid ? 'PAID' : 'UNPAID',
                    style: TextStyle(
                      color: isPaid ? const Color(0xFF1FC97A) : const Color(0xFFFF8A4D),
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                )
              ],
            ),
          ),

          // Dotted Divider Line
          Row(
            children: List.generate(
              30,
              (index) => Expanded(
                child: Container(
                  color: index % 2 == 0 ? Colors.transparent : const Color(0xFF164E70),
                  height: 2,
                ),
              ),
            ),
          ),

          // Bottom Details of Ticket
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                _buildTicketRow("Category", fine!.categoryName),
                const SizedBox(height: 14),
                _buildTicketRow(
                  "Total Fine Amount",
                  "LKR ${fine!.amount.toStringAsFixed(2)}",
                  valueColor: const Color(0xFF4AA3FF),
                  isBold: true,
                ),
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildTicketRow(String label, String value, {Color? valueColor, bool isBold = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(color: Color(0xFFAACDE9), fontSize: 14)),
        Text(
          value,
          style: TextStyle(
            color: valueColor ?? const Color(0xFFFFF6EA),
            fontSize: isBold ? 18 : 14,
            fontWeight: isBold ? FontWeight.bold : FontWeight.w600,
          ),
        ),
      ],
    );
  }
}
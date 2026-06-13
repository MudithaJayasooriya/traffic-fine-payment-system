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
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.transparent,
        foregroundColor: Colors.black,
        title: const Text("Search Database", style: TextStyle(fontWeight: FontWeight.bold)),
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
                    decoration: InputDecoration(
                      hintText: "Enter Reference Number",
                      prefixIcon: const Icon(Icons.search, color: Colors.grey),
                      filled: true,
                      fillColor: Colors.white,
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: BorderSide(color: Colors.grey[200]!),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(color: Color(0xFF3B82F6), width: 2),
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
                      backgroundColor: const Color(0xFF1E3A8A),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                    child: const Icon(Icons.arrow_forward_ios_rounded, size: 18),
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
                  Icon(Icons.folder_off_rounded, size: 64, color: Colors.grey[300]),
                  const SizedBox(height: 16),
                  Text(
                    "No record found",
                    style: TextStyle(color: Colors.grey[600], fontSize: 16, fontWeight: FontWeight.w500),
                  ),
                ],
              )
          ],
        ),
      ),
    );
  }

  Widget _buildTicketResult() {
    final isPaid = fine!.status.toLowerCase() == 'paid';

    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.grey[200]!),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
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
                    Text("REFERENCE ID", style: TextStyle(fontSize: 11, color: Colors.grey[400], fontWeight: FontWeight.bold)),
                    Text(
                      fine!.referenceNumber,
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                    ),
                  ],
                ),
                // Status Badge
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                  decoration: BoxDecoration(
                    color: isPaid ? Colors.green[50] : Colors.orange[50],
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    fine!.status.toUpperCase(),
                    style: TextStyle(
                      color: isPaid ? Colors.green[700] : Colors.orange[700],
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
                  color: index % 2 == 0 ? Colors.transparent : Colors.grey[200],
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
                const SizedBox(height: 16),
                _buildTicketRow(
                  "Total Fine Amount",
                  "\$${fine!.amount}", // Replace with currency sign of choice
                  valueColor: const Color(0xFF1E3A8A),
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
        Text(label, style: TextStyle(color: Colors.grey[500], fontSize: 14)),
        Text(
          value,
          style: TextStyle(
            color: valueColor ?? Colors.grey[800],
            fontSize: isBold ? 18 : 15,
            fontWeight: isBold ? FontWeight.bold : FontWeight.w600,
          ),
        ),
      ],
    );
  }
}
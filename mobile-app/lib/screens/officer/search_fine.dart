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
  bool isLoading = false;

  List<Fine> recentFines = [];

  @override
  void initState() {
    super.initState();
    _loadRecentFines();
  }

  Future<void> _loadRecentFines() async {
    final fines = await service.getOfficerFines();
    if (mounted) {
      setState(() {
        recentFines = fines;
      });
    }
  }

  void search([String? query]) async {
    final text = query ?? controller.text.trim();
    if (text.isEmpty) return;

    FocusScope.of(context).unfocus();
    setState(() => isLoading = true);

    final result = await service.searchFine(text);
    if (mounted) {
      setState(() {
        fine = result;
        hasSearched = true;
        isLoading = false;
      });
    }
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
        title: const Text("Search Traffic Fines",
            style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFFFF6EA))),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Modern Search Bar Layout
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: controller,
                    style: const TextStyle(color: Color(0xFFEAF6FF), fontSize: 14),
                    decoration: InputDecoration(
                      hintText: "Enter Ticket Ref (e.g. FINE-XXXX)",
                      hintStyle: const TextStyle(color: Color(0xFF5AA3FF), fontSize: 13),
                      prefixIcon: const Icon(Icons.search, color: Color(0xFF4AA3FF)),
                      suffixIcon: controller.text.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.clear, color: Color(0xFF9FCAFF)),
                              onPressed: () {
                                controller.clear();
                                setState(() {
                                  fine = null;
                                  hasSearched = false;
                                });
                              },
                            )
                          : null,
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
                    onSubmitted: (val) => search(),
                  ),
                ),
                const SizedBox(width: 10),
                SizedBox(
                  height: 52,
                  child: ElevatedButton(
                    onPressed: () => search(),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF4AA3FF),
                      foregroundColor: const Color(0xFF021022),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                    ),
                    child: const Icon(Icons.search, size: 22),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),

            // Recent Ticket Reference Suggestions List
            if (recentFines.isNotEmpty && !hasSearched) ...[
              const Text(
                "Available Reference Suggestions",
                style: TextStyle(
                    fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFFD7A46B)),
              ),
              const SizedBox(height: 8),
              const Text(
                "Tap any recent ticket reference below to search details immediately:",
                style: TextStyle(fontSize: 12, color: Color(0xFFAACDE9)),
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: recentFines.map((f) {
                  return InkWell(
                    onTap: () {
                      controller.text = f.referenceNumber;
                      search(f.referenceNumber);
                    },
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: const Color(0xFF07223A),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFF1F4F78)),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.receipt_long, color: Color(0xFF4AA3FF), size: 14),
                          const SizedBox(width: 6),
                          Text(
                            f.referenceNumber,
                            style: const TextStyle(
                                color: Color(0xFFFFF6EA),
                                fontWeight: FontWeight.bold,
                                fontSize: 12),
                          ),
                        ],
                      ),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 24),
            ],

            // Dynamic Results Section
            if (isLoading)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(32.0),
                  child: CircularProgressIndicator(color: Color(0xFF4AA3FF)),
                ),
              )
            else if (fine != null)
              _buildTicketResult()
            else if (hasSearched)
              Center(
                child: Column(
                  children: const [
                    SizedBox(height: 24),
                    Icon(Icons.folder_off_rounded, size: 56, color: Color(0xFF1F4F78)),
                    SizedBox(height: 12),
                    Text(
                      "No fine record found for this reference.",
                      style: TextStyle(
                          color: Color(0xFFAACDE9), fontSize: 14, fontWeight: FontWeight.w500),
                    ),
                  ],
                ),
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
                    const Text("REFERENCE NUMBER",
                        style: TextStyle(
                            fontSize: 10,
                            color: Color(0xFFD7A46B),
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.5)),
                    const SizedBox(height: 4),
                    Text(
                      fine!.referenceNumber,
                      style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFFFFF6EA),
                          letterSpacing: 0.5),
                    ),
                  ],
                ),
                // Status Badge
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                  decoration: BoxDecoration(
                    color: isPaid
                        ? const Color(0xFF1FC97A).withOpacity(0.2)
                        : const Color(0xFFFF8A4D).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                        color: isPaid
                            ? const Color(0xFF1FC97A).withOpacity(0.5)
                            : const Color(0xFFFF8A4D).withOpacity(0.5)),
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
                _buildTicketRow("Category Name", fine!.categoryName),
                const SizedBox(height: 12),
                _buildTicketRow("Driver ID", "#${fine!.driverId}"),
                const SizedBox(height: 12),
                _buildTicketRow("Officer ID", "#${fine!.officerId}"),
                const SizedBox(height: 12),
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

  Widget _buildTicketRow(String label, String value,
      {Color? valueColor, bool isBold = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(color: Color(0xFFAACDE9), fontSize: 13)),
        Text(
          value,
          style: TextStyle(
            color: valueColor ?? const Color(0xFFFFF6EA),
            fontSize: isBold ? 16 : 13,
            fontWeight: isBold ? FontWeight.bold : FontWeight.w600,
          ),
        ),
      ],
    );
  }
}
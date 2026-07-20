import 'package:flutter/material.dart';
import '../../services/fine_service.dart';
import '../../models/fine.dart';

class IssuedFinesScreen extends StatefulWidget {
  const IssuedFinesScreen({super.key});

  @override
  State<IssuedFinesScreen> createState() => _IssuedFinesScreenState();
}

class _IssuedFinesScreenState extends State<IssuedFinesScreen> {
  final FineService _fineService = FineService();
  List<Fine> _issuedFines = [];
  List<Fine> _filteredFines = [];
  bool _isLoading = true;

  String _selectedFilter = "ALL"; // ALL, UNPAID, PAID
  final TextEditingController _searchCtrl = TextEditingController();

  List<dynamic> _categories = [];
  List<dynamic> _drivers = [];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    final fines = await _fineService.getOfficerFines();
    final cats = await _fineService.getAllCategories();
    final drvs = await _fineService.getAllDrivers();

    if (mounted) {
      setState(() {
        _issuedFines = fines;
        _categories = cats;
        _drivers = drvs;
        _applyFilters();
        _isLoading = false;
      });
    }
  }

  void _applyFilters() {
    final query = _searchCtrl.text.trim().toLowerCase();

    setState(() {
      _filteredFines = _issuedFines.where((fine) {
        final matchesStatus = _selectedFilter == "ALL" ||
            (_selectedFilter == "UNPAID" && fine.status == "NOT_PAID") ||
            (_selectedFilter == "PAID" && fine.status == "PAID");

        final ref = fine.referenceNumber.toLowerCase();
        final cat = fine.categoryName.toLowerCase();
        final driver = fine.driverId.toString();

        final matchesQuery = query.isEmpty ||
            ref.contains(query) ||
            cat.contains(query) ||
            driver.contains(query);

        return matchesStatus && matchesQuery;
      }).toList();
    });
  }

  // DELETE FINE CONFIRMATION
  Future<void> _handleDeleteFine(Fine fine) async {
    if (fine.status == 'PAID') {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Paid fines cannot be deleted.'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF07223A),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: Color(0xFF164E70)),
        ),
        title: const Text('Delete Fine Ticket?', style: TextStyle(color: Color(0xFFFFF6EA))),
        content: Text(
          'Are you sure you want to delete ticket ${fine.referenceNumber}? This action cannot be undone.',
          style: const TextStyle(color: Color(0xFFAACDE9)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel', style: TextStyle(color: Color(0xFF9FCAFF))),
          ),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: Colors.red.shade700),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Delete Ticket'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      final success = await _fineService.deleteFine(fine.id);
      if (mounted) {
        if (success) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Ticket ${fine.referenceNumber} deleted successfully.'),
              backgroundColor: const Color(0xFF1FC97A),
            ),
          );
          _loadData();
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Failed to delete fine ticket.'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    }
  }

  // EDIT FINE DIALOG
  Future<void> _handleEditFine(Fine fine) async {
    if (fine.status == 'PAID') {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Paid fines cannot be edited.'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    final matchedCategory = _categories.firstWhere(
      (c) => c['categoryName'] == fine.categoryName || c['categoryCode'] == fine.categoryName,
      orElse: () => _categories.isNotEmpty ? _categories.first : {},
    );
    String selectedCategoryCode = matchedCategory['categoryCode'] ??
        (_categories.isNotEmpty ? _categories.first['categoryCode'] : '');
    int selectedDriverId = fine.driverId;

    await showDialog(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            final initialCategory = _categories.any((c) => c['categoryCode'] == selectedCategoryCode)
                ? selectedCategoryCode
                : (_categories.isNotEmpty ? _categories.first['categoryCode'] : null);

            final initialDriver = _drivers.any((d) => d['id'] == selectedDriverId)
                ? selectedDriverId
                : (_drivers.isNotEmpty ? _drivers.first['id'] : null);

            return AlertDialog(
              backgroundColor: const Color(0xFF07223A),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
                side: const BorderSide(color: Color(0xFF164E70)),
              ),
              title: Row(
                children: [
                  const Icon(Icons.edit_note, color: Color(0xFF4AA3FF)),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Edit Ticket ${fine.referenceNumber}',
                      style: const TextStyle(color: Color(0xFFFFF6EA), fontSize: 16),
                    ),
                  ),
                ],
              ),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Violation Category',
                        style: TextStyle(color: Color(0xFFD7A46B), fontSize: 12, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 6),
                    DropdownButtonFormField<String>(
                      initialValue: initialCategory,
                      dropdownColor: const Color(0xFF06223B),
                      style: const TextStyle(color: Color(0xFFFFF6EA), fontSize: 13),
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: const Color(0xFF06223B),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      items: _categories.map<DropdownMenuItem<String>>((cat) {
                        return DropdownMenuItem<String>(
                          value: cat['categoryCode'],
                          child: Text('${cat['categoryCode']} - ${cat['categoryName']}'),
                        );
                      }).toList(),
                      onChanged: (val) {
                        if (val != null) {
                          setDialogState(() {
                            selectedCategoryCode = val;
                          });
                        }
                      },
                    ),

                    const SizedBox(height: 16),

                    const Text('Offending Driver',
                        style: TextStyle(color: Color(0xFFD7A46B), fontSize: 12, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 6),
                    DropdownButtonFormField<int>(
                      initialValue: initialDriver,
                      dropdownColor: const Color(0xFF06223B),
                      style: const TextStyle(color: Color(0xFFFFF6EA), fontSize: 13),
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: const Color(0xFF06223B),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      items: _drivers.map<DropdownMenuItem<int>>((drv) {
                        return DropdownMenuItem<int>(
                          value: drv['id'],
                          child: Text('Driver #${drv['id']} (${drv['username']})'),
                        );
                      }).toList(),
                      onChanged: (val) {
                        if (val != null) {
                          setDialogState(() {
                            selectedDriverId = val;
                          });
                        }
                      },
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(ctx),
                  child: const Text('Cancel', style: TextStyle(color: Color(0xFFAACDE9))),
                ),
                ElevatedButton(
                  onPressed: () async {
                    Navigator.pop(ctx);
                    final updated = await _fineService.updateFine(
                      fine.id,
                      selectedCategoryCode,
                      selectedDriverId,
                    );
                    if (mounted) {
                      if (updated != null) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Fine ticket updated successfully.'),
                            backgroundColor: Color(0xFF1FC97A),
                          ),
                        );
                        _loadData();
                      } else {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Failed to update fine ticket.'),
                            backgroundColor: Colors.red,
                          ),
                        );
                      }
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF4AA3FF),
                    foregroundColor: const Color(0xFF021022),
                  ),
                  child: const Text('Save Changes'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF021022),
      appBar: AppBar(
        backgroundColor: const Color(0xFF07223A),
        foregroundColor: const Color(0xFFEAF6FF),
        elevation: 0,
        title: const Text(
          'My Issued Tickets',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Search Input
              TextField(
                controller: _searchCtrl,
                onChanged: (_) => _applyFilters(),
                style: const TextStyle(color: Color(0xFFEAF6FF), fontSize: 14),
                decoration: InputDecoration(
                  hintText: 'Search ticket ref, category, or driver...',
                  hintStyle: const TextStyle(color: Color(0xFF5AA3FF), fontSize: 13),
                  prefixIcon: const Icon(Icons.search, color: Color(0xFF4AA3FF)),
                  suffixIcon: _searchCtrl.text.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.clear, color: Color(0xFF9FCAFF)),
                          onPressed: () {
                            _searchCtrl.clear();
                            _applyFilters();
                          },
                        )
                      : null,
                  filled: true,
                  fillColor: const Color(0xFF07223A),
                  contentPadding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: Color(0xFF164E70)),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: Color(0xFF164E70)),
                  ),
                ),
              ),

              const SizedBox(height: 12),

              // Filter Tabs (All, Unpaid, Paid)
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    _buildFilterChip("ALL", "All Tickets (${_issuedFines.length})"),
                    const SizedBox(width: 8),
                    _buildFilterChip("UNPAID", "Unpaid (${_issuedFines.where((f) => f.status == 'NOT_PAID').length})"),
                    const SizedBox(width: 8),
                    _buildFilterChip("PAID", "Paid (${_issuedFines.where((f) => f.status == 'PAID').length})"),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // List View
              Expanded(
                child: _isLoading
                    ? const Center(
                        child: CircularProgressIndicator(color: Color(0xFF4AA3FF)),
                      )
                    : _filteredFines.isEmpty
                        ? Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: const [
                                Icon(Icons.assignment_outlined, size: 48, color: Color(0xFF4AA3FF)),
                                SizedBox(height: 12),
                                Text(
                                  'No issued tickets matching filter.',
                                  style: TextStyle(color: Color(0xFFAACDE9), fontSize: 14),
                                ),
                              ],
                            ),
                          )
                        : RefreshIndicator(
                            onRefresh: _loadData,
                            color: const Color(0xFF4AA3FF),
                            child: ListView.separated(
                              itemCount: _filteredFines.length,
                              separatorBuilder: (_, __) => const SizedBox(height: 12),
                              itemBuilder: (context, index) {
                                final fine = _filteredFines[index];
                                final isPaid = fine.status == 'PAID';

                                return Container(
                                  padding: const EdgeInsets.all(16),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF07223A),
                                    borderRadius: BorderRadius.circular(20),
                                    border: Border.all(
                                        color: isPaid
                                            ? const Color(0xFF1FC97A).withOpacity(0.5)
                                            : const Color(0xFF1F4F78)),
                                  ),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(
                                            fine.referenceNumber,
                                            style: const TextStyle(
                                              fontSize: 16,
                                              fontWeight: FontWeight.bold,
                                              color: Color(0xFF4AA3FF),
                                            ),
                                          ),

                                          // Status Pill Badge
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                                horizontal: 10, vertical: 4),
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
                                                color: isPaid
                                                    ? const Color(0xFF1FC97A)
                                                    : const Color(0xFFFF8A4D),
                                                fontSize: 11,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 8),

                                      Text(
                                        fine.categoryName,
                                        style: const TextStyle(
                                            color: Color(0xFFFFF6EA),
                                            fontWeight: FontWeight.bold,
                                            fontSize: 14),
                                      ),

                                      const SizedBox(height: 4),
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(
                                            "Driver ID: #${fine.driverId}",
                                            style: const TextStyle(
                                                color: Color(0xFFAACDE9), fontSize: 12),
                                          ),
                                          Text(
                                            "LKR ${fine.amount.toStringAsFixed(0)}",
                                            style: const TextStyle(
                                                color: Color(0xFF1FC97A),
                                                fontWeight: FontWeight.bold,
                                                fontSize: 14),
                                          ),
                                        ],
                                      ),

                                      const SizedBox(height: 12),
                                      const Divider(color: Color(0xFF164E70), height: 1),
                                      const SizedBox(height: 8),

                                      // Action Bar: Edit & Delete (Enabled ONLY if NOT_PAID)
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(
                                            "Issued Date: ${fine.fineDate ?? 'Recent'}",
                                            style: const TextStyle(
                                                color: Color(0xFF8DB8D8), fontSize: 11),
                                          ),

                                          if (!isPaid) ...[
                                            Row(
                                              children: [
                                                // EDIT BUTTON
                                                IconButton(
                                                  icon: const Icon(Icons.edit,
                                                      color: Color(0xFF4AA3FF), size: 20),
                                                  tooltip: "Edit Fine Ticket",
                                                  onPressed: () => _handleEditFine(fine),
                                                ),
                                                // DELETE BUTTON
                                                IconButton(
                                                  icon: const Icon(Icons.delete_outline,
                                                      color: Color(0xFFFF8A8A), size: 20),
                                                  tooltip: "Delete Fine Ticket",
                                                  onPressed: () => _handleDeleteFine(fine),
                                                ),
                                              ],
                                            )
                                          ] else ...[
                                            const Row(
                                              children: [
                                                Icon(Icons.lock,
                                                    color: Color(0xFF1FC97A), size: 14),
                                                SizedBox(width: 4),
                                                Text(
                                                  "Locked",
                                                  style: TextStyle(
                                                      color: Color(0xFF1FC97A),
                                                      fontSize: 11,
                                                      fontWeight: FontWeight.bold),
                                                ),
                                              ],
                                            )
                                          ]
                                        ],
                                      )
                                    ],
                                  ),
                                );
                              },
                            ),
                          ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFilterChip(String value, String label) {
    final isSelected = _selectedFilter == value;
    return ChoiceChip(
      label: Text(
        label,
        style: TextStyle(
          color: isSelected ? const Color(0xFF021022) : const Color(0xFFEAF6FF),
          fontWeight: FontWeight.bold,
          fontSize: 12,
        ),
      ),
      selected: isSelected,
      selectedColor: const Color(0xFF4AA3FF),
      backgroundColor: const Color(0xFF07223A),
      side: BorderSide(
        color: isSelected ? const Color(0xFF4AA3FF) : const Color(0xFF164E70),
      ),
      onSelected: (_) {
        setState(() {
          _selectedFilter = value;
          _applyFilters();
        });
      },
    );
  }
}

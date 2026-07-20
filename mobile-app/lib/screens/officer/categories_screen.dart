import 'package:flutter/material.dart';
import '../../services/fine_service.dart';

class CategoriesScreen extends StatefulWidget {
  const CategoriesScreen({super.key});

  @override
  State<CategoriesScreen> createState() => _CategoriesScreenState();
}

class _CategoriesScreenState extends State<CategoriesScreen> {
  final FineService _service = FineService();
  List<dynamic> _categories = [];
  List<dynamic> _filteredCategories = [];
  bool _isLoading = true;
  final TextEditingController _searchCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadCategories();
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadCategories() async {
    setState(() => _isLoading = true);
    final data = await _service.getAllCategories();
    setState(() {
      _categories = data;
      _filteredCategories = data;
      _isLoading = false;
    });
  }

  void _filterCategories(String query) {
    if (query.trim().isEmpty) {
      setState(() => _filteredCategories = _categories);
    } else {
      final q = query.toLowerCase();
      setState(() {
        _filteredCategories = _categories.where((cat) {
          final code = (cat['categoryCode'] ?? '').toString().toLowerCase();
          final name = (cat['categoryName'] ?? '').toString().toLowerCase();
          return code.contains(q) || name.contains(q);
        }).toList();
      });
    }
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
          'Traffic Fine Categories',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              // Search Input Box
              TextField(
                controller: _searchCtrl,
                onChanged: _filterCategories,
                style: const TextStyle(color: Color(0xFFEAF6FF), fontSize: 14),
                decoration: InputDecoration(
                  hintText: 'Search by Code or Violation Name...',
                  hintStyle: const TextStyle(color: Color(0xFF5AA3FF), fontSize: 13),
                  prefixIcon: const Icon(Icons.search, color: Color(0xFF4AA3FF)),
                  suffixIcon: _searchCtrl.text.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.clear, color: Color(0xFF9FCAFF)),
                          onPressed: () {
                            _searchCtrl.clear();
                            _filterCategories('');
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
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: Color(0xFF4AA3FF)),
                  ),
                ),
              ),

              const SizedBox(height: 16),

              // Categories List
              Expanded(
                child: _isLoading
                    ? const Center(
                        child: CircularProgressIndicator(color: Color(0xFF4AA3FF)),
                      )
                    : _filteredCategories.isEmpty
                        ? Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: const [
                                Icon(Icons.warning_amber_rounded, size: 48, color: Color(0xFFD7A46B)),
                                SizedBox(height: 12),
                                Text(
                                  'No matching fine categories found.',
                                  style: TextStyle(color: Color(0xFFAACDE9), fontSize: 14),
                                ),
                              ],
                            ),
                          )
                        : ListView.separated(
                            itemCount: _filteredCategories.length,
                            separatorBuilder: (_, __) => const SizedBox(height: 12),
                            itemBuilder: (context, index) {
                              final cat = _filteredCategories[index];
                              final code = cat['categoryCode'] ?? '';
                              final name = cat['categoryName'] ?? '';
                              final amount = cat['defaultAmount'] ?? 0;
                              final desc = cat['description'] ?? '';

                              return Container(
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF07223A),
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(color: const Color(0xFF1F4F78)),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                              horizontal: 10, vertical: 4),
                                          decoration: BoxDecoration(
                                            color: const Color(0xFF072B46),
                                            borderRadius: BorderRadius.circular(8),
                                            border: Border.all(color: const Color(0xFF4AA3FF).withOpacity(0.4)),
                                          ),
                                          child: Text(
                                            code,
                                            style: const TextStyle(
                                              color: Color(0xFFD7A46B),
                                              fontWeight: FontWeight.bold,
                                              fontSize: 12,
                                            ),
                                          ),
                                        ),
                                        Text(
                                          'LKR ${amount.toString()}',
                                          style: const TextStyle(
                                            color: Color(0xFF1FC97A),
                                            fontWeight: FontWeight.bold,
                                            fontSize: 15,
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 10),
                                    Text(
                                      name,
                                      style: const TextStyle(
                                        color: Color(0xFFFFF6EA),
                                        fontWeight: FontWeight.bold,
                                        fontSize: 15,
                                      ),
                                    ),
                                    if (desc.isNotEmpty) ...[
                                      const SizedBox(height: 6),
                                      Text(
                                        desc,
                                        style: const TextStyle(
                                          color: Color(0xFFAACDE9),
                                          fontSize: 12,
                                        ),
                                      ),
                                    ],
                                  ],
                                ),
                              );
                            },
                          ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

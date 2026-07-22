import 'package:flutter/material.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import '../../services/api_service.dart';
import '../../services/fine_service.dart';
import 'officer_dashboard.dart';

class CreateFineScreen extends StatefulWidget {
  const CreateFineScreen({super.key});

  @override
  State<CreateFineScreen> createState() => _CreateFineScreenState();
}

class _CreateFineScreenState extends State<CreateFineScreen> {
  final FineService service = FineService();

  // DATA
  List<dynamic> categories = [];
  List<dynamic> drivers = [];

  // SELECTED
  Map<String, dynamic>? selectedCategoryObj;
  Map<String, dynamic>? selectedDriverObj;

  String? selectedCategory;
  String? selectedDriver;

  // Officer Info (Locked)
  int? loggedInOfficerId;
  String? loggedInOfficerUsername;
  bool _isLoadingOfficer = true;

  String result = "";
  bool isSuccess = false;
  bool isCreated = false;
  String referenceNumber = "";

  @override
  void initState() {
    super.initState();
    loadInitialData();
    _loadLoggedInOfficer();
  }

  Future<void> _loadLoggedInOfficer() async {
    final token = await ApiService.getToken();
    if (token != null) {
      try {
        final decoded = JwtDecoder.decode(token);
        final id = decoded['id'] ?? decoded['userId'];
        final username = decoded['sub'] ?? decoded['username'] ?? 'Officer';

        setState(() {
          loggedInOfficerId = id;
          loggedInOfficerUsername = username;
          _isLoadingOfficer = false;
        });
      } catch (e) {
        print("Error decoding officer token: $e");
        setState(() => _isLoadingOfficer = false);
      }
    } else {
      setState(() => _isLoadingOfficer = false);
    }
  }

  void loadInitialData() async {
    final c = await service.getAllCategories();
    final d = await service.getAllDrivers();

    setState(() {
      categories = c;
      drivers = d;
    });
  }

  // CREATE FINE
  void createFine() async {
    if (selectedCategory == null ||
        loggedInOfficerId == null ||
        selectedDriver == null) {
      setState(() {
        result = "Please select a Category and Offending Driver";
        isSuccess = false;
      });
      return;
    }

    final fine = await service.createFine(
      selectedCategory!,
      loggedInOfficerId!,
      int.parse(selectedDriver!),
    );

    setState(() {
      if (fine != null) {
        result = "Fine Created Successfully";
        referenceNumber = fine.referenceNumber ?? "N/A";
        isSuccess = true;
        isCreated = true;
      } else {
        result = "Failed to create fine";
        isSuccess = false;
        isCreated = false;
      }
    });
  }

  // SEARCHABLE CATEGORY MODAL PICKER
  void _openCategoryPicker() {
    String query = "";

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF07223A),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            final filtered = categories.where((cat) {
              final code = (cat['categoryCode'] ?? '').toString().toLowerCase();
              final name = (cat['categoryName'] ?? '').toString().toLowerCase();
              final q = query.toLowerCase();
              return code.contains(q) || name.contains(q);
            }).toList();

            return Container(
              height: MediaQuery.of(context).size.height * 0.75,
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        "Select Violation Category",
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFFFFF6EA),
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, color: Color(0xFFAACDE9)),
                        onPressed: () => Navigator.pop(context),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Search Bar inside Modal
                  TextField(
                    autofocus: true,
                    style: const TextStyle(
                      color: Color(0xFFEAF6FF),
                      fontSize: 14,
                    ),
                    decoration: InputDecoration(
                      hintText: "Search by Code (e.g. SPD01) or Name...",
                      hintStyle: const TextStyle(
                        color: Color(0xFF5AA3FF),
                        fontSize: 13,
                      ),
                      prefixIcon: const Icon(
                        Icons.search,
                        color: Color(0xFF4AA3FF),
                      ),
                      filled: true,
                      fillColor: const Color(0xFF06223B),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(color: Color(0xFF214F73)),
                      ),
                    ),
                    onChanged: (v) => setModalState(() => query = v),
                  ),

                  const SizedBox(height: 16),

                  Expanded(
                    child: filtered.isEmpty
                        ? const Center(
                            child: Text(
                              "No matching categories found.",
                              style: TextStyle(color: Color(0xFFAACDE9)),
                            ),
                          )
                        : ListView.separated(
                            itemCount: filtered.length,
                            separatorBuilder: (_, __) => const Divider(
                              color: Color(0xFF1F4F78),
                              height: 1,
                            ),
                            itemBuilder: (context, index) {
                              final cat = filtered[index];
                              final code = cat['categoryCode'] ?? '';
                              final name = cat['categoryName'] ?? '';
                              final amount = cat['defaultAmount'] ?? 0;

                              return ListTile(
                                contentPadding: const EdgeInsets.symmetric(
                                  vertical: 6,
                                  horizontal: 8,
                                ),
                                title: Text(
                                  name,
                                  style: const TextStyle(
                                    color: Color(0xFFFFF6EA),
                                    fontWeight: FontWeight.bold,
                                    fontSize: 14,
                                  ),
                                ),
                                subtitle: Text(
                                  "Code: $code | LKR ${amount.toString()}",
                                  style: const TextStyle(
                                    color: Color(0xFF4AA3FF),
                                    fontSize: 12,
                                  ),
                                ),
                                trailing: const Icon(
                                  Icons.chevron_right,
                                  color: Color(0xFF5AA3FF),
                                ),
                                onTap: () {
                                  setState(() {
                                    selectedCategoryObj = cat;
                                    selectedCategory = code;
                                  });
                                  Navigator.pop(context);
                                },
                              );
                            },
                          ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  // SEARCHABLE DRIVER MODAL PICKER
  void _openDriverPicker() {
    String query = "";

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF07223A),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            final filtered = drivers.where((d) {
              final id = (d['id'] ?? '').toString().toLowerCase();
              final username = (d['username'] ?? '').toString().toLowerCase();
              final nic = (d['nicNumber'] ?? '').toString().toLowerCase();
              final q = query.toLowerCase();
              return id.contains(q) || username.contains(q) || nic.contains(q);
            }).toList();

            return Container(
              height: MediaQuery.of(context).size.height * 0.75,
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        "Select Offending Driver",
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFFFFF6EA),
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, color: Color(0xFFAACDE9)),
                        onPressed: () => Navigator.pop(context),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Search Bar inside Modal
                  TextField(
                    autofocus: true,
                    style: const TextStyle(
                      color: Color(0xFFEAF6FF),
                      fontSize: 14,
                    ),
                    decoration: InputDecoration(
                      hintText: "Search by Driver ID, Username, or NIC...",
                      hintStyle: const TextStyle(
                        color: Color(0xFF5AA3FF),
                        fontSize: 13,
                      ),
                      prefixIcon: const Icon(
                        Icons.search,
                        color: Color(0xFF4AA3FF),
                      ),
                      filled: true,
                      fillColor: const Color(0xFF06223B),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(color: Color(0xFF214F73)),
                      ),
                    ),
                    onChanged: (v) => setModalState(() => query = v),
                  ),

                  const SizedBox(height: 16),

                  Expanded(
                    child: filtered.isEmpty
                        ? const Center(
                            child: Text(
                              "No matching drivers found.",
                              style: TextStyle(color: Color(0xFFAACDE9)),
                            ),
                          )
                        : ListView.separated(
                            itemCount: filtered.length,
                            separatorBuilder: (_, __) => const Divider(
                              color: Color(0xFF1F4F78),
                              height: 1,
                            ),
                            itemBuilder: (context, index) {
                              final driver = filtered[index];
                              final id = driver['id']?.toString() ?? '';
                              final username = driver['username'] ?? '';
                              final nic = driver['nicNumber'] ?? 'N/A';

                              return ListTile(
                                contentPadding: const EdgeInsets.symmetric(
                                  vertical: 6,
                                  horizontal: 8,
                                ),
                                title: Text(
                                  "Driver: $username",
                                  style: const TextStyle(
                                    color: Color(0xFFFFF6EA),
                                    fontWeight: FontWeight.bold,
                                    fontSize: 14,
                                  ),
                                ),
                                subtitle: Text(
                                  "ID: #$id | NIC: $nic",
                                  style: const TextStyle(
                                    color: Color(0xFF4AA3FF),
                                    fontSize: 12,
                                  ),
                                ),
                                trailing: const Icon(
                                  Icons.chevron_right,
                                  color: Color(0xFF5AA3FF),
                                ),
                                onTap: () {
                                  setState(() {
                                    selectedDriverObj = driver;
                                    selectedDriver = id;
                                  });
                                  Navigator.pop(context);
                                },
                              );
                            },
                          ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    // SUCCESS VIEW
    if (isCreated) {
      return Scaffold(
        backgroundColor: const Color(0xFF021022),
        body: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Container(
                    height: 90,
                    width: 90,
                    decoration: BoxDecoration(
                      color: const Color(0xFF1FC97A).withOpacity(0.2),
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: const Color(0xFF1FC97A),
                        width: 3,
                      ),
                    ),
                    child: const Icon(
                      Icons.check_circle_rounded,
                      size: 56,
                      color: Color(0xFF1FC97A),
                    ),
                  ),
                  const SizedBox(height: 20),

                  const Text(
                    "Ticket Issued Successfully!",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFFFFF6EA),
                    ),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    "The fine has been registered into the traffic system.",
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 13, color: Color(0xFFAACDE9)),
                  ),

                  const SizedBox(height: 28),

                  // Reference Card
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: const Color(0xFF07223A),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: const Color(0xFF4AA3FF).withOpacity(0.5),
                      ),
                    ),
                    child: Column(
                      children: [
                        const Text(
                          "REFERENCE NUMBER",
                          style: TextStyle(
                            fontSize: 11,
                            letterSpacing: 1.5,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFFD7A46B),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          referenceNumber,
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF4AA3FF),
                            letterSpacing: 1.0,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 28),

                  SizedBox(
                    height: 52,
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.pushAndRemoveUntil(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const OfficerDashboard(),
                          ),
                          (route) => false,
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF4AA3FF),
                        foregroundColor: const Color(0xFF021022),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                      ),
                      child: const Text(
                        "RETURN TO DASHBOARD",
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    }

    // FORM INPUT VIEW
    return Scaffold(
      backgroundColor: const Color(0xFF021022),
      appBar: AppBar(
        backgroundColor: const Color(0xFF07223A),
        foregroundColor: const Color(0xFFEAF6FF),
        elevation: 0,
        title: const Text(
          "Issue Traffic Fine Ticket",
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // 1. VIOLATION CATEGORY (SEARCHABLE PICKER)
              GestureDetector(
                onTap: _openCategoryPicker,
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF07223A),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: selectedCategoryObj != null
                          ? const Color(0xFF4AA3FF)
                          : const Color(0xFF1F4F78),
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "Violation Category",
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFFD7A46B),
                        ),
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          const Icon(
                            Icons.search,
                            color: Color(0xFF4AA3FF),
                            size: 20,
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              selectedCategoryObj != null
                                  ? "${selectedCategoryObj!['categoryCode']} - ${selectedCategoryObj!['categoryName']}"
                                  : "Tap to search category by name or code...",
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: selectedCategoryObj != null
                                    ? FontWeight.bold
                                    : FontWeight.normal,
                                color: selectedCategoryObj != null
                                    ? const Color(0xFFFFF6EA)
                                    : const Color(0xFFAACDE9),
                              ),
                            ),
                          ),
                          const Icon(
                            Icons.arrow_drop_down,
                            color: Color(0xFF4AA3FF),
                          ),
                        ],
                      ),
                      if (selectedCategoryObj != null) ...[
                        const SizedBox(height: 10),
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: const Color(0xFF06223B),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            "Fine Amount: LKR ${selectedCategoryObj!['defaultAmount']}",
                            style: const TextStyle(
                              color: Color(0xFF1FC97A),
                              fontWeight: FontWeight.bold,
                              fontSize: 13,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 16),

              // 2. ISSUING OFFICER (LOCKED / READ-ONLY)
              Container(
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
                      children: const [
                        Text(
                          "Issuing Officer (Logged In)",
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFFD7A46B),
                          ),
                        ),
                        Icon(Icons.lock, color: Color(0xFF5AA3FF), size: 16),
                      ],
                    ),
                    const SizedBox(height: 10),
                    _isLoadingOfficer
                        ? const SizedBox(
                            height: 20,
                            width: 20,
                            child: CircularProgressIndicator(
                              color: Color(0xFF4AA3FF),
                              strokeWidth: 2,
                            ),
                          )
                        : Row(
                            children: [
                              const Icon(
                                Icons.badge_outlined,
                                color: Color(0xFF4AA3FF),
                                size: 20,
                              ),
                              const SizedBox(width: 10),
                              Text(
                                "ID: #${loggedInOfficerId ?? 'N/A'} — ${loggedInOfficerUsername ?? ''}",
                                style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFFFFF6EA),
                                ),
                              ),
                            ],
                          ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // 3. OFFENDING DRIVER (SEARCHABLE PICKER)
              GestureDetector(
                onTap: _openDriverPicker,
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF07223A),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: selectedDriverObj != null
                          ? const Color(0xFF4AA3FF)
                          : const Color(0xFF1F4F78),
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "Offending Driver",
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFFD7A46B),
                        ),
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          const Icon(
                            Icons.person_search,
                            color: Color(0xFF4AA3FF),
                            size: 20,
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              selectedDriverObj != null
                                  ? "Driver: ${selectedDriverObj!['username']} (ID: #${selectedDriverObj!['id']})"
                                  : "Tap to search driver by ID, Name, or NIC...",
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: selectedDriverObj != null
                                    ? FontWeight.bold
                                    : FontWeight.normal,
                                color: selectedDriverObj != null
                                    ? const Color(0xFFFFF6EA)
                                    : const Color(0xFFAACDE9),
                              ),
                            ),
                          ),
                          const Icon(
                            Icons.arrow_drop_down,
                            color: Color(0xFF4AA3FF),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 24),

              if (result.isNotEmpty && !isSuccess)
                Container(
                  padding: const EdgeInsets.all(12),
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                    color: Colors.red.shade900.withOpacity(0.3),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: Colors.red.shade700.withOpacity(0.5),
                    ),
                  ),
                  child: Text(
                    result,
                    style: const TextStyle(
                      color: Color(0xFFFF8A8A),
                      fontSize: 13,
                    ),
                  ),
                ),

              SizedBox(
                height: 52,
                child: ElevatedButton(
                  onPressed: createFine,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF4AA3FF),
                    foregroundColor: const Color(0xFF021022),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: const Text(
                    "ISSUE FINE TICKET",
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

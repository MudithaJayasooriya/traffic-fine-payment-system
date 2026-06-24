import 'package:flutter/material.dart';
import 'package:dropdown_search/dropdown_search.dart';
import '../../services/fine_service.dart';
// Import your dashboard screen here
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
  Map<String, dynamic>? selectedOfficerObj;

  String? selectedCategory;
  String? selectedDriver;

  // Officer ID input
  final TextEditingController officerIdController = TextEditingController();

  String result = "";
  bool isSuccess = false;

  // UI State Tracking
  bool isCreated = false;
  String referenceNumber = "";

  @override
  void initState() {
    super.initState();
    loadInitialData();
  }

  // LOAD DATA
  void loadInitialData() async {
    final c = await service.getAllCategories();
    final d = await service.getAllDrivers();

    setState(() {
      categories = c;
      drivers = d;
    });
  }

  // OFFICER AUTO FETCH
  void fetchOfficerById(String id) async {
    if (id.isEmpty) return;

    final officer = await service.getUserById(int.parse(id));

    setState(() {
      selectedOfficerObj = officer;
    });
  }

  // CREATE FINE
  void createFine() async {
    if (selectedCategory == null ||
        officerIdController.text.isEmpty ||
        selectedDriver == null) {
      setState(() {
        result = "Please fill all fields";
        isSuccess = false;
      });
      return;
    }

    final fine = await service.createFine(
      selectedCategory!,
      int.parse(officerIdController.text),
      int.parse(selectedDriver!),
    );

    setState(() {
      if (fine != null) {
        result = "Fine Created Successfully";
        referenceNumber = fine.referenceNumber ?? "N/A";
        isSuccess = true;
        isCreated = true; // Flips UI to the Success View
      } else {
        result = "Failed to create fine";
        isSuccess = false;
        isCreated = false;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);


    // SUCCESS VIEW (Shows only after fine is successfully created)
    if (isCreated) {
      return Scaffold(
        body: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Animated-like Checkmark Ring
                  Container(
                    height: 100,
                    width: 100,
                    decoration: BoxDecoration(
                      color: Colors.green.shade50,
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.green.shade200, width: 4),
                    ),
                    child: Icon(Icons.check_circle_rounded, size: 64, color: Colors.green.shade600),
                  ),
                  const SizedBox(height: 24),

                  Text(
                    "Ticket Issued Successfully!",
                    textAlign: TextAlign.center,
                    style: theme.textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: Colors.green.shade800,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    "The fine has been registered into the traffic system.",
                    textAlign: TextAlign.center,
                    style: theme.textTheme.bodyMedium?.copyWith(color: Colors.grey.shade600),
                  ),

                  const SizedBox(height: 32),

                  // Big prominent Reference Number Card
                  Card(
                    color: theme.colorScheme.primaryContainer.withOpacity(0.4),
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                      side: BorderSide(color: theme.colorScheme.primary.withOpacity(0.2)),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
                      child: Column(
                        children: [
                          Text(
                            "REFERENCE NUMBER",
                            style: theme.textTheme.labelMedium?.copyWith(
                              letterSpacing: 1.5,
                              fontWeight: FontWeight.bold,
                              color: theme.colorScheme.primary,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            referenceNumber,
                            style: theme.textTheme.headlineMedium?.copyWith(
                              fontWeight: FontWeight.bold,
                              color: theme.colorScheme.onPrimaryContainer,
                              letterSpacing: 1.0,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Complete Breakdown Table / Details
                  Text(
                    "Ticket Details Summary",
                    style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  Card(
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                      side: BorderSide(color: theme.colorScheme.outlineVariant),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        children: [
                          _summaryRow("Category", "${selectedCategoryObj?['categoryCode']} - ${selectedCategoryObj?['categoryName']}"),
                          const Divider(height: 20),
                          _summaryRow("Fine Amount", "\$${selectedCategoryObj?['defaultAmount']}"),
                          const Divider(height: 20),
                          _summaryRow("Officer", "ID ${selectedOfficerObj?['id']} (${selectedOfficerObj?['username']})"),
                          const Divider(height: 20),
                          _summaryRow("Driver", "${selectedDriverObj?['username']} (ID: ${selectedDriverObj?['id']})"),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 40),

                  // Redirect OK button
                  FilledButton(
                    onPressed: () {
                      // Navigate directly to dashboard and remove previous setup from stack
                      Navigator.pushAndRemoveUntil(
                        context,
                        MaterialPageRoute(builder: (context) => const OfficerDashboard()),
                            (route) => false,
                      );
                    },
                    style: FilledButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text("OK - Return to Dashboard", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    }

    // STANDARD FORM VIEW (Default initial view state)

    return Scaffold(
      appBar: AppBar(
        title: const Text("Create Fine Ticket"),
        centerTitle: true,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            //  CATEGORY
            Card(
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: BorderSide(color: theme.colorScheme.outlineVariant),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Violation Category",
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: theme.colorScheme.primary,
                      ),
                    ),
                    const SizedBox(height: 12),
                    DropdownSearch<Map<String, dynamic>>(
                      items: categories.cast<Map<String, dynamic>>(),
                      itemAsString: (i) =>
                      "${i['categoryCode']} - ${i['categoryName']}",
                      popupProps: const PopupProps.menu(showSearchBox: true),
                      onChanged: (item) {
                        setState(() {
                          selectedCategoryObj = item;
                          selectedCategory = item?['categoryCode'];
                        });
                      },
                      dropdownDecoratorProps: const DropDownDecoratorProps(
                        dropdownSearchDecoration: InputDecoration(
                          prefixIcon: Icon(Icons.assignment_outlined),
                          labelText: "Select Category",
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.all(Radius.circular(12)),
                          ),
                        ),
                      ),
                    ),
                    if (selectedCategoryObj != null)
                      _box(context, [
                        "Code: ${selectedCategoryObj!['categoryCode']}",
                        "Name: ${selectedCategoryObj!['categoryName']}",
                        "Description: ${selectedCategoryObj!['description']}",
                        "Amount: \$${selectedCategoryObj!['defaultAmount']}",
                      ]),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // OFFICER
            Card(
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: BorderSide(color: theme.colorScheme.outlineVariant),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Issuing Officer",
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: theme.colorScheme.primary,
                      ),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: officerIdController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(
                        prefixIcon: Icon(Icons.badge_outlined),
                        labelText: "Officer ID",
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.all(Radius.circular(12)),
                        ),
                      ),
                      onChanged: fetchOfficerById,
                    ),
                    if (selectedOfficerObj != null)
                      _box(context, [
                        "ID: ${selectedOfficerObj!['id']}",
                        "Username: ${selectedOfficerObj!['username']}",
                        "Email: ${selectedOfficerObj!['email']}",
                      ]),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // DRIVER
            Card(
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: BorderSide(color: theme.colorScheme.outlineVariant),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Offending Driver",
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: theme.colorScheme.primary,
                      ),
                    ),
                    const SizedBox(height: 12),
                    DropdownSearch<Map<String, dynamic>>(
                      items: drivers.cast<Map<String, dynamic>>(),
                      itemAsString: (i) => "${i['id']} - ${i['username']}",
                      popupProps: const PopupProps.menu(showSearchBox: true),
                      onChanged: (item) {
                        setState(() {
                          selectedDriverObj = item;
                          selectedDriver = item?['id'].toString();
                        });
                      },
                      dropdownDecoratorProps: const DropDownDecoratorProps(
                        dropdownSearchDecoration: InputDecoration(
                          prefixIcon: Icon(Icons.person_outline),
                          labelText: "Select Driver",
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.all(Radius.circular(12)),
                          ),
                        ),
                      ),
                    ),
                    if (selectedDriverObj != null)
                      _box(context, [
                        "ID: ${selectedDriverObj!['id']}",
                        "Username: ${selectedDriverObj!['username']}",
                        "Phone: ${selectedDriverObj!['phoneNumber']}",
                      ]),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 32),

            // ISSUE BUTTON
            FilledButton.icon(
              onPressed: createFine,
              style: FilledButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              icon: const Icon(Icons.gavel),
              label: const Text(
                "Issue Ticket",
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),

            const SizedBox(height: 20),

            // Error Message (Only shows if creation fails)
            if (result.isNotEmpty && !isSuccess)
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.red.shade50,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.red.shade300),
                ),
                child: Row(
                  children: [
                    Icon(Icons.error, color: Colors.red.shade700),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        result,
                        style: TextStyle(color: Colors.red.shade900, fontWeight: FontWeight.w600),
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }

  // BOX UI HELPERS
  Widget _box(BuildContext context, List<String> items) {
    final theme = Theme.of(context);
    return Container(
      margin: const EdgeInsets.only(top: 12),
      padding: const EdgeInsets.all(12),
      width: double.infinity,
      decoration: BoxDecoration(
        color: theme.colorScheme.primaryContainer.withOpacity(0.3),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: items.map((e) {
          return Padding(
            padding: const EdgeInsets.symmetric(vertical: 2),
            child: Text(
              e,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onPrimaryContainer,
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _summaryRow(String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          flex: 2,
          child: Text(
            label,
            style: const TextStyle(fontWeight: FontWeight.w500, color: Colors.grey),
          ),
        ),
        Expanded(
          flex: 3,
          child: Text(
            value,
            textAlign: TextAlign.end,
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
        ),
      ],
    );
  }
}
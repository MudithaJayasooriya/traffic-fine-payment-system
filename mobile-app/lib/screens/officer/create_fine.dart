import 'package:flutter/material.dart';
import '../../services/fine_service.dart';

class CreateFineScreen extends StatefulWidget {
  const CreateFineScreen({super.key});

  @override
  State<CreateFineScreen> createState() => _CreateFineScreenState();
}

class _CreateFineScreenState extends State<CreateFineScreen> {
  final categoryController = TextEditingController();
  final officerController = TextEditingController();
  final driverController = TextEditingController();
  final FineService service = FineService();

  String result = "";
  bool isSuccess = false;

  void createFine() async {
    if (categoryController.text.isEmpty || officerController.text.isEmpty || driverController.text.isEmpty) {
      setState(() {
        result = "Please fill in all fields";
        isSuccess = false;
      });
      return;
    }

    // Dynamic UI trick: unfocus keyboard
    FocusScope.of(context).unfocus();

    final fine = await service.createFine(
      categoryController.text,
      int.parse(officerController.text),
      int.parse(driverController.text),
    );

    setState(() {
      if (fine != null) {
        result = "Fine Created Successfully!\nRef: ${fine.referenceNumber}";
        isSuccess = true;
      } else {
        result = "Failed to create fine. Please try again.";
        isSuccess = false;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        title: const Text("New Citation", style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Enter Offense Details",
              style: TextStyle(fontSize: 16, color: Colors.grey[600]),
            ),
            const SizedBox(height: 24),

            _buildInputField(
              controller: categoryController,
              label: "Category Code",
              icon: Icons.gavel_rounded,
              hint: "e.g., SPEED_01",
            ),
            const SizedBox(height: 20),

            _buildInputField(
              controller: officerController,
              label: "Officer ID",
              icon: Icons.badge_rounded,
              hint: "Enter your numerical ID",
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 20),

            _buildInputField(
              controller: driverController,
              label: "Driver ID",
              icon: Icons.assignment_ind_rounded,
              hint: "Enter motorist license ID",
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 32),

            // Submit Button
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: createFine,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1E3A8A),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 2,
                ),
                child: const Text(
                  "Issue Ticket",
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Result Alert Box
            if (result.isNotEmpty)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: isSuccess ? Colors.green[50] : Colors.red[50],
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: isSuccess ? Colors.green[200]! : Colors.red[200]!,
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      isSuccess ? Icons.check_circle_rounded : Icons.error_rounded,
                      color: isSuccess ? Colors.green[700] : Colors.red[700],
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        result,
                        style: TextStyle(
                          color: isSuccess ? Colors.green[900] : Colors.red[900],
                          fontWeight: FontWeight.w500,
                        ),
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

  Widget _buildInputField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    required String hint,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: controller,
          keyboardType: keyboardType,
          decoration: InputDecoration(
            hintText: hint,
            prefixIcon: Icon(icon, color: Colors.grey[400], size: 22),
            filled: true,
            fillColor: Colors.grey[50],
            contentPadding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: BorderSide(color: Colors.grey[200]!),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: Color(0xFF3B82F6), width: 2),
            ),
          ),
        ),
      ],
    );
  }
}
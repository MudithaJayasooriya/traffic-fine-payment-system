import 'package:flutter/material.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import '../services/api_service.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _isLoading = true;
  String _username = '';
  String _email = '';
  String _role = '';
  String _nicNumber = '';
  String _id = '';

  @override
  void initState() {
    super.initState();
    _loadProfileData();
  }

  Future<void> _loadProfileData() async {
    final token = await ApiService.getToken();
    final storedRole = await ApiService.getRole() ?? '';
    final storedName = await ApiService.getName() ?? '';

    if (token != null) {
      try {
        final decoded = JwtDecoder.decode(token);
        setState(() {
          _id = (decoded['id'] ?? decoded['userId'] ?? '').toString();
          _username = decoded['sub'] ?? decoded['username'] ?? storedName;
          _email = decoded['email'] ?? 'N/A';
          _nicNumber = decoded['nicNumber'] ?? 'N/A';
          _role = (decoded['role'] ?? storedRole).toString().toUpperCase();
          _isLoading = false;
        });
        return;
      } catch (e) {
        print("Error decoding token in profile: $e");
      }
    }

    setState(() {
      _username = storedName.isNotEmpty ? storedName : 'User';
      _role = storedRole.toUpperCase();
      _isLoading = false;
    });
  }

  Future<void> _handleLogout() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF07223A),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: Color(0xFF164E70)),
        ),
        title: const Text('Log out?', style: TextStyle(color: Color(0xFFFFF6EA))),
        content: const Text('Are you sure you want to log out of your session?',
            style: TextStyle(color: Color(0xFFAACDE9))),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel', style: TextStyle(color: Color(0xFF9FCAFF))),
          ),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: Colors.red.shade700),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Log out'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      await ApiService.logout();
      if (mounted) {
        Navigator.pushNamedAndRemoveUntil(context, '/', (route) => false);
      }
    }
  }

  void _handleChangePassword() {
    final oldPasswordCtrl = TextEditingController();
    final newPasswordCtrl = TextEditingController();
    String errorMsg = "";

    showDialog(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              backgroundColor: const Color(0xFF07223A),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
                side: const BorderSide(color: Color(0xFF164E70)),
              ),
              title: Row(
                children: const [
                  Icon(Icons.lock_reset, color: Color(0xFF4AA3FF)),
                  SizedBox(width: 8),
                  Text('Change Password',
                      style: TextStyle(color: Color(0xFFFFF6EA), fontSize: 18)),
                ],
              ),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextField(
                      controller: oldPasswordCtrl,
                      obscureText: true,
                      style: const TextStyle(color: Color(0xFFFFF6EA)),
                      decoration: const InputDecoration(
                        labelText: 'Current Password',
                        prefixIcon: Icon(Icons.lock_outline, color: Color(0xFF4AA3FF)),
                      ),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: newPasswordCtrl,
                      obscureText: true,
                      style: const TextStyle(color: Color(0xFFFFF6EA)),
                      decoration: const InputDecoration(
                        labelText: 'New Password',
                        prefixIcon: Icon(Icons.key_outlined, color: Color(0xFF4AA3FF)),
                      ),
                    ),
                    if (errorMsg.isNotEmpty) ...[
                      const SizedBox(height: 12),
                      Text(errorMsg, style: const TextStyle(color: Color(0xFFFF8A8A), fontSize: 12)),
                    ],
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
                    if (oldPasswordCtrl.text.isEmpty || newPasswordCtrl.text.isEmpty) {
                      setDialogState(() => errorMsg = "Please fill all fields.");
                      return;
                    }

                    final res = await ApiService.changePassword(
                      oldPassword: oldPasswordCtrl.text,
                      newPassword: newPasswordCtrl.text,
                    );

                    if (res['success'] == true) {
                      if (mounted) {
                        Navigator.pop(ctx);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Password updated successfully.'),
                            backgroundColor: Color(0xFF1FC97A),
                          ),
                        );
                      }
                    } else {
                      setDialogState(() => errorMsg = res['message'] ?? "Failed to change password.");
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF4AA3FF),
                    foregroundColor: const Color(0xFF021022),
                  ),
                  child: const Text('Update Password'),
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
    final isOfficer = _role.contains("OFFICER");
    final themeColor = isOfficer ? const Color(0xFFD7A46B) : const Color(0xFF4AA3FF);

    return Scaffold(
      backgroundColor: const Color(0xFF021022),
      appBar: AppBar(
        backgroundColor: const Color(0xFF07223A),
        foregroundColor: const Color(0xFFEAF6FF),
        elevation: 0,
        title: const Text(
          'My Profile',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF4AA3FF)))
          : SafeArea(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  children: [
                    // Profile Header Card
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: const Color(0xFF07223A),
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: themeColor.withOpacity(0.4)),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.3),
                            blurRadius: 20,
                            offset: const Offset(0, 8),
                          )
                        ],
                      ),
                      child: Column(
                        children: [
                          CircleAvatar(
                            radius: 40,
                            backgroundColor: themeColor.withOpacity(0.2),
                            child: Icon(
                              isOfficer ? Icons.local_police : Icons.person,
                              size: 44,
                              color: themeColor,
                            ),
                          ),
                          const SizedBox(height: 14),
                          Text(
                            _username,
                            style: const TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFFFFF6EA),
                            ),
                          ),
                          const SizedBox(height: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                            decoration: BoxDecoration(
                              color: themeColor.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: themeColor.withOpacity(0.4)),
                            ),
                            child: Text(
                              isOfficer ? 'TRAFFIC POLICE OFFICER' : 'LICENSED DRIVER',
                              style: TextStyle(
                                color: themeColor,
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 1.2,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Information List Card
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: const Color(0xFF07223A),
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: const Color(0xFF164E70)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            "Account Details",
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFFFFF6EA),
                            ),
                          ),
                          const SizedBox(height: 16),
                          _buildDetailRow(Icons.badge, "User Account ID", "#${_id.isNotEmpty ? _id : 'N/A'}"),
                          const Divider(color: Color(0xFF164E70), height: 20),
                          _buildDetailRow(Icons.credit_card, "NIC Number", _nicNumber),
                          const Divider(color: Color(0xFF164E70), height: 20),
                          _buildDetailRow(Icons.email, "Email Address", _email),
                          const Divider(color: Color(0xFF164E70), height: 20),
                          _buildDetailRow(Icons.verified_user, "Account Status", "Active & Verified",
                              valColor: const Color(0xFF1FC97A)),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Actions Card
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: const Color(0xFF07223A),
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: const Color(0xFF164E70)),
                      ),
                      child: Column(
                        children: [
                          ListTile(
                            contentPadding: EdgeInsets.zero,
                            leading: Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: const Color(0xFF4AA3FF).withOpacity(0.15),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.lock_reset, color: Color(0xFF4AA3FF)),
                            ),
                            title: const Text("Change Password",
                                style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFFFF6EA))),
                            subtitle: const Text("Update security credentials",
                                style: TextStyle(color: Color(0xFFAACDE9), fontSize: 12)),
                            trailing: const Icon(Icons.chevron_right, color: Color(0xFF4AA3FF)),
                            onTap: _handleChangePassword,
                          ),
                          const Divider(color: Color(0xFF164E70), height: 16),
                          ListTile(
                            contentPadding: EdgeInsets.zero,
                            leading: Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: Colors.red.withOpacity(0.15),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.logout, color: Color(0xFFFF8A8A)),
                            ),
                            title: const Text("Log Out",
                                style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFFF8A8A))),
                            subtitle: const Text("Exit current session",
                                style: TextStyle(color: Color(0xFFAACDE9), fontSize: 12)),
                            trailing: const Icon(Icons.chevron_right, color: Color(0xFFFF8A8A)),
                            onTap: _handleLogout,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildDetailRow(IconData icon, String label, String value, {Color? valColor}) {
    return Row(
      children: [
        Icon(icon, color: const Color(0xFF4AA3FF), size: 20),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: const TextStyle(fontSize: 11, color: Color(0xFFAACDE9))),
              const SizedBox(height: 2),
              Text(
                value,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: valColor ?? const Color(0xFFFFF6EA),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

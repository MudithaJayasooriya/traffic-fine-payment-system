import 'package:flutter/material.dart';
import 'create_fine.dart';
import '../../services/api_service.dart';
import '../../services/fine_service.dart';
import 'search_fine.dart';
import 'categories_screen.dart';
import 'issued_fines_screen.dart';

class OfficerDashboard extends StatefulWidget {
  const OfficerDashboard({Key? key}) : super(key: key);

  @override
  State<OfficerDashboard> createState() => _OfficerDashboardState();
}

class _OfficerDashboardState extends State<OfficerDashboard> {
  final FineService _fineService = FineService();
  int _issuedTicketCount = 0;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadCount();
  }

  Future<void> _loadCount() async {
    setState(() => _isLoading = true);
    final fines = await _fineService.getOfficerFines();
    if (mounted) {
      setState(() {
        _issuedTicketCount = fines.length;
        _isLoading = false;
      });
    }
  }

  Future<void> _handleLogout(BuildContext context) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF07223A),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: Color(0xFF164E70)),
        ),
        title: const Text('Log out?', style: TextStyle(color: Color(0xFFFFF6EA))),
        content: const Text('You will be returned to the landing screen.', style: TextStyle(color: Color(0xFFAACDE9))),
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
      if (context.mounted) {
        Navigator.pushNamedAndRemoveUntil(context, '/', (route) => false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF021022),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _loadCount,
          color: const Color(0xFF4AA3FF),
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header Section
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "OFFICER TERMINAL",
                          style: TextStyle(
                              color: Color(0xFFD7A46B),
                              fontSize: 11,
                              letterSpacing: 2,
                              fontWeight: FontWeight.bold),
                        ),
                        SizedBox(height: 2),
                        Text(
                          "Police Dashboard",
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFFFFF6EA),
                          ),
                        ),
                      ],
                    ),
                    OutlinedButton.icon(
                      onPressed: () => _handleLogout(context),
                      icon: const Icon(Icons.logout, size: 16, color: Color(0xFFFF8A8A)),
                      label: const Text('Log out', style: TextStyle(color: Color(0xFFFF8A8A), fontSize: 13)),
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: Color(0xFFFF8A8A)),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),

                // Department Status Banner
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: const Color(0xFF072B46),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: const Color(0xFF4AA3FF).withOpacity(0.4)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.3),
                        blurRadius: 20,
                        offset: const Offset(0, 8),
                      )
                    ],
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: const [
                              Icon(Icons.shield, color: Color(0xFF4AA3FF), size: 18),
                              SizedBox(width: 6),
                              Text(
                                "SYSTEM STATUS",
                                style: TextStyle(
                                    color: Color(0xFF9FCAFF),
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: 1),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          const Text(
                            "Police Terminal Active",
                            style: TextStyle(
                              color: Color(0xFFFFF6EA),
                              fontSize: 17,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),

                      // Total Count Badge
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: const Color(0xFF06223B),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFF1F4F78)),
                        ),
                        child: Column(
                          children: [
                            const Text(
                              "ISSUED",
                              style: TextStyle(
                                  color: Color(0xFFD7A46B),
                                  fontSize: 9,
                                  fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 2),
                            _isLoading
                                ? const SizedBox(
                                    height: 14,
                                    width: 14,
                                    child: CircularProgressIndicator(
                                        color: Color(0xFF4AA3FF), strokeWidth: 2),
                                  )
                                : Text(
                                    _issuedTicketCount.toString(),
                                    style: const TextStyle(
                                      color: Color(0xFF4AA3FF),
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                          ],
                        ),
                      )
                    ],
                  ),
                ),

                const SizedBox(height: 28),

                const Text(
                  "Main Menu Actions",
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFFFFF6EA),
                  ),
                ),
                const SizedBox(height: 14),

                // 2x2 Grid Menu Actions
                GridView.count(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisCount: 2,
                  crossAxisSpacing: 14,
                  mainAxisSpacing: 14,
                  childAspectRatio: 1.15,
                  children: [
                    _buildMenuCard(
                      context,
                      title: "Issue Fine",
                      subtitle: "New citation ticket",
                      icon: Icons.add_moderator_rounded,
                      color: const Color(0xFF1FC97A),
                      onTap: () async {
                        await Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const CreateFineScreen()),
                        );
                        _loadCount();
                      },
                    ),
                    _buildMenuCard(
                      context,
                      title: "My Issued Tickets",
                      subtitle: "View, edit & delete",
                      icon: Icons.assignment,
                      color: const Color(0xFF4AA3FF),
                      onTap: () async {
                        await Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const IssuedFinesScreen()),
                        );
                        _loadCount();
                      },
                    ),
                    _buildMenuCard(
                      context,
                      title: "Search Fine",
                      subtitle: "Lookup tickets & ref",
                      icon: Icons.search,
                      color: const Color(0xFF7BD5FF),
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const SearchFineScreen()),
                      ),
                    ),
                    _buildMenuCard(
                      context,
                      title: "Fine Categories",
                      subtitle: "Violation codes & rates",
                      icon: Icons.list_alt,
                      color: const Color(0xFFD7A46B),
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const CategoriesScreen()),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildMenuCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFF07223A),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFF164E70)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.3),
              blurRadius: 12,
              offset: const Offset(0, 4),
            )
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: color.withOpacity(0.15),
                shape: BoxShape.circle,
                border: Border.all(color: color.withOpacity(0.4)),
              ),
              child: Icon(icon, color: color, size: 22),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFFFFF6EA),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: const TextStyle(fontSize: 11, color: Color(0xFFAACDE9)),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }
}

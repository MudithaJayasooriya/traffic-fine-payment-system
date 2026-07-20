import 'package:flutter/material.dart';
import 'officer_dashboard.dart';
import 'issued_fines_screen.dart';
import 'categories_screen.dart';
import 'search_fine.dart';
import 'create_fine.dart';
import '../profile_screen.dart';

class OfficerHomeScreen extends StatefulWidget {
  const OfficerHomeScreen({super.key});

  @override
  State<OfficerHomeScreen> createState() => _OfficerHomeScreenState();
}

class _OfficerHomeScreenState extends State<OfficerHomeScreen> {
  int _currentIndex = 0;

  final List<Widget> _pages = const [
    OfficerDashboard(),
    IssuedFinesScreen(),
    CategoriesScreen(),
    SearchFineScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF021022),
      body: IndexedStack(
        index: _currentIndex,
        children: _pages,
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const CreateFineScreen()),
          );
        },
        backgroundColor: const Color(0xFF4AA3FF),
        foregroundColor: const Color(0xFF021022),
        icon: const Icon(Icons.add_moderator_rounded, size: 22),
        label: const Text(
          'Issue Fine',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
        ),
      ),
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: Color(0xFF07223A),
          border: Border(top: BorderSide(color: Color(0xFF164E70), width: 1)),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) {
            setState(() {
              _currentIndex = index;
            });
          },
          backgroundColor: const Color(0xFF07223A),
          selectedItemColor: const Color(0xFF4AA3FF),
          unselectedItemColor: const Color(0xFFAACDE9),
          selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11),
          unselectedLabelStyle: const TextStyle(fontSize: 10),
          type: BottomNavigationBarType.fixed,
          elevation: 8,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.dashboard_rounded),
              label: 'Dashboard',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.assignment_rounded),
              label: 'Issued',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.list_alt_rounded),
              label: 'Categories',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.search_rounded),
              label: 'Search',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person_rounded),
              label: 'Profile',
            ),
          ],
        ),
      ),
    );
  }
}

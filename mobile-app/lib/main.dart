import 'package:flutter/material.dart';
import 'services/api_service.dart';
import 'screens/auth/login.dart';
import 'screens/auth/register.dart';
import 'screens/landing_screen.dart';
import 'screens/driver/driver_home_screen.dart';
import 'screens/officer/reset_password_screen.dart';
import 'screens/officer/officer_dashboard.dart';
import 'core/constants.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Check existing session on app launch
  final isLoggedIn = await ApiService.isLoggedIn();
  final role = isLoggedIn ? await ApiService.getRole() : null;
  final mustChangePassword =
  isLoggedIn ? await ApiService.getMustChangePassword() : false;

  runApp(MyApp(initialRoute: _resolveInitialRoute(role, mustChangePassword)));
}

String _resolveInitialRoute(String? role, bool mustChangePassword) {
  if (role == AppConstants.roleOfficer && mustChangePassword) {
    return '/reset-password';
  }
  if (role == AppConstants.roleDriver) return '/driver-home';
  if (role == AppConstants.roleOfficer) return '/officer-home';

  // If not logged in, go to Landing instead of Login directly
  return '/';
}

class MyApp extends StatelessWidget {
  final String initialRoute;

  const MyApp({super.key, required this.initialRoute});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Traffic Fine App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF1A3A6B),
          brightness: Brightness.light,
        ),
        useMaterial3: true,
        fontFamily: 'Roboto',
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF1A3A6B),
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 14,
          ),
        ),
      ),
      initialRoute: initialRoute,
      routes: {
        '/': (_) => const LandingScreen(),
        '/login': (_) => const LoginScreen(),
        '/register': (_) => const RegisterScreen(),
        '/driver-home': (_) => const DriverHomeScreen(),
        '/reset-password': (_) => const ResetPasswordScreen(),
        '/officer-home': (_) => const OfficerDashboard(),
      },
    );
  }
}
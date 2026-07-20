import 'package:flutter/material.dart';
import 'services/api_service.dart';
import 'screens/auth/login.dart';
import 'screens/auth/register.dart';
import 'screens/landing_screen.dart';
import 'screens/driver/driver_home_screen.dart';
import 'screens/officer/reset_password_screen.dart';
import 'screens/officer/officer_dashboard.dart';
import 'screens/officer/officer_home_screen.dart';
import 'screens/officer/categories_screen.dart';
import 'screens/officer/issued_fines_screen.dart';
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
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF021022),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF4AA3FF),
          secondary: Color(0xFF7BD5FF),
          surface: Color(0xFF07223A),
          background: Color(0xFF021022),
          onPrimary: Color(0xFF021022),
          onSurface: Color(0xFFEAF6FF),
        ),
        useMaterial3: true,
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF07223A),
          foregroundColor: Color(0xFFEAF6FF),
          elevation: 0,
          centerTitle: true,
        ),
        cardTheme: const CardThemeData(
          color: Color(0xFF062033),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(20)),
            side: BorderSide(color: Color(0xFF1F4F78), width: 1),
          ),
          elevation: 4,
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF4AA3FF),
            foregroundColor: const Color(0xFF021022),
            padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 24),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: const Color(0xFF06223B),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: Color(0xFF214F73)),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: Color(0xFF214F73)),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: Color(0xFF5AA3FF), width: 2),
          ),
          hintStyle: const TextStyle(color: Color(0xFFAACDE9)),
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 18,
            vertical: 16,
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
        '/officer-home': (_) => const OfficerHomeScreen(),
        '/categories': (_) => const CategoriesScreen(),
        '/issued-fines': (_) => const IssuedFinesScreen(),
      },
    );
  }
}